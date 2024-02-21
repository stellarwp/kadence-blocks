<?php

namespace Tests\wpunit\blocks;
class AccordionTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'accordion';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Accordion_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Accordion_Block();
	}

	protected function _after() {
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-accordion', 'registered' ), 'Block scripts registered' );
	}
}
