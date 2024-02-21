<?php

namespace Tests\wpunit\blocks;
class RowlayoutTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'rowlayout';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Rowlayout_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Rowlayout_Block();
	}

	protected function _after() {
	}

}
