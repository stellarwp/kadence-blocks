<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Tabs_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TabsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'tabs';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Tabs_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Tabs_Block();
	}


}
