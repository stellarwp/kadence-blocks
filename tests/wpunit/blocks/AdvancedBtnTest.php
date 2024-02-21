<?php

namespace Tests\wpunit\blocks;
class AdvancedBtnTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'advancedbtn';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Advancedbtn_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Advancedbtn_Block();
	}

	protected function _after() {
	}

}
