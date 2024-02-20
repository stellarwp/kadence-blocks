<?php

namespace Tests\wpunit\blocks;
class IconListTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'iconlist';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Iconlist_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Iconlist_Block();
	}

	protected function _after() {
	}

}
