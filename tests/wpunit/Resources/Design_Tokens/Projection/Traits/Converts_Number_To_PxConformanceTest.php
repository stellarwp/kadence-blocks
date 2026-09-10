<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Traits;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Converts_Number_To_Px;
use Tests\Support\Classes\TestCase;

/**
 * Proves the PHP length->pixel conversion stays identical to the JS one by asserting against the SAME
 * fixture the jest suite reads (never a forked copy). The two exist because `kadence/single-icon`'s
 * `size` reaches output twice: as a `font-size` declaration on the front end, resolved in PHP, and as
 * the SVG's `width`/`height` presentation attribute in the editor, resolved in JS. A drift in
 * `Converts_Number_To_Px::to_px()` here, or in `tokenPx()` on the JS side, would render an icon at one
 * size in the editor and another on the front end, and fails whichever suite still expects the old
 * number.
 *
 * @since TBD
 */
final class Converts_Number_To_PxConformanceTest extends TestCase {

	/**
	 * Every convertible length in the shared conformance fixture converts to the exact pixel number the
	 * jest suite also asserts for that entry, on the shared 16px root-font-size assumption.
	 *
	 * @dataProvider lengthProvider
	 *
	 * @param string $length The resolved CSS length, e.g. "1.5rem".
	 * @param float  $px     The expected pixel value.
	 *
	 * @return void
	 */
	public function testLengthsConvertToTheExpectedPixelValue( string $length, float $px ): void {
		$this->assertSame( $px, $this->converter()->to_px( $length ) );
	}

	/**
	 * Every unconvertible entry in the shared conformance fixture is declined, so a caller falls back to
	 * its own default rather than rendering a guessed number. Note this includes a UNITLESS value: a
	 * bare "0" is a valid CSS length but carries no unit to convert from, and neither language accepts
	 * it.
	 *
	 * @dataProvider unconvertibleProvider
	 *
	 * @param string $value A value the fixture asserts cannot be safely converted.
	 *
	 * @return void
	 */
	public function testUnconvertibleValuesAreDeclined( string $value ): void {
		$this->assertNull( $this->converter()->to_px( $value ) );
	}

	/**
	 * @return Generator
	 */
	public function lengthProvider(): Generator {
		foreach ( $this->load_fixture()['lengths'] as $entry ) {
			yield $entry['length'] => [
				'length' => $entry['length'],
				'px'     => (float) $entry['px'],
			];
		}
	}

	/**
	 * @return Generator
	 */
	public function unconvertibleProvider(): Generator {
		foreach ( $this->load_fixture()['unconvertible'] as $index => $value ) {
			yield sprintf( 'unconvertible[%d]: %s', $index, wp_json_encode( $value ) ) => [
				'value' => $value,
			];
		}
	}

	/**
	 * A throwaway consumer of the trait that exposes `to_px()` publicly. The trait's method is private,
	 * which is correct for its real consumers (the adapter and the editor-default catalog both call it
	 * on themselves) but leaves it unreachable from a test without a host class.
	 *
	 * @return object An object exposing a public to_px( string $length ): ?float.
	 */
	private function converter(): object {
		return new class() {
			// Visibility aliasing rather than a wrapper method: a public `to_px()` declared on the class
			// would OVERRIDE the trait's rather than expose it, and would then be testing the wrapper.
			use Converts_Number_To_Px {
				to_px as public;
			}
		};
	}

	/**
	 * The shared length/pixel conformance fixture, decoded. The SAME file the jest suite reads, so
	 * neither language can drift without both suites' data changing together.
	 *
	 * @return array{lengths: array<int, array{length: string, px: int|float}>, unconvertible: array<int, string>}
	 */
	private function load_fixture(): array {
		// phpcs:ignore WordPressVIPMinimum.Performance.FetchingRemoteData.FileGetContentsUnknown
		return (array) json_decode( (string) file_get_contents( $this->fixture_path() ), true );
	}

	/**
	 * Absolute path to the shared conformance fixture, derived from the plugin root so it resolves the
	 * same way regardless of which working directory slic runs the suite from.
	 *
	 * @return string
	 */
	private function fixture_path(): string {
		return KADENCE_BLOCKS_PATH . 'src/extension/design-tokens/__tests__/fixtures/length-to-px-conformance.json';
	}
}
