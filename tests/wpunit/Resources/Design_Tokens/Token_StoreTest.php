<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens;

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
