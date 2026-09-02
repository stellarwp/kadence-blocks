<?php declare( strict_types=1 );
// cspell:ignore palette pagenow xxl xxxl .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Covers the CSS-variable projector: it appends the resolved --kb-token--* declarations to KB's front-end
 * and editor style handles, routes the legacy color filter through the bridge, feeds KB's font-size scale
 * from the tokens, is a no-op when the registry is deactivated, and honors the active library — only the active
 * library is emitted, so pointing the active-library pointer at another library changes what is projected to the front
 * end.
 */
final class ProjectorTest extends TestCase {

	/**
	 * The shipped baseline resolves semantic.color.button-bg through primitive.color.brand.button, so an
	 * override of that primitive surfaces as a literal in the projected CSS.
	 *
	 * @var string
	 */
	private const BASELINE_BUTTON = '#3633e1';

	/**
	 * A sentinel value, absent from the baseline, that a non-default library overrides the button primitive to.
	 *
	 * @var string
	 */
	private const BRAND_B_BUTTON = '#123456';

	/**
	 * The button primitive id the shipped baseline resolves semantic.color.button-bg through; the active
	 * library's canonical var carries its resolved literal.
	 *
	 * @var string
	 */
	private const BUTTON_PRIMITIVE = 'primitive.color.brand.button';

