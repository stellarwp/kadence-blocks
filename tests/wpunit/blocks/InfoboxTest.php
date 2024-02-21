<?php

namespace Tests\wpunit\blocks;
class InfoboxTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'infobox';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Infobox_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Infobox_Block();
	}

	protected function _after() {
	}

}
