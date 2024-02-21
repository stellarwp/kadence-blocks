<?php

namespace Tests\wpunit\blocks;
class IconTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'googlemaps';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Googlemaps_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Googlemaps_Block();
	}

	protected function _after() {
	}

}
