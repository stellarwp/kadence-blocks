<?php

namespace Tests\wpunit\blocks;
class ProgressBarTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'progress-bar';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Progress_Bar_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Progress_Bar_Block();
	}

	protected function _after() {
	}

}
