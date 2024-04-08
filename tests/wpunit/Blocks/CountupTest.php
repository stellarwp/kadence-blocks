<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Countup_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class CountupTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'countup';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Countup_Block
	 */
	protected $block;

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-countup', 'registered' ), 'Count up library is registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-countup', 'registered' ), 'Count up script is registered' );
	}

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Countup_Block();
	}


}
