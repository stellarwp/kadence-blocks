<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Navigation_Link_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class NavigationItemTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'navigation-link';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Navigation_Link_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Navigation_Link_Block();
	}

	protected function _after() {
	}


}
