<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers the tokenOrder per-group sort-order map read/write operations of Token_Order_Index.
 *
 * @since TBD
 */
final class Token_Order_IndexTest extends TestCase {

	/**
	 * The index under test.
	 *
	 * @since TBD
	 *
	 * @var Token_Order_Index
	 */
	private Token_Order_Index $index;

	/**
	 * Build a fresh index before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->index = new Token_Order_Index();
	}

	// -------------------------------------------------------------------------
	// all()
	// -------------------------------------------------------------------------

	/**
	 * An empty document has no stored group orders.
	 *
	 * @return void
	 */
	public function testAllReturnsEmptyArrayForEmptyDocument(): void {
		$this->assertSame( [], $this->index->all( [] ) );
	}

	/**
	 * A document missing the $extensions key has no stored group orders.
	 *
	 * @return void
	 */
	public function testAllReturnsEmptyArrayWhenExtensionsKeyMissing(): void {
		$doc = [ 'primitive' => [ 'color' => [] ] ];

		$this->assertSame( [], $this->index->all( $doc ) );
	}

	/**
	 * A well-formed tokenOrder section round-trips through all() unchanged.
	 *
	 * @return void
	 */
	public function testAllReturnsStoredEntries(): void {
		$doc = $this->doc_with_entry( 'Brand', [ 'semantic.color.button-bg', 'semantic.color.button-text' ] );

		$this->assertSame(
			[ 'Brand' => [ 'semantic.color.button-bg', 'semantic.color.button-text' ] ],
			$this->index->all( $doc )
		);
	}

