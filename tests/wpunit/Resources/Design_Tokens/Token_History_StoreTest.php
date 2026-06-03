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

		// Every save is kept — v1 never prunes.
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
