<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Googlemaps_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class IconTest extends KadenceBlocksUnit {


	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'googlemaps';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Googlemaps_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Googlemaps_Block();
	}


}
