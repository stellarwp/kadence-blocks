<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Lazy_Load;

use KadenceWP\KadenceBlocks\Optimizer\Lazy_Load\Background_Lazy_Loader;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path;
use KadenceWP\KadenceBlocks\Optimizer\Response\DeviceAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Response\WebsiteAnalysis;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Traits\Permalink_Trait;
use Tests\Support\Classes\TestCase;
use Brain\Monkey;

final class BackgroundLazyLoaderTest extends TestCase {

	use Permalink_Trait;

	private Store $store;
	private Background_Lazy_Loader $lazy_loader;
	private Path $path;

	protected function setUp(): void {
		Monkey\setUp();

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

		$this->store       = $this->container->get( Store::class );
		$this->lazy_loader = $this->container->get( Background_Lazy_Loader::class );
	}

	protected function tearDown(): void {
		$this->store->delete( $this->path );

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

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

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

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( true );

		$result = $this->lazy_loader->modify_row_layout_block_wrapper_args( $args, $attributes );

		// Should not add lazy loading attributes since the image is in the above-the-fold list.
		$this->assertEquals( $args, $result );
	}

	/**
	 * Create a test WebsiteAnalysis object.
	 *
	 * @param string[] $desktop_background_images Desktop background images.
	 * @param string[] $mobile_background_images  Mobile background images.
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
