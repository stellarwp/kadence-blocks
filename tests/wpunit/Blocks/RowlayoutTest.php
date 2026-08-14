<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Rowlayout_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class RowlayoutTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'rowlayout';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Rowlayout_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Rowlayout_Block();
	}

	private function video_attrs( string $ratio ): array {
		return [
			'uniqueID'            => '9_r',
			'backgroundVideoType' => 'youtube',
			'backgroundVideo'     => [ [ 'youTube' => 'abc123', 'ratio' => $ratio ] ],
		];
	}

	public function testBackgroundVideoRatioIsEscaped() {
		$html = $this->block->get_video_render( $this->video_attrs( '16/9" onmouseover="alert(1)' ) );

		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidBackgroundVideoRatioRendersUnchanged() {
		$html = $this->block->get_video_render( $this->video_attrs( '16/9' ) );

		$this->assertStringContainsString( 'kb-bg-video-ratio-16-9"', $html );
	}
}
