<?php declare( strict_types=1 );
// cspell:ignore palette pagenow xxl xxxl .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
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
 * from the tokens, is a no-op when the registry is deactivated, and honors the active set — the declarations
 * carry the active set's resolved values, so pointing the active-set pointer at another set changes what is
 * projected to the front end.
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
	 * The button primitive id the shipped baseline resolves semantic.color.button-bg through; the
	 * canonical alias layer re-points its var at the active set's namespaced var.
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
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		// Projector was registered as a singleton during module bootstrap.
		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );
		$this->store     = $this->container->get( Token_Store::class );
		$this->active    = $this->container->get( Active_Set_Store::class );

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

	// ---- Filter routing -------------------------------------------------------------------------------

	/**
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

		$css        = implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
		$canonical  = Css_Var::from_id( 'primitive.dimension.font-size.lg' );
		$namespaced = Css_Var::from_id( 'primitive.dimension.font-size.lg', 'default' );

		// The slot points --global-kb-font-size-lg at the primitive token var.
		$this->assertStringContainsString( '--global-kb-font-size-lg:var(' . $canonical . ',', $css );

		// And that primitive carries the shipped fluid clamp() value.
		$this->assertStringContainsString(
			$namespaced . ':clamp(1.75rem, 1.576rem + 0.543vw, 2rem)',
			$css
		);
	}

	// ---- Deactivated registry (fail-closed) ----------------------------------------------------------

	/**
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
	 * With only the default set, its baseline literal is emitted under the default namespace and the
	 * canonical alias layer points at that default namespace.
	 *
	 * @return void
	 */
	public function testItProjectsTheDefaultSetsBaselineValuesWhenDefaultIsActive(): void {
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		// The default set's pointer appears twice: once in the :root alias layer (default is active), once
		// in the default switch selector.
		$this->assertSame( 2, substr_count( $css, $this->pointer_to_set( Token_Store::default_slug() ) ) );
	}

	/**
	 * Every set is emitted simultaneously, so both the default and the active set's literals are present;
	 * pointing the active set at brand-b re-points the canonical alias layer at the brand-b namespace
	 * (with no re-resolve of the document), which is the switch.
	 *
	 * @return void
	 */
	public function testItProjectsTheActiveSetsResolvedValuesToTheFrontEnd(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );
		$this->active->set( 'brand-b' );

		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		// Both sets' literals are present (Option B emits every set), each under its own namespace.
		$this->assertStringContainsString( self::BRAND_B_BUTTON, $css );
		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );

		// The active set's pointer is in both the alias layer and its switch selector (twice); a non-active
		// set's is only in its switch selector (once). So the alias layer targets brand-b.
		$this->assertSame( 2, substr_count( $css, $this->pointer_to_set( 'brand-b' ) ) );
		$this->assertSame( 1, substr_count( $css, $this->pointer_to_set( Token_Store::default_slug() ) ) );
	}

	/**
	 * Pointing the pointer back at the default set re-points the alias layer at the default namespace,
	 * proving the projector reads the pointer on each build rather than caching the first set it saw. Both
	 * sets' namespaced literals remain present throughout — only the alias layer's target changes.
	 *
	 * @return void
	 */
	public function testPointingBackAtTheDefaultRevertsWhatIsProjected(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );

		$this->active->set( 'brand-b' );
		$this->projector->enqueue_front_end();
		// brand-b active: its pointer is in the alias layer plus its switch selector.
		$this->assertSame( 2, substr_count( $this->inline_css(), $this->pointer_to_set( 'brand-b' ) ) );

		// A fresh handle drops the prior build so the next one is asserted in isolation.
		$this->register_front_handle();

		$this->active->set( Token_Store::default_slug() );
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		// The alias layer now targets the default set; brand-b drops back to switch-selector only.
		$this->assertSame( 2, substr_count( $css, $this->pointer_to_set( Token_Store::default_slug() ) ) );
		$this->assertSame( 1, substr_count( $css, $this->pointer_to_set( 'brand-b' ) ) );
	}

	/**
	 * Every stored set plus the default is emitted at once: each as a namespaced --kb-token--<set>--* block
	 * carrying its own literal, plus a per-set [data-kb-token-set="<set>"] switch selector.
	 *
	 * @return void
	 */
	public function testItEmitsEverySetNamespacedWithASwitchSelector(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );

		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		// Each set's button primitive is defined under its own namespace.
		$this->assertStringContainsString( Css_Var::from_id( self::BUTTON_PRIMITIVE, Token_Store::default_slug() ) . ':' . self::BASELINE_BUTTON, $css );
		$this->assertStringContainsString( Css_Var::from_id( self::BUTTON_PRIMITIVE, 'brand-b' ) . ':' . self::BRAND_B_BUTTON, $css );

		// Each set carries its own client-side switch selector.
		$this->assertStringContainsString( '[data-kb-token-set="' . Token_Store::default_slug() . '"]{', $css );
		$this->assertStringContainsString( '[data-kb-token-set="brand-b"]{', $css );
	}

	/**
	 * A non-active set whose stored document cannot be resolved (here, an alias cycle) is skipped rather
	 * than fatal: the remaining sets and the active alias layer still project, so one broken set never
	 * suppresses the whole stylesheet.
	 *
	 * @return void
	 */
	public function testABrokenNonActiveSetDoesNotSuppressTheOtherSets(): void {
		$this->store->save_document( $this->cyclic_document(), 'brand-b' );

		// Default stays active and resolves cleanly.
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		// The default set still projects its baseline literal and canonical alias layer.
		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		$this->assertSame( 2, substr_count( $css, $this->pointer_to_set( Token_Store::default_slug() ) ) );

		// The broken brand-b set is omitted entirely — no switch selector for it.
		$this->assertStringNotContainsString( '[data-kb-token-set="brand-b"]', $css );
	}

	/**
	 * When the active set is the one that cannot be resolved, the whole stylesheet is suppressed rather
	 * than emitting an alias layer that points at a set with no definition block.
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
	 * The declaration that points the canonical button-primitive var at a given set's namespaced var. It
	 * appears in that set's switch selector always, and additionally in the :root alias layer when the set
	 * is active — so its occurrence count distinguishes the active set (2) from a non-active set (1).
	 *
	 * @param string $slug The set slug the canonical var is pointed at.
	 *
	 * @return string
	 */
	private function pointer_to_set( string $slug ): string {
		return Css_Var::from_id( self::BUTTON_PRIMITIVE ) . ':var(' . Css_Var::from_id( self::BUTTON_PRIMITIVE, $slug ) . ');';
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
