<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Header_Column_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class HeaderColumnTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'header-column';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Header_Column_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Header_Column_Block();
	}

	protected function _after() {
	}

}
