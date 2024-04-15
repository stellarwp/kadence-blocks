<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Progress_Bar_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ProgressBarTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'progress-bar';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Progress_Bar_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Progress_Bar_Block();
	}


}
