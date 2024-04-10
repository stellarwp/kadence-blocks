<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Advancedbtn_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class AdvancedBtnTest extends KadenceBlocksUnit {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'advancedbtn';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Advancedbtn_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Advancedbtn_Block();
	}


}
