<?php

namespace Tests\wpunit\blocks;
class SinglebtnTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'singlebtn';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Singlebtn_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Singlebtn_Block();
	}

	protected function _after() {
	}

}