	/**
	 * A malformed group entry — a non-list ("map-shaped") value, a non-string group key, or
	 * non-string ids inside the list — is dropped (or filtered) on read rather than surfaced, so a
	 * hand-corrupted section degrades to declaration order instead of a type error downstream.
	 *
	 * @dataProvider malformedSectionProvider
	 *
	 * @param array<int|string, mixed> $section  The raw decoded tokenOrder section.
	 * @param array<string, list<string>> $expected The expected result of all() against that section.
	 *
	 * @return void
	 */
	public function testAllDropsOrFiltersMalformedEntries( array $section, array $expected ): void {
		$doc = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_token_order() => $section,
				],
			],
		];

		$this->assertSame( $expected, $this->index->all( $doc ) );
	}

	/**
	 * Malformed tokenOrder section shapes and what all() must degrade each to.
	 *
	 * @return Generator
	 */
	public function malformedSectionProvider(): Generator {
		yield 'integer-keyed group' => [
			'section'  => [ 0 => [ 'semantic.color.button-bg' ] ],
			'expected' => [],
		];

		yield 'map-shaped (non-sequential) group value' => [
			'section'  => [ 'Brand' => [ 'a' => 'semantic.color.button-bg' ] ],
			'expected' => [],
		];

		yield 'non-string id inside an otherwise valid list' => [
			'section'  => [ 'Brand' => [ 'semantic.color.button-bg', 42, 'semantic.color.button-text' ] ],
			'expected' => [ 'Brand' => [ 'semantic.color.button-bg', 'semantic.color.button-text' ] ],
		];

		yield 'non-array group value' => [
			'section'  => [ 'Brand' => 'not-a-list' ],
			'expected' => [],
		];
	}

	// -------------------------------------------------------------------------
	// for_group()
	// -------------------------------------------------------------------------

	/**
	 * for_group() returns [] for a group with no stored order.
	 *
	 * @return void
	 */
	public function testForGroupReturnsEmptyArrayWhenAbsent(): void {
		$this->assertSame( [], $this->index->for_group( [], 'Brand' ) );
	}

	/**
	 * for_group() returns [] for a document with no tokenOrder section.
	 *
	 * @return void
	 */
	public function testForGroupReturnsEmptyArrayForDocumentWithNoSection(): void {
		$doc = [ 'primitive' => [ 'color' => [] ] ];

		$this->assertSame( [], $this->index->for_group( $doc, 'Brand' ) );
	}

	/**
	 * for_group() returns the stored order for the requested group.
	 *
	 * @return void
	 */
	public function testForGroupReturnsStoredOrder(): void {
		$doc = $this->doc_with_entry( 'Brand', [ 'semantic.color.button-bg' ] );

		$this->assertSame( [ 'semantic.color.button-bg' ], $this->index->for_group( $doc, 'Brand' ) );
	}

	// -------------------------------------------------------------------------
	// set_group()
	// -------------------------------------------------------------------------

	/**
	 * set_group() creates the $extensions/{namespace}/tokenOrder path when none of it yet exists.
	 *
	 * @return void
	 */
	public function testSetGroupCreatesFullPathWhenMissing(): void {
		$result = $this->index->set_group( [], 'Brand', [ 'semantic.color.button-bg' ] );

		$this->assertSame( [ 'semantic.color.button-bg' ], $this->index->for_group( $result, 'Brand' ) );
	}

	/**
	 * set_group() replaces a previously stored order for the same group wholesale.
	 *
	 * @return void
	 */
	public function testSetGroupReplacesExistingOrderWholesale(): void {
		$doc = $this->doc_with_entry( 'Brand', [ 'semantic.color.button-bg', 'semantic.color.button-text' ] );

		$result = $this->index->set_group( $doc, 'Brand', [ 'semantic.color.button-text' ] );

		$this->assertSame( [ 'semantic.color.button-text' ], $this->index->for_group( $result, 'Brand' ) );
	}

	/**
	 * set_group() deduplicates submitted ids, keeping the first occurrence.
	 *
	 * @return void
	 */
	public function testSetGroupDeduplicatesKeepingFirstOccurrence(): void {
		$result = $this->index->set_group(
			[],
			'Brand',
			[ 'semantic.color.button-bg', 'semantic.color.button-text', 'semantic.color.button-bg' ]
		);

		$this->assertSame(
			[ 'semantic.color.button-bg', 'semantic.color.button-text' ],
			$this->index->for_group( $result, 'Brand' )
		);
	}

	/**
	 * set_group() leaves a sibling group's stored order untouched.
	 *
	 * @return void
	 */
	public function testSetGroupPreservesSiblingGroups(): void {
		$doc = $this->doc_with_entry( 'Brand', [ 'semantic.color.button-bg' ] );

		$result = $this->index->set_group( $doc, 'Spacing', [ 'spacing.sm' ] );

		$this->assertSame( [ 'semantic.color.button-bg' ], $this->index->for_group( $result, 'Brand' ) );
		$this->assertSame( [ 'spacing.sm' ], $this->index->for_group( $result, 'Spacing' ) );
	}

	/**
	 * set_group() does not modify the document passed in — every mutator returns a new document.
	 *
	 * @return void
	 */
	public function testSetGroupDoesNotModifyItsInput(): void {
		$doc = [];

		$this->index->set_group( $doc, 'Brand', [ 'semantic.color.button-bg' ] );

		$this->assertSame( [], $doc );
	}

	// -------------------------------------------------------------------------
	// remove_group()
	// -------------------------------------------------------------------------

	/**
	 * remove_group() is a no-op (the same document is returned) when nothing is stored for the
	 * group.
	 *
	 * @return void
	 */
	public function testRemoveGroupIsNoOpWhenAbsent(): void {
		$result = $this->index->remove_group( [], 'Brand' );

		$this->assertSame( [], $result );
	}

	/**
	 * remove_group() deletes only the targeted group, leaving sibling groups intact.
	 *
	 * @return void
	 */
	public function testRemoveGroupDeletesTargetGroupOnly(): void {
		$doc = $this->doc_with_entry( 'Brand', [ 'semantic.color.button-bg' ] );
		$doc = $this->index->set_group( $doc, 'Spacing', [ 'spacing.sm' ] );

		$result = $this->index->remove_group( $doc, 'Brand' );

		$this->assertSame( [], $this->index->for_group( $result, 'Brand' ) );
		$this->assertSame( [ 'spacing.sm' ], $this->index->for_group( $result, 'Spacing' ) );
	}

	/**
	 * remove_group() leaves the rest of the document, outside the tokenOrder section, unchanged.
	 *
	 * @return void
	 */
	public function testRemoveGroupLeavesTheRestOfTheDocumentUnchanged(): void {
		$doc = $this->doc_with_entry( 'Brand', [ 'semantic.color.button-bg' ] );

		$doc['primitive'] = [
			'color' => [
				'brand' => [
					'$type'  => 'color',
					'$value' => '#3182CE',
				],
			],
		];

		$result = $this->index->remove_group( $doc, 'Brand' );

		$this->assertSame( $doc['primitive'], $result['primitive'] );
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * Build a decoded document carrying a single tokenOrder group entry.
	 *
	 * @param string       $group The group name.
	 * @param array<string> $ids   The stored ordered id list.
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_entry( string $group, array $ids ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_token_order() => [
						$group => $ids,
					],
				],
			],
		];
	}
}
