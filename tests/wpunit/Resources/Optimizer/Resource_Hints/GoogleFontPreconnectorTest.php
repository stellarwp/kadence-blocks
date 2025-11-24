<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Resource_Hints;

use KadenceWP\KadenceBlocks\Optimizer\Analysis_Registry;
use KadenceWP\KadenceBlocks\Optimizer\Optimizer_Provider;
use KadenceWP\KadenceBlocks\Optimizer\Resource_Hints\Google_Font_Preconnector;
use Tests\Support\Classes\OptimizerTestCase;
use Brain\Monkey;
use PHPUnit\Framework\MockObject\MockObject;

final class GoogleFontPreconnectorTest extends OptimizerTestCase {

	private Google_Font_Preconnector $preconnector;

	/** @var Analysis_Registry&MockObject */
	private $registry;

	protected function setUp(): void {
		Monkey\setUp();

		Monkey\Functions\when( '\\KadenceWP\\KadenceBlocks\\Traits\\wp_is_mobile' )->justReturn( false );

		parent::setUp();

		$this->registry     = $this->createMock( Analysis_Registry::class );
		$this->preconnector = new Google_Font_Preconnector( $this->registry );
	}

	public function testItReturnsOriginalUrlsWhenNotOptimized(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( false );

		$original_urls = [ 'https://example.com' ];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$this->assertEquals( $original_urls, $result );
	}

	public function testItReturnsOriginalUrlsWhenRelationTypeIsNotPreconnect(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [ 'https://example.com' ];
		$relation_type = 'dns-prefetch';

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$this->assertEquals( $original_urls, $result );
	}

	public function testItAddsGoogleFontsUrlsWhenOptimizedAndPreconnect(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [ 'https://example.com' ];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$expected_urls = [
			'https://example.com',
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );
	}

	public function testItAddsGoogleFontsUrlsToEmptyArray(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$expected_urls = [
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );
	}

	public function testItPreservesExistingUrlsWhenAddingGoogleFonts(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [
			'https://example.com',
			[
				'href' => 'https://cdn.example.com',
				true   => 'crossorigin',
			],
		];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$expected_urls = [
			'https://example.com',
			[
				'href' => 'https://cdn.example.com',
				true   => 'crossorigin',
			],
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );
	}

	public function testItHandlesDifferentRelationTypes(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls  = [ 'https://example.com' ];
		$relation_types = [ 'dns-prefetch', 'prefetch', 'prerender' ];

		foreach ( $relation_types as $relation_type ) {
			$result = $this->preconnector->preconnect( $original_urls, $relation_type );
			$this->assertEquals( $original_urls, $result );
		}
	}

	public function testItHandlesCaseSensitiveRelationType(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [ 'https://example.com' ];
		$relation_type = 'PRECONNECT'; // Uppercase

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		// Should not add Google Fonts URLs because relation type doesn't match exactly.
		$this->assertEquals( $original_urls, $result );
	}

	public function testItHandlesMixedUrlTypes(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [
			'https://example.com',
			'https://cdn.example.com',
			[
				'href' => 'https://api.example.com',
				true   => 'crossorigin',
			],
		];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$expected_urls = [
			'https://example.com',
			'https://cdn.example.com',
			[
				'href' => 'https://api.example.com',
				true   => 'crossorigin',
			],
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );
	}

	public function testItHandlesEmptyRelationType(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [ 'https://example.com' ];
		$relation_type = '';

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		// Should not add Google Fonts URLs because relation type is empty.
		$this->assertEquals( $original_urls, $result );
	}

	public function testItHandlesNullRelationType(): void {
		$this->registry->method( 'is_optimized' )
						->willReturn( true );

		$original_urls = [ 'https://example.com' ];
		$relation_type = null;

		$result = $this->preconnector->preconnect( $original_urls, (string) $relation_type );

		// Should not add Google Fonts URLs because relation type is null.
		$this->assertEquals( $original_urls, $result );
	}

	public function testItHandlesRegistryReturningFalseThenTrue(): void {
		$this->registry->method( 'is_optimized' )
						->willReturnOnConsecutiveCalls( false, true );

		$original_urls = [ 'https://example.com' ];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		// First call - not optimized.
		$result1 = $this->preconnector->preconnect( $original_urls, $relation_type );
		$this->assertEquals( $original_urls, $result1 );

		// Second call - optimized.
		$result2       = $this->preconnector->preconnect( $original_urls, $relation_type );
		$expected_urls = [
			'https://example.com',
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];
		$this->assertEquals( $expected_urls, $result2 );
	}

