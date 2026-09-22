<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Label_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers the tokenLabels display-label override map read/write operations of Token_Label_Index.
 *
 * @since TBD
 */
final class Token_Label_IndexTest extends TestCase {

	/**
	 * The index under test.
	 *
	 * @since TBD
	 *
	 * @var Token_Label_Index
	 */
	private Token_Label_Index $index;

	/**
	 * Build a fresh index before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->index = new Token_Label_Index();
	}

	// -------------------------------------------------------------------------
	// all()
	// -------------------------------------------------------------------------

	/**
	 * An empty document has no label overrides.
	 *
	 * @return void
	 */
	public function testAllReturnsEmptyArrayForEmptyDocument(): void {
		$this->assertSame( [], $this->index->all( [] ) );
	}

	/**
	 * A document missing the $extensions key has no label overrides.
	 *
	 * @return void
	 */
	public function testAllReturnsEmptyArrayWhenExtensionsKeyMissing(): void {
		$doc = [ 'primitive' => [ 'color' => [] ] ];

		$this->assertSame( [], $this->index->all( $doc ) );
	}

	/**
	 * A well-formed tokenLabels section round-trips through all() unchanged.
	 *
	 * @return void
	 */
	public function testAllReturnsStoredEntries(): void {
		$id  = 'semantic.color.button-bg';
		$doc = $this->doc_with_entry( $id, 'Brand Button' );

		$this->assertSame( [ $id => 'Brand Button' ], $this->index->all( $doc ) );
	}

