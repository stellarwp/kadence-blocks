<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_History_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_History_Table;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use Tests\Support\Classes\TestCase;

final class Token_History_StoreTest extends TestCase {

	private Token_History_Store $history;

	protected function setUp(): void {
		parent::setUp();

		$this->history = $this->container->get( Token_History_Store::class );
	}

	public function testCountIsZeroAndLatestIsNullWhenNoHistoryExists(): void {
		$this->assertSame( 0, $this->history->count() );
		$this->assertNull( $this->history->latest() );
		$this->assertSame( [], $this->history->for_set() );
	}

	public function testRecordPersistsASnapshotReadableByCountAndLatest(): void {
		$this->history->record( Token_History_Store::default_slug(), '{"was":"here"}', 'abc123' );

		$this->assertSame( 1, $this->history->count() );

		$latest = $this->history->latest();
		$this->assertIsArray( $latest );
		$this->assertSame( '{"was":"here"}', $latest['document'] );
		$this->assertSame( 'abc123', $latest['version'] );
	}

	public function testRecordStampsACreatedAtTimestamp(): void {
		$this->history->record( Token_History_Store::default_slug(), '{}', '' );

		$latest = $this->history->latest();
		$this->assertIsArray( $latest );
		$this->assertMatchesRegularExpression(
			'/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/',
			(string) $latest['created_at']
		);
	}

	public function testRecordAppendsRatherThanOverwriting(): void {
		$this->history->record( Token_History_Store::default_slug(), '{"v":1}', 'one' );
		$this->history->record( Token_History_Store::default_slug(), '{"v":2}', 'two' );
		$this->history->record( Token_History_Store::default_slug(), '{"v":3}', 'three' );

		// Appends, not overwrites — and three is within the default retention limit, so all are kept.
		$this->assertSame( 3, $this->history->count() );
	}

	public function testLatestReturnsTheMostRecentlyRecordedSnapshot(): void {
		$this->history->record( Token_History_Store::default_slug(), '{"v":1}', 'one' );
		$this->history->record( Token_History_Store::default_slug(), '{"v":2}', 'two' );

		$latest = $this->history->latest();
		$this->assertSame( '{"v":2}', $latest['document'] );
	}

	public function testForSetReturnsSnapshotsNewestFirst(): void {
		$this->history->record( Token_History_Store::default_slug(), '{"v":1}', 'one' );
		$this->history->record( Token_History_Store::default_slug(), '{"v":2}', 'two' );
		$this->history->record( Token_History_Store::default_slug(), '{"v":3}', 'three' );

		$documents = array_column( $this->history->for_set(), 'document' );

		$this->assertSame( [ '{"v":3}', '{"v":2}', '{"v":1}' ], $documents );
	}

	public function testForSetHonoursLimitAndOffset(): void {
		foreach ( [ '{"v":1}', '{"v":2}', '{"v":3}', '{"v":4}' ] as $index => $document ) {
			$this->history->record( Token_History_Store::default_slug(), $document, (string) $index );
		}

		// Newest first: v4, v3, v2, v1. Skip the newest, take the next two.
		$documents = array_column( $this->history->for_set( '', 2, 1 ), 'document' );

		$this->assertSame( [ '{"v":3}', '{"v":2}' ], $documents );
	}

	public function testHistoryIsIsolatedBySlug(): void {
		$this->history->record( 'set-a', '{"set":"a"}', 'va' );
		$this->history->record( 'set-b', '{"set":"b1"}', 'vb1' );
		$this->history->record( 'set-b', '{"set":"b2"}', 'vb2' );

		$this->assertSame( 1, $this->history->count( 'set-a' ) );
		$this->assertSame( 2, $this->history->count( 'set-b' ) );
		$this->assertSame( '{"set":"a"}', $this->history->latest( 'set-a' )['document'] );
		$this->assertSame( '{"set":"b2"}', $this->history->latest( 'set-b' )['document'] );
	}

	public function testRecordPrunesToTheDefaultLimitKeepingTheNewest(): void {
		// Seven saves, default retention of five: the two oldest are pruned.
		foreach ( range( 1, 7 ) as $n ) {
			$this->history->record( Token_History_Store::default_slug(), '{"v":' . $n . '}', (string) $n );
		}

		$this->assertSame( Token_History_Store::default_history_limit(), $this->history->count() );

		$documents = array_column( $this->history->for_set( '', 100 ), 'document' );

		// Newest five kept, oldest two (v1, v2) gone.
		$this->assertSame( [ '{"v":7}', '{"v":6}', '{"v":5}', '{"v":4}', '{"v":3}' ], $documents );
	}

	public function testHistoryLimitFilterOverridesTheRetentionCount(): void {
		$to_two = static fn(): int => 2;
		add_filter( 'kadence_blocks_design_tokens_history_limit', $to_two );

		foreach ( range( 1, 4 ) as $n ) {
			$this->history->record( Token_History_Store::default_slug(), '{"v":' . $n . '}', (string) $n );
		}

		remove_filter( 'kadence_blocks_design_tokens_history_limit', $to_two );

		$this->assertSame( 2, $this->history->count() );
		$documents = array_column( $this->history->for_set( '', 100 ), 'document' );
		$this->assertSame( [ '{"v":4}', '{"v":3}' ], $documents );
	}

	public function testANonPositiveLimitDisablesPruning(): void {
		$disable = static fn(): int => 0;
		add_filter( 'kadence_blocks_design_tokens_history_limit', $disable );

		foreach ( range( 1, 8 ) as $n ) {
			$this->history->record( Token_History_Store::default_slug(), '{"v":' . $n . '}', (string) $n );
		}

		remove_filter( 'kadence_blocks_design_tokens_history_limit', $disable );

		// Pruning off: every snapshot is kept, well past the default limit.
		$this->assertSame( 8, $this->history->count() );
	}

	public function testPruningIsScopedToTheSavedSlug(): void {
		// set-b is seeded first and stays within its limit; pruning set-a later
		// must not touch it.
		$this->history->record( 'set-b', '{"b":1}', 'b1' );
		$this->history->record( 'set-b', '{"b":2}', 'b2' );

		foreach ( range( 1, 7 ) as $n ) {
			$this->history->record( 'set-a', '{"a":' . $n . '}', (string) $n );
		}

		$this->assertSame( Token_History_Store::default_history_limit(), $this->history->count( 'set-a' ) );
		$this->assertSame( 2, $this->history->count( 'set-b' ) );
	}

	public function testHistoryLimitFilterReceivesTheSlug(): void {
		$captured = null;
		$capture  = static function ( int $limit, string $slug ) use ( &$captured ): int {
			$captured = $slug;

			return $limit;
		};
		add_filter( 'kadence_blocks_design_tokens_history_limit', $capture, 10, 2 );

		$this->history->record( 'my-set', '{"a":1}', 'v' );

		remove_filter( 'kadence_blocks_design_tokens_history_limit', $capture, 10 );

		$this->assertSame( 'my-set', $captured );
	}

	public function testRecordThrowsWhenTheTableIsMissing(): void {
		// StellarWP's DB layer throws on a query error rather than returning a
		// falsy value, so writing to a non-existent table surfaces as an exception.
		$history = new Token_History_Store( 'kb_design_tokens_history_does_not_exist' );

		$this->expectException( DatabaseQueryException::class );

		$history->record( 'default', '{"a":1}', 'v' );
	}

	public function testTableNameMatchesTheConfiguredHistoryTable(): void {
		// Guards the container binding: the store must point at the history table,
		// not accidentally at the main tokens table.
		$this->assertSame( Token_History_Table::table_name( false ), $this->history->table() );
	}
}
