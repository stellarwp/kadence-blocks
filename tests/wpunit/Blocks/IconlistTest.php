<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Iconlist_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class IconlistTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'iconlist';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Iconlist_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Iconlist_Block();
	}


}
