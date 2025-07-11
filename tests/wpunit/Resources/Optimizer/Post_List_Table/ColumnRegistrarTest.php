<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table;

use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Column_Registrar;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Renderable;
use PHPUnit\Framework\MockObject\MockObject;
use Tests\Support\Classes\TestCase;

final class ColumnRegistrarTest extends TestCase {

	private Column $column;

	/** @var Renderable&MockObject */
	private $renderable;

	private Column_Registrar $registrar;

	protected function setUp(): void {
		parent::setUp();

		$this->column     = new Column( 'optimizer_status', 'Optimizer Status' );
		$this->renderable = $this->createMock( Renderable::class );

		$this->registrar = new Column_Registrar(
			$this->column,
			$this->renderable
		);
	}

	public function testItCreatesWithDependencyInjection(): void {
		$column = new Column( 'test_column', 'Test Column' );

		$registrar = new Column_Registrar(
			$column,
			$this->renderable
		);

		$this->assertInstanceOf( Column_Registrar::class, $registrar );
	}

	public function testItAddsColumnHeaderToExistingColumns(): void {
		$existing_columns = [
			'title'  => 'Title',
			'author' => 'Author',
			'date'   => 'Date',
		];

		$result = $this->registrar->add_header( $existing_columns );

		$expected_columns = [
			'title'            => 'Title',
			'author'           => 'Author',
			'date'             => 'Date',
			'optimizer_status' => 'Optimizer Status',
		];

		$this->assertEquals( $expected_columns, $result );
	}

	public function testItAddsColumnHeaderToEmptyColumns(): void {
		$existing_columns = [];

		$result = $this->registrar->add_header( $existing_columns );

		$expected_columns = [
			'optimizer_status' => 'Optimizer Status',
		];

		$this->assertEquals( $expected_columns, $result );
	}

	public function testItOverridesExistingColumnWithSameSlug(): void {
		$existing_columns = [
			'title'            => 'Title',
			'optimizer_status' => 'Old Label',
		];

		$result = $this->registrar->add_header( $existing_columns );

		$expected_columns = [
			'title'            => 'Title',
			'optimizer_status' => 'Optimizer Status',
		];

		$this->assertEquals( $expected_columns, $result );
	}

	public function testItMarksColumnAsSortableWithIsSortable(): void {
		$registrar = new Column_Registrar(
			$this->column,
			$this->renderable,
			true
		);

		$existing_columns = [
			'title' => 'title',
			'date'  => 'date',
		];

		$result = $registrar->mark_sortable( $existing_columns );

		$expected_columns = [
			'title'            => 'title',
			'date'             => 'date',
			'optimizer_status' => [
				'optimizer_status',
				true,
				'Optimizer Status',
				'Table ordered by Optimizer Status',
				'asc',
			],
		];

		$this->assertEquals( $expected_columns, $result );
	}

	public function testItMarksColumnAsSortableWithEmptyColumns(): void {
		$registrar = new Column_Registrar(
			$this->column,
			$this->renderable,
			true
		);

		$existing_columns = [];

		$result = $registrar->mark_sortable( $existing_columns );

		$expected_columns = [
			'optimizer_status' => [
				'optimizer_status',
				true,
				'Optimizer Status',
				'Table ordered by Optimizer Status',
				'asc',
			],
		];

		$this->assertEquals( $expected_columns, $result );
	}

	public function testItHandlesSpecialCharactersInColumnLabel(): void {
		$column    = new Column( 'special_column', 'Column with "quotes" & <tags>' );
		$registrar = new Column_Registrar( $column, $this->renderable, true );

		$existing_columns = [];
		$result           = $registrar->mark_sortable( $existing_columns );

		$this->assertStringContainsString( 'Table ordered by Column with "quotes" & <tags>', $result['special_column'][3] );
	}

	public function testItRendersColumnWhenSlugMatches(): void {
		$post_id = 123;
		$slug    = 'optimizer_status';

		$this->renderable->expects( $this->once() )
			->method( 'render' )
			->with( $post_id );

		$this->registrar->render( $slug, $post_id );
	}

	public function testItDoesNotRenderColumnWhenSlugDoesNotMatch(): void {
		$post_id = 123;
		$slug    = 'different_column';

		$this->renderable->expects( $this->never() )
			->method( 'render' );

		$this->registrar->render( $slug, $post_id );
	}

	public function testItHandlesCaseSensitiveSlugMatching(): void {
		$post_id = 123;
		$slug    = 'Optimizer_Status'; // Different case

		$this->renderable->expects( $this->never() )
			->method( 'render' );

		$this->registrar->render( $slug, $post_id );
	}

	public function testItHandlesEmptySlugInRender(): void {
		$post_id = 123;
		$slug    = '';

		$this->renderable->expects( $this->never() )
			->method( 'render' );

		$this->registrar->render( $slug, $post_id );
	}

	public function testItHandlesZeroPostIdInRender(): void {
		$post_id = 0;
		$slug    = 'optimizer_status';

		$this->renderable->expects( $this->once() )
			->method( 'render' )
			->with( $post_id );

		$this->registrar->render( $slug, $post_id );
	}

	public function testItHandlesNegativePostIdInRender(): void {
		$post_id = -1;
		$slug    = 'optimizer_status';

		$this->renderable->expects( $this->once() )
			->method( 'render' )
			->with( $post_id );

		$this->registrar->render( $slug, $post_id );
	}

	public function testItPreservesOriginalColumnsOrder(): void {
		$existing_columns = [
			'cb'     => '<input type="checkbox" />',
			'title'  => 'Title',
			'author' => 'Author',
			'date'   => 'Date',
		];

		$result = $this->registrar->add_header( $existing_columns );

		// New column should be added at the end.
		$expected_keys = [ 'cb', 'title', 'author', 'date', 'optimizer_status' ];
		$this->assertEquals( $expected_keys, array_keys( $result ) );
	}

	public function testItHandlesUnicodeInColumnLabel(): void {
		$column    = new Column( 'unicode_column', 'Optimización 🚀' );
		$registrar = new Column_Registrar( $column, $this->renderable );

		$existing_columns = [];
		$result           = $registrar->add_header( $existing_columns );

		$this->assertEquals( 'Optimización 🚀', $result['unicode_column'] );
	}

	public function testItCreatesCorrectSortableColumnStructure(): void {
		$registrar = new Column_Registrar(
			$this->column,
			$this->renderable,
			true
		);

		$existing_columns = [];

		$result = $registrar->mark_sortable( $existing_columns );

		$sortable_column = $result['optimizer_status'];

		// Verify the structure matches WordPress expectations.
		$this->assertIsArray( $sortable_column );
		$this->assertCount( 5, $sortable_column );
		$this->assertEquals( 'optimizer_status', $sortable_column[0] ); // orderby key
		$this->assertTrue( $sortable_column[1] ); // is_descending_first
		$this->assertEquals( 'Optimizer Status', $sortable_column[2] ); // label
		$this->assertStringContainsString( 'Table ordered by', $sortable_column[3] ); // description
		$this->assertEquals( 'asc', $sortable_column[4] ); // default_order
	}
}
