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
		$segments = explode( '.', $id );

		$leaf = [
			'$type'  => $type,
			'$value' => '#ff0000',
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
