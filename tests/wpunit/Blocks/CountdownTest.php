<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Countdown_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class CountdownTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'countdown';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Countdown_Block
	 */
	protected $block;

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-countdown', 'registered' ), 'Countdown script is registered' );
	}

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Countdown_Block();
	}


}
