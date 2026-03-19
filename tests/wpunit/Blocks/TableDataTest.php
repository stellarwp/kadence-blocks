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
	 * Returns context that makes the cell render as <th> via isFirstColumnHeader (column 0).
	 *
	 * @return array
	 */
	private function header_via_first_column(): array {
		return [ 'kadence/table/isFirstColumnHeader' => true ];
	}

	/**
	 * Returns context that makes the cell render as <th> via isFirstRowHeader (row 0).
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
	 * Tests that scope="col" is emitted on a <th> header cell driven by the first-column-header path.
	 *
	 * @return void
	 */
	public function testScopeColEmittedOnThViaFirstColumn() {
		$attributes     = [
			'column' => 0,
			'scope'  => 'col',
		];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringContainsString( 'scope="col"', $html );
	}

	/**
	 * Tests that scope="row" is emitted on a <th> header cell driven by the first-row-header path.
	 * Uses column=1 to confirm it is the row-header path, not the column-header path, driving <th>.
	 *
	 * @return void
	 */
	public function testScopeRowEmittedOnThViaFirstRow() {
		$attributes     = [
			'column' => 1,
			'scope'  => 'row',
		];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_row() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringContainsString( 'scope="row"', $html );
	}

	/**
	 * Tests that no scope attribute is emitted when scope is an empty string, even on a <th> cell.
	 *
	 * @return void
	 */
	public function testNoScopeAttributeWhenScopeIsEmptyOnTh() {
		$attributes     = [
			'column' => 0,
			'scope'  => '',
		];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that no scope attribute is emitted when the scope key is absent from attributes.
	 *
	 * @return void
	 */
	public function testNoScopeAttributeWhenScopeNotSetOnTh() {
		$attributes     = [ 'column' => 0 ];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<th', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that isFirstColumnHeader context alone does not make a header cell when column !== 0.
	 * Covers the case where the first-column-header setting is enabled on the table but this
	 * cell is not in column 0, so it must still render as <td>.
	 *
	 * @return void
	 */
	public function testFirstColumnHeaderFlagWithNonZeroColumnIsNotAHeader() {
		$attributes     = [
			'column' => 1,
			'scope'  => 'col',
		];
		$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that column position alone does not make a header cell when isFirstColumnHeader
	 * context is not set. Verifies the && in is_this_block_header is not accidentally an ||.
	 *
	 * @return void
	 */
	public function testColumnZeroWithoutContextFlagIsNotAHeader() {
		$attributes     = [
			'column' => 0,
			'scope'  => 'col',
		];
		$block_instance = $this->make_block_instance( $attributes, $this->non_header_context() );

		$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

		$this->assertStringContainsString( '<td', $html );
		$this->assertStringNotContainsString( 'scope=', $html );
	}

	/**
	 * Tests that scope is suppressed on <td> cells regardless of the scope attribute value.
	 *
	 * @return void
	 */
	public function testNoScopeAttributeOnTdRegardlessOfScopeValue() {
		foreach ( [ 'col', 'row' ] as $scope ) {
			$attributes     = [
				'column' => 1,
				'scope'  => $scope,
			];
			$block_instance = $this->make_block_instance( $attributes, $this->non_header_context() );

			$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

			$this->assertStringContainsString( '<td', $html, "Expected <td> for scope='{$scope}' on non-header cell." );
			$this->assertStringNotContainsString( 'scope=', $html, "scope attribute must be suppressed on <td> for scope='{$scope}'." );
		}
	}

	/**
	 * Tests that unsupported scope values are rejected and not emitted even on a <th> cell.
	 * Includes injection attempts to confirm the server-side allowlist is enforced.
	 *
	 * @return void
	 */
	public function testUnsupportedScopeValueNotEmittedOnTh() {
		foreach ( [ 'colgroup', 'rowgroup', 'invalid', '<script>', '1' ] as $bad_scope ) {
			$attributes     = [
				'column' => 0,
				'scope'  => $bad_scope,
			];
			$block_instance = $this->make_block_instance( $attributes, $this->header_via_first_column() );

			$html = $this->block->build_html( $attributes, 'abc', '', $block_instance );

			$this->assertStringContainsString( '<th', $html, "Expected <th> for scope value '{$bad_scope}'." );
			$this->assertStringNotContainsString( 'scope=', $html, "scope attribute must not be emitted for unsupported value '{$bad_scope}'." );
		}
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
