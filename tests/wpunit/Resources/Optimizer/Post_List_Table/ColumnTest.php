<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use Tests\Support\Classes\TestCase;

final class ColumnTest extends TestCase {

	public function testItCreatesColumnWithAllProperties(): void {
		$slug     = 'test_column';
		$label    = 'Test Column';
		$meta_key = 'test_meta_key';

		$column = new Column( $slug, $label, $meta_key );

		$this->assertEquals( $slug, $column->slug );
		$this->assertEquals( $label, $column->label );
		$this->assertEquals( $meta_key, $column->meta_key );
	}

	public function testItThrowsExceptionForEmptySlug(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column slug cannot be empty.' );

		new Column( '', 'Test Label', 'test_meta' );
	}

	public function testItThrowsExceptionForEmptyLabel(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column label cannot be empty.' );

		new Column( 'test_slug', '', 'test_meta' );
	}

	public function testItAllowsEmptyMetaKey(): void {
		$column = new Column( 'test_slug', 'Test Label', '' );

		$this->assertEquals( 'test_slug', $column->slug );
		$this->assertEquals( 'Test Label', $column->label );
		$this->assertEquals( '', $column->meta_key );
	}

	public function testItThrowsExceptionForWhitespaceOnlySlug(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column slug cannot be empty.' );

		new Column( '   ', 'Test Label', 'test_meta' );
	}

	public function testItThrowsExceptionForWhitespaceOnlyLabel(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column label cannot be empty.' );

		new Column( 'test_slug', '   ', 'test_meta' );
	}

	public function testItAllowsWhitespaceOnlyMetaKey(): void {
		$column = new Column( 'test_slug', 'Test Label', '   ' );

		$this->assertEquals( 'test_slug', $column->slug );
		$this->assertEquals( 'Test Label', $column->label );
		$this->assertEquals( '   ', $column->meta_key );
	}

	public function testItThrowsExceptionForMixedWhitespaceSlug(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column slug cannot be empty.' );

		// Test tabs, spaces, and newlines
		new Column( " \t\n ", 'Test Label', 'test_meta' );
	}

	public function testItThrowsExceptionForMixedWhitespaceLabel(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column label cannot be empty.' );

		// Test tabs, spaces, and newlines
		new Column( 'test_slug', " \t\n ", 'test_meta' );
	}

	public function testItHandlesSpecialCharacters(): void {
		$slug     = 'test-column_with-special.chars';
		$label    = 'Test Column with "quotes" & <tags>';
		$meta_key = '_private_meta_key';

		$column = new Column( $slug, $label, $meta_key );

		$this->assertEquals( $slug, $column->slug );
		$this->assertEquals( $label, $column->label );
		$this->assertEquals( $meta_key, $column->meta_key );
	}

	public function testItHandlesUnicodeCharacters(): void {
		$slug     = 'unicode_column';
		$label    = 'Tëst Cølümn with émojis 🎉';
		$meta_key = 'unicode_meta_key';

		$column = new Column( $slug, $label, $meta_key );

		$this->assertEquals( $slug, $column->slug );
		$this->assertEquals( $label, $column->label );
		$this->assertEquals( $meta_key, $column->meta_key );
	}

	public function testItHandlesLongStrings(): void {
		$long_slug     = str_repeat( 'a', 255 );
		$long_label    = str_repeat( 'Test Column ', 50 ); // ~550 characters
		$long_meta_key = str_repeat( 'meta_', 50 ); // ~250 characters

		$column = new Column( $long_slug, $long_label, $long_meta_key );

		$this->assertEquals( $long_slug, $column->slug );
		$this->assertEquals( $long_label, $column->label );
		$this->assertEquals( $long_meta_key, $column->meta_key );
	}

	public function testItMaintainsDataIntegrity(): void {
		$original_data = [
			'slug'     => 'optimizer_status',
			'label'    => __( 'Optimization Status', 'kadence-blocks' ),
			'meta_key' => '_kb_optimizer_analysis',
		];

		$column = new Column(
			$original_data['slug'],
			$original_data['label'],
			$original_data['meta_key']
		);

		// Verify data integrity - no modification should occur
		$this->assertEquals( $original_data['slug'], $column->slug );
		$this->assertEquals( $original_data['label'], $column->label );
		$this->assertEquals( $original_data['meta_key'], $column->meta_key );
	}
} 
