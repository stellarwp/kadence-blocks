<?php declare( strict_types=1 );
// cspell:ignore palette pagenow .

namespace Tests\wpunit\Resources\Design_Tokens\Projection;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

final class Projection_ProviderTest extends TestCase {

	private Projector $projector;
	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		// Projector was registered as a singleton during module bootstrap.
		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );

		// Register the KB style handles the hooks append to.
		if ( ! wp_style_is( 'kadence-blocks-global-variables', 'registered' ) ) {
			wp_register_style( 'kadence-blocks-global-variables', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		}
		if ( ! wp_style_is( 'kadence-blocks-global-editor-styles', 'registered' ) ) {
			wp_register_style( 'kadence-blocks-global-editor-styles', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		}
	}

	protected function tearDown(): void {
		wp_deregister_style( 'kadence-blocks-global-variables' );
		wp_deregister_style( 'kadence-blocks-global-editor-styles' );

		// Re-activate the registry in case a test called deactivate() on the singleton.
		$this->container->get( Token_Registry::class )->activate();

		// Clear the Token_Resolver singleton's in-memory memo so calls to resolve() made
		// during these tests do not short-circuit object-cache checks in later test classes.
		/** @var Token_Resolver $resolver */
		$resolver      = $this->container->get( Token_Resolver::class );
		$memo_property = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo_property->setAccessible( true );
		$memo_property->setValue( $resolver, [] );

		parent::tearDown();
	}

	// ---- Front-end enqueue ---------------------------------------------------------------------------

	public function testEnqueueFrontEndAppendsInlineStyleToGlobalVariablesHandle(): void {
		$this->projector->enqueue_front_end();

		$inline = wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' );

		$this->assertNotEmpty( $inline );

		$css = implode( '', (array) $inline );
		$this->assertStringContainsString( Scope::root(), $css );
		$this->assertStringContainsString( '--kb-token--', $css );
	}

	// ---- Editor enqueue -------------------------------------------------------------------------------

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

	public function testFilterFontSizesPassesThroughWhenNoFontSizeTokensRegistered(): void {
		$input  = [ 'sm' => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)' ];
		$result = $this->projector->filter_font_sizes( $input );

		// Shipped tokens have no kadence_slot font-size entries, so input passes through unchanged.
		$this->assertSame( $input, $result );
	}

	// ---- Deactivated registry (fail-closed) ----------------------------------------------------------

	public function testNothingIsEmittedWhenRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$this->projector->enqueue_front_end();
		$this->projector->enqueue_editor();

		$front_inline  = wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' );
		$editor_inline = wp_styles()->get_data( 'kadence-blocks-global-editor-styles', 'after' );

		$this->assertEmpty( $front_inline );
		$this->assertEmpty( $editor_inline );
	}

	public function testFiltersReturnInputUnchangedWhenRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$colors = [ '--global-palette1' => '#3182CE' ];
		$sizes  = [ 'sm' => 'clamp(0.8rem, 0.73rem + 0.217vw, 0.9rem)' ];

		$this->assertSame( $colors, $this->projector->filter_global_colors( $colors ) );
		$this->assertSame( $sizes, $this->projector->filter_font_sizes( $sizes ) );
	}
}
