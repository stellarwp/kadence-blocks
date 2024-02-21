<?php

namespace Tests\wpunit\blocks;
class GooglemapsTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'icon';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Icon_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Icon_Block();
	}

	protected function _after() {
	}

}
