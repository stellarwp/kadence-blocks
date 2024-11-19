<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Header_Section_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class HeaderSectionTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'header-section';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Header_Section_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Header_Section_Block();
	}

	protected function _after() {
	}

}
