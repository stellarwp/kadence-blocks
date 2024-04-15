<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Singlebtn_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class SinglebtnTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'singlebtn';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Singlebtn_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Singlebtn_Block();
	}


}
