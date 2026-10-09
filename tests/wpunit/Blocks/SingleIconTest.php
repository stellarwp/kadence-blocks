<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Single_Icon_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class SingleIconTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'single-icon';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Single_Icon_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Single_Icon_Block();
	}

	/**
	 * An untouched stacked icon emits no padding of its own, so the stylesheet's 20px padding applies.
	 *
	 * @return void
	 */
	public function testAnUntouchedStackedIconEmitsNoPadding(): void {
		$css = $this->render_stacked_icon_css( 'single-icon-stacked-untouched', [] );

		$this->assertStringContainsString( 'border-width:', $css );
		$this->assertStringNotContainsString( 'padding', $css );
	}

	/**
	 * A stacked icon with its own padding still emits that padding.
	 *
	 * @return void
	 */
	public function testAStackedIconWithItsOwnPaddingStillEmitsIt(): void {
		$css = $this->render_stacked_icon_css(
			'single-icon-stacked-padded',
			[
				'padding'     => [ 8, 8, 8, 8 ],
				'paddingUnit' => 'px',
			]
		);

		$this->assertStringContainsString( 'padding-top:8px;', $css );
		$this->assertStringContainsString( 'padding-left:8px;', $css );
	}

	/**
	 * Render a stacked icon through the block's real render callback and return the CSS it registered.
	 *
	 * @param string               $unique_id  The block's unique id.
	 * @param array<string, mixed> $attributes Extra instance attributes.
	 *
	 * @return string The CSS the block registered for this instance.
	 */
	private function render_stacked_icon_css( string $unique_id, array $attributes ): string {
		$this->block->render_css(
			array_merge(
				[
					'uniqueID' => $unique_id,
					'style'    => 'stacked',
				],
				$attributes
			),
			'<span class="kb-svg-icon-wrap"></span>',
			null
		);

		return \Kadence_Blocks_CSS::$styles[ 'kb-single-icon' . $unique_id ] ?? '';
	}
}
