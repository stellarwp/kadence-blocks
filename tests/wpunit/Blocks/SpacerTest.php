<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Spacer_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class SpacerTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'spacer';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Spacer_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Spacer_Block();
	}


}
