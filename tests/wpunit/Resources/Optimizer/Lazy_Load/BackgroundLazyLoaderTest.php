<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Asset\Asset;
use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Background_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\OptimizerTestCase;

final class BackgroundLazyLoaderTest extends OptimizerTestCase {

	use Permalink_Trait;

	private Store $store;
	private Background_Lazy_Loader $lazy_loader;
	private Path $path;
	private Analysis_Registry $registry;
	private Asset $asset;

	protected function setUp(): void {
		parent::setUp();

		// Set pretty permalinks.
		update_option( 'permalink_structure', '/%postname%/' );

		$post_id = $this->factory()->post->create(
			[
				'post_title'  => 'Test Post',
				'post_status' => 'publish',
				'post_name'   => 'test-post',
			]
		);

		$post_path = $this->get_post_path( $post_id );

		$this->assertNotEmpty( $post_path );

		$this->path = new Path( $post_path );

		$_SERVER['REQUEST_URI'] = '/test-post/';

		$this->store = $this->container->get( Store::class );
		$this->asset = $this->container->get( Asset::class );

		// Create the registry for desktop testing.
		$path_factory   = $this->container->get( Path_Factory::class );
		$this->registry = new Analysis_Registry( $this->store, $path_factory, false );

		// Create a custom lazy loader with our test registry.
		$this->lazy_loader = new Background_Lazy_Loader( $this->asset, $this->registry );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

		$this->registry->flush();

		unset( $_SERVER['REQUEST_URI'] );

		parent::tearDown();
	}

