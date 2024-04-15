<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Listitem_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ListitemTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'listitem';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Listitem_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Listitem_Block();
	}


}
