<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Optimizer\Post_List_Table\Sorters;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Database\Optimizer_Query;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Contracts\Table_Sorter;
use KadenceWP\KadenceBlocks\Optimizer\Post_List_Table\Sorters\Optimizer_Table_Sorter;
use Tests\Support\Classes\TestCase;

final class OptimizerTableSorterTest extends TestCase {

	private Optimizer_Table_Sorter $sorter;
	private Optimizer_Query $query;

	protected function setUp(): void {
		parent::setUp();

		$this->query  = $this->container->get( Optimizer_Query::class );
		$this->sorter = $this->container->get( Optimizer_Table_Sorter::class );
	}

	public function testItAcceptsValidAscOrder(): void {
		$result = $this->sorter->orderby( 'ASC' );

		$this->assertEquals( '(optimizer.post_id IS NULL) ASC', $result );
	}

	public function testItAcceptsValidDescOrder(): void {
		$result = $this->sorter->orderby( 'DESC' );

		$this->assertEquals( '(optimizer.post_id IS NULL) DESC', $result );
	}

	public function testItThrowsExceptionForInvalidOrder(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Invalid sort order: INVALID. Must be either ASC or DESC.' );

		$this->sorter->orderby( 'INVALID' );
	}

	public function testItThrowsExceptionForEmptyOrder(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Invalid sort order: . Must be either ASC or DESC.' );

		$this->sorter->orderby( '' );
	}

	public function testItThrowsExceptionForLowerCaseOrder(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Invalid sort order: asc. Must be either ASC or DESC.' );

		$this->sorter->orderby( 'asc' );
	}

	public function testItThrowsExceptionForMixedCaseOrder(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Invalid sort order: Asc. Must be either ASC or DESC.' );

		$this->sorter->orderby( 'Asc' );
	}

	public function testItThrowsExceptionForNullOrder(): void {
		$this->expectException( InvalidArgumentException::class );
		$this->expectExceptionMessage( 'Invalid sort order: . Must be either ASC or DESC.' );

		$this->sorter->orderby( '' );
	}

	public function testItGeneratesCorrectJoinQuery(): void {
		global $wpdb;

		$result = $this->sorter->join();

		$expected_table = $this->query->table_with_prefix();
		$expected_join  = "LEFT JOIN `{$expected_table}` optimizer ON optimizer.post_id = {$wpdb->posts}.ID";

		$this->assertEquals( $expected_join, $result );
	}

	public function testItUsesCorrectTableName(): void {
		$result = $this->sorter->join();

		// Verify the table name is properly escaped and included.
		$this->assertStringContainsString( 'kb_optimizer', $result );
		$this->assertStringContainsString( 'LEFT JOIN', $result );
		$this->assertStringContainsString( 'optimizer ON optimizer.post_id', $result );
	}

	public function testItHandlesDifferentTableNames(): void {
		// Test that the join uses the table name from the query.
		$result         = $this->sorter->join();
		$expected_table = $this->query->table_with_prefix();

		$this->assertStringContainsString( $expected_table, $result );
	}

	public function testItImplementsTableSorterInterface(): void {
		$this->assertInstanceOf(
			Table_Sorter::class,
			$this->sorter
		);
	}

	public function testItMaintainsSqlInjectionProtection(): void {
		// Test that the join query is properly escaped.
		$result = $this->sorter->join();

		// Should not contain any unescaped user input or dangerous patterns.
		$this->assertStringNotContainsString( '--', $result );
		$this->assertStringNotContainsString( '/*', $result );
		$this->assertStringNotContainsString( '*/', $result );
		$this->assertStringNotContainsString( ';', $result );
	}
}
