<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\User_Primitive_Registrar;
use KadenceWP\KadenceBlocks\Psr\Log\Test\TestLogger;
use Tests\Support\Classes\TestCase;

final class User_Primitive_RegistrarTest extends TestCase {

	/**
	 * Build a fresh Registrar with isolated registry and logger.
	 *
	 * @param Token_Registry $registry
	 * @param TestLogger     $logger
	 *
	 * @return User_Primitive_Registrar
	 */
	private function make_registrar( Token_Registry $registry, TestLogger $logger ): User_Primitive_Registrar {
		return new User_Primitive_Registrar(
			$this->container->get( Token_Store::class ),
			$registry,
			new User_Primitive_Index(),
			$logger
		);
	}

	/**
	 * Encode a document with one user primitive: the tree entry and the envelope entry.
	 *
	 * @param string $id    Dot-path id (e.g. "primitive.my-color").
	 * @param string $type  DTCG $type (e.g. "color").
	 * @param string $label Human-readable label.
	 *
	 * @return string JSON-encoded document.
	 */
	private function encode_document( string $id, string $type, string $label ): string {
		return $this->encode_document_with_value( $id, $type, $label, '#ff0000' );
	}

	/**
	 * Encode a document with one user primitive, accepting any $value shape (a composite's
	 * object $value, in particular).
	 *
	 * @param string $id    Dot-path id (e.g. "primitive.my-color").
	 * @param string $type  DTCG $type (e.g. "color").
	 * @param string $label Human-readable label.
	 * @param mixed  $value DTCG $value.
	 *
	 * @return string JSON-encoded document.
	 */
	private function encode_document_with_value( string $id, string $type, string $label, $value ): string {
		$segments = explode( '.', $id );

		$leaf = [
			'$type'  => $type,
			'$value' => $value,
		];

		$tree = $leaf;
		for ( $i = count( $segments ) - 1; $i >= 0; $i-- ) {
			$tree = [ $segments[ $i ] => $tree ];
		}

		$envelope = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'userPrimitives' => [
						$id => [ 'label' => $label ],
					],
				],
			],
		];

		return (string) wp_json_encode( array_merge( $tree, $envelope ) );
	}

	/**
	 * Encode a document with one user primitive whose envelope entry carries a stable group key.
	 *
	 * @param string $id    Dot-path id.
	 * @param string $type  DTCG $type.
	 * @param string $label Human-readable label.
	 * @param string $group Stable group key stored in the envelope.
	 *
	 * @return string JSON-encoded document.
	 */
	private function encode_document_with_group( string $id, string $type, string $label, string $group ): string {
		$segments = explode( '.', $id );

		$leaf = [
			'$type'  => $type,
			'$value' => '0.75rem',
		];

		$tree = $leaf;
		for ( $i = count( $segments ) - 1; $i >= 0; $i-- ) {
			$tree = [ $segments[ $i ] => $tree ];
		}

		$envelope = [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'userPrimitives' => [
						$id => [
							'label' => $label,
							'group' => $group,
						],
					],
				],
			],
		];

		return (string) wp_json_encode( array_merge( $tree, $envelope ) );
	}

	/**
	 * A stored group key that resolves through a declared token carries the current-locale group
	 * label into the registered definition, so the custom token surfaces in the same feed group
	 * as its declared siblings.
	 *
	 * @return void
	 */
	public function testStoredGroupKeyResolvesToTheDeclaredGroupLabel(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		$registry->register(
			[
				'id'        => 'primitive.dimension.radius.sm',
				'type'      => 'dimension',
				'label'     => 'SM',
				'group'     => 'Border Radius',
				'group_key' => 'border-radius',
			]
		);

		$store->save_document(
			$this->encode_document_with_group( 'primitive.dimension.custom.radius-md', 'dimension', 'Radius MD', 'border-radius' )
		);

		$this->make_registrar( $registry, $logger )->sync();

		$token = $registry->get( 'primitive.dimension.custom.radius-md' );
		$this->assertNotNull( $token );
		$this->assertSame( 'Border Radius', $token->group );
		$this->assertFalse( $logger->hasWarningRecords() );
	}

	/**
	 * A stored group key no declaration carries fails soft: the token still registers, ungrouped,
	 * with a logged warning rather than a fatal — a plugin downgrade or a removed declaration
	 * must not break the whole registrar sync.
	 *
	 * @return void
	 */
	public function testStoredGroupKeyThatNoLongerResolvesFailsSoftToUngrouped(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		$store->save_document(
			$this->encode_document_with_group( 'primitive.dimension.custom.radius-md', 'dimension', 'Radius MD', 'no-such-group' )
		);

		$this->make_registrar( $registry, $logger )->sync();

		$token = $registry->get( 'primitive.dimension.custom.radius-md' );
		$this->assertNotNull( $token );
		$this->assertSame( '', $token->group );
		$this->assertTrue( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testBootWithNoStoredDocumentsRegistersNothing(): void {
		$registry  = new Token_Registry();
		$registrar = $this->make_registrar( $registry, new TestLogger() );

		$registrar->sync();

		$this->assertSame( [], $registry->user_created_ids() );
	}

	/**
	 * @return void
	 */
	public function testValidEntryRegistersWithLabelFromEnvelopeAndTypeFromTree(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		$store->save_document(
			$this->encode_document( 'primitive.my-color', 'color', 'My Color' )
		);

		$this->make_registrar( $registry, $logger )->sync();

		$this->assertSame( [ 'primitive.my-color' ], $registry->user_created_ids() );

		$token = $registry->get( 'primitive.my-color' );
		$this->assertNotNull( $token );
		$this->assertSame( 'color', $token->type );
		$this->assertSame( 'My Color', $token->label );
		$this->assertFalse( $logger->hasWarningRecords() );
	}

	/**
	 * A stored document with a dimension user primitive registers it, proving the registrar
	 * is already type-agnostic — no registrar changes are needed for a non-color scalar.
	 *
	 * @return void
	 */
	public function testDimensionEntryRegistersWithTypeFromTree(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		$store->save_document(
			$this->encode_document_with_value( 'primitive.dimension.custom.gap-md', 'dimension', 'Gap MD', '1.5rem' )
		);

		$this->make_registrar( $registry, $logger )->sync();

		$this->assertSame( [ 'primitive.dimension.custom.gap-md' ], $registry->user_created_ids() );

		$token = $registry->get( 'primitive.dimension.custom.gap-md' );
		$this->assertNotNull( $token );
		$this->assertSame( 'dimension', $token->type );
		$this->assertTrue( $token->is_user_created() );
		$this->assertSame( 'Gap MD', $token->label );
		$this->assertFalse( $logger->hasWarningRecords() );
	}

	/**
	 * A stored document with a shadow user primitive registers it — the registrar and
	 * Token_Definition's charset guard accept the "shadow" id segment with zero registrar
	 * changes, even though the leaf's $value is an object rather than a scalar.
	 *
	 * @return void
	 */
	public function testShadowEntryRegisters(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		$shadow_value = [
			'color'   => '#1A202C',
			'offsetX' => '0px',
			'offsetY' => '2px',
			'blur'    => '8px',
			'spread'  => '0px',
		];

		$store->save_document(
			$this->encode_document_with_value( 'primitive.shadow.custom.elevated', 'shadow', 'Elevated', $shadow_value )
		);

		$this->make_registrar( $registry, $logger )->sync();

		$this->assertSame( [ 'primitive.shadow.custom.elevated' ], $registry->user_created_ids() );

		$token = $registry->get( 'primitive.shadow.custom.elevated' );
		$this->assertNotNull( $token );
		$this->assertSame( 'shadow', $token->type );
		$this->assertTrue( $token->is_user_created() );
		$this->assertSame( 'Elevated', $token->label );
		$this->assertFalse( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testUserPrimitivesInEveryStoredLibraryAreRegistered(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();

		// Save primitives to a library other than the default. Every stored library is synced, not only
		// the active one — the multi-library projection renders every library, so it needs every
		// library's primitives.
		$store->save_document( $this->encode_document( 'primitive.brand-color', 'color', 'Brand Color' ), 'brand-b' );

		$this->make_registrar( $registry, new TestLogger() )->sync();

		$this->assertSame( [ 'primitive.brand-color' ], $registry->user_created_ids() );
	}

	/**
	 * @return void
	 */
	public function testSyncAccumulatesPrimitivesAcrossAllStoredLibraries(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();
		$reg      = $this->make_registrar( $registry, $logger );

		// Populate the default library.
		$store->save_document( $this->encode_document( 'primitive.default-color', 'color', 'Default Color' ) );
		$reg->sync();
		$this->assertSame( [ 'primitive.default-color' ], $registry->user_created_ids() );

		// Populate a second library.
		$store->save_document( $this->encode_document( 'primitive.brand-color', 'color', 'Brand Color' ), 'brand-b' );
		$reg->sync();

		// Both libraries' primitives are registered; a library no longer has to be active to appear.
		$this->assertSame( [ 'primitive.default-color', 'primitive.brand-color' ], $registry->user_created_ids() );
	}

	/**
	 * @return void
	 */
	public function testCollidingIdAcrossLibrariesKeepsDefaultAndLogsWarning(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		// Two different libraries independently define the same canonical id.
		$store->save_document( $this->encode_document( 'primitive.color.custom.blue', 'color', 'Default Blue' ) );
		$store->save_document( $this->encode_document( 'primitive.color.custom.blue', 'color', 'Brand Blue' ), 'brand-b' );

		$this->make_registrar( $registry, $logger )->sync();

		// The default library's definition wins; the registry has no per-library namespacing to keep both.
		$this->assertSame( [ 'primitive.color.custom.blue' ], $registry->user_created_ids() );

		$token = $registry->get( 'primitive.color.custom.blue' );
		$this->assertNotNull( $token );
		$this->assertSame( 'Default Blue', $token->label );
		$this->assertTrue( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testWriteToSameSlugTriggersReload(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$reg      = $this->make_registrar( $registry, new TestLogger() );

		$store->save_document( $this->encode_document( 'primitive.my-color', 'color', 'My Color' ) );
		$reg->sync();
		$this->assertSame( [ 'primitive.my-color' ], $registry->user_created_ids() );

		// Overwrite the default library's document with a different primitive.
		$store->save_document( $this->encode_document( 'primitive.other-color', 'color', 'Other Color' ) );
		$reg->sync();

		$this->assertSame( [ 'primitive.other-color' ], $registry->user_created_ids() );
	}

	/**
	 * @return void
	 */
	public function testWriteToAnyLibraryAddsToTheRegistry(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$reg      = $this->make_registrar( $registry, new TestLogger() );

		$store->save_document( $this->encode_document( 'primitive.my-color', 'color', 'My Color' ) );
		$reg->sync();
		$this->assertSame( [ 'primitive.my-color' ], $registry->user_created_ids() );

		// Writing to a different library adds to the registry rather than replacing it.
		$store->save_document( $this->encode_document( 'primitive.brand-color', 'color', 'Brand Color' ), 'brand-b' );
		$reg->sync();

		$this->assertSame( [ 'primitive.my-color', 'primitive.brand-color' ], $registry->user_created_ids() );
	}

	/**
	 * @return void
	 */
	public function testOrphanedEnvelopeEntryIsLoggedAndSkipped(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		// Envelope entry present but no matching tree leaf.
		$doc = (string) wp_json_encode(
			[
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							'primitive.ghost' => [ 'label' => 'Ghost' ],
						],
					],
				],
			] 
		);
		$store->save_document( $doc );

		$this->make_registrar( $registry, $logger )->sync();

		$this->assertSame( [], $registry->user_created_ids() );
		$this->assertTrue( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testMissingTypeInTreeLeafIsLoggedAndSkipped(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		// Tree leaf exists but has no $type.
		$doc = (string) wp_json_encode(
			[
				'primitive'   => [
					'my-color' => [
						'$value' => '#ff0000',
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							'primitive.my-color' => [ 'label' => 'My Color' ],
						],
					],
				],
			] 
		);
		$store->save_document( $doc );

		$this->make_registrar( $registry, $logger )->sync();

		$this->assertSame( [], $registry->user_created_ids() );
		$this->assertTrue( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testUnknownTypeValueIsLoggedAndSkipped(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		$doc = (string) wp_json_encode(
			[
				'primitive'   => [
					'my-token' => [
						'$type'  => 'unknownType',
						'$value' => 'something',
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'userPrimitives' => [
							'primitive.my-token' => [ 'label' => 'My Token' ],
						],
					],
				],
			] 
		);
		$store->save_document( $doc );

		$this->make_registrar( $registry, $logger )->sync();

		$this->assertSame( [], $registry->user_created_ids() );
		$this->assertTrue( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testSystemTokenCollisionIsLoggedAndSkipped(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$logger   = new TestLogger();

		// Pre-register a system token with the same id.
		$registry->register(
			[
				'id'    => 'primitive.my-color',
				'type'  => 'color',
				'label' => 'System Color',
			] 
		);

		$store->save_document( $this->encode_document( 'primitive.my-color', 'color', 'My Color' ) );

		$this->make_registrar( $registry, $logger )->sync();

		// System token still present, no user-created entry.
		$this->assertSame( [], $registry->user_created_ids() );
		$this->assertTrue( $logger->hasWarningRecords() );
	}

	/**
	 * @return void
	 */
	public function testSyncIsIdempotent(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$reg      = $this->make_registrar( $registry, new TestLogger() );

		$store->save_document( $this->encode_document( 'primitive.my-color', 'color', 'My Color' ) );

		$reg->sync();
		$reg->sync();

		$this->assertSame( [ 'primitive.my-color' ], $registry->user_created_ids() );
	}

	/**
	 * @return void
	 */
	public function testSyncReReadsCommittedStoreStateOnEachCall(): void {
		$store    = $this->container->get( Token_Store::class );
		$registry = new Token_Registry();
		$reg      = $this->make_registrar( $registry, new TestLogger() );

		// First state: one primitive.
		$store->save_document( $this->encode_document( 'primitive.first', 'color', 'First' ) );
		$reg->sync();
		$this->assertSame( [ 'primitive.first' ], $registry->user_created_ids() );

		// State changes: different primitive committed to the store.
		$store->save_document( $this->encode_document( 'primitive.second', 'dimension', 'Second' ) );
		$reg->sync();

		// Re-sync reads the new committed document, not a stale copy.
		$this->assertSame( [ 'primitive.second' ], $registry->user_created_ids() );
	}
}
