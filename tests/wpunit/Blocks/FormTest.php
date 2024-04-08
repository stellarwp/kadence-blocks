<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Form_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class FormTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'form';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Form_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Form_Block();
	}


}
