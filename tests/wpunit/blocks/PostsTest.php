<?php

namespace Tests\wpunit\blocks;
class PostsTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'posts';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Posts_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Posts_Block();
	}

	protected function _after() {
	}

}
