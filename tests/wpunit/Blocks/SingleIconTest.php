<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Single_Icon_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class SingleIconTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'single-icon';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Single_Icon_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Single_Icon_Block();
	}


}
