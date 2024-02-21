<?php

namespace Tests\wpunit\blocks;
class ShowMoreTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'show-more';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Show_More_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Show_More_Block();
	}

	protected function _after() {
	}

}
