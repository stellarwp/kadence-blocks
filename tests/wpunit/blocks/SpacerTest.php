<?php

namespace Tests\wpunit\blocks;
class SpacerTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'spacer';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Spacer_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Spacer_Block();
	}

	protected function _after() {
	}

}
