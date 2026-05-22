<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Table_Data_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TableDataTest extends KadenceBlocksUnit {

	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'table-data';

	/**
	 * The block under test.
	 *
	 * @var Kadence_Blocks_Table_Data_Block
	 */
	protected $block;

	/**
	 * Set up the block instance for testing.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Table_Data_Block();
	}

	/**
	 * Build a WP_Block instance for kadence/table-data with the given context.
	 *
	 * @param array $attributes Block attributes.
	 * @param array $context    Available block context values.
	 * @return \WP_Block
	 */
	private function make_block_instance( array $attributes, array $context ): \WP_Block {
		return new \WP_Block(
			[
				'blockName'    => 'kadence/table-data',
				'attrs'        => $attributes,
				'innerBlocks'  => [],
				'innerHTML'    => '',
				'innerContent' => [],
			],
			$context
		);
	}

	/**
	 * Returns context that makes the cell a column header (column 0 in a table with isFirstColumnHeader).
	 *
	 * @return array
	 */
	private function header_via_first_column(): array {
		return [ 'kadence/table/isFirstColumnHeader' => true ];
	}

	/**
	 * Returns context that makes the cell a row header (row 0 in a table with isFirstRowHeader).
	 *
	 * @return array
	 */
	private function header_via_first_row(): array {
		return [
			'kadence/table/isFirstRowHeader' => true,
			'kadence/table/parentRow'        => 0,
		];
	}

	/**
	 * Returns context that produces a plain <td> with no header flags set.
	 *
	 * @return array
	 */
	private function non_header_context(): array {
		return [];
	}

	/**
	 * Tests that scope="row" is emitted on a <th> for a first-column header cell at column 0.
	 * First-column headers identify rows, so the correct scope is "row".
	 *
	 * @return void
	 */
	public function testScopeRowEmittedOnThViaFirstColumnHeader() {
		$attributes     = [ 'column' => 0 ];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringContainsString( 'scope="row"', $html );
	}

	/**
	 * Tests that scope="col" is emitted on a <th> for a first-row header cell at row 0.
	 * First-row headers identify columns, so the correct scope is "col".
	 * Uses column=1 to confirm the row-header path, not the column-header path, drives <th>.
	 *
	 * @return void
	 */
	public function testScopeColEmittedOnThViaFirstRowHeader() {
		$attributes     = [ 'column' => 1 ];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_row() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringContainsString( 'scope="col"', $html );
	}

	/**
	 * Tests that isFirstColumnHeader context alone does not make a header cell when column !== 0.
	 * Covers the case where the first-column-header setting is enabled on the table but this
	 * cell is not in column 0, so it must still render as <td>.
	 *
	 * @return void
	 */
	public function testFirstColumnHeaderFlagWithNonZeroColumnIsNotAHeader() {
		$attributes     = [ 'column' => 1 ];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that column position alone does not make a header cell when isFirstColumnHeader
	 * context is not set. Verifies that both conditions must be true.
	 *
	 * @return void
	 */
	public function testColumnZeroWithoutContextFlagIsNotAHeader() {
		$attributes     = [ 'column' => 0 ];
		$block_instance = $this->make_block_instance( $attributes, $this->non_header_context() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that isFirstRowHeader context alone does not make a header cell when parentRow !== 0.
	 * Verifies that only row 0 qualifies as the header row.
	 *
	 * @return void
	 */
	public function testFirstRowHeaderFlagWithNonZeroRowIsNotAHeader() {
		$attributes     = [ 'column' => 0 ];
		$context        = [
			'kadence/table/isFirstRowHeader' => true,
			'kadence/table/parentRow'        => 1,
		];
		$block_instance = $this->make_block_instance( $attributes, $context );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that row 0 alone does not make a header cell when isFirstRowHeader context is not set.
	 * Verifies that both conditions must be true.
	 *
	 * @return void
	 */
	public function testRowZeroWithoutContextFlagIsNotAHeader() {
		$attributes     = [ 'column' => 1 ];
		$context        = [ 'kadence/table/parentRow' => 0 ];
		$block_instance = $this->make_block_instance( $attributes, $context );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that when both header flags are set and the cell is at column 0 of row 0,
	 * the first-row-header path takes precedence and emits scope="col".
	 *
	 * @return void
	 */
	public function testFirstRowHeaderTakesPrecedenceOverFirstColumnHeaderAtCellZeroZero() {
		$attributes = [ 'column' => 0 ];
		$context    = [
			'kadence/table/isFirstRowHeader'    => true,
			'kadence/table/isFirstColumnHeader' => true,
			'kadence/table/parentRow'           => 0,
		];
		$block_instance = $this->make_block_instance( $attributes, $context );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringContainsString( 'scope="col"', $html );
	}

	/**
	 * Tests that non-header cells always render as <td> with no scope attribute.
	 *
	 * @return void
	 */
	public function testNoScopeAttributeOnTdCell() {
		$attributes     = [ 'column' => 1 ];
		$block_instance = $this->make_block_instance( $attributes, $this->non_header_context() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that inner content is passed through to the rendered output on a <td> cell.
	 *
	 * @return void
	 */
	public function testTdTagUsedForNonHeaderCell() {
		$attributes     = [ 'column' => 1 ];
		$block_instance = $this->make_block_instance( $attributes, $this->non_header_context() );

		$html = $this->block->build_html( $attributes, 'abc', 'Cell content', $block_instance );

		$this->assertStringContainsString( '<td ', $html );
		$this->assertStringContainsString( '</td>', $html );
		$this->assertStringContainsString( 'Cell content', $html );
	}
}
