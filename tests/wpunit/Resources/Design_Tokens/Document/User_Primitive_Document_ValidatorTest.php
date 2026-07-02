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
	 * @return void
	 */
	public function testTreeLeafWithWrongTypeReturnsTypeError(): void {
		$id  = 'primitive.color.custom.size';
		$doc = $this->doc_with_leaf_type( $id, 'Size', 'dimension', '16px' );

		$errors = $this->validator->validate( $doc );

		$ids = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_id(), $errors );
		$this->assertContains( $id, $ids );

		$messages = array_map( static fn( User_Primitive_Validation_Error $e ) => $e->get_message(), $errors );
		$found    = false;
		foreach ( $messages as $msg ) {
			if ( strpos( $msg, 'only "color" is allowed' ) !== false ) {
				$found = true;
				break;
			}
		}
		$this->assertTrue( $found, 'Expected a type error message mentioning "only "color" is allowed".' );
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
