<?php declare( strict_types=1 );
// cspell:ignore advancedbtn palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Covers the preset projector: it appends the scoped preset CSS to KB's front-end and editor style
 * handles, and is a no-op when the registry is deactivated.
 */
final class ProjectorTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	private Preset_Resolver $resolver;

	private Token_Store $store;

	private Active_Token_Library_Store $active;

	protected function setUp(): void {
		parent::setUp();

		$this->resolver = $this->container->get( Preset_Resolver::class );
		$this->store    = $this->container->get( Token_Store::class );
		$this->active   = $this->container->get( Active_Token_Library_Store::class );

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

	public function testItAppendsPresetCssToTheFrontEndHandle(): void {
		$this->projector( $this->button_bindings() )->enqueue_front_end();

		$css = implode( '', (array) wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );

		$this->assertStringContainsString( '.wp-block-kadence-singlebtn.kb-preset--default{', $css );
		$this->assertStringContainsString( '--global-palette1:var(--kb-token--preset--kadence-singlebtn--default--button-bg', $css );
	}

	/**
	 * The preset projector is context-independent — its scoped rules retarget the `--global-*` slot vars,
	 * which carry no dependency on the editor's markup shape — so its editor build is byte-for-byte
	 * identical to its front-end build.
	 *
	 * @return void
	 */
	public function testEditorCssEqualsCss(): void {
		$projector = $this->projector( $this->button_bindings() );

		$this->assertSame( $projector->css(), $projector->editor_css() );
	}

	public function testItIsANoopWhenTheRegistryIsDeactivated(): void {
		$registry = $this->button_bindings();
		$registry->deactivate();

		$this->projector( $registry )->enqueue_front_end();

		$this->assertEmpty( wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}

	public function testTheProviderBindsTheProjectorAsASingleton(): void {
		// Proves Projection\Preset\Provider ran during module boot and bound the projector graph.
		$this->assertSame(
			$this->container->get( Projector::class ),
			$this->container->get( Projector::class )
		);
	}

	/**
	 * Build the projector with a given registry, the real preset resolver and the store.
	 */
	private function projector( Token_Registry $registry ): Projector {
		return new Projector( $registry, $this->store, $this->active, new Css_Builder( $registry, $this->resolver, $this->store ) );
	}

	/**
	 * A registry holding a Button's preset bindings that target Kadence palette slots.
	 */
	private function button_bindings(): Token_Registry {
		$registry = new Token_Registry();
		$registry->register_preset_bindings(
			[
				'block'    => self::BUTTON,
				'group'    => 'style',
				'bindings' => [
					'button-bg'   => [ 'kadence_slot' => 'palette1' ],
					'button-text' => [ 'kadence_slot' => 'palette9' ],
				],
			]
		);

		return $registry;
	}
}
