<?php

namespace Tests\wpunit\blocks;
class AdvancedGalleryTest extends \KadenceBlocksUnit {
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'advancedgallery';

	/**
	 * Block instance.
	 *
	 * @var \Kadence_Blocks_Advancedbtn_Block
	 */
	protected $block;

	protected function _before() {
		$this->block = new \Kadence_Blocks_Advancedgallery_Block();
	}

	protected function _after() {
	}

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kad-splide', 'registered' ), 'Splide is registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-splide-init', 'registered' ), 'Splide init registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-masonry-init', 'registered' ), 'Masonry init registered' );
		$this->assertTrue( wp_script_is( 'kadence-glightbox', 'registered' ), 'Glightbox registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-glight-init', 'registered' ), 'Glightbox init registered' );
	}
}
