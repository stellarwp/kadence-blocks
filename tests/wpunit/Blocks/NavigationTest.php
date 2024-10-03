<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Navigation_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class NavigationTest extends KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'navigation';

	/**
	 * Post type for the form.
	 *
	 * @var string
	 */
	protected $post_type = 'kadence_navigation';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Navigation_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Navigation_Block();
	}

	protected function _after() {
	}

	public function testNavigationCptRegistered() {
		$this->assertTrue( $this->tester->is_cpt_registered( $this->post_type ), 'Navigation CPT is registered' );
	}

}
