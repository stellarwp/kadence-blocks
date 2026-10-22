<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Table;
use KadenceWP\KadenceBlocks\StellarWP\DB\DB;
use Tests\Support\Classes\TestCase;

/**
 * Covers the request cache of token library rows: each library is read from the table once per request,
 * a missing library included, and every write path drops the row it touched so later reads, and the
 * listeners a write signals, see the new state.
 */
final class Token_Store_Row_CacheTest extends TestCase {

	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->store = $this->container->get( Token_Store::class );
	}

	/**
	 * Repeated reads of a saved library, through every getter, read its row from the table once.
	 *
	 * @return void
	 */
	public function testRepeatedReadsOfALibraryQueryTheTableOnce(): void {
		$this->store->save_document( '{"a":1}', 'brand', 'Brand' );
		$this->start_a_new_request();

		$reads = $this->count_reads(
			function (): void {
				$this->store->get_document( 'brand' );
				$this->store->get_document( 'brand' );
				$this->store->get_decoded_document( 'brand' );
				$this->store->get_version( 'brand' );
				$this->store->get_version( 'brand' );
				$this->store->get_title( 'brand' );
				$this->store->exists( 'brand' );
			}
		);

		$this->assertSame( 1, $reads );
	}

	/**
	 * A library without a row is remembered too, so it is read from the table once and keeps reading back
	 * as missing.
	 *
	 * @return void
	 */
	public function testAMissingLibraryIsReadOnce(): void {
		$reads = $this->count_reads(
			function (): void {
				$this->assertSame( '', $this->store->get_document( 'missing' ) );
				$this->assertSame( '', $this->store->get_version( 'missing' ) );
				$this->assertSame( '', $this->store->get_title( 'missing' ) );
				$this->assertFalse( $this->store->exists( 'missing' ) );
				$this->assertSame( '', $this->store->get_document( 'missing' ) );
			}
		);

		$this->assertSame( 1, $reads );
	}

	/**
	 * Each library has its own row: reading a second library reads the table again, and does not return
	 * the first library's row.
	 *
	 * @return void
	 */
	public function testEachLibraryIsReadSeparately(): void {
		$this->store->save_document( '{"a":1}', 'brand-a' );
		$this->store->save_document( '{"b":1}', 'brand-b' );
		$this->start_a_new_request();

		$reads = $this->count_reads(
			function (): void {
				$this->assertSame( '{"a":1}', $this->store->get_document( 'brand-a' ) );
				$this->assertSame( '{"b":1}', $this->store->get_document( 'brand-b' ) );
				$this->assertSame( '{"a":1}', $this->store->get_document( 'brand-a' ) );
			}
		);

		$this->assertSame( 2, $reads );
	}

	/**
	 * A library read as missing reads back its first save.
	 *
	 * @return void
	 */
	public function testAFirstSaveIsReadBackAfterTheLibraryWasReadAsMissing(): void {
		$this->assertFalse( $this->store->exists( 'brand' ) );

		$this->store->save_document( '{"a":1}', 'brand', 'Brand' );

		$this->assertTrue( $this->store->exists( 'brand' ) );
		$this->assertSame( '{"a":1}', $this->store->get_document( 'brand' ) );
		$this->assertSame( 'Brand', $this->store->get_title( 'brand' ) );
	}

	/**
	 * An overwrite is read back with its new document and version, not the row read before it.
	 *
	 * @return void
	 */
	public function testAnOverwriteIsReadBack(): void {
		$this->store->save_document( '{"a":1}', 'brand' );
		$version = $this->store->get_version( 'brand' );

		$this->store->save_document( '{"a":2}', 'brand' );

		$this->assertSame( '{"a":2}', $this->store->get_document( 'brand' ) );
		$this->assertNotSame( $version, $this->store->get_version( 'brand' ) );
	}

	/**
	 * A conditional first write and a conditional update are each read back.
	 *
	 * @return void
	 */
	public function testConditionalSavesAreReadBack(): void {
		$this->assertSame( '', $this->store->get_version( 'brand' ) );

		$this->assertTrue( $this->store->save_document_conditional( '{"a":1}', '', 'brand' ) );
		$this->assertSame( '{"a":1}', $this->store->get_document( 'brand' ) );

		$this->assertTrue( $this->store->save_document_conditional( '{"a":2}', $this->store->get_version( 'brand' ), 'brand' ) );
		$this->assertSame( '{"a":2}', $this->store->get_document( 'brand' ) );
	}

	/**
	 * A conditional update that loses a race drops the remembered row, so the next read shows the row that
	 * won rather than the one read before the race.
	 *
	 * @return void
	 */
	public function testAConditionalUpdateThatLosesARaceReadsBackTheWinningRow(): void {
		global $wpdb;

		$this->store->save_document( '{"a":1}', 'brand' );
		$version = $this->store->get_version( 'brand' );
		$table   = $wpdb->prefix . Token_Table::table_name( false );

		// Another request writes the row between this request's version check and its conditional update.
		$race = static function ( $query ) use ( $table, &$race ) {
			if ( is_string( $query ) && preg_match( '/^\s*UPDATE\s+`?' . preg_quote( $table, '/' ) . '`?\s/i', $query ) ) {
				remove_filter( 'query', $race );
				DB::table( Token_Table::table_name( false ) )
					->where( 'slug', 'brand' )
					->update(
						[
							'document' => '{"a":"theirs"}',
							'version'  => md5( 'theirs' ),
						]
					);
			}

			return $query;
		};
		add_filter( 'query', $race );

		$this->assertFalse( $this->store->save_document_conditional( '{"a":"ours"}', $version, 'brand' ) );
		$this->assertSame( '{"a":"theirs"}', $this->store->get_document( 'brand' ) );
	}

	/**
	 * A conditional first write that loses a race to another first write drops the remembered missing row,
	 * so the next read shows the row that won.
	 *
	 * @return void
	 */
	public function testAConditionalFirstWriteThatLosesARaceReadsBackTheWinningRow(): void {
		$this->assertFalse( $this->store->exists( 'brand' ) );
		$this->insert_first_during_the_next_insert( 'brand', 'Theirs' );

		$this->assertFalse( $this->store->save_document_conditional( '{"a":"ours"}', '', 'brand' ) );
		$this->assertTrue( $this->store->exists( 'brand' ) );
		$this->assertSame( '{"a":"theirs"}', $this->store->get_document( 'brand' ) );
	}

	/**
	 * Naming the default library while another request creates its row drops the remembered missing row,
	 * so the next read shows the row that won.
	 *
	 * @return void
	 */
	public function testNamingTheDefaultLibraryThatLosesARaceReadsBackTheWinningRow(): void {
		$this->assertSame( '', $this->store->get_title() );
		$this->insert_first_during_the_next_insert( Token_Store::default_slug(), 'Theirs' );

		$this->assertFalse( $this->store->save_title( Token_Store::default_slug(), 'Ours' ) );
		$this->assertSame( 'Theirs', $this->store->get_title() );
	}

	/**
	 * Naming the default library, and renaming it, are each read back.
	 *
	 * @return void
	 */
	public function testTitleSavesAreReadBack(): void {
		$this->assertSame( '', $this->store->get_title() );

		$this->assertTrue( $this->store->save_title( Token_Store::default_slug(), 'Main' ) );
		$this->assertSame( 'Main', $this->store->get_title() );

		$this->assertTrue( $this->store->save_title( Token_Store::default_slug(), 'Renamed' ) );
		$this->assertSame( 'Renamed', $this->store->get_title() );
	}

	/**
	 * A version bump is read back.
	 *
	 * @return void
	 */
	public function testAVersionBumpIsReadBack(): void {
		$this->store->save_document( '{"a":1}', 'brand' );
		$version = $this->store->get_version( 'brand' );

		$this->store->bump_version( 'brand' );

		$this->assertNotSame( $version, $this->store->get_version( 'brand' ) );
	}

	/**
	 * A deleted library, removed outright or conditionally, reads back as missing.
	 *
	 * @return void
	 */
	public function testDeletesAreReadBack(): void {
		$this->store->save_document( '{"a":1}', 'brand-a' );
		$this->store->save_document( '{"b":1}', 'brand-b' );
		$this->assertTrue( $this->store->exists( 'brand-a' ) );
		$this->assertTrue( $this->store->exists( 'brand-b' ) );

		$this->store->delete( 'brand-a' );
		$this->assertTrue( $this->store->delete_document_conditional( 'brand-b', $this->store->get_version( 'brand-b' ) ) );

		$this->assertFalse( $this->store->exists( 'brand-a' ) );
		$this->assertSame( '', $this->store->get_document( 'brand-a' ) );
		$this->assertFalse( $this->store->exists( 'brand-b' ) );
		$this->assertSame( '', $this->store->get_document( 'brand-b' ) );
	}

	/**
	 * Deleting the default library resets it to baseline, which is read back as an empty document.
	 *
	 * @return void
	 */
	public function testResettingTheDefaultLibraryIsReadBack(): void {
		$this->store->save_document( '{"a":1}' );
		$this->assertSame( '{"a":1}', $this->store->get_document() );

		$this->store->delete();

		$this->assertSame( '', $this->store->get_document() );
	}

	/**
	 * A listener of the changed action reads the row that was just written, for every write that signals
	 * a change.
	 *
	 * @return void
	 */
	public function testChangedListenersReadTheNewRow(): void {
		$seen = [];
		add_action(
			Token_Store::changed_action(),
			function ( string $slug ) use ( &$seen ): void {
				$seen[] = $this->store->get_document( $slug ) . '@' . $this->store->get_version( $slug );
			}
		);

		$this->store->get_document( 'brand' );
		$this->store->save_document( '{"a":1}', 'brand' );
		$this->assertSame( '{"a":1}@' . $this->store->get_version( 'brand' ), end( $seen ) );

		$this->store->save_document_conditional( '{"a":2}', $this->store->get_version( 'brand' ), 'brand' );
		$this->assertSame( '{"a":2}@' . $this->store->get_version( 'brand' ), end( $seen ) );

		$this->store->bump_version( 'brand' );
		$this->assertSame( '{"a":2}@' . $this->store->get_version( 'brand' ), end( $seen ) );
		$this->assertCount( 3, array_unique( $seen ) );
	}

	/**
	 * A listener of the deleted action reads the library as missing.
	 *
	 * @return void
	 */
	public function testDeletedListenersReadTheLibraryAsMissing(): void {
		$this->store->save_document( '{"a":1}', 'brand' );
		$this->assertTrue( $this->store->exists( 'brand' ) );

		$exists = null;
		add_action(
			Token_Store::deleted_action(),
			function ( string $slug ) use ( &$exists ): void {
				$exists = $this->store->exists( $slug );
			}
		);

		$this->store->delete( 'brand' );

		$this->assertFalse( $exists );
	}

	/**
	 * With no active library ever set, resolving the active library falls back to the default without
	 * reading the table.
	 *
	 * @return void
	 */
	public function testAnUnsetActiveLibraryResolvesWithoutReadingTheTable(): void {
		delete_option( 'kadence_blocks_design_tokens_active_library' );
		$active = $this->container->get( Active_Token_Library_Store::class );

		$reads = $this->count_reads(
			function () use ( $active ): void {
				$this->assertSame( Token_Store::default_slug(), $active->get() );
			}
		);

		$this->assertSame( 0, $reads );
	}

	/**
	 * Forgets everything this request read, as a new request would. A save's listeners read the row
	 * back, so without this the rows saved during setup are already remembered.
	 *
	 * @return void
	 */
	private function start_a_new_request(): void {
		wp_cache_flush();
	}

	/**
	 * Makes the next insert into the token library table lose a race: another request's row for the slug
	 * is inserted just before it, so it fails on the duplicate slug.
	 *
	 * @param string $slug  The token library slug.
	 * @param string $title The winning row's title.
	 *
	 * @return void
	 */
	private function insert_first_during_the_next_insert( string $slug, string $title ): void {
		global $wpdb;

		$table = $wpdb->prefix . Token_Table::table_name( false );
		$race  = static function ( $query ) use ( $table, $slug, $title, &$race ) {
			if ( is_string( $query ) && preg_match( '/^\s*INSERT\s+INTO\s+`?' . preg_quote( $table, '/' ) . '`?\s/i', $query ) ) {
				remove_filter( 'query', $race );
				DB::table( Token_Table::table_name( false ) )->insert(
					[
						'slug'       => $slug,
						'document'   => '{"a":"theirs"}',
						'version'    => md5( 'theirs' ),
						'updated_at' => current_time( 'mysql', true ),
						'title'      => $title,
					]
				);
			}

			return $query;
		};

		add_filter( 'query', $race );
	}

	/**
	 * Runs a callback and counts the queries it sends that read the token library table.
	 *
	 * @param callable $callback The code to run.
	 *
	 * @return int The number of reads.
	 */
	private function count_reads( callable $callback ): int {
		global $wpdb;

		$table  = $wpdb->prefix . Token_Table::table_name( false );
		$reads  = 0;
		$filter = static function ( $query ) use ( $table, &$reads ) {
			if ( is_string( $query ) && preg_match( '/^\s*SELECT\b.*\bFROM\s+`?' . preg_quote( $table, '/' ) . '`?(\s|$)/is', $query ) ) {
				++$reads;
			}

			return $query;
		};

		add_filter( 'query', $filter );

		try {
			$callback();
		} finally {
			remove_filter( 'query', $filter );
		}

		return $reads;
	}
}
