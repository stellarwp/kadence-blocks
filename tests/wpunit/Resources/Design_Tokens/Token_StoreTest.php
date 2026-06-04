<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_History_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Table;
use KadenceWP\KadenceBlocks\StellarWP\DB\DB;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use Tests\Support\Classes\TestCase;

final class Token_StoreTest extends TestCase {

	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->store = $this->container->get( Token_Store::class );
	}

	public function testItReturnsAnEmptyDocumentWhenNoRowExists(): void {
		$this->assertSame( '', $this->store->get_document() );
		$this->assertSame( '', $this->store->get_document( 'does-not-exist' ) );
	}

	public function testItReturnsAnEmptyVersionWhenNoRowExists(): void {
		$this->assertSame( '', $this->store->get_version() );
		$this->assertSame( '', $this->store->get_version( 'does-not-exist' ) );
	}

	public function testItSavesAndReadsBackADocument(): void {
		$document = '{"color":{"brand":{"$value":"#bada55"}}}';

		$this->store->save_document( $document );

		$this->assertSame( $document, $this->store->get_document() );
	}

	public function testGetVersionReturnsTheStoredHash(): void {
		$this->store->save_document( '{"a":1}' );

		$this->assertMatchesRegularExpression( '/^[a-f0-9]{32}$/', $this->store->get_version() );
	}

	public function testSavingAnEmptyDocumentReadsBackEmptyButStillCreatesAVersionedRow(): void {
		$this->store->save_document( '' );

		// An empty document means "render entirely from baseline", but the row
		// (and its cache-busting version) still exist.
		$this->assertSame( '', $this->store->get_document() );
		$this->assertSame( 1, $this->count_rows() );
		$this->assertMatchesRegularExpression( '/^[a-f0-9]{32}$/', $this->store->get_version() );
	}

	public function testSavingTwiceUpdatesTheSameRowAndChangesTheVersion(): void {
		$this->store->save_document( '{"a":1}' );
		$first_version = $this->store->get_version();

		$this->store->save_document( '{"b":2}' );
		$second_version = $this->store->get_version();

		// One row, latest document wins.
		$this->assertSame( 1, $this->count_rows() );
		$this->assertSame( '{"b":2}', $this->store->get_document() );

		// Version is a populated md5 hash that changes between writes (cache-busting).
		$this->assertMatchesRegularExpression( '/^[a-f0-9]{32}$/', $second_version );
		$this->assertNotSame( $first_version, $second_version );
	}

	public function testSaveFiresTheChangedActionWithTheSlug(): void {
		$fired = [];
		add_action(
			Token_Store::changed_action(),
			static function ( $slug ) use ( &$fired ): void {
				$fired[] = $slug;
			}
		);

		$this->store->save_document( '{}', 'brand-b' );

		$this->assertSame( [ 'brand-b' ], $fired );
	}

	public function testSaveDoesNotClobberAnExistingTitleWhenOmitted(): void {
		$this->store->save_document( '{"v":1}', Token_Store::default_slug(), 'My Tokens' );
		$this->store->save_document( '{"v":2}' );

		$this->assertSame( 'My Tokens', $this->read_title() );
	}

	public function testBumpVersionChangesVersionButKeepsDocument(): void {
		$this->store->save_document( '{"keep":true}' );
		$before = $this->store->get_version();

		$this->store->bump_version();
		$after = $this->store->get_version();

		$this->assertSame( '{"keep":true}', $this->store->get_document() );
		$this->assertNotSame( $before, $after );
	}

	public function testBumpVersionFiresTheChangedAction(): void {
		$this->store->save_document( '{}' );

		$fired = 0;
		add_action(
			Token_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		$this->store->bump_version();

		$this->assertSame( 1, $fired );
	}

	public function testBumpVersionIsANoOpForAMissingSet(): void {
		$fired = 0;
		add_action(
			Token_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		$this->store->bump_version( 'never-saved' );

		$this->assertSame( 0, $fired );
		$this->assertSame( 0, $this->count_rows() );
	}

	public function testTokenSetsAreIsolatedBySlug(): void {
		$this->store->save_document( '{"set":"a"}', 'set-a' );
		$this->store->save_document( '{"set":"b"}', 'set-b' );

		$this->assertSame( '{"set":"a"}', $this->store->get_document( 'set-a' ) );
		$this->assertSame( '{"set":"b"}', $this->store->get_document( 'set-b' ) );
		$this->assertSame( 2, $this->count_rows() );
	}

	public function testAWriteErrorThrowsAndDoesNotFireTheChangedAction(): void {
		// Point a store at a table that doesn't exist so the write errors out.
		// StellarWP's DB layer throws on any query error rather than returning a
		// falsy value, so the change action is never reached — proving it only
		// fires on a successful write.
		$store = new Token_Store( 'kb_design_tokens_does_not_exist' );

		$fired = 0;
		add_action(
			Token_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		$caught = null;

		try {
			$store->save_document( '{"a":1}' );
		} catch ( DatabaseQueryException $e ) {
			$caught = $e;
		}

		$this->assertInstanceOf(
			DatabaseQueryException::class,
			$caught,
			'Expected a DatabaseQueryException writing to a missing table.'
		);
		$this->assertSame( 0, $fired );
	}

	public function testSupersededActionDoesNotFireOnAFirstSave(): void {
		$fired = 0;
		add_action(
			Token_Store::superseded_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		// No prior row exists, so there is no previous document to archive.
		$this->store->save_document( '{"first":true}' );

		$this->assertSame( 0, $fired );
	}

	public function testSupersededActionFiresWithThePreviousDocumentAndVersionOnOverwrite(): void {
		$this->store->save_document( '{"v":1}' );
		$first_version = $this->store->get_version();

		$captured = [];
		add_action(
			Token_Store::superseded_action(),
			static function ( $slug, $document, $version ) use ( &$captured ): void {
				$captured = [
					'slug'     => $slug,
					'document' => $document,
					'version'  => $version,
				];
			},
			10,
			3
		);

		$this->store->save_document( '{"v":2}' );

		// The signal carries the state leaving the table, not the incoming save.
		$this->assertSame( Token_Store::default_slug(), $captured['slug'] );
		$this->assertSame( '{"v":1}', $captured['document'] );
		$this->assertSame( $first_version, $captured['version'] );
	}

	public function testSupersededActionFiresEvenWhenThePreviousDocumentWasEmpty(): void {
		// A saved-empty set is still a real prior state (an undo back to baseline),
		// distinct from "no row at all".
		$this->store->save_document( '' );

		$captured = null;
		add_action(
			Token_Store::superseded_action(),
			static function ( $slug, $document ) use ( &$captured ): void {
				$captured = $document;
			},
			10,
			2
		);

		$this->store->save_document( '{"now":"set"}' );

		$this->assertSame( '', $captured );
	}

	public function testSupersededActionFiresOnlyAfterTheNewDocumentIsPersisted(): void {
		$this->store->save_document( '{"v":1}' );

		// Capture what the live table holds at the moment the action fires, plus
		// the previous document the action carries.
		$live_at_fire   = null;
		$carried_in_arg = null;
		add_action(
			Token_Store::superseded_action(),
			function ( $slug, $document ) use ( &$live_at_fire, &$carried_in_arg ): void {
				$live_at_fire   = $this->store->get_document();
				$carried_in_arg = $document;
			},
			10,
			2
		);

		$this->store->save_document( '{"v":2}' );

		// The action fires after the upsert commits, so the new value is already
		// live — guarding that a failed write never archives a phantom previous.
		$this->assertSame( '{"v":2}', $live_at_fire );
		// It still carries the document that was just replaced.
		$this->assertSame( '{"v":1}', $carried_in_arg );
	}

	public function testSaveArchivesThePreviousDocumentIntoHistory(): void {
		$history = $this->container->get( Token_History_Store::class );

		// First save: nothing to archive yet.
		$this->store->save_document( '{"v":1}' );
		$this->assertSame( 0, $history->count() );

		// Second save: the first document is archived before being overwritten.
		$this->store->save_document( '{"v":2}' );
		$this->assertSame( 1, $history->count() );
		$this->assertSame( '{"v":1}', $history->latest()['document'] );

		// Third save: history accumulates, newest first.
		$this->store->save_document( '{"v":3}' );
		$this->assertSame( 2, $history->count() );
		$this->assertSame( '{"v":2}', $history->latest()['document'] );
	}

	public function testBumpVersionDoesNotArchiveHistory(): void {
		$history = $this->container->get( Token_History_Store::class );

		$this->store->save_document( '{"v":1}' );
		$this->store->bump_version();

		// bump_version() re-hashes without changing the document, so there is no
		// new prior state to record.
		$this->assertSame( 0, $history->count() );
	}

	/**
	 * Read the title column directly (test-only inspection of the table).
	 */
	private function read_title( ?string $slug = null ): ?string {
		$slug ??= Token_Store::default_slug();

		$row = DB::table( Token_Table::table_name( false ) )
				->where( 'slug', $slug )
				->get( ARRAY_A );

		return $row['title'] ?? null;
	}

	private function count_rows(): int {
		return (int) DB::table( Token_Table::table_name( false ) )->count();
	}
}
