<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Favorite_Font_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers the favoriteFonts ordered-family-list read/write operations of Favorite_Font_Index.
 *
 * @since TBD
 */
final class Favorite_Font_IndexTest extends TestCase {

	/**
	 * The index under test.
	 *
	 * @since TBD
	 *
	 * @var Favorite_Font_Index
	 */
	private Favorite_Font_Index $index;

	/**
	 * Build a fresh index before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->index = new Favorite_Font_Index();
	}

	// -------------------------------------------------------------------------
	// all()
	// -------------------------------------------------------------------------

	/**
	 * An empty document has no favorites.
	 *
	 * @return void
	 */
	public function testAllReturnsEmptyArrayForEmptyDocument(): void {
		$this->assertSame( [], $this->index->all( [] ) );
	}

	/**
	 * A document missing the $extensions key has no favorites.
	 *
	 * @return void
	 */
	public function testAllReturnsEmptyArrayWhenExtensionsKeyMissing(): void {
		$doc = [ 'primitive' => [ 'color' => [] ] ];

		$this->assertSame( [], $this->index->all( $doc ) );
	}

	/**
	 * A well-formed favoriteFonts section round-trips through all() in its stored order.
	 *
	 * @return void
	 */
	public function testAllReturnsStoredFamiliesInOrder(): void {
		$doc = $this->doc_with_favorites( [ 'Inter', 'Abril Fatface' ] );

		$this->assertSame( [ 'Inter', 'Abril Fatface' ], $this->index->all( $doc ) );
	}

