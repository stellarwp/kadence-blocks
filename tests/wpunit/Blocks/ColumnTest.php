<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Column_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ColumnTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'column';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Column_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Column_Block();
	}


}