	public function testItReturnsOriginalArgsWhenNoBackgroundImage(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => false,
		];

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenBackgroundImageIsEmpty(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => '',
		];

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenBackgroundImageIsNull(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => null,
		];

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoAnalysisData(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenBackgroundImageIsAboveTheFoldOnDesktop(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenBackgroundImageIsAboveTheFoldOnMobile(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis( [], [ 'http://wordpress.test/image.jpg' ] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Background_Lazy_Loader( $this->asset, $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenNoClassesAndNoInlineBackground(): void {
		$args = [
			'id' => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenClassesIsFalseAndNoInlineBackground(): void {
		$args = [
			'class' => false,
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItAddsLazyLoadingAttributesForDesktopBackgroundImage(): void {
		$args = [
			'class' => 'kb-row-layout kb-row-layout-123',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => 'kb-row-layout kb-row-layout-123',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingAttributesForMobileBackgroundImage(): void {
		$args = [
			'class' => 'kb-row-layout kb-row-layout-123',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => 'kb-row-layout kb-row-layout-123',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItPreservesOtherAttributesWhenAddingLazyLoading(): void {
		$args = [
			'class'     => 'kb-row-layout',
			'id'        => 'test-row',
			'style'     => 'background-color: red;',
			'data-test' => 'value',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'style'                     => 'background-color: red;',
			'data-test'                 => 'value',
			'data-kadence-lazy-class'   => 'kb-row-layout',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleBackgroundImagesInAnalysis(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image3.jpg',
		];

		$this->createTestAnalysis(
			[ 'http://wordpress.test/image1.jpg', 'http://wordpress.test/image2.jpg' ]
		);

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => 'kb-row-layout',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesEmptyBackgroundImagesArray(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis( [] );

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => 'kb-row-layout',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesCaseSensitiveBackgroundImageMatching(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/IMAGE.jpg',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => 'kb-row-layout',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSpecialCharactersInBackgroundImageUrl(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image with spaces.jpg',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image with spaces.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesUnicodeCharactersInBackgroundImageUrl(): void {
		$args = [
			'class' => 'kb-row-layout',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/🚀-image.jpg',
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/🚀-image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesEmptyClassString(): void {
		$args = [
			'class' => '',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItHandlesWhitespaceInClassString(): void {
		$args = [
			'class' => '   kb-row-layout   ',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg' => 'http://wordpress.test/image.jpg',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => '   kb-row-layout   ',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingAttributesForInlineBackgroundImage(): void {
		$args = [
			'style' => 'background-image: url(http://wordpress.test/image.jpg);',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => 'background-image: url(http://wordpress.test/image.jpg);',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingAttributesForInlineBackgroundImageWithoutClass(): void {
		$args = [
			'style' => 'background-image: url(http://wordpress.test/image.jpg);',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => 'background-image: url(http://wordpress.test/image.jpg);',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingAttributesForInlineBackgroundImageWithEmptyStyle(): void {
		$args = [
			'id' => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => '',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItAddsLazyLoadingAttributesForInlineBackgroundImageWithClassAndStyle(): void {
		$args = [
			'class' => 'kb-row-layout',
			'style' => 'background-image: url(http://wordpress.test/image.jpg);',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-class'   => 'kb-row-layout',
			'data-kadence-lazy-style'   => 'background-image: url(http://wordpress.test/image.jpg);',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'class,style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItReturnsOriginalArgsWhenNoClassesAndInlineBackgroundIsFalse(): void {
		$args = [
			'id' => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => false,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItReturnsOriginalArgsWhenClassesIsFalseAndInlineBackgroundIsFalse(): void {
		$args = [
			'class' => false,
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => false,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$this->assertEquals( $args, $result );
	}

	public function testItHandlesInlineBackgroundImageWithComplexStyle(): void {
		$args = [
			'style' => 'background-image: url(http://wordpress.test/image.jpg); background-size: cover; background-position: center;',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => 'background-image: url(http://wordpress.test/image.jpg); background-size: cover; background-position: center;',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesInlineBackgroundImageWithSpecialCharactersInStyle(): void {
		$args = [
			'style' => 'background-image: url("http://wordpress.test/image with spaces.jpg");',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image with spaces.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => 'background-image: url("http://wordpress.test/image with spaces.jpg");',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesInlineBackgroundImageWithUnicodeInStyle(): void {
		$args = [
			'style' => 'background-image: url("http://wordpress.test/🚀-image.jpg");',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/🚀-image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => 'background-image: url("http://wordpress.test/🚀-image.jpg");',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesInlineBackgroundImageWithWhitespaceInStyle(): void {
		$args = [
			'style' => '   background-image: url(http://wordpress.test/image.jpg);   ',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => '   background-image: url(http://wordpress.test/image.jpg);   ',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesInlineBackgroundImageWithMobileAnalysis(): void {
		$args = [
			'style' => 'background-image: url(http://wordpress.test/image.jpg);',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		$expected = [
			'id'                        => 'test-row',
			'data-kadence-lazy-style'   => 'background-image: url(http://wordpress.test/image.jpg);',
			'data-kadence-lazy-trigger' => 'viewport',
			'data-kadence-lazy-attrs'   => 'style',
		];

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesInlineBackgroundImageWithAboveTheFoldImage(): void {
		$args = [
			'style' => 'background-image: url(http://wordpress.test/image.jpg);',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_row_background_images( $args, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	public function testItHandlesInlineBackgroundImageWithAboveTheFoldImageOnMobile(): void {
		$args = [
			'class' => 'kt-row-has-bg',
			'style' => 'background-image: url(http://wordpress.test/image.jpg);',
			'id'    => 'test-row',
		];

		$attributes = [
			'bgImg'            => 'http://wordpress.test/image.jpg',
			'backgroundInline' => true,
		];

		$this->createTestAnalysis( [], [ 'http://wordpress.test/image.jpg' ] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Background_Lazy_Loader( $this->asset, $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_row_background_images( $args, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	// Column background lazy loading tests.
	public function testItReturnsOriginalHtmlWhenNoBackgroundImageForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [],
		];

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenBackgroundImageIsEmptyForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => '',
				],
			],
		];

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenBackgroundImageIsFalseForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => false,
				],
			],
		];

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenBackgroundImageIsNullForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => null,
				],
			],
		];

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenNoAnalysisDataForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		// Should return original HTML since registry is not optimized.
		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenBackgroundImageIsAboveTheFoldForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenNoKadenceColumnClassForColumn(): void {
		$html = '<div class="some-other-class">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItReturnsOriginalHtmlWhenNoClassAttributeForColumn(): void {
		$html = '<div>Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItAddsLazyLoadingAttributesForColumnBackgroundForColumn(): void {
		$html = '<div class="wp-block-kadence-column kb-column-layout-123">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column kb-column-layout-123" data-kadence-lazy-trigger="viewport" >Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItPreservesOtherAttributesWhenAddingLazyLoadingToColumn(): void {
		$html = '<div class="wp-block-kadence-column" id="test-column" style="background-color: red;" data-test="value">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column" data-kadence-lazy-trigger="viewport"  id="test-column" style="background-color: red;" data-test="value">Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleBackgroundImagesInAnalysisForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image3.jpg',
				],
			],
		];

		$this->createTestAnalysis(
			[ 'http://wordpress.test/image1.jpg', 'http://wordpress.test/image2.jpg' ]
		);

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column" data-kadence-lazy-trigger="viewport" >Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesEmptyBackgroundImagesArrayForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis( [] );

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column" data-kadence-lazy-trigger="viewport" >Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesCaseSensitiveBackgroundImageMatchingForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/IMAGE.jpg',
				],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column" data-kadence-lazy-trigger="viewport" >Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesSpecialCharactersInBackgroundImageUrlForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image with spaces.jpg',
				],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/image with spaces.jpg' ] );

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $html, $result );
	}

	public function testItHandlesUnicodeCharactersInBackgroundImageUrlForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/🚀-image.jpg',
				],
			],
		];

		$this->createTestAnalysis( [ 'http://wordpress.test/🚀-image.jpg' ] );

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $html, $result );
	}

	public function testItHandlesEmptyClassStringForColumn(): void {
		$html = '<div class="">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItHandlesWhitespaceInClassStringForColumn(): void {
		$html = '<div class="   wp-block-kadence-column   ">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="   wp-block-kadence-column   " data-kadence-lazy-trigger="viewport" >Column content</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesComplexHtmlStructureForColumn(): void {
		$html = '<div class="wp-block-kadence-column" id="test-column">
			<div class="inner-content">
				<p>Some content</p>
			</div>
		</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column" data-kadence-lazy-trigger="viewport"  id="test-column">
			<div class="inner-content">
				<p>Some content</p>
			</div>
		</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMultipleKadenceColumnsInHtmlForColumn(): void {
		$html = '<div class="wp-block-kadence-column">First column</div><div class="wp-block-kadence-column">Second column</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		// Should only modify the first kadence column found.
		$expected = '<div data-kadence-lazy-attrs="class" data-kadence-lazy-class="wp-block-kadence-column" data-kadence-lazy-trigger="viewport" >First column</div><div class="wp-block-kadence-column">Second column</div>';

		$this->assertEquals( $expected, $result );
	}

	public function testItHandlesMobileAnalysisForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'bgImg' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis( [], [ 'http://wordpress.test/image.jpg' ] );

		// Create mobile registry and lazy loader for this test.
		$path_factory       = $this->container->get( Path_Factory::class );
		$mobile_registry    = new Analysis_Registry( $this->store, $path_factory, true );
		$mobile_lazy_loader = new Background_Lazy_Loader( $this->asset, $mobile_registry );

		$result = $mobile_lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $html, $result );
	}

	public function testItHandlesMissingBackgroundImgKeyForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [
				[
					'someOtherKey' => 'http://wordpress.test/image.jpg',
				],
			],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItHandlesEmptyBackgroundImgArrayForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => [],
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	public function testItHandlesNonArrayBackgroundImgForColumn(): void {
		$html = '<div class="wp-block-kadence-column">Column content</div>';

		$attributes = [
			'backgroundImg' => 'not-an-array',
		];

		$this->createTestAnalysis();

		$result = $this->lazy_loader->lazy_load_column_backgrounds( $html, $attributes );

		$this->assertEquals( $html, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @param string[] $desktop_background_images Desktop background images.
	 * @param string[] $mobile_background_images Mobile background images.
	 */
	private function createTestAnalysis(
		array $desktop_background_images = [],
		array $mobile_background_images = []
	): void {
		$desktop = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => $desktop_background_images,
				'sections'         => [],
			]
		);

		$mobile = DeviceAnalysis::from(
			[
				'criticalImages'   => [],
				'backgroundImages' => $mobile_background_images,
				'sections'         => [],
			]
		);

		$analysis = WebsiteAnalysis::from(
			[
				'desktop' => $desktop->toArray(),
				'mobile'  => $mobile->toArray(),
				'images'  => [],
			]
		);

		$this->store->set( $this->path, $analysis );
	}
}
