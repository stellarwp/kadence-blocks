<?php declare( strict_types=1 );
// cspell:ignore palette pagenow .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Covers the CSS-variable projector: it appends the resolved --kb-token--* declarations to KB's front-end
 * and editor style handles, routes the legacy color/font-size filters through the bridge, is a no-op when
 * the registry is deactivated, and honors the active set — the declarations carry the active set's resolved
 * values, so pointing the active-set pointer at another set changes what is projected to the front end.
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

	/**
	 * @return void
	 */
	public function testFilterFontSizesPassesThroughWhenNoFontSizeTokensRegistered(): void {
		$input  = [ 'sm' => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)' ];
		$result = $this->projector->filter_font_sizes( $input );

		// Shipped tokens have no kadence_slot font-size entries, so input passes through unchanged.
		$this->assertSame( $input, $result );
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
	 * @return void
	 */
	public function testFiltersReturnInputUnchangedWhenRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$colors = [ '--global-palette1' => '#3182CE' ];
		$sizes  = [ 'sm' => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)' ];

		$this->assertSame( $colors, $this->projector->filter_global_colors( $colors ) );
		$this->assertSame( $sizes, $this->projector->filter_font_sizes( $sizes ) );
	}

	// ---- Active set ----------------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testItProjectsTheDefaultSetsBaselineValuesWhenDefaultIsActive(): void {
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		$this->assertStringNotContainsString( self::BRAND_B_BUTTON, $css );
	}

	/**
	 * @return void
	 */
	public function testItProjectsTheActiveSetsResolvedValuesToTheFrontEnd(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );
		$this->active->set( 'brand-b' );

		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BRAND_B_BUTTON, $css );
		$this->assertStringNotContainsString( self::BASELINE_BUTTON, $css );
	}

	/**
	 * Pointing the pointer back at the default set reverts what is projected, proving the projector reads
	 * the pointer on each build rather than caching the first set it saw.
	 *
	 * @return void
	 */
	public function testPointingBackAtTheDefaultRevertsWhatIsProjected(): void {
		$this->store->save_document( $this->brand_b_document(), 'brand-b' );

		$this->active->set( 'brand-b' );
		$this->projector->enqueue_front_end();
		$this->assertStringContainsString( self::BRAND_B_BUTTON, $this->inline_css() );

		// A fresh handle drops the brand-b declarations so the next build is asserted in isolation.
		$this->register_front_handle();

		$this->active->set( Token_Store::default_slug() );
		$this->projector->enqueue_front_end();

		$css = $this->inline_css();

		$this->assertStringContainsString( self::BASELINE_BUTTON, $css );
		$this->assertStringNotContainsString( self::BRAND_B_BUTTON, $css );
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
