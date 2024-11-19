<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Header_Container_Tablet_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class HeaderContainerTabletTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'header-container-tablet';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Header_Container_Tablet_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Header_Container_Tablet_Block();
	}

	protected function _after() {
	}

}
