<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table\Sorters;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters\Meta_Sort_Exists;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\TestCase;
use WP_Query;

final class MetaSortExistsTest extends TestCase {

	public function testItCreatesWithDefaultSecondaryOrderFields(): void {
		$sort_strategy = new Meta_Sort_Exists();

		$this->assertInstanceOf( Meta_Sort_Exists::class, $sort_strategy );
	}

	public function testItCreatesWithCustomSecondaryOrderFields(): void {
		$custom_fields = [ 'date', 'menu_order', 'title' ];
		$sort_strategy = new Meta_Sort_Exists( $custom_fields );

		$this->assertInstanceOf( Meta_Sort_Exists::class, $sort_strategy );
	}

	public function testItCreatesWithEmptySecondaryOrderFields(): void {
		$sort_strategy = new Meta_Sort_Exists( [] );

		$this->assertInstanceOf( Meta_Sort_Exists::class, $sort_strategy );
	}

	public function testItDoesNotSortWhenNotInAdmin(): void {
		// Mock not being in admin.
		$this->set_admin_context( false );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->never() )->method( 'is_main_query' );
		$query->expects( $this->never() )->method( 'get' );
		$query->expects( $this->never() )->method( 'set' );

		$column        = new Column( 'test_column', 'Test Column', 'test_meta_key' );
		$sort_strategy = new Meta_Sort_Exists();

