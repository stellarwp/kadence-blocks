<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Accordion_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class AccordionTest extends KadenceBlocksUnit {
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

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kadence-blocks-accordion', 'registered' ), 'Block scripts registered' );
	}

	protected function setUp(): void {
		parent::setUp();

		$this->block = new Kadence_Blocks_Accordion_Block();
	}
}
