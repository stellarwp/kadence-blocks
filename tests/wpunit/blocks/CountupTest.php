<?php

namespace Tests\wpunit\blocks;
class CountupTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'countup';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Countup_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Countup_Block();
	}

	protected function _after() {
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-countup', 'registered' ), 'Count up library is registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-countup', 'registered' ), 'Count up script is registered' );
	}
}
