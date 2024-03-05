<?php

namespace Tests\wpunit\blocks;
class TableofcontentsTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'tableofcontents';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Tableofcontents_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Tableofcontents_Block();
	}

	protected function _after() {
	}

}
