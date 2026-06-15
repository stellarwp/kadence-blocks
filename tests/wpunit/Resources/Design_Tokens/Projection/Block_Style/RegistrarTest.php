<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style\Registrar;
use Tests\Support\Classes\TestCase;
use WP_Block_Styles_Registry;

/**
 * Covers the block-style registrar: it registers a WordPress block style for each native block variant so
 * the editor's styles switcher offers them, and skips Kadence blocks.
 */
final class RegistrarTest extends TestCase {

	private Registrar $registrar;

	protected function setUp(): void {
		parent::setUp();

		$this->registrar = $this->container->get( Registrar::class );
	}

	public function testItRegistersABlockStyleForEachNativeVariant(): void {
		$this->registrar->register();

		$styles = WP_Block_Styles_Registry::get_instance()->get_registered_styles_for_block( 'core/button' );

		$this->assertArrayHasKey( 'kb-primary', $styles );
		$this->assertArrayHasKey( 'kb-secondary', $styles );
		$this->assertArrayHasKey( 'kb-ghost', $styles );
		$this->assertSame( 'Ghost', $styles['kb-ghost']['label'] );
	}

	public function testItDoesNotRegisterStylesForKadenceBlocks(): void {
		$this->registrar->register();

		$styles = WP_Block_Styles_Registry::get_instance()->get_registered_styles_for_block( 'kadence/advancedbtn' );

		$this->assertArrayNotHasKey( 'kb-primary', $styles );
	}
}
