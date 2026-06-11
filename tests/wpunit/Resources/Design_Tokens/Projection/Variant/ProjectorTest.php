<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Covers the variant projector: it appends the scoped variant CSS to KB's front-end and editor style
 * handles, and is a no-op when the registry is deactivated.
 */
final class ProjectorTest extends TestCase {

	private const BUTTON = 'kadence/advancedbtn';

	private Variant_Resolver $resolver;

	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Variant_Resolver::class );
		$this->store    = $this->container->get( Token_Store::class );

		// Register the KB style handles the projector appends to.
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

		// Clear the shared Token_Resolver memo so stored overrides from a sibling test cannot leak in.
		$resolver_ref = new ReflectionProperty( $this->resolver, 'resolver' );
		$resolver_ref->setAccessible( true );
		$token_resolver = $resolver_ref->getValue( $this->resolver );

		$memo = new ReflectionProperty( $token_resolver, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $token_resolver, [] );

		parent::tearDown();
	}

	public function testItAppendsVariantCssToTheFrontEndHandle(): void {
		$this->projector( $this->button_set() )->enqueue_front_end();

		$css = implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );

		$this->assertStringContainsString( '.wp-block-kadence-advancedbtn.kb-variant--primary{', $css );
		$this->assertStringContainsString( '--global-palette1:var(--kb-token--variant--kadence-advancedbtn--primary--button-bg', $css );
	}

	public function testItIsANoopWhenTheRegistryIsDeactivated(): void {
		$registry = $this->button_set();
		$registry->deactivate();

		$this->projector( $registry )->enqueue_front_end();

		$this->assertEmpty( wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}

	public function testTheProviderBindsTheProjectorAsASingleton(): void {
		// Proves Projection\Variant\Provider ran during module boot and bound the projector graph.
		$this->assertSame(
			$this->container->get( Projector::class ),
			$this->container->get( Projector::class )
		);
	}

	/**
	 * Build the projector with a given registry, the real variant resolver and the store.
	 */
	private function projector( Token_Registry $registry ): Projector {
		return new Projector( $registry, $this->store, new Css_Builder( $registry, $this->resolver ) );
	}

	/**
	 * A registry holding a Button variant set whose bindings target Kadence palette slots.
	 */
	private function button_set(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register_variant_set(
			[
				'block'    => self::BUTTON,
				'bindings' => [
					'button-bg'   => [ 'kadence_slot' => 'palette1' ],
					'button-text' => [ 'kadence_slot' => 'palette9' ],
				],
			]
		);

		return $registry;
	}
}
