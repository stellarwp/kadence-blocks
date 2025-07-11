<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use Tests\Support\Classes\TestCase;

final class ColumnTest extends TestCase {

	public function testItCreatesColumnWithAllProperties(): void {
		$slug  = 'test_column';
		$label = 'Test Column';

		$column = new Column( $slug, $label );

		$this->assertEquals( $slug, $column->slug );
		$this->assertEquals( $label, $column->label );
	}

	public function testItThrowsExceptionForEmptySlug(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column slug cannot be empty.' );

		new Column( '', 'Test Label' );
	}

	public function testItThrowsExceptionForEmptyLabel(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column label cannot be empty.' );

		new Column( 'test_slug', '' );
	}

	public function testItThrowsExceptionForWhitespaceOnlySlug(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column slug cannot be empty.' );

		new Column( '   ', 'Test Label' );
	}

	public function testItThrowsExceptionForWhitespaceOnlyLabel(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column label cannot be empty.' );

		new Column( 'test_slug', '   ' );
	}

	public function testItThrowsExceptionForMixedWhitespaceSlug(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column slug cannot be empty.' );

		// Test tabs, spaces, and newlines
		new Column( " \t\n ", 'Test Label' );
	}

	public function testItThrowsExceptionForMixedWhitespaceLabel(): void {
		$this->expectException( \InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Column label cannot be empty.' );

		// Test tabs, spaces, and newlines
		new Column( 'test_slug', " \t\n " );
	}

	public function testItHandlesSpecialCharacters(): void {
		$slug  = 'test-column_with-special.chars';
		$label = 'Test Column with "quotes" & <tags>';

		$column = new Column( $slug, $label );

		$this->assertEquals( $slug, $column->slug );
		$this->assertEquals( $label, $column->label );
	}

	public function testItHandlesUnicodeCharacters(): void {
		$slug  = 'unicode_column';
		$label = 'Tëst Cølümn with émojis 🎉';

		$column = new Column( $slug, $label );

		$this->assertEquals( $slug, $column->slug );
		$this->assertEquals( $label, $column->label );
	}

	public function testItHandlesLongStrings(): void {
		$long_slug  = str_repeat( 'a', 255 );
		$long_label = str_repeat( 'Test Column ', 50 ); // ~550 characters

		$column = new Column( $long_slug, $long_label );

		$this->assertEquals( $long_slug, $column->slug );
		$this->assertEquals( $long_label, $column->label );
	}

	public function testItMaintainsDataIntegrity(): void {
		$original_data = [
			'slug'  => 'optimizer_status',
			'label' => __( 'Optimization Status', 'kadence-blocks' ),
		];

		$column = new Column(
			$original_data['slug'],
			$original_data['label']
		);

		// Verify data integrity - no modification should occur
		$this->assertEquals( $original_data['slug'], $column->slug );
		$this->assertEquals( $original_data['label'], $column->label );
	}
}
