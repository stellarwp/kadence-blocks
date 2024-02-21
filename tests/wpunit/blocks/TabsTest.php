<?php

namespace Tests\wpunit\blocks;
class TabsTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'tabs';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Tabs_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Tabs_Block();
	}

	protected function _after() {
	}

}
