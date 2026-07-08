<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use Tests\Support\Classes\TestCase;

final class Active_Set_StoreTest extends TestCase {

	/**
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->active = $this->container->get( Active_Set_Store::class );
		$this->store  = $this->container->get( Token_Store::class );
	}

	/**
	 * @return void
	 */
	public function testItDefaultsToTheDefaultSetWhenNothingIsStored(): void {
		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
	}

	/**
	 * @return void
	 */
	public function testItRoundTripsAValidNonDefaultSet(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$this->active->set( 'brand-b' );

		$this->assertSame( 'brand-b', $this->active->get() );
	}

	/**
	 * @return void
	 */
	public function testItFallsBackToTheDefaultSetWhenThePointerIsDangling(): void {
		// Point at a set that has no row, bypassing the delete signal, to prove the read-time fallback
		// resolves a dangling pointer rather than surfacing a non-existent set.
		update_option( 'kadence_blocks_design_tokens_active_set', 'ghost', true );

		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
	}

	/**
	 * @return void
	 */
	public function testSetFiresTheChangedActionWithTheNewAndPreviousSlug(): void {
		$this->store->save_document( '{}', 'brand-b' );

		$fired = [];
		add_action(
			Active_Set_Store::changed_action(),
			static function ( $new, $old ) use ( &$fired ): void {
				$fired[] = [ $new, $old ];
			},
			10,
			2
		);

		$this->active->set( 'brand-b' );

		$this->assertSame( [ [ 'brand-b', Token_Store::default_slug() ] ], $fired );
	}

	/**
	 * @return void
	 */
	public function testSetIsANoOpWhenThePointerIsUnchanged(): void {
		$this->store->save_document( '{}', 'brand-b' );
		$this->active->set( 'brand-b' );

		$fired = 0;
		add_action(
			Active_Set_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		// Re-pointing at the already-active set writes nothing and signals nothing.
		$this->active->set( 'brand-b' );

		$this->assertSame( 'brand-b', $this->active->get() );
		$this->assertSame( 0, $fired );
	}

	/**
	 * @return void
	 */
	public function testDeletingTheActiveSetResetsThePointerToTheDefaultAndSignals(): void {
		$this->store->save_document( '{}', 'brand-b' );
		$this->active->set( 'brand-b' );

		$fired = [];
		add_action(
			Active_Set_Store::changed_action(),
			static function ( $new, $old ) use ( &$fired ): void {
				$fired[] = [ $new, $old ];
			},
			10,
			2
		);

		// Deleting the active set fires Token_Store::deleted_action(), which the active-set store is wired
		// to: the now-dangling pointer drops back to the default and the change is signalled.
		$this->store->delete( 'brand-b' );

		$this->assertSame( Token_Store::default_slug(), $this->active->get() );
		$this->assertSame( [ [ Token_Store::default_slug(), 'brand-b' ] ], $fired );
	}

	/**
	 * @return void
	 */
	public function testDeletingANonActiveSetLeavesThePointerUntouched(): void {
		$this->store->save_document( '{}', 'brand-b' );
		$this->store->save_document( '{}', 'brand-c' );
		$this->active->set( 'brand-b' );

		$fired = 0;
		add_action(
			Active_Set_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		$this->store->delete( 'brand-c' );

		$this->assertSame( 'brand-b', $this->active->get() );
		$this->assertSame( 0, $fired );
	}
}
