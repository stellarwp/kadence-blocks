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
 * from the tokens, is a no-op when the registry is deactivated, and honors the active set — only the active
 * set is emitted, so pointing the active-set pointer at another set changes what is projected to the front
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
	 * A sentinel value, absent from the baseline, that a non-default set overrides the button primitive to.
	 *
	 * @var string
	 */
	private const BRAND_B_BUTTON = '#123456';

	/**
	 * The button primitive id the shipped baseline resolves semantic.color.button-bg through; the active
	 * set's canonical var carries its resolved literal.
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

	// ---- Active set ----------------------------------------------------------------------------------

	/**
	 * With the default set active, its baseline literal is emitted directly under the canonical button var.
	 *
	 * @return void
	 */
	public function testItProjectsTheDefaultSetsBaselineValuesWhenDefaultIsActive(): void {
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		$this->assertStringContainsString( Css_Var::from_id( self::BUTTON_PRIMITIVE ) . ':' . self::BASELINE_BUTTON, $css );
	}

	/**
	 * Only the active set is emitted: pointing the active-set pointer at brand-b projects brand-b's literal
	 * under the canonical button var, and the non-active default set's literal is absent.
	 *
	 * @return void
	 */
	public function testItProjectsOnlyTheActiveSetsResolvedValuesToTheFrontEnd(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );
		$this->active->set( 'brand-b' );

		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		// The active set's literal is present under the canonical button var...
		$this->assertStringContainsString( Css_Var::from_id( self::BUTTON_PRIMITIVE ) . ':' . self::BRAND_B_BUTTON, $css );
		// ...and the non-active default set's literal is not emitted at all.
		$this->assertStringNotContainsString( self::BASELINE_BUTTON, $css );
	}

	/**
	 * Pointing the pointer back at the default set re-emits the default's baseline literal and drops the
	 * brand-b literal, proving the projector reads the pointer on each build rather than caching the first
	 * set it saw.
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
	 * The projector emits only the active set with no per-set namespaced blocks and no
	 * `[data-kb-token-set]` switch selectors: a stored non-active set contributes nothing to the output.
	 *
	 * @return void
	 */
	public function testItEmitsOnlyTheActiveSetWithNoNamespacedOrSwitchLayers(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );

		// Default stays active.
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringNotContainsString( '--kb-token--default--', $css );
		$this->assertStringNotContainsString( '--kb-token--brand-b--', $css );
		$this->assertStringNotContainsString( '[data-kb-token-set', $css );
		// The non-active set's sentinel literal never appears.
		$this->assertStringNotContainsString( self::BRAND_B_BUTTON, $css );
	}

	/**
	 * When the active set cannot be resolved (here, an alias cycle) the whole stylesheet is suppressed
	 * rather than emitting a partial block, so the page falls back to KB's existing variables.
	 *
	 * @return void
	 */
	public function testABrokenActiveSetSuppressesAllCss(): void {
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