	public function testPreconnectConstantValue(): void {
		$this->assertEquals( 'preconnect', Google_Font_Preconnector::PRECONNECT );
	}

	public function testItIsRegisteredWithWpResourceHintsFilter(): void {
		// Get the container from the test case.
		$container = $this->container;

		// Register the Google Font Preconnector in the container.
		$container->singleton( Google_Font_Preconnector::class, Google_Font_Preconnector::class );

		// Get the preconnector instance.
		$preconnector = $container->get( Google_Font_Preconnector::class );

		// Verify it's an instance of the correct class.
		$this->assertInstanceOf( Google_Font_Preconnector::class, $preconnector );

		// Test that the preconnect method works when called directly.
		$original_urls = [ 'https://example.com' ];
		$relation_type = Google_Font_Preconnector::PRECONNECT;

		// Use the existing mock registry from setUp.
		$this->registry->method( 'is_optimized' )->willReturn( true );

		$result = $this->preconnector->preconnect( $original_urls, $relation_type );

		$expected_urls = [
			'https://example.com',
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );
	}

	public function testItFiltersWpResourceHintsWhenEnabled(): void {
		// Enable the resource hints feature.
		add_filter( 'kadence_blocks_enable_resource_hits', '__return_true' );

		// Set up the container to use our mocked registry.
		$this->container->when( Google_Font_Preconnector::class )
						->needs( Analysis_Registry::class )
						->give( fn() => $this->registry );

		// Mock the registry to return true for is_optimized.
		$this->registry->method( 'is_optimized' )->willReturn( true );

		// Register the Optimizer Provider to set up the filters.
		$this->container->register( Optimizer_Provider::class );

		// Test the wp_resource_hints filter directly.
		$original_urls = [ 'https://example.com' ];
		$relation_type = 'preconnect';

		$result = apply_filters( 'wp_resource_hints', $original_urls, $relation_type );

		// Verify that Google Fonts URLs were added.
		$expected_urls = [
			'https://example.com',
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );

		// Clean up.
		remove_filter( 'kadence_blocks_enable_resource_hits', '__return_true' );
	}

	public function testItGetsFilteredValueWhenResourceHintsEnabled(): void {
		// Enable the resource hints feature.
		add_filter( 'kadence_blocks_enable_resource_hits', '__return_true' );

		// Set up the container to use our mocked registry.
		$this->container->when( Google_Font_Preconnector::class )
						->needs( Analysis_Registry::class )
						->give( fn() => $this->registry );

		// Mock the registry to return true for is_optimized.
		$this->registry->method( 'is_optimized' )->willReturn( true );

		// Register the Optimizer Provider to set up the filters.
		$this->container->register( Optimizer_Provider::class );

		// Test the wp_resource_hints filter directly.
		$original_urls = [ 'https://example.com' ];
		$relation_type = 'preconnect';

		$result = apply_filters( 'wp_resource_hints', $original_urls, $relation_type );

		// Verify that Google Fonts URLs were added (filtered value).
		$expected_urls = [
			'https://example.com',
			'https://fonts.googleapis.com',
			[
				'href' => 'https://fonts.gstatic.com',
				true   => 'crossorigin',
			],
		];

		$this->assertEquals( $expected_urls, $result );

		// Clean up.
		remove_filter( 'kadence_blocks_enable_resource_hits', '__return_true' );
	}

	public function testItDoesNotFilterWpResourceHintsWhenDisabled(): void {
		// Remove any filters registered by other classes above.
		remove_all_filters( 'wp_resource_hints' );

		// Disable the resource hints feature.
		add_filter( 'kadence_blocks_enable_resource_hits', '__return_false' );

		// Set up the container to use our mocked registry.
		$this->container->when( Google_Font_Preconnector::class )
						->needs( Analysis_Registry::class )
						->give( fn() => $this->registry );

		// Mock the registry to return true for is_optimized.
		$this->registry->method( 'is_optimized' )->willReturn( true );

		// Register the Optimizer Provider to set up the filters.
		$this->container->register( Optimizer_Provider::class );

		// Test the wp_resource_hints filter directly.
		$original_urls = [ 'https://example.com' ];
		$relation_type = 'preconnect';

		$result = apply_filters( 'wp_resource_hints', $original_urls, $relation_type );

		// Verify that no Google Fonts URLs were added (filter should be disabled).
		$this->assertEquals( $original_urls, $result );

		// Clean up.
		remove_filter( 'kadence_blocks_enable_resource_hits', '__return_false' );
	}
}
