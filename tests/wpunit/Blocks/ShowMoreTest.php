<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Show_More_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ShowMoreTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'show-more';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Show_More_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Show_More_Block();
	}


}
