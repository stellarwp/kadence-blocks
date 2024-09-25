<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Header_Container_Desktop_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class HeaderContainerDesktopTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'header-container-desktop';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Header_Container_Desktop_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Header_Container_Desktop_Block();
	}

	protected function _after() {
	}

}
