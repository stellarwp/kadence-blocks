<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Testimonial_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TestimonialTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonial';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Testimonial_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Testimonial_Block();
	}


}
