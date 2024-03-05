<?php

namespace Tests\wpunit\blocks;
class CountdownTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'countdown';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Countdown_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Countdown_Block();
	}

	protected function _after() {
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-countdown', 'registered' ), 'Countdown script is registered' );
	}
}
