<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use Tests\Support\Classes\TestCase;

/**
 * Covers the provenance-envelope read/write operations of User_Primitive_Index.
 */
final class User_Primitive_IndexTest extends TestCase {

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->index = new User_Primitive_Index();
	}

	/**
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $index;

	// -------------------------------------------------------------------------
	// all()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testAllReturnsEmptyArrayForEmptyDocument(): void {
		$result = $this->index->all( [] );

		$this->assertSame( [], $result );
	}

	/**
	 * @return void
	 */
	public function testAllReturnsEmptyArrayWhenExtensionsKeyMissing(): void {
		$doc = [ 'primitive' => [ 'color' => [] ] ];

		$this->assertSame( [], $this->index->all( $doc ) );
	}

	/**
	 * @return void
	 */
	public function testAllReturnsStoredEntries(): void {
		$id  = 'primitive.color.custom.my-brand';
		$doc = $this->doc_with_entry( $id, 'My Brand' );

		$result = $this->index->all( $doc );

		$this->assertArrayHasKey( $id, $result );
		$this->assertSame( 'My Brand', $result[ $id ]['label'] );
	}

	// -------------------------------------------------------------------------
	// has()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testHasReturnsFalseWhenAbsent(): void {
		$this->assertFalse( $this->index->has( [], 'primitive.color.custom.missing' ) );
	}

	/**
	 * @return void
	 */
	public function testHasReturnsTrueWhenPresent(): void {
		$id  = 'primitive.color.custom.my-brand';
		$doc = $this->doc_with_entry( $id, 'My Brand' );

		$this->assertTrue( $this->index->has( $doc, $id ) );
	}

	// -------------------------------------------------------------------------
	// label_for()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testLabelForReturnsNullWhenAbsent(): void {
		$this->assertNull( $this->index->label_for( [], 'primitive.color.custom.missing' ) );
	}

	/**
	 * @return void
	 */
	public function testLabelForReturnsStoredLabel(): void {
		$id  = 'primitive.color.custom.accent';
		$doc = $this->doc_with_entry( $id, 'Accent Blue' );

		$this->assertSame( 'Accent Blue', $this->index->label_for( $doc, $id ) );
	}

	// -------------------------------------------------------------------------
	// add()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testAddCreatesFullPathWhenMissing(): void {
		$id     = 'primitive.color.custom.brand';
		$result = $this->index->add( [], $id, 'Brand Color' );

		$this->assertTrue( $this->index->has( $result, $id ) );
		$this->assertSame( 'Brand Color', $this->index->label_for( $result, $id ) );
	}

	/**
	 * @return void
	 */
	public function testAddDoesNotWriteTypeOrValue(): void {
		$id     = 'primitive.color.custom.brand';
		$result = $this->index->add( [], $id, 'Brand' );
		$all    = $this->index->all( $result );

		$this->assertArrayNotHasKey( '$type', $all[ $id ] );
		$this->assertArrayNotHasKey( '$value', $all[ $id ] );
	}

	/**
	 * @return void
	 */
	public function testAddOverwritesExistingEntry(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_entry( $id, 'Old Label' );

		$result = $this->index->add( $doc, $id, 'New Label' );

		$this->assertSame( 'New Label', $this->index->label_for( $result, $id ) );
	}

	/**
	 * @return void
	 */
	public function testAddPreservesSiblingEntries(): void {
		$id_a = 'primitive.color.custom.alpha';
		$id_b = 'primitive.color.custom.beta';
		$doc  = $this->doc_with_entry( $id_a, 'Alpha' );

		$result = $this->index->add( $doc, $id_b, 'Beta' );

		$this->assertTrue( $this->index->has( $result, $id_a ) );
		$this->assertTrue( $this->index->has( $result, $id_b ) );
	}

	/**
	 * The default `null` group preserves whatever group an existing entry already stores — the
	 * shape the label endpoints rely on, since their request carries no group of its own.
	 *
	 * @return void
	 */
	public function testAddWithNullGroupPreservesTheExistingStoredGroup(): void {
		$id  = 'primitive.dimension.custom.radius-md';
		$doc = $this->doc_with_entry( $id, 'Radius MD', 'radius' );

		$result = $this->index->add( $doc, $id, 'Renamed Radius' );

		$this->assertSame( 'radius', $this->index->all( $result )[ $id ]['group'] );
	}

	/**
	 * A string group argument sets the group explicitly, overriding whatever was stored before.
	 *
	 * @return void
	 */
	public function testAddWithAStringGroupSetsItExplicitly(): void {
		$id  = 'primitive.dimension.custom.radius-md';
		$doc = $this->doc_with_entry( $id, 'Radius MD', 'old-group' );

		$result = $this->index->add( $doc, $id, 'Radius MD', 'radius' );

		$this->assertSame( 'radius', $this->index->all( $result )[ $id ]['group'] );
	}

	/**
	 * An empty-string group argument clears a stored group, and the entry omits the "group" key
	 * entirely rather than storing an empty string — an ungrouped document stays byte-identical
	 * to one that never had a group.
	 *
	 * @return void
	 */
	public function testAddWithAnEmptyStringGroupClearsItAndOmitsTheKey(): void {
		$id  = 'primitive.dimension.custom.radius-md';
		$doc = $this->doc_with_entry( $id, 'Radius MD', 'radius' );

		$result = $this->index->add( $doc, $id, 'Radius MD', '' );

		$this->assertArrayNotHasKey( 'group', $this->index->all( $result )[ $id ] );
	}

	/**
	 * A brand-new entry written with the default null group has no prior entry to preserve, so it
	 * simply omits the "group" key — the common case for every ungrouped create.
	 *
	 * @return void
	 */
	public function testAddWithNullGroupAndNoExistingEntryOmitsTheKey(): void {
		$id     = 'primitive.color.custom.brand';
		$result = $this->index->add( [], $id, 'Brand' );

		$this->assertArrayNotHasKey( 'group', $this->index->all( $result )[ $id ] );
	}

	// -------------------------------------------------------------------------
	// remove()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testRemoveIsNoOpWhenAbsent(): void {
		$result = $this->index->remove( [], 'primitive.color.custom.missing' );

		$this->assertSame( [], $result );
	}

	/**
	 * @return void
	 */
	public function testRemoveDeletesTargetEntryOnly(): void {
		$id_a = 'primitive.color.custom.alpha';
		$id_b = 'primitive.color.custom.beta';
		$doc  = $this->doc_with_entry( $id_a, 'Alpha' );
		$doc  = $this->index->add( $doc, $id_b, 'Beta' );

		$result = $this->index->remove( $doc, $id_a );

		$this->assertFalse( $this->index->has( $result, $id_a ) );
		$this->assertTrue( $this->index->has( $result, $id_b ) );
	}

	// -------------------------------------------------------------------------
	// rename()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testRenameSwapsIdAndUpdatesLabel(): void {
		$old_id = 'primitive.color.custom.old-brand';
		$new_id = 'primitive.color.custom.new-brand';
		$doc    = $this->doc_with_entry( $old_id, 'Old Brand' );

		$result = $this->index->rename( $doc, $old_id, $new_id, 'New Brand' );

		$this->assertFalse( $this->index->has( $result, $old_id ) );
		$this->assertTrue( $this->index->has( $result, $new_id ) );
		$this->assertSame( 'New Brand', $this->index->label_for( $result, $new_id ) );
	}

	/**
	 * @return void
	 */
	public function testRenameDoesNotWriteTypeOrValue(): void {
		$old_id = 'primitive.color.custom.foo';
		$new_id = 'primitive.color.custom.bar';
		$doc    = $this->doc_with_entry( $old_id, 'Foo' );

		$result = $this->index->rename( $doc, $old_id, $new_id, 'Bar' );
		$all    = $this->index->all( $result );

		$this->assertArrayNotHasKey( '$type', $all[ $new_id ] );
		$this->assertArrayNotHasKey( '$value', $all[ $new_id ] );
	}

	/**
	 * The old entry's group carries to the new id — rename() reads it before remove() erases the
	 * old entry, rather than relying on add()'s own preserve-by-default lookup (which would find
	 * nothing, since the new id has no entry yet).
	 *
	 * @return void
	 */
	public function testRenameCarriesTheOldStoredGroupToTheNewId(): void {
		$old_id = 'primitive.dimension.custom.radius-md';
		$new_id = 'primitive.dimension.custom.radius-medium';
		$doc    = $this->doc_with_entry( $old_id, 'Radius MD', 'radius' );

		$result = $this->index->rename( $doc, $old_id, $new_id, 'Radius Medium' );

		$this->assertSame( 'radius', $this->index->all( $result )[ $new_id ]['group'] );
	}

	/**
	 * An ungrouped entry's rename stays ungrouped — the new entry omits the "group" key rather
	 * than inheriting one from anywhere else.
	 *
	 * @return void
	 */
	public function testRenameOfAnUngroupedEntryLeavesTheNewEntryUngrouped(): void {
		$old_id = 'primitive.color.custom.old-brand';
		$new_id = 'primitive.color.custom.new-brand';
		$doc    = $this->doc_with_entry( $old_id, 'Old Brand' );

		$result = $this->index->rename( $doc, $old_id, $new_id, 'New Brand' );

		$this->assertArrayNotHasKey( 'group', $this->index->all( $result )[ $new_id ] );
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * @param string $id
	 * @param string $label
	 * @param string $group Optional stable group key to seed alongside the label.
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_entry( string $id, string $label, string $group = '' ): array {
		$entry = [ 'label' => $label ];

		if ( $group !== '' ) {
			$entry['group'] = $group;
		}

		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_user_primitives() => [
						$id => $entry,
					],
				],
			],
		];
	}
}
