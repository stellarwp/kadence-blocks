<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Tableofcontents_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TableofcontentsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'tableofcontents';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Tableofcontents_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Tableofcontents_Block();
	}


}
