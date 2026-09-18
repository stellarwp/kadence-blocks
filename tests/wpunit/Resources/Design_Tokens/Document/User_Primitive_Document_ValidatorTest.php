<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Document_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Validation_Error;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline\Empty_Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
use Tests\Support\Classes\TestCase;

/**
 * Covers the invariant checks in User_Primitive_Document_Validator.
 */
final class User_Primitive_Document_ValidatorTest extends TestCase {

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->index     = new User_Primitive_Index();
		$this->baseline  = new Empty_Baseline_Document();
		$this->registry  = new Token_Registry();
		$this->validator = new User_Primitive_Document_Validator(
			$this->index,
			$this->baseline,
			$this->registry
		);
	}

	/**
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $index;

	/**
	 * @var Baseline_Document
	 */
	private Baseline_Document $baseline;

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @var User_Primitive_Document_Validator
	 */
	private User_Primitive_Document_Validator $validator;

	// -------------------------------------------------------------------------
	// valid documents
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testValidDocumentWithSingleColorEntryReturnsNoErrors(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );

		$errors = $this->validator->validate( $doc );

		$this->assertSame( [], $errors );
	}

	/**
	 * @return void
	 */
	public function testValidDocumentWithMultipleColorEntriesReturnsNoErrors(): void {
		$id_a = 'primitive.color.custom.brand';
		$id_b = 'primitive.color.custom.accent';
		$doc  = $this->doc_with_color_entry( $id_a, 'Brand', '#3182CE' );
		$doc  = $this->add_color_entry( $doc, $id_b, 'Accent', '#E53E3E' );

		$errors = $this->validator->validate( $doc );

		$this->assertSame( [], $errors );
	}

	/**
	 * @return void
	 */
	public function testEmptyDocumentReturnsNoErrors(): void {
		$errors = $this->validator->validate( [] );

		$this->assertSame( [], $errors );
	}

	/**
	 * Gate 3 is open for a dimension user primitive: a literal $value under
	 * primitive.dimension.custom.* validates cleanly.
	 *
	 * @return void
	 */
	public function testValidDocumentWithDimensionEntryReturnsNoErrors(): void {
		$id  = 'primitive.dimension.custom.gap-md';
		$doc = $this->doc_with_envelope_only( $id, 'Gap MD' );
		$doc = $this->set_tree_leaf( $doc, $id, Token_Type::get_type_dimension(), '1.5rem' );

		$errors = $this->validator->validate( $doc );

		$this->assertSame( [], $errors );
	}

	/**
	 * Gate 3 is open for the shadow composite, and the orphan walk does not descend into
	 * the sub-field map to misreport it as an orphan leaf.
	 *
	 * @return void
	 */
	public function testValidDocumentWithShadowEntryReturnsNoErrors(): void {
		$id  = 'primitive.shadow.custom.elevated';
		$doc = $this->doc_with_envelope_only( $id, 'Elevated' );
		$doc = $this->set_tree_leaf_value( $doc, $id, Token_Type::get_type_shadow(), $this->shadow_value() );

		$errors = $this->validator->validate( $doc );

		$this->assertSame( [], $errors );
	}

	/**
	 * A document mixing color, dimension, and shadow user primitives returns no errors,
	 * pinning that the generalized checks and the orphan walk cover every type together.
	 *
	 * @return void
	 */
	public function testMixedTypeDocumentReturnsNoErrors(): void {
		$color_id     = 'primitive.color.custom.brand';
		$dimension_id = 'primitive.dimension.custom.gap-md';
		$shadow_id    = 'primitive.shadow.custom.elevated';

		$doc = $this->doc_with_color_entry( $color_id, 'Brand', '#3182CE' );

		$doc = $this->index->add( $doc, $dimension_id, 'Gap MD' );
		$doc = $this->set_tree_leaf( $doc, $dimension_id, Token_Type::get_type_dimension(), '1.5rem' );

		$doc = $this->index->add( $doc, $shadow_id, 'Elevated' );
		$doc = $this->set_tree_leaf_value( $doc, $shadow_id, Token_Type::get_type_shadow(), $this->shadow_value() );

		$errors = $this->validator->validate( $doc );

		$this->assertSame( [], $errors );
	}

	// -------------------------------------------------------------------------
	// envelope entry missing tree leaf
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testEnvelopeEntryWithNoMatchingTreeLeafReturnsError(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_envelope_only( $id, 'Brand' );

		$errors = $this->validator->validate( $doc );

		$this->assertCount( 1, $errors );
		$this->assertSame( $id, $errors[0]->get_id() );
		$this->assertStringContainsString( 'no matching tree leaf', $errors[0]->get_message() );
	}

	// -------------------------------------------------------------------------
	// orphan tree leaf (no envelope entry)
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testTreeLeafWithNoEnvelopeEntryReturnsOrphanError(): void {
		$id  = 'primitive.color.custom.orphan';
		$doc = $this->doc_with_tree_only( $id, '#FFFFFF' );

		$errors = $this->validator->validate( $doc );

		$this->assertCount( 1, $errors );
		$this->assertSame( $id, $errors[0]->get_id() );
		$this->assertStringContainsString( 'no provenance envelope entry', $errors[0]->get_message() );
	}

	/**
	 * The orphan walk reads the primitive subtree by the type's MAPPED id segment
	 * (Token_Type::get_id_segment()), not the raw $type — a font-family leaf with no envelope
	 * entry is found and reported under the kebab id, matching where it actually lives in the
	 * document tree.
	 *
	 * @return void
	 */
	public function testFontFamilyTreeLeafWithNoEnvelopeEntryReturnsOrphanErrorUnderTheKebabId(): void {
		$id  = 'primitive.font-family.custom.orphan';
		$doc = $this->set_tree_leaf( [], $id, Token_Type::get_type_font_family(), '["Abel"]' );

		$errors = $this->validator->validate( $doc );

		$this->assertCount( 1, $errors );
		$this->assertSame( $id, $errors[0]->get_id() );
		$this->assertStringContainsString( 'no provenance envelope entry', $errors[0]->get_message() );
	}

	/**
	 * The orphan scan covers every type segment, not one: it finds a leaf with no envelope entry under
	 * dimension and shadow just as it does under color, and a shadow's object $value sub-fields
	 * are not themselves reported as orphans.
	 *
	 * @return void
	 */
	public function testOrphanScanCoversEveryTypeSegment(): void {
		$color_id     = 'primitive.color.custom.orphan';
		$dimension_id = 'primitive.dimension.custom.orphan';
		$shadow_id    = 'primitive.shadow.custom.orphan';

		$doc = $this->doc_with_tree_only( $color_id, '#FFFFFF' );
		$doc = $this->set_tree_leaf( $doc, $dimension_id, Token_Type::get_type_dimension(), '1rem' );
		$doc = $this->set_tree_leaf_value( $doc, $shadow_id, Token_Type::get_type_shadow(), $this->shadow_value() );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertCount( 3, $errors );
		$this->assertContains( $color_id, $ids );
		$this->assertContains( $dimension_id, $ids );
		$this->assertContains( $shadow_id, $ids );
	}

	// -------------------------------------------------------------------------
	// id outside allowed namespace
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testEnvelopeEntryOutsideAllowedNamespaceReturnsNamespaceError(): void {
		$id  = 'semantic.color.button-bg';
		$doc = $this->doc_with_envelope_entry_only( $id, 'Button BG' );

		$errors = $this->validator->validate( $doc );

		$this->assertGreaterThanOrEqual( 1, count( $errors ) );
		$this->assertSame( $id, $errors[0]->get_id() );
		$this->assertStringContainsString( 'allowed namespace', $errors[0]->get_message() );
	}

	// -------------------------------------------------------------------------
	// wrong $type
	// -------------------------------------------------------------------------

	/**
	 * An id whose second segment is the raw camelCase $type spelling (rather than
	 * Token_Type::get_id_segment()'s mapped kebab spelling) no longer matches is_reserved_id() at
	 * all — the mapping means "fontWeight" is never a valid id segment, only "font-weight" is — so
	 * this now fails the namespace gate itself, not the (dropped) unsupported-type predicate.
	 *
	 * @return void
	 */
	public function testTreeLeafWithCamelCaseIdSegmentReturnsNamespaceError(): void {
		$id  = 'primitive.fontWeight.custom.size';
		$doc = $this->doc_with_leaf_type( $id, 'Size', 'fontWeight', '600' );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'allowed namespace' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a namespace error message mentioning "allowed namespace".' );
	}

	// -------------------------------------------------------------------------
	// $type / id segment mismatch
	// -------------------------------------------------------------------------

	/**
	 * A supported $type that disagrees with its id's type segment is a self-inconsistent
	 * document the invariant flags, regardless of which supported type is declared.
	 *
	 * @dataProvider segmentMismatchProvider
	 *
	 * @param string $id           The canonical id, whose second segment is the "true" type.
	 * @param string $declared_type The $type the tree leaf declares, which disagrees with $id.
	 *
	 * @return void
	 */
	public function testTreeLeafTypeMismatchingIdSegmentReturnsMismatchError( string $id, string $declared_type ): void {
		$doc = $this->doc_with_leaf_type( $id, 'Label', $declared_type, '16px' );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'does not match its id namespace' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a $type / id namespace mismatch error.' );
	}

	/**
	 * @return Generator
	 */
	public function segmentMismatchProvider(): Generator {
		yield 'dimension id with a color leaf type' => [
			'id'            => 'primitive.dimension.custom.x',
			'declared_type' => Token_Type::get_type_color(),
		];

		yield 'color id with a dimension leaf type' => [
			'id'            => 'primitive.color.custom.x',
			'declared_type' => Token_Type::get_type_dimension(),
		];

		yield 'the mapped font-family id segment with a fontWeight leaf type' => [
			'id'            => 'primitive.font-family.custom.x',
			'declared_type' => Token_Type::get_type_font_weight(),
		];
	}

	/**
	 * The invariant compares the MAPPED id segment against $type, not the raw $type spelling: a
	 * fontFamily leaf under the font-family id segment is self-consistent and returns no mismatch
	 * error, even though "fontFamily" !== "font-family" as raw strings.
	 *
	 * @return void
	 */
	public function testTreeLeafTypeMatchingMappedIdSegmentReturnsNoMismatchError(): void {
		$id  = 'primitive.font-family.custom.x';
		$doc = $this->doc_with_leaf_type( $id, 'Label', Token_Type::get_type_font_family(), '["Abel"]' );

		$errors = $this->validator->validate( $doc );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );

		foreach ( $messages as $msg ) {
			$this->assertStringNotContainsString( 'does not match its id namespace', $msg );
		}
	}

	// -------------------------------------------------------------------------
	// shadow whole-$value alias
	// -------------------------------------------------------------------------

	/**
	 * A shadow leaf whose whole $value is an alias string hits the same no-alias invariant
	 * every other type does — the generalization does not carve out a composite exception.
	 *
	 * @return void
	 */
	public function testShadowTreeLeafWithAliasValueReturnsAliasError(): void {
		$id  = 'primitive.shadow.custom.alias-shadow';
		$doc = $this->doc_with_envelope_only( $id, 'Alias Shadow' );
		$doc = $this->set_tree_leaf( $doc, $id, Token_Type::get_type_shadow(), '{primitive.shadow.elevation.md}' );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'aliases are not allowed' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected an alias error.' );
	}

	// -------------------------------------------------------------------------
	// alias $value
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testTreeLeafWithAliasValueReturnsAliasError(): void {
		$id  = 'primitive.color.custom.alias-color';
		$doc = $this->doc_with_color_entry( $id, 'Alias Color', '{primitive.color.brand.primary}' );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'aliases are not allowed' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected an alias error.' );
	}

	// -------------------------------------------------------------------------
	// empty label
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testEmptyLabelInEnvelopeReturnsLabelError(): void {
		$id  = 'primitive.color.custom.unlabeled';
		$doc = $this->doc_with_color_entry( $id, '', '#000000' );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'missing or empty label' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a label error.' );
	}

	// -------------------------------------------------------------------------
	// group
	// -------------------------------------------------------------------------

	/**
	 * An envelope entry with no "group" key at all validates cleanly — group is optional and its
	 * absence is the common case for every ungrouped custom token.
	 *
	 * @return void
	 */
	public function testEntryWithNoGroupKeyReturnsNoErrors(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );

		$this->assertSame( [], $this->validator->validate( $doc ) );
	}

	/**
	 * An entry with a valid lowercase kebab-case group string validates cleanly.
	 *
	 * @return void
	 */
	public function testEntryWithAKebabCaseGroupReturnsNoErrors(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );
		$doc = $this->index->add( $doc, $id, 'Brand', 'radius' );

		$this->assertSame( [], $this->validator->validate( $doc ) );
	}

	/**
	 * A non-string "group" value is rejected — a hand-edited or corrupted document must not slip
	 * past the invariant just because no real write path produces this shape.
	 *
	 * @return void
	 */
	public function testEntryWithANonStringGroupReturnsGroupError(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );

		$ext = Extensions::get_extensions_key();
		$ns  = Extensions::get_namespace();
		$sec = Extensions::get_section_user_primitives();
		$doc[ $ext ][ $ns ][ $sec ][ $id ]['group'] = 123;

		$errors   = $this->validator->validate( $doc );
		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );

		$found = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'invalid group' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a group error.' );
	}

	/**
	 * A "group" string outside the kebab-case charset (e.g. underscores, uppercase) is rejected —
	 * it must never reach the same charset a token id segment enforces.
	 *
	 * @return void
	 */
	public function testEntryWithANonKebabGroupReturnsGroupError(): void {
		$id  = 'primitive.color.custom.brand';
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );
		$doc = $this->index->add( $doc, $id, 'Brand', 'Border_Radius' );

		$errors   = $this->validator->validate( $doc );
		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );

		$found = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'invalid group' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a group error.' );
	}

	// -------------------------------------------------------------------------
	// baseline collision
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testIdCollidingWithBaselineTokenReturnsCollisionError(): void {
		$id       = 'primitive.color.custom.brand';
		$baseline = $this->make_baseline_with( $id );
		$registry = new Token_Registry();
		$sut      = new User_Primitive_Document_Validator( $this->index, $baseline, $registry );
		$doc      = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );

		$errors = $sut->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'collides with a baseline token' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a baseline collision error.' );
	}

	// -------------------------------------------------------------------------
	// system registry collision
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testIdCollidingWithSystemRegistryTokenReturnsSystemCollisionError(): void {
		$id       = 'primitive.color.custom.brand';
		$registry = new Token_Registry();
		$registry->register(
			[
				'id'    => $id,
				'type'  => 'color',
				'label' => 'System Brand',
			] 
		);
		$sut = new User_Primitive_Document_Validator( $this->index, $this->baseline, $registry );
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );

		$errors = $sut->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'collides with a system-registered token' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a system collision error.' );
	}

	/**
	 * A user-created registry token does not trigger the system collision check.
	 *
	 * @return void
	 */
	public function testIdCollidingWithUserCreatedRegistryTokenReturnsNoSystemCollisionError(): void {
		$id       = 'primitive.color.custom.brand';
		$registry = new Token_Registry();
		$registry->register_user_primitive( $id, 'color', 'User Brand' );
		$sut = new User_Primitive_Document_Validator( $this->index, $this->baseline, $registry );
		$doc = $this->doc_with_color_entry( $id, 'Brand', '#3182CE' );

		$errors = $sut->validate( $doc );

		foreach ( $errors as $error ) {
			$this->assertStringNotContainsString(
				'collides with a system-registered token',
				$error->get_message()
			);
		}
	}

	// -------------------------------------------------------------------------
	// data-provider driven: valid id patterns
	// -------------------------------------------------------------------------

	/**
	 * @dataProvider validIdProvider
	 *
	 * @param string $id
	 *
	 * @return void
	 */
	public function testValidIdPassesNamespaceCheck( string $id ): void {
		$doc    = $this->doc_with_color_entry( $id, 'Label', '#FFFFFF' );
		$errors = $this->validator->validate( $doc );

		foreach ( $errors as $error ) {
			$this->assertStringNotContainsString( 'allowed namespace', $error->get_message() );
		}
	}

	/**
	 * @return Generator
	 */
	public function validIdProvider(): Generator {
		yield 'single slug' => [ 'id' => 'primitive.color.custom.brand' ];
		yield 'hyphenated slug' => [ 'id' => 'primitive.color.custom.brand-primary' ];
		yield 'numeric slug' => [ 'id' => 'primitive.color.custom.color1' ];
	}

	/**
	 * @dataProvider invalidIdProvider
	 *
	 * @param string $id
	 *
	 * @return void
	 */
	public function testInvalidIdFailsNamespaceCheck( string $id ): void {
		$doc    = $this->doc_with_envelope_entry_only( $id, 'Label' );
		$errors = $this->validator->validate( $doc );

		$this->assertNotEmpty( $errors );
		$this->assertStringContainsString( 'allowed namespace', $errors[0]->get_message() );
	}

	/**
	 * @return Generator
	 */
	public function invalidIdProvider(): Generator {
		yield 'semantic namespace' => [ 'id' => 'semantic.color.button-bg' ];
		yield 'uppercase slug' => [ 'id' => 'primitive.color.custom.Brand' ];
		yield 'missing custom segment' => [ 'id' => 'primitive.color.brand' ];
		yield 'trailing dot' => [ 'id' => 'primitive.color.custom.' ];
	}

	// -------------------------------------------------------------------------
	// helpers
	// -------------------------------------------------------------------------

	/**
	 * @param string $id
	 * @param string $label
	 * @param string $hex
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_color_entry( string $id, string $label, string $hex ): array {
		$doc = $this->doc_with_envelope_only( $id, $label );

		return $this->set_tree_leaf( $doc, $id, 'color', $hex );
	}

	/**
	 * @param string $id
	 * @param string $label
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_envelope_only( string $id, string $label ): array {
		return $this->doc_with_envelope_entry_only( $id, $label );
	}

	/**
	 * @param string $id
	 * @param string $hex
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_tree_only( string $id, string $hex ): array {
		return $this->set_tree_leaf( [], $id, 'color', $hex );
	}

	/**
	 * @param string $id
	 * @param string $label
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_envelope_entry_only( string $id, string $label ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_user_primitives() => [
						$id => [ 'label' => $label ],
					],
				],
			],
		];
	}

	/**
	 * @param string $id
	 * @param string $label
	 * @param string $type
	 * @param string $value
	 *
	 * @return array<string, mixed>
	 */
	private function doc_with_leaf_type( string $id, string $label, string $type, string $value ): array {
		$doc = $this->doc_with_envelope_entry_only( $id, $label );

		return $this->set_tree_leaf( $doc, $id, $type, $value );
	}

	/**
	 * @param array<string, mixed> $doc
	 * @param string               $id
	 * @param string               $label
	 * @param string               $hex
	 *
	 * @return array<string, mixed>
	 */
	private function add_color_entry( array $doc, string $id, string $label, string $hex ): array {
		$doc = $this->index->add( $doc, $id, $label );

		return $this->set_tree_leaf( $doc, $id, 'color', $hex );
	}

	/**
	 * Set a token leaf node in the primitive tree at a dot-path id.
	 *
	 * @param array<string, mixed> $doc
	 * @param string               $id
	 * @param string               $type
	 * @param string               $value
	 *
	 * @return array<string, mixed>
	 */
	private function set_tree_leaf( array $doc, string $id, string $type, string $value ): array {
		$segments = explode( '.', $id );
		$node     = &$doc;

		foreach ( $segments as $segment ) {
			if ( ! isset( $node[ $segment ] ) || ! is_array( $node[ $segment ] ) ) {
				$node[ $segment ] = [];
			}
			$node = &$node[ $segment ];
		}

		$node['$type']  = $type;
		$node['$value'] = $value;

		return $doc;
	}

	/**
	 * Set a token leaf node in the primitive tree at a dot-path id, accepting any $value shape
	 * (a composite's object $value, in particular).
	 *
	 * @param array<string, mixed> $doc
	 * @param string               $id
	 * @param string               $type
	 * @param mixed                $value
	 *
	 * @return array<string, mixed>
	 */
	private function set_tree_leaf_value( array $doc, string $id, string $type, $value ): array {
		$segments = explode( '.', $id );
		$node     = &$doc;

		foreach ( $segments as $segment ) {
			if ( ! isset( $node[ $segment ] ) || ! is_array( $node[ $segment ] ) ) {
				$node[ $segment ] = [];
			}
			$node = &$node[ $segment ];
		}

		$node['$type']  = $type;
		$node['$value'] = $value;

		return $doc;
	}

	/**
	 * A literal, fully-populated shadow composite $value fixture.
	 *
	 * @return array<string, string>
	 */
	private function shadow_value(): array {
		return [
			'color'   => '#1A202C',
			'offsetX' => '0px',
			'offsetY' => '2px',
			'blur'    => '8px',
			'spread'  => '0px',
		];
	}

	/**
	 * Build a Baseline_Document stub that reports has() = true for the given id.
	 *
	 * @param string $id
	 *
	 * @return Baseline_Document
	 */
	private function make_baseline_with( string $id ): Baseline_Document {
		return new class( $id ) implements Baseline_Document {
			/** @var string */
			private string $id;

			/** @param string $id */
			public function __construct( string $id ) {
				$this->id = $id;
			}

			/** @param string $id */
			public function has( string $id ): bool {
				return $id === $this->id;
			}

			/** @return array<string, mixed> */
			public function document(): array {
				return [];
			}
		};
	}
}