	/**
	 * A malformed entry (non-string key, non-string value, or empty-string value) is dropped on
	 * read rather than surfaced, so a hand-corrupted section degrades to "no override".
	 *
	 * @dataProvider malformedEntryProvider
	 *
	 * @param array<int|string, mixed> $section The raw decoded tokenLabels section.
	 *
	 * @return void
	 */
	public function testAllDropsMalformedEntries( array $section ): void {
		$doc = [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_token_labels() => $section,
				],
			],
		];

		$this->assertSame( [], $this->index->all( $doc ) );
	}

	/**
	 * Malformed tokenLabels section shapes that must each degrade to "no override" on read.
	 *
	 * @return Generator
	 */
	public function malformedEntryProvider(): Generator {
		yield 'integer key' => [
			'section' => [ 0 => 'Numeric Key' ],
		];

		yield 'non-string value' => [
			'section' => [ 'semantic.color.button-bg' => 42 ],
		];

		yield 'empty string value' => [
			'section' => [ 'semantic.color.button-bg' => '' ],
		];

		yield 'whitespace-only value' => [
			'section' => [ 'semantic.color.button-bg' => '   ' ],
		];
	}

	// -------------------------------------------------------------------------
	// has()
	// -------------------------------------------------------------------------

	/**
	 * has() is false for an id with no stored override.
	 *
	 * @return void
	 */
	public function testHasReturnsFalseWhenAbsent(): void {
		$this->assertFalse( $this->index->has( [], 'semantic.color.missing' ) );
	}

	/**
	 * has() is true once an override is stored for the id.
	 *
	 * @return void
	 */
	public function testHasReturnsTrueWhenPresent(): void {
		$id  = 'semantic.color.button-bg';
		$doc = $this->doc_with_entry( $id, 'Brand Button' );

		$this->assertTrue( $this->index->has( $doc, $id ) );
	}

	// -------------------------------------------------------------------------
	// label_for()
	// -------------------------------------------------------------------------

	/**
	 * label_for() returns null for an id with no stored override.
	 *
	 * @return void
	 */
	public function testLabelForReturnsNullWhenAbsent(): void {
		$this->assertNull( $this->index->label_for( [], 'semantic.color.missing' ) );
	}

	/**
	 * label_for() returns the stored override string.
	 *
	 * @return void
	 */
	public function testLabelForReturnsStoredLabel(): void {
		$id  = 'semantic.color.button-bg';
		$doc = $this->doc_with_entry( $id, 'Brand Button' );

		$this->assertSame( 'Brand Button', $this->index->label_for( $doc, $id ) );
	}

	// -------------------------------------------------------------------------
	// set()
	// -------------------------------------------------------------------------

	/**
	 * set() creates the $extensions/{namespace}/tokenLabels path when none of it yet exists.
	 *
	 * @return void
	 */
	public function testSetCreatesFullPathWhenMissing(): void {
		$id     = 'semantic.color.button-bg';
		$result = $this->index->set( [], $id, 'Brand Button' );

		$this->assertTrue( $this->index->has( $result, $id ) );
		$this->assertSame( 'Brand Button', $this->index->label_for( $result, $id ) );
	}

	/**
	 * set() overwrites a previously stored override for the same id.
	 *
	 * @return void
	 */
	public function testSetOverwritesExistingEntry(): void {
		$id  = 'semantic.color.button-bg';
		$doc = $this->doc_with_entry( $id, 'Old Label' );

		$result = $this->index->set( $doc, $id, 'New Label' );

		$this->assertSame( 'New Label', $this->index->label_for( $result, $id ) );
	}

	/**
	 * set() leaves sibling entries in the section untouched.
	 *
	 * @return void
	 */
	public function testSetPreservesSiblingEntries(): void {
		$id_a = 'semantic.color.button-bg';
		$id_b = 'semantic.color.button-text';
		$doc  = $this->doc_with_entry( $id_a, 'Bg' );

		$result = $this->index->set( $doc, $id_b, 'Text' );

		$this->assertTrue( $this->index->has( $result, $id_a ) );
		$this->assertTrue( $this->index->has( $result, $id_b ) );
	}

	/**
	 * set() refuses to store an empty label — storing an empty label must be impossible by
	 * construction; clearing is remove(), never set( '' ).
	 *
	 * @return void
	 */
	public function testSetThrowsForEmptyLabel(): void {
		$this->expectException( InvalidArgumentException::class );

		$this->index->set( [], 'semantic.color.button-bg', '' );
	}

	/**
	 * set() refuses a whitespace-only label too — it is the empty label with padding, and all()
	 * would drop it on read, leaving an override that silently does not exist.
	 *
	 * @return void
	 */
	public function testSetThrowsForWhitespaceOnlyLabel(): void {
		$this->expectException( InvalidArgumentException::class );

		$this->index->set( [], 'semantic.color.button-bg', "  \t " );
	}

	/**
	 * set() does not modify the document passed in — every mutator returns a new document.
	 *
	 * @return void
	 */
	public function testSetDoesNotModifyItsInput(): void {
		$doc = [];

		$this->index->set( $doc, 'semantic.color.button-bg', 'Brand Button' );

		$this->assertSame( [], $doc );
	}

	// -------------------------------------------------------------------------
	// remove()
	// -------------------------------------------------------------------------

	/**
	 * remove() is a no-op (the same document is returned) when nothing is stored for the id.
	 *
	 * @return void
	 */
	public function testRemoveIsNoOpWhenAbsent(): void {
		$result = $this->index->remove( [], 'semantic.color.missing' );

		$this->assertSame( [], $result );
	}

	/**
	 * remove() deletes only the targeted entry, leaving siblings intact.
	 *
	 * @return void
	 */
	public function testRemoveDeletesTargetEntryOnly(): void {
		$id_a = 'semantic.color.button-bg';
		$id_b = 'semantic.color.button-text';
		$doc  = $this->doc_with_entry( $id_a, 'Bg' );
		$doc  = $this->index->set( $doc, $id_b, 'Text' );

		$result = $this->index->remove( $doc, $id_a );

		$this->assertFalse( $this->index->has( $result, $id_a ) );
		$this->assertTrue( $this->index->has( $result, $id_b ) );
	}

	/**
	 * remove() leaves the rest of the document, outside the tokenLabels section, unchanged.
	 *
	 * @return void
	 */
	public function testRemoveLeavesTheRestOfTheDocumentUnchanged(): void {
		$id  = 'semantic.color.button-bg';
		$doc = $this->doc_with_entry( $id, 'Bg' );

		$doc['primitive'] = [
			'color' => [
				'brand' => [
					'$type'  => 'color',
					'$value' => '#3182CE',
				],
			],
		];

		$result = $this->index->remove( $doc, $id );

		$this->assertSame( $doc['primitive'], $result['primitive'] );
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * Build a decoded document carrying a single tokenLabels entry.
	 *
	 * @param string $id    The token id.
	 * @param string $label The stored label.
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_entry( string $id, string $label ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_token_labels() => [
						$id => $label,
					],
				],
			],
		];
	}
}
