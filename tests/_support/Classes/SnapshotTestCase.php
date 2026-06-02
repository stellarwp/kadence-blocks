<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use Codeception\TestCase\WPTestCase;
use Spatie\Snapshots;
use Spatie\Snapshots\MatchesSnapshots;

/**
 * Base test case for snapshot tests.
 *
 * Boots WordPress (via the `snapshot` Codeception suite) and asserts generated output
 * against stored snapshots in sibling `__snapshots__/` directories. Run with
 * `slic run snapshot --debug` to (re)generate snapshots.
 */
class SnapshotTestCase extends WPTestCase {

	/*
	 * Alias the trait's JSON assertion so the original implementation stays callable from
	 * within our override below ( `parent::` cannot reach a trait method ).
	 */
	use MatchesSnapshots {
		assertMatchesJsonSnapshot as protected spatieAssertMatchesJsonSnapshot;
	}

	/**
	 * Assert that a value matches its stored JSON snapshot.
	 *
	 * Overrides Spatie\Snapshots\MatchesSnapshots::assertMatchesJsonSnapshot().
	 *
	 * The Spatie version expects a pre-serialized JSON string and its JSON driver
	 * decodes then re-encodes both sides before comparing; that round-trip is
	 * lossy -- e.g. an empty object {} is normalized to an empty array [] -- which
	 * fails an otherwise-identical document.
	 *
	 * For a non-string value this version encodes it to JSON once with
	 * JSON_PRETTY_PRINT and compares it as text, so structures like {} are preserved
	 * exactly. A string is assumed to be already-serialized JSON and is passed through to
	 * Spatie's original implementation ( via the aliased spatieAssertMatchesJsonSnapshot() ).
	 *
	 * @param mixed $data Data to snapshot. Non-strings are JSON-encoded; a string is
	 *                    treated as pre-serialized JSON and handled by Spatie.
	 *
	 * @return void
	 */
	public function assertMatchesJsonSnapshot( $data ): void {
		if ( is_string( $data ) ) {
			$this->spatieAssertMatchesJsonSnapshot( $data );

			return;
		}

		$this->assertMatchesSnapshot( wp_json_encode( $data, JSON_PRETTY_PRINT ) );
	}

	/**
	 * Fails the test if the snapshot does not already exist.
	 *
	 * Useful in scenarios where you may be using a Data Provider to generate snapshots and
	 * want to guard against a test silently passing because no snapshot was ever written.
	 *
	 * @param Snapshots\Driver|null $driver Snapshot driver. Must match the Driver used when
	 *                                      writing the snapshot for the correct file name to
	 *                                      be checked. Defaults to TextDriver.
	 *
	 * @return void
	 */
	protected function assertSnapshotExists( ?Snapshots\Driver $driver = null ): void {
		if ( ! $driver ) {
			$driver = new Snapshots\Drivers\TextDriver();
		}

		/*
		 * Increment the snapshot incrementor to ensure we are checking against the correct
		 * file name.
		 */
		++$this->snapshotIncrementor;

		$snapshot = Snapshots\Snapshot::forTestCase(
			$this->getSnapshotId(),
			$this->getSnapshotDirectory(),
			$driver
		);

		/*
		 * Decrement the snapshot incrementor so a snapshot can still be created with the
		 * expected file name afterwards. We have to do this due to how we create a separate
		 * Snapshot object above.
		 */
		--$this->snapshotIncrementor;

		if (
			! $snapshot->exists()
			&& ! $this->shouldUpdateSnapshots()
		) {
			$this->fail( 'A snapshot file does not exist for this test. Generate one with: slic run snapshot --debug' );
		}
	}
}
