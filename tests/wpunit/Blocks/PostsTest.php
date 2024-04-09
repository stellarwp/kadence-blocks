<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Posts_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class PostsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'posts';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Posts_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Posts_Block();
	}


}
