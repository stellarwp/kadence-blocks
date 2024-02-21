<?php

namespace Tests\wpunit\blocks;
class TestimonialsTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'testimonials';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Testimonials_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Testimonials_Block();
	}

	protected function _after() {
	}

}
