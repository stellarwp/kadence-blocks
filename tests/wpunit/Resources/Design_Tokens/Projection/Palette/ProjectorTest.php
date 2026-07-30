<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

/**
 * Covers the palette switch-layer projector: it emits a `[data-kb-palette="<id>"]` selector for each of the
 * active set's shipped palettes, and is a no-op when the registry is deactivated.
 */
final class ProjectorTest extends TestCase {

	/**
	 * @var Projector
	 */
	private Projector $projector;

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		$this->registry->activate();

		parent::tearDown();
	}

	/**
	 * The projector emits a switch selector for each shipped palette, re-pointing the brand color vars to the
	 * palette's values (here the "sunset" starter palette).
	 *
	 * @return void
	 */
	public function testItEmitsASwitchSelectorForEachShippedPalette(): void {
		$css = $this->projector->css();

		$this->assertStringContainsString( '[data-kb-palette="default"]{', $css );
		$this->assertStringContainsString( '[data-kb-palette="sunset"]{', $css );
		$this->assertStringContainsString( '[data-kb-palette="forest"]{', $css );

		$this->assertStringContainsString(
			Css_Var::from_id( 'primitive.color.brand.primary' ) . ':#DD6B20;',
			$css
		);
	}

	/**
	 * A deactivated registry projects nothing, so a fail-closed registry leaves KB's behavior untouched.
	 *
	 * @return void
	 */
	public function testItEmitsNothingWhenTheRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		wp_deregister_style( 'kadence-blocks-global-variables' );
		wp_register_style( 'kadence-blocks-global-variables', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion

		$this->projector->enqueue_front_end();

		$this->assertEmpty( wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}
}
