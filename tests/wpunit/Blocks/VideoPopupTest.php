<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Tabs_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class VideoPopupTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'videopopup';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Videopopup_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = $this->getMockBuilder(\Kadence_Blocks_Videopopup_Block::class)
			->onlyMethods(['get_pro_version'])
			->getMock();
	}

	public function testFreeBlockShouldRegisterWithoutPro()
	{
		// Register without KBP_VERSION defined.
		$this->block->method('get_pro_version')->willReturn(null);
		$this->assertTrue($this->block->should_register());
	}

	public function testFreeBlockShouldRegisterWithNewerPro()
	{
		// Register with KBP_VERSION defined and newer than 2.6.1.
		$this->block->method('get_pro_version')->willReturn('3.0.0');
		$this->assertTrue($this->block->should_register());
	}

	public function testFreeBlockShouldNotRegisterWithOldPro()
	{
		// Don't register with KBP_VERSION defined and older than 2.6.1.
		$this->block->method('get_pro_version')->willReturn('2.0.0');
		$this->assertFalse($this->block->should_register());
	}

}
