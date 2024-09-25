<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Off_Canvas_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class OffCanvasTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'off-canvas';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Off_Canvas_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Off_Canvas_Block();
	}

	protected function _after() {
	}

}
