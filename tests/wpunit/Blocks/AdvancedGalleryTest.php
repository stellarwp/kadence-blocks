<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Advancedbtn_Block;
use Kadence_Blocks_Advancedgallery_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class AdvancedGalleryTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'advancedgallery';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Advancedbtn_Block
	 */
	protected $block;

	public function testIsScriptRegistered() {
		$this->block->register_scripts();

		$this->assertTrue( wp_script_is( 'kad-splide', 'registered' ), 'Splide is registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-splide-init', 'registered' ), 'Splide init registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-masonry-init', 'registered' ), 'Masonry init registered' );
		$this->assertTrue( wp_script_is( 'kadence-glightbox', 'registered' ), 'Glightbox registered' );
		$this->assertTrue( wp_script_is( 'kadence-blocks-glight-init', 'registered' ), 'Glightbox init registered' );
	}

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Advancedgallery_Block();
	}

	// Make sure captions that are arrays do not throw an error.
	public function test_render_gallery_images_with_array_caption()
	{
		$image = [
			'url' => 'http://example.com/image.jpg',
			'lightUrl' => 'http://example.com/image.jpg',
			'caption' => [ 'should', 'not', 'fail']
		];
		$attributes = [
			'linkTo' => 'media',
			'lightbox' => 'magnific',
			'lightboxCaption' => true,
		];

		$response = $this->block->render_gallery_images( $image, $attributes );

		$this->assertIsString( $response );
		$this->assertNotEmpty( $response );
	}
}