		$sort_strategy->sort( $query, $column );
	}

	public function testItDoesNotSortWhenNotMainQuery(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( false );
		$query->expects( $this->never() )->method( 'get' );
		$query->expects( $this->never() )->method( 'set' );

		$column        = new Column( 'test_column', 'Test Column', 'test_meta_key' );
		$sort_strategy = new Meta_Sort_Exists();

		$sort_strategy->sort( $query, $column );
	}

	public function testItDoesNotSortWhenOrderbyDoesNotMatch(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( true );
		$query->expects( $this->once() )
				->method( 'get' )
				->with( 'orderby' )
				->willReturn( 'different_column' );
		$query->expects( $this->never() )->method( 'set' );

		$column        = new Column( 'test_column', 'Test Column', 'test_meta_key' );
		$sort_strategy = new Meta_Sort_Exists();

		$sort_strategy->sort( $query, $column );
	}

	public function testItSetsMetaQueryAndOrderbyWhenConditionsAreMet(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( true );
		$query->expects( $this->once() )
				->method( 'get' )
				->with( 'orderby' )
				->willReturn( 'test_column' );

		// Expect meta_query to be set with correct structure.
		$expected_meta_query = [
			'relation' => 'OR',
			[
				'key'     => 'test_meta_key',
				'compare' => 'NOT EXISTS',
			],
			[
				'key'     => 'test_meta_key',
				'compare' => 'EXISTS',
			],
		];

		$query->expects( $this->exactly( 2 ) )
				->method( 'set' )
				->willReturnCallback(
					function ( $key, $value ) use ( $expected_meta_query ) {
						switch ( $key ) {
							case 'meta_query':
								$this->assertEquals( $expected_meta_query, $value );
								break;
							case 'orderby':
								$this->assertEquals( 'meta_value title', $value );
								break;
							default:
								$this->fail( "Unexpected key: $key" );
						}
					}
				);

		$column        = new Column( 'test_column', 'Test Column', 'test_meta_key' );
		$sort_strategy = new Meta_Sort_Exists();

		$sort_strategy->sort( $query, $column );
	}

	public function testItSetsOrderbyWithCustomSecondaryFields(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( true );
		$query->expects( $this->once() )
				->method( 'get' )
				->with( 'orderby' )
				->willReturn( 'test_column' );

		$expected_meta_query = [
			'relation' => 'OR',
			[
				'key'     => 'test_meta_key',
				'compare' => 'NOT EXISTS',
			],
			[
				'key'     => 'test_meta_key',
				'compare' => 'EXISTS',
			],
		];

		$query->expects( $this->exactly( 2 ) )
				->method( 'set' )
				->willReturnCallback(
					function ( $key, $value ) use ( $expected_meta_query ) {
						switch ( $key ) {
							case 'meta_query':
								$this->assertEquals( $expected_meta_query, $value );
								break;
							case 'orderby':
								$this->assertEquals( 'meta_value date menu_order title', $value );
								break;
							default:
								$this->fail( "Unexpected key: $key" );
						}
					}
				);

		$column        = new Column( 'test_column', 'Test Column', 'test_meta_key' );
		$sort_strategy = new Meta_Sort_Exists( [ 'date', 'menu_order', 'title' ] );

		$sort_strategy->sort( $query, $column );
	}

	public function testItSetsOrderbyWithEmptySecondaryFields(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( true );
		$query->expects( $this->once() )
				->method( 'get' )
				->with( 'orderby' )
				->willReturn( 'test_column' );

		$expected_meta_query = [
			'relation' => 'OR',
			[
				'key'     => 'test_meta_key',
				'compare' => 'NOT EXISTS',
			],
			[
				'key'     => 'test_meta_key',
				'compare' => 'EXISTS',
			],
		];

		$query->expects( $this->exactly( 2 ) )
				->method( 'set' )
				->willReturnCallback(
					function ( $key, $value ) use ( $expected_meta_query ) {
						switch ( $key ) {
							case 'meta_query':
								$this->assertEquals( $expected_meta_query, $value );
								break;
							case 'orderby':
								$this->assertEquals( 'meta_value', $value );
								break;
							default:
								$this->fail( "Unexpected key: $key" );
						}
					}
				);

		$column        = new Column( 'test_column', 'Test Column', 'test_meta_key' );
		$sort_strategy = new Meta_Sort_Exists( [] );

		$sort_strategy->sort( $query, $column );
	}

	public function testItHandlesDifferentMetaKeys(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( true );
		$query->expects( $this->once() )
				->method( 'get' )
				->with( 'orderby' )
				->willReturn( 'optimizer_status' );

		$expected_meta_query = [
			'relation' => 'OR',
			[
				'key'     => '_kb_optimizer_analysis',
				'compare' => 'NOT EXISTS',
			],
			[
				'key'     => '_kb_optimizer_analysis',
				'compare' => 'EXISTS',
			],
		];

		$query->expects( $this->exactly( 2 ) )
				->method( 'set' )
				->willReturnCallback(
					function ( $key, $value ) use ( $expected_meta_query ) {
						switch ( $key ) {
							case 'meta_query':
								$this->assertEquals( $expected_meta_query, $value );
								break;
							case 'orderby':
								$this->assertEquals( 'meta_value title', $value );
								break;
							default:
								$this->fail( "Unexpected key: $key" );
						}
					}
				);

		$column        = new Column( 'optimizer_status', 'Optimizer Status', '_kb_optimizer_analysis' );
		$sort_strategy = new Meta_Sort_Exists();

		$sort_strategy->sort( $query, $column );
	}

	public function testItHandlesSpecialCharactersInMetaKey(): void {
		// Mock being in admin.
		$this->set_admin_context( true );

		/** @var WP_Query&MockObject $query */
		$query = $this->createMock( WP_Query::class );
		$query->expects( $this->once() )
				->method( 'is_main_query' )
				->willReturn( true );
		$query->expects( $this->once() )
				->method( 'get' )
				->with( 'orderby' )
				->willReturn( 'special_column' );

		$expected_meta_query = [
			'relation' => 'OR',
			[
				'key'     => '_special-meta.key_with$chars',
				'compare' => 'NOT EXISTS',
			],
			[
				'key'     => '_special-meta.key_with$chars',
				'compare' => 'EXISTS',
			],
		];

		$query->expects( $this->exactly( 2 ) )
				->method( 'set' )
				->willReturnCallback(
					function ( $key, $value ) use ( $expected_meta_query ) {
						switch ( $key ) {
							case 'meta_query':
								$this->assertEquals( $expected_meta_query, $value );
								break;
							case 'orderby':
								$this->assertEquals( 'meta_value title', $value );
								break;
							default:
								$this->fail( "Unexpected key: $key" );
						}
					}
				);

		$column        = new Column( 'special_column', 'Special Column', '_special-meta.key_with$chars' );
		$sort_strategy = new Meta_Sort_Exists();

		$sort_strategy->sort( $query, $column );
	}

	/**
	 * Helper method to mock admin context.
	 *
	 * Mock is_admin() function behavior by modifying global state.
	 *
	 * @param bool $is_admin
	 */
	private function set_admin_context( bool $is_admin ): void {
		if ( $is_admin ) {
			// Set up admin context.
			set_current_screen( 'edit-post' );
		} else {
			// Remove admin context.
			set_current_screen( 'front' );
		}
	}
}
