<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Infobox_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class InfoboxTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'infobox';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Infobox_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Infobox_Block();
	}


}
