<?php

namespace Tests\wpunit\blocks;
class TestimonialTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonial';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Testimonial_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Testimonial_Block();
	}

	protected function _after() {
	}

}
