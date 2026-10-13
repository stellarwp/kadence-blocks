<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use Tests\Support\Classes\TestCase;

final class Active_Token_Library_StoreTest extends TestCase {

	/**
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Boots the container-resolved active-library store and token store before each test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->active = $this->container->get( Active_Token_Library_Store::class );
		$this->store  = $this->container->get( Token_Store::class );
	}

	/**
	 * The pointer resolves to the default library when nothing has ever been stored.
	 *
	 * @return void
	 */
	public function testItDefaultsToTheDefaultLibraryWhenNothingIsStored(): void {
		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
	}

	/**
	 * Pointing at a valid non-default library and reading it back returns that library's slug.
	 *
	 * @return void
	 */
	public function testItRoundTripsAValidNonDefaultLibrary(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$this->active->set( 'brand-b' );

		$this->assertSame( 'brand-b', $this->active->get() );
	}

	/**
	 * A pointer left dangling at a library with no row falls back to the default library on read.
	 *
	 * @return void
	 */
	public function testItFallsBackToTheDefaultLibraryWhenThePointerIsDangling(): void {
		// Point at a library that has no row, bypassing the delete signal, to prove the read-time
		// fallback resolves a dangling pointer rather than surfacing a non-existent library.
		update_option( 'kadence_blocks_design_tokens_active_library', 'ghost', true );

		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
	}

	/**
	 * Setting the pointer fires the changed action with the new and previous slugs.
	 *
	 * @return void
	 */
	public function testSetFiresTheChangedActionWithTheNewAndPreviousSlug(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$fired = [];
		add_action(
			Active_Token_Library_Store::changed_action(),
			static function ( $new_slug, $old_slug ) use ( &$fired ): void {
				$fired[] = [ $new_slug, $old_slug ];
			},
			10,
			2
		);

		$this->active->set( 'brand-b' );

		$this->assertSame( [ [ 'brand-b', Token_Store::default_slug() ] ], $fired );
	}

	/**
	 * Re-pointing at the already-active library writes nothing and fires no change signal.
	 *
	 * @return void
	 */
	public function testSetIsANoOpWhenThePointerIsUnchanged(): void {
		$this->store->save_document( '{}', 'brand-b' );
		$this->active->set( 'brand-b' );

		$fired = 0;
		add_action(
			Active_Token_Library_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		// Re-pointing at the already-active library writes nothing and signals nothing.
		$this->active->set( 'brand-b' );

		$this->assertSame( 'brand-b', $this->active->get() );
		$this->assertSame( 0, $fired );
	}

	/**
	 * Deleting the active library resets the pointer to the default and signals the change.
	 *
	 * @return void
	 */
	public function testDeletingTheActiveLibraryResetsThePointerToTheDefaultAndSignals(): void {
		$this->store->save_document( '{}', 'brand-b' );
		$this->active->set( 'brand-b' );

		$fired = [];
		add_action(
			Active_Token_Library_Store::changed_action(),
			static function ( $new_slug, $old_slug ) use ( &$fired ): void {
				$fired[] = [ $new_slug, $old_slug ];
			},
			10,
			2
		);

		// Deleting the active library fires Token_Store::deleted_action(), which the active-library
		// store is wired to: the now-dangling pointer drops back to the default and the change is
		// signalled.
		$this->store->delete( 'brand-b' );

		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
		$this->assertSame( [ [ Token_Store::default_slug(), 'brand-b' ] ], $fired );
	}

	/**
	 * Deleting a library that is not the active one leaves the pointer untouched.
	 *
	 * @return void
	 */
	public function testDeletingANonActiveLibraryLeavesThePointerUntouched(): void {
		$this->store->save_document( '{}', 'brand-b' );
		$this->store->save_document( '{}', 'brand-c' );
		$this->active->set( 'brand-b' );

		$fired = 0;
		add_action(
			Active_Token_Library_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		$this->store->delete( 'brand-c' );

		$this->assertSame( 'brand-b', $this->active->get() );
		$this->assertSame( 0, $fired );
	}
}
