<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Rowlayout_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class RowlayoutTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'rowlayout';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Rowlayout_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Rowlayout_Block();
	}


}
