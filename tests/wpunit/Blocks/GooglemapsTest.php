<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Icon_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class GooglemapsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'icon';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Icon_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Icon_Block();
	}


}
