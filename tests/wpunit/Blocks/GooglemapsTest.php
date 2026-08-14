<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Googlemaps_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class GooglemapsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'googlemaps';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Googlemaps_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Googlemaps_Block();
	}

	private function render( string $attributes ): string {
		return do_blocks( '<!-- wp:kadence/googlemaps ' . $attributes . ' /-->' );
	}

	public function testCoordinatesCannotInjectScript() {
		$html = $this->render( '{"uniqueID":"9_g","lat":"1}};alert(document.domain);function u(){var z={a:1","lng":"2"}' );

		$this->assertStringNotContainsString( 'alert(document.domain)', $html );
		$this->assertStringNotContainsString( '1}};', $html );
	}

	public function testValidCoordinatesRenderUnchanged() {
		$html = $this->render( '{"uniqueID":"9_g","lat":"37.82000","lng":"-122.4781"}' );

		$this->assertStringContainsString( 'lat: 37.82000, lng: -122.4781', $html );
	}
}
