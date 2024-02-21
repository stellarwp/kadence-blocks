<?php

namespace Tests\wpunit\blocks;
class SingleIconTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'single-icon';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Single_Icon_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Single_Icon_Block();
	}

	protected function _after() {
	}

}
