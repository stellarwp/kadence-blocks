<?php

namespace Tests\wpunit\blocks;
class ColumnTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'column';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Column_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Column_Block();
	}

	protected function _after() {
	}
}
