<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Theme_JSON_Data;

/**
 * Covers the native block-style projector: it appends the scoped variant CSS to KB's style handles,
 * injects the $default baseline into theme.json, and is a no-op when the registry is deactivated.
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

		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		parent::tearDown();
	}

	private function theme_json( array $data = [] ): WP_Theme_JSON_Data {
		return new WP_Theme_JSON_Data( array_merge( [ 'version' => 2 ], $data ), 'theme' );
	}

	public function testItAppendsNativeVariantCssToTheFrontEndHandle(): void {
		$this->projector->enqueue_front_end();

		$css = implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );

		$this->assertStringContainsString( '.wp-block-button.is-style-kb-primary{', $css );
	}

	public function testItInjectsTheDefaultBaselineIntoThemeJson(): void {
		$result = $this->projector->inject( $this->theme_json() );

		$blocks = $result->get_data()['styles']['blocks'] ?? [];

		$this->assertArrayHasKey( 'core/button', $blocks );
		$this->assertSame( 'var(--wp--preset--color--button-bg)', $blocks['core/button']['color']['background'] );
	}

	public function testItIsANoopWhenTheRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		$this->projector->enqueue_front_end();
		$this->assertEmpty( wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );

		$result = $this->projector->inject( $this->theme_json() );
		$blocks = $result->get_data()['styles']['blocks'] ?? [];
		$this->assertArrayNotHasKey( 'core/button', $blocks );
	}
}