	/**
	 * A malformed favoriteFonts section — a non-list ("map-shaped") value, or non-string, empty or
	 * duplicated families inside the list — is dropped (or filtered) on read rather than surfaced,
	 * so a hand-corrupted section degrades to "no favorites" instead of a type error downstream.
	 *
	 * @dataProvider malformedSectionProvider
	 *
	 * @param array<int|string, mixed> $section  The raw decoded favoriteFonts section.
	 * @param list<string>             $expected The expected result of all() against that section.
	 *
	 * @return void
	 */
	public function testAllDropsOrFiltersMalformedEntries( array $section, array $expected ): void {
		$doc = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_favorite_fonts() => $section,
				],
			],
		];

		$this->assertSame( $expected, $this->index->all( $doc ) );
	}

	/**
	 * Malformed favoriteFonts section shapes and what all() must degrade each to.
	 *
	 * @return Generator
	 */
	public function malformedSectionProvider(): Generator {
		yield 'map-shaped (non-sequential) section value' => [
			'section'  => [ 'a' => 'Inter' ],
			'expected' => [],
		];

		yield 'non-string family inside an otherwise valid list' => [
			'section'  => [ 'Inter', 42, 'Georgia' ],
			'expected' => [ 'Inter', 'Georgia' ],
		];

		yield 'empty-string family inside an otherwise valid list' => [
			'section'  => [ 'Inter', '' ],
			'expected' => [ 'Inter' ],
		];

		yield 'whitespace-only family inside an otherwise valid list' => [
			'section'  => [ 'Inter', '   ' ],
			'expected' => [ 'Inter' ],
		];

		yield 'surrounding whitespace is trimmed' => [
			'section'  => [ '  Inter  ' ],
			'expected' => [ 'Inter' ],
		];

		yield 'duplicate family collapses to first occurrence' => [
			'section'  => [ 'Inter', 'Georgia', 'Inter' ],
			'expected' => [ 'Inter', 'Georgia' ],
		];
	}

	// -------------------------------------------------------------------------
	// has()
	// -------------------------------------------------------------------------

	/**
	 * has() reports a stored family, and reports a family that is not stored as absent.
	 *
	 * @return void
	 */
	public function testHasReportsMembership(): void {
		$doc = $this->doc_with_favorites( [ 'Inter' ] );

		$this->assertTrue( $this->index->has( $doc, 'Inter' ) );
		$this->assertFalse( $this->index->has( $doc, 'Georgia' ) );
	}

	/**
	 * has() trims the family it is asked about, matching how all() stores one.
	 *
	 * @return void
	 */
	public function testHasTrimsTheQueriedFamily(): void {
		$doc = $this->doc_with_favorites( [ 'Inter' ] );

		$this->assertTrue( $this->index->has( $doc, '  Inter  ' ) );
	}

	/**
	 * A family name is a proper noun, not an identifier, so membership folds case. The REST catalog
	 * gate in front of this already accepts either spelling, so matching case-sensitively here would
	 * let both through and store two entries for one font.
	 *
	 * @dataProvider caseVariantProvider
	 *
	 * @param string $stored  The family as stored.
	 * @param string $queried The same family, spelled differently.
	 *
	 * @return void
	 */
	public function testHasMatchesRegardlessOfCase( string $stored, string $queried ): void {
		$this->assertTrue( $this->index->has( $this->doc_with_favorites( [ $stored ] ), $queried ) );
	}

	/**
	 * Spellings of one family name, for the membership, add and remove cases below.
	 *
	 * @return Generator
	 */
	public function caseVariantProvider(): Generator {
		yield 'upper queried against title' => [
			'stored'  => 'Inter',
			'queried' => 'INTER',
		];
		yield 'lower queried against title' => [
			'stored'  => 'Inter',
			'queried' => 'inter',
		];
		yield 'title queried against lower' => [
			'stored'  => 'inter',
			'queried' => 'Inter',
		];
		yield 'mixed multi-word' => [
			'stored'  => 'Abril Fatface',
			'queried' => 'abril FATFACE',
		];
	}

	// -------------------------------------------------------------------------
	// add()
	// -------------------------------------------------------------------------

	/**
	 * The consequence of the rule above on the write path: a second spelling of a family already
	 * favorited is the same idempotent no-op an exact repeat is, rather than a second entry that
	 * neither picker would render — both collapse the list case-insensitively before display, so such
	 * an entry could not be seen or cleared through the UI.
	 *
	 * @dataProvider caseVariantProvider
	 *
	 * @param string $stored  The family as stored.
	 * @param string $queried The same family, spelled differently.
	 *
	 * @return void
	 */
	public function testAddDoesNotStoreASecondSpellingOfAFamily( string $stored, string $queried ): void {
		$doc = $this->doc_with_favorites( [ $stored ] );

		$this->assertSame( $doc, $this->index->add( $doc, $queried ) );
		$this->assertSame( [ $stored ], $this->index->all( $this->index->add( $doc, $queried ) ) );
	}

	/**
	 * add() creates the $extensions/{namespace}/favoriteFonts path when none of it yet exists.
	 *
	 * @return void
	 */
	public function testAddCreatesFullPathWhenMissing(): void {
		$result = $this->index->add( [], 'Inter' );

		$this->assertSame( [ 'Inter' ], $this->index->all( $result ) );
	}

	/**
	 * add() appends to the end, so insertion order is the display order a picker renders.
	 *
	 * @return void
	 */
	public function testAddAppendsToTheEnd(): void {
		$doc = $this->doc_with_favorites( [ 'Inter' ] );

		$result = $this->index->add( $doc, 'Georgia' );

		$this->assertSame( [ 'Inter', 'Georgia' ], $this->index->all( $result ) );
	}

	/**
	 * add() is idempotent on a family already in the list: the same document comes back, so a
	 * replayed write neither duplicates the entry nor moves it to the end of the list.
	 *
	 * @return void
	 */
	public function testAddIsIdempotentAndPreservesPosition(): void {
		$doc = $this->doc_with_favorites( [ 'Inter', 'Georgia' ] );

		$result = $this->index->add( $doc, 'Inter' );

		$this->assertSame( $doc, $result );
	}

	/**
	 * add() refuses an empty or whitespace-only family, returning the document untouched — all()
	 * would filter such an entry out anyway, so it must not be storable in the first place.
	 *
	 * @dataProvider blankFamilyProvider
	 *
	 * @param string $family The blank family name.
	 *
	 * @return void
	 */
	public function testAddRefusesABlankFamily( string $family ): void {
		$doc = $this->doc_with_favorites( [ 'Inter' ] );

		$this->assertSame( $doc, $this->index->add( $doc, $family ) );
	}

	/**
	 * Family names that carry no name at all.
	 *
	 * @return Generator
	 */
	public function blankFamilyProvider(): Generator {
		yield 'empty string' => [ 'family' => '' ];
		yield 'spaces only' => [ 'family' => '   ' ];
	}

	/**
	 * add() trims the family before storing it, so the same face cannot enter the list twice under
	 * two spellings that differ only in whitespace.
	 *
	 * @return void
	 */
	public function testAddTrimsTheFamily(): void {
		$result = $this->index->add( [], '  Inter  ' );

		$this->assertSame( [ 'Inter' ], $this->index->all( $result ) );
	}

	/**
	 * add() does not modify the document passed in — every mutator returns a new document.
	 *
	 * @return void
	 */
	public function testAddDoesNotModifyItsInput(): void {
		$doc = [];

		$this->index->add( $doc, 'Inter' );

		$this->assertSame( [], $doc );
	}

	// -------------------------------------------------------------------------
	// remove()
	// -------------------------------------------------------------------------

	/**
	 * remove() is a no-op (the same document is returned) when the family is not in the list.
	 *
	 * @return void
	 */
	public function testRemoveIsNoOpWhenAbsent(): void {
		$this->assertSame( [], $this->index->remove( [], 'Inter' ) );
	}

	/**
	 * remove() deletes only the named family, leaving every other favorite's relative order intact.
	 *
	 * @return void
	 */
	public function testRemoveDeletesTargetFamilyOnly(): void {
		$doc = $this->doc_with_favorites( [ 'Inter', 'Georgia', 'Abril Fatface' ] );

		$result = $this->index->remove( $doc, 'Georgia' );

		$this->assertSame( [ 'Inter', 'Abril Fatface' ], $this->index->all( $result ) );
	}

	/**
	 * remove() leaves the rest of the document, outside the favoriteFonts section, unchanged.
	 *
	 * @return void
	 */
	public function testRemoveLeavesTheRestOfTheDocumentUnchanged(): void {
		$doc = $this->doc_with_favorites( [ 'Inter' ] );

		$doc['primitive'] = [
			'color' => [
				'brand' => [
					'$type'  => 'color',
					'$value' => '#3182CE',
				],
			],
		];

		$result = $this->index->remove( $doc, 'Inter' );

		$this->assertSame( $doc['primitive'], $result['primitive'] );
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * A favorite can be cleared through the spelling a client holds rather than only through the one
	 * that happens to be stored — otherwise a favorite added before this rule existed could be
	 * unreachable from a picker that lowercases what it sends.
	 *
	 * @dataProvider caseVariantProvider
	 *
	 * @param string $stored  The family as stored.
	 * @param string $queried The same family, spelled differently.
	 *
	 * @return void
	 */
	public function testRemoveMatchesRegardlessOfCase( string $stored, string $queried ): void {
		$doc = $this->doc_with_favorites( [ $stored, 'Georgia' ] );

		$this->assertSame( [ 'Georgia' ], $this->index->all( $this->index->remove( $doc, $queried ) ) );
	}

	/**
	 * A section hand-written with two spellings of one family renders once, keeping the first — the
	 * same collapse both pickers apply, so the Style Library and a block agree on the list.
	 *
	 * @return void
	 */
	public function testAllCollapsesCaseVariantDuplicates(): void {
		$doc = $this->doc_with_favorites( [ 'Inter', 'INTER', 'Georgia', 'inter' ] );

		$this->assertSame( [ 'Inter', 'Georgia' ], $this->index->all( $doc ) );
	}

	/**
	 * Build a decoded document carrying a favoriteFonts family list.
	 *
	 * @param list<string> $families The stored favorite families.
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_favorites( array $families ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_favorite_fonts() => $families,
				],
			],
		];
	}
}
