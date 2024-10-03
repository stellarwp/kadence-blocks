<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Header_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class HeaderTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'header';

	/**
	 * Post type for the form.
	 *
	 * @var string
	 */
	protected $post_type = 'kadence_header';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Header_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Header_Block();
	}

	protected function _after() {
	}

	public function testHeaderCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Header CPT is registered' );
	}

}
