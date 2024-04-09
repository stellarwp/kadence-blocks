<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Image_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ImageTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'image';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Image_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Image_Block();
	}


}
