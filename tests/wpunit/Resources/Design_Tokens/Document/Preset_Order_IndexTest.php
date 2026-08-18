<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Preset_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers the presetOrder per-block ordered-slug-list read/write operations of Preset_Order_Index.
 *
 * @since TBD
 */
final class Preset_Order_IndexTest extends TestCase {

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * The index under test.
	 *
	 * @since TBD
	 *
	 * @var Preset_Order_Index
	 */
	private Preset_Order_Index $index;

	/**
	 * Build a fresh index before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->index = new Preset_Order_Index();
	}

	// -------------------------------------------------------------------------
	// for_block()
	// -------------------------------------------------------------------------

	/**
	 * An empty document has no stored order for any block.
	 *
	 * @return void
	 */
	public function testForBlockReturnsEmptyArrayForEmptyDocument(): void {
		$this->assertSame( [], $this->index->for_block( [], self::BUTTON ) );
	}

	/**
	 * A document missing the $extensions key has no stored order.
	 *
	 * @return void
	 */
	public function testForBlockReturnsEmptyArrayWhenExtensionsKeyMissing(): void {
		$doc = [ 'primitive' => [ 'color' => [] ] ];

		$this->assertSame( [], $this->index->for_block( $doc, self::BUTTON ) );
	}

	/**
	 * A well-formed presetOrder entry for a block round-trips through for_block() unchanged.
	 *
	 * @return void
	 */
	public function testForBlockReturnsStoredEntries(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'secondary', 'primary' ] );

		$this->assertSame( [ 'secondary', 'primary' ], $this->index->for_block( $doc, self::BUTTON ) );
	}

	/**
	 * A malformed presetOrder entry — a non-list ("map-shaped") value, or non-string/empty slugs
	 * inside the list — is dropped (or filtered) on read rather than surfaced, so a hand-corrupted
	 * entry degrades to declaration order instead of a type error downstream.
	 *
	 * @dataProvider malformedEntryProvider
	 *
	 * @param array<int|string, mixed> $entry    The raw decoded presetOrder entry for the block.
	 * @param list<string>             $expected The expected result of for_block() against that entry.
	 *
	 * @return void
	 */
	public function testForBlockDropsOrFiltersMalformedEntries( array $entry, array $expected ): void {
		$doc = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_preset_order() => [ self::BUTTON => $entry ],
				],
			],
		];

		$this->assertSame( $expected, $this->index->for_block( $doc, self::BUTTON ) );
	}

	/**
	 * Malformed presetOrder entry shapes and what for_block() must degrade each to.
	 *
	 * @return Generator
	 */
	public function malformedEntryProvider(): Generator {
		yield 'map-shaped (non-sequential) entry' => [
			'entry'    => [ 'a' => 'primary' ],
			'expected' => [],
		];

		yield 'non-string slug inside an otherwise valid list' => [
			'entry'    => [ 'primary', 42, 'secondary' ],
			'expected' => [ 'primary', 'secondary' ],
		];

		yield 'empty-string slug inside an otherwise valid list' => [
			'entry'    => [ 'primary', '' ],
			'expected' => [ 'primary' ],
		];
	}

	/**
	 * A repeated slug in a stored order collapses to its first occurrence on read, so a document
	 * written outside set_block() (which deduplicates on write) cannot surface a preset twice.
	 *
	 * @return void
	 */
	public function testForBlockDeduplicatesRepeatedSlugs(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary', 'primary', 'secondary' ] );

		$this->assertSame( [ 'primary', 'secondary' ], $this->index->for_block( $doc, self::BUTTON ) );
	}

	// -------------------------------------------------------------------------
	// set_block()
	// -------------------------------------------------------------------------

	/**
	 * set_block() creates the $extensions/{namespace}/presetOrder path when none of it yet exists.
	 *
	 * @return void
	 */
	public function testSetBlockCreatesFullPathWhenMissing(): void {
		$result = $this->index->set_block( [], self::BUTTON, [ 'secondary', 'primary' ] );

		$this->assertSame( [ 'secondary', 'primary' ], $this->index->for_block( $result, self::BUTTON ) );
	}

	/**
	 * set_block() replaces a previously stored order for the same block wholesale.
	 *
	 * @return void
	 */
	public function testSetBlockReplacesExistingOrderWholesale(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary', 'secondary' ] );

		$result = $this->index->set_block( $doc, self::BUTTON, [ 'secondary' ] );

		$this->assertSame( [ 'secondary' ], $this->index->for_block( $result, self::BUTTON ) );
	}

	/**
	 * set_block() deduplicates submitted slugs, keeping the first occurrence.
	 *
	 * @return void
	 */
	public function testSetBlockDeduplicatesKeepingFirstOccurrence(): void {
		$result = $this->index->set_block( [], self::BUTTON, [ 'primary', 'secondary', 'primary' ] );

		$this->assertSame( [ 'primary', 'secondary' ], $this->index->for_block( $result, self::BUTTON ) );
	}

	/**
	 * set_block() leaves a sibling block's stored order untouched.
	 *
	 * @return void
	 */
	public function testSetBlockPreservesSiblingBlocks(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary' ] );

		$result = $this->index->set_block( $doc, 'kadence/advancedbtn', [ 'ghost' ] );

		$this->assertSame( [ 'primary' ], $this->index->for_block( $result, self::BUTTON ) );
		$this->assertSame( [ 'ghost' ], $this->index->for_block( $result, 'kadence/advancedbtn' ) );
	}

	/**
	 * set_block() does not modify the document passed in — every mutator returns a new document.
	 *
	 * @return void
	 */
	public function testSetBlockDoesNotModifyItsInput(): void {
		$doc = [];

		$this->index->set_block( $doc, self::BUTTON, [ 'primary' ] );

		$this->assertSame( [], $doc );
	}

	// -------------------------------------------------------------------------
	// remove_block()
	// -------------------------------------------------------------------------

	/**
	 * remove_block() is a no-op (the same document reference is returned) when nothing is stored
	 * for the block.
	 *
	 * @return void
	 */
	public function testRemoveBlockIsNoOpWhenAbsent(): void {
		$doc = [];

		$this->assertSame( $doc, $this->index->remove_block( $doc, self::BUTTON ) );
	}

	/**
	 * remove_block() deletes only the targeted block's order, leaving sibling blocks intact.
	 *
	 * @return void
	 */
	public function testRemoveBlockDeletesTargetBlockOnly(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary' ] );
		$doc = $this->index->set_block( $doc, 'kadence/advancedbtn', [ 'ghost' ] );

		$result = $this->index->remove_block( $doc, self::BUTTON );

		$this->assertSame( [], $this->index->for_block( $result, self::BUTTON ) );
		$this->assertSame( [ 'ghost' ], $this->index->for_block( $result, 'kadence/advancedbtn' ) );
	}

	/**
	 * remove_block() clears a block whose stored value is null. The entry is malformed but still
	 * present, so guarding with isset() would report it missing and strand it in storage.
	 *
	 * @return void
	 */
	public function testRemoveBlockClearsANullEntry(): void {
		$doc = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_preset_order() => [
						self::BUTTON          => null,
						'kadence/advancedbtn' => [ 'ghost' ],
					],
				],
			],
		];

		$result = $this->index->remove_block( $doc, self::BUTTON );

		$section = $result[ Extensions::get_extensions_key() ][ Extensions::get_namespace() ][ Extensions::get_section_preset_order() ];

		$this->assertArrayNotHasKey( self::BUTTON, $section );
		$this->assertSame( [ 'ghost' ], $this->index->for_block( $result, 'kadence/advancedbtn' ) );
	}

	/**
	 * remove_block() prunes the whole presetOrder section once its last block entry is removed, so
	 * a fully-cleared order leaves no residue in the stored document.
	 *
	 * @return void
	 */
	public function testRemoveBlockPrunesTheEmptiedSection(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary' ] );

		$result = $this->index->remove_block( $doc, self::BUTTON );

		$this->assertArrayNotHasKey( Extensions::get_extensions_key(), $result );
	}

	/**
	 * remove_block() leaves the rest of the document, outside the presetOrder section, unchanged.
	 *
	 * @return void
	 */
	public function testRemoveBlockLeavesTheRestOfTheDocumentUnchanged(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary' ] );

		$doc['primitive'] = [
			'color' => [
				'brand' => [
					'$type'  => 'color',
					'$value' => '#3182CE',
				],
			],
		];

		$result = $this->index->remove_block( $doc, self::BUTTON );

		$this->assertSame( $doc['primitive'], $result['primitive'] );
	}

	// -------------------------------------------------------------------------
	// apply()
	// -------------------------------------------------------------------------

	/**
	 * With no stored order, apply() returns the incoming names in their own (declaration) order.
	 *
	 * @return void
	 */
	public function testApplyWithNoStoredOrderReturnsIncomingOrder(): void {
		$result = $this->index->apply( [], self::BUTTON, [ 'primary', 'secondary' ] );

		$this->assertSame( [ 'primary', 'secondary' ], $result );
	}

	/**
	 * A stored order wins over declaration order for the slugs it names.
	 *
	 * @return void
	 */
	public function testApplyStoredOrderWinsOverDeclarationOrder(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'secondary', 'primary' ] );

		$result = $this->index->apply( $doc, self::BUTTON, [ 'primary', 'secondary' ] );

		$this->assertSame( [ 'secondary', 'primary' ], $result );
	}

	/**
	 * A stored slug the incoming names no longer include (a deleted preset) is skipped silently,
	 * rather than surfaced as a phantom row.
	 *
	 * @return void
	 */
	public function testApplySkipsStaleStoredSlugs(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'secondary', 'ghost', 'primary' ] );

		$result = $this->index->apply( $doc, self::BUTTON, [ 'primary', 'secondary' ] );

		$this->assertSame( [ 'secondary', 'primary' ], $result );
	}

	/**
	 * A preset the stored order never mentions (a newly created one) appends after the ordered
	 * slugs, in its incoming position relative to other unordered names.
	 *
	 * @return void
	 */
	public function testApplyAppendsNamesTheStoredOrderDoesNotMention(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'secondary' ] );

		$result = $this->index->apply( $doc, self::BUTTON, [ 'primary', 'secondary', 'accent' ] );

		$this->assertSame( [ 'secondary', 'primary', 'accent' ], $result );
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * A duplicated stored slug does not repeat the preset in the applied order, so apply() keeps
	 * returning a permutation of the incoming names.
	 *
	 * @return void
	 */
	public function testApplyDoesNotRepeatADuplicatedStoredSlug(): void {
		$doc = $this->doc_with_order( self::BUTTON, [ 'primary', 'primary' ] );

		$this->assertSame(
			[ 'primary', 'secondary' ],
			$this->index->apply( $doc, self::BUTTON, [ 'secondary', 'primary' ] )
		);
	}

	/**
	 * Build a decoded document carrying one block's presetOrder entry.
	 *
	 * @param string        $block The block name.
	 * @param list<string>  $slugs The stored ordered preset-slug list.
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_order( string $block, array $slugs ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_preset_order() => [ $block => $slugs ],
				],
			],
		];
	}
}
