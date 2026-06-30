<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Native;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

/**
 * Covers the native button projector: it appends the companion stylesheet to KB's front-end handle, scopes
 * it to the palette-override setting (every button vs only variant-selected ones), and is a no-op when the
 * registry is deactivated.
 */
final class ProjectorTest extends TestCase {

	private Projector $projector;

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );

		if ( ! wp_style_is( 'kadence-blocks-global-variables', 'registered' ) ) {
			wp_register_style( 'kadence-blocks-global-variables', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion
		}
	}

	protected function tearDown(): void {
		wp_deregister_style( 'kadence-blocks-global-variables' );
		$this->registry->activate();

		parent::tearDown();
	}

	/**
	 * The enqueued companion CSS for the front-end handle.
	 *
	 * @return string
	 */
	private function enqueued_css(): string {
		$this->projector->enqueue_front_end();

		return implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}

	/**
	 * When the theme palette is NOT overridden (the default), the companion CSS only styles a button that
	 * opts in with a selected variant, so an untouched core/button keeps its native theme button.
	 *
	 * @return void
	 */
	public function testItScopesToVariantSelectionWhenThePaletteIsNotOverridden(): void {
		update_option( 'kadence_blocks_colors', (string) wp_json_encode( [ 'override' => false ] ) );

		$css = $this->enqueued_css();

		$this->assertStringContainsString( '.wp-block-button[class*="kb-variant--"]:not(.is-style-outline) > .wp-block-button__link', $css );
	}

	/**
	 * When the theme palette IS overridden, the theme's native button color is gone, so the companion CSS
	 * owns every core/button's default — the rules target ".wp-block-button" with no variant-class scope.
	 *
	 * @return void
	 */
	public function testItOwnsEveryButtonDefaultWhenThePaletteIsOverridden(): void {
		update_option( 'kadence_blocks_colors', (string) wp_json_encode( [ 'override' => true ] ) );

		$css = $this->enqueued_css();

		$this->assertStringContainsString( '.wp-block-button:not(.is-style-outline) > .wp-block-button__link:not(.has-background){background-color:var(--global-palette-btn-bg);}', $css );
		$this->assertStringNotContainsString( 'kb-variant--', $css );
	}

	/**
	 * @return void
	 */
	public function testItIsANoopWhenTheRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$this->projector->enqueue_front_end();

		$this->assertEmpty( wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}
}
