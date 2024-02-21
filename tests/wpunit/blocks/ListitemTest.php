<?php

namespace Tests\wpunit\blocks;
class ListitemTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'listitem';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Listitem_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Listitem_Block();
	}

	protected function _after() {
	}

}
