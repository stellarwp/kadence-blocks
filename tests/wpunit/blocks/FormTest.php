<?php

namespace Tests\wpunit\blocks;
class FormTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'form';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Form_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Form_Block();
	}

	protected function _after() {
	}
}
