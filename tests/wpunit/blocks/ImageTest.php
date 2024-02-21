<?php

namespace Tests\wpunit\blocks;
class ImageTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'image';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Image_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Image_Block();
	}

	protected function _after() {
	}

}