	/**
	 * @var Projector
	 */
	private Projector $projector;

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		// Projector was registered as a singleton during module bootstrap.
		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );
		$this->store     = $this->container->get( Token_Store::class );
		$this->active    = $this->container->get( Active_Token_Library_Store::class );

		// Register the KB style handles the hooks append to.
		$this->register_front_handle();
		if ( ! wp_style_is( 'kadence-blocks-global-editor-styles', 'registered' ) ) {
			wp_register_style( 'kadence-blocks-global-editor-styles', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		}
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		wp_deregister_style( 'kadence-blocks-global-variables' );
		wp_deregister_style( 'kadence-blocks-global-editor-styles' );

		// Re-activate the registry in case a test called deactivate() on the singleton.
		$this->registry->activate();

		// Clear the Token_Resolver singleton's in-memory memo so calls to resolve() made during these
		// tests do not short-circuit object-cache checks in later test classes.
		$resolver      = $this->container->get( Token_Resolver::class );
		$memo_property = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo_property->setAccessible( true );
		$memo_property->setValue( $resolver, [] );

		parent::tearDown();
	}

	// ---- Front-end enqueue ---------------------------------------------------------------------------

	/**
	 * The front-end hook appends the token declarations to KB's global-variables handle.
	 *
	 * @return void
	 */
	public function testEnqueueFrontEndAppendsInlineStyleToGlobalVariablesHandle(): void {
		$this->projector->enqueue_front_end();

		$inline = wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' );

		$this->assertNotEmpty( $inline );

		$css = implode( '', (array) $inline );
		$this->assertStringContainsString( Scope::root(), $css );
		$this->assertStringContainsString( '--kb-token--', $css );
	}

	// ---- Editor enqueue -------------------------------------------------------------------------------

	/**
	 * The editor hook appends the token declarations to KB's global-editor-styles handle on an editor page.
	 *
	 * @return void
	 */
	public function testEnqueueEditorAppendsInlineStyleToEditorHandle(): void {
		global $pagenow;
		$prev    = $pagenow;
		$pagenow = 'post-new.php'; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		$this->projector->enqueue_editor();

		$pagenow = $prev; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		$inline = wp_styles()->get_data( 'kadence-blocks-global-editor-styles', 'after' );

		$this->assertNotEmpty( $inline );

		$css = implode( '', (array) $inline );
		$this->assertStringContainsString( Scope::root(), $css );
		$this->assertStringContainsString( '--kb-token--', $css );
	}

	// ---- Editor CSS -----------------------------------------------------------------------------------

	/**
	 * The token-var projector is context-independent — it emits `:root { --kb-token--*: … }` custom
	 * properties with no block-scoped selector — so its editor build is byte-for-byte identical to its
	 * front-end build.
	 *
	 * @return void
	 */
	public function testEditorCssEqualsCss(): void {
		$this->assertSame( $this->projector->css(), $this->projector->editor_css() );
	}

	// ---- Filter routing -------------------------------------------------------------------------------

	/**
	 * The legacy color filter is routed through the bridge, which rewrites the palette slots it owns.
	 *
	 * @return void
	 */
	public function testFilterGlobalColorsRoutesToBridge(): void {
		$input  = [
			'--global-palette1' => '#3182CE',
			'--global-palette2' => '#2B6CB0',
		];
		$result = $this->projector->filter_global_colors( $input );

		// The shipped tokens include a palette1 slot, so that key will be rewritten; others pass through.
		$this->assertArrayHasKey( '--global-palette1', $result );
		$this->assertArrayHasKey( '--global-palette2', $result );
	}

	// ---- Font-size slot bridge -----------------------------------------------------------------------

	/**
	 * The front-end projection redefines each --global-kb-font-size-<slug> slot as its primitive token var
	 * (the slug is claimed on the primitive, like spacing/gap), and that primitive carries the shipped
	 * clamp(), so a block storing a named size follows the token.
	 *
	 * @return void
	 */
	public function testFrontEndCssRedefinesGlobalFontSizeSlots(): void {
		$this->projector->enqueue_front_end();

		$css       = implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
		$canonical = Css_Var::from_id( 'primitive.dimension.font-size.lg' );

		// The slot points --global-kb-font-size-lg at the primitive token var.
		$this->assertStringContainsString( '--global-kb-font-size-lg:var(' . $canonical . ',', $css );

		// And that primitive carries the shipped fluid clamp() value at its canonical var.
		$this->assertStringContainsString(
			$canonical . ':clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
			$css
		);
	}

	// ---- Deactivated registry (fail-closed) ----------------------------------------------------------

	/**
	 * A deactivated registry emits nothing to either style handle.
	 *
	 * @return void
	 */
	public function testNothingIsEmittedWhenRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$this->projector->enqueue_front_end();
		$this->projector->enqueue_editor();

		$front_inline  = wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' );
		$editor_inline = wp_styles()->get_data( 'kadence-blocks-global-editor-styles', 'after' );

		$this->assertEmpty( $front_inline );
		$this->assertEmpty( $editor_inline );
	}

	/**
	 * A deactivated registry leaves the legacy color filter's input untouched, so KB's own palette survives
	 * when token projection is off.
	 *
	 * @return void
	 */
	public function testDeactivatedRegistryLeavesColorFilterUnchanged(): void {
		$this->registry->deactivate();

		$colors = [ '--global-palette1' => '#3182CE' ];

		$this->assertSame( $colors, $this->projector->filter_global_colors( $colors ) );
	}

	// ---- User-created primitives ---------------------------------------------------------------------

	/**
	 * A stored shadow user primitive reaches Css_Renderer::shadow() through the resolver with
	 * zero resolver/renderer changes: the projected CSS carries the token's custom property
	 * with the rendered single-shadow shorthand. This is the first projection pin for a
	 * user-created token of any type.
	 *
	 * @return void
	 */
	public function testItProjectsAStoredShadowUserPrimitiveAsTheSingleShadowShorthand(): void {
		$id = 'primitive.shadow.custom.elevated';

		$this->store->save_document( $this->shadow_user_primitive_document( $id, 'Elevated' ) );

		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString(
			Css_Var::from_id( $id ) . ':0px 2px 8px 0px #1A202C',
			$css
		);
	}

	// ---- Active library ----------------------------------------------------------------------------------

	/**
	 * With the default library active, its baseline literal is emitted directly under the canonical button var.
	 *
	 * @return void
	 */
	public function testItProjectsTheDefaultLibraryBaselineValuesWhenDefaultIsActive(): void {
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		$this->assertStringContainsString( Css_Var::from_id( self::BUTTON_PRIMITIVE ) . ':' . self::BASELINE_BUTTON, $css );
	}

	/**
	 * Only the active library is emitted: pointing the active-library pointer at brand-b projects brand-b's literal
	 * under the canonical button var, and the non-active default library's literal is absent.
	 *
	 * @return void
	 */
	public function testItProjectsOnlyTheActiveLibraryResolvedValuesToTheFrontEnd(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );
		$this->active->set( 'brand-b' );

		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		// The active library's literal is present under the canonical button var...
		$this->assertStringContainsString( Css_Var::from_id( self::BUTTON_PRIMITIVE ) . ':' . self::BRAND_B_BUTTON, $css );
		// ...and the non-active default library's literal is not emitted at all.
		$this->assertStringNotContainsString( self::BASELINE_BUTTON, $css );
	}

	/**
	 * Pointing the pointer back at the default library re-emits the default's baseline literal and drops the
	 * brand-b literal, proving the projector reads the pointer on each build rather than caching the first
	 * library it saw.
	 *
	 * @return void
	 */
	public function testPointingBackAtTheDefaultRevertsWhatIsProjected(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );

		$this->active->set( 'brand-b' );
		$this->projector->enqueue_front_end();
		$this->assertStringContainsString( self::BRAND_B_BUTTON, $this->inline_css() );

		// A fresh handle drops the prior build so the next one is asserted in isolation.
		$this->register_front_handle();

		$this->active->set( Token_Store::default_slug() );
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		$this->assertStringNotContainsString( self::BRAND_B_BUTTON, $css );
	}

	/**
	 * The projector emits only the active library with no per-library namespaced blocks and no
	 * `[data-kb-token-set]` switch selectors: a stored non-active library contributes nothing to the output.
	 *
	 * @return void
	 */
	public function testItEmitsOnlyTheActiveLibraryWithNoNamespacedOrSwitchLayers(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );

		// Default stays active.
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringNotContainsString( '--kb-token--default--', $css );
		$this->assertStringNotContainsString( '--kb-token--brand-b--', $css );
		$this->assertStringNotContainsString( '[data-kb-token-set', $css );
		// The non-active library's sentinel literal never appears.
		$this->assertStringNotContainsString( self::BRAND_B_BUTTON, $css );
	}

	/**
	 * When the active library cannot be resolved (here, an alias cycle) the whole stylesheet is suppressed
	 * rather than emitting a partial block, so the page falls back to KB's existing variables.
	 *
	 * @return void
	 */
	public function testABrokenActiveLibrarySuppressesAllCss(): void {
		$this->store->save_document( $this->cyclic_document(), 'brand-b' );
		$this->active->set( 'brand-b' );

		$this->projector->enqueue_front_end();

		$this->assertSame( '', $this->inline_css() );
	}

	/**
	 * An overrides-only DTCG document that retargets the button primitive the shipped baseline resolves
	 * semantic.color.button-bg through.
	 *
	 * @return string
	 */
	private function brand_b_document(): string {
		return (string) wp_json_encode(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'button' => [
								'$type'  => 'color',
								'$value' => self::BRAND_B_BUTTON,
							],
						],
					],
				],
			]
		);
	}

	/**
	 * A stored document containing one shadow user primitive: the tree leaf plus its provenance
	 * envelope entry, the shape the create endpoint would have written.
	 *
	 * @param string $id    The canonical dot-path id.
	 * @param string $label The label to store in the provenance map.
	 *
	 * @return string
	 */
	private function shadow_user_primitive_document( string $id, string $label ): string {
		return (string) wp_json_encode(
			[
				'primitive'   => [
					'shadow' => [
						'custom' => [
							'elevated' => [
								'$type'  => 'shadow',
								'$value' => [
									'color'   => '#1A202C',
									'offsetX' => '0px',
									'offsetY' => '2px',
									'blur'    => '8px',
									'spread'  => '0px',
								],
							],
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							$id => [ 'label' => $label ],
						],
					],
				],
			]
		);
	}

	/**
	 * A DTCG document whose two primitives alias each other, forming an unresolvable cycle — the shape a
	 * direct DB write could introduce past the REST validation gate.
	 *
	 * @return string
	 */
	private function cyclic_document(): string {
		return (string) wp_json_encode(
			[
				'primitive' => [
					'color' => [
						'a' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.b}',
						],
						'b' => [
							'$type'  => 'color',
							'$value' => '{primitive.color.a}',
						],
					],
				],
			]
		);
	}

	/**
	 * Register (or reset) the KB front-end style handle the projector appends its declarations to.
	 *
	 * @return void
	 */
	private function register_front_handle(): void {
		if ( wp_style_is( 'kadence-blocks-global-variables', 'registered' ) ) {
			wp_deregister_style( 'kadence-blocks-global-variables' );
		}

		wp_register_style( 'kadence-blocks-global-variables', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
	}

	/**
	 * The inline CSS the projector appended to the front-end handle, flattened to a single string.
	 *
	 * @return string
	 */
	private function inline_css(): string {
		return implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}
}
