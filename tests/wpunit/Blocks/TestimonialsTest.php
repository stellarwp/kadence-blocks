<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Testimonials_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TestimonialsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonials';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Testimonials_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Testimonials_Block();
	}


}
