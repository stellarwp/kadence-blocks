<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Style;
use Tests\Support\Classes\TestCase;

/**
 * Guards the variant class shapes the editor adds and the projector targets, so the flat single-axis class
 * and the grouped multi-axis class can never drift from the selector the CSS hooks.
 */
final class StyleTest extends TestCase {

	/**
	 * A flat block's variant keeps the single-segment "kb-variant--<variant>" shape.
	 *
	 * @return void
	 */
	public function testFlatVariantClass(): void {
		$this->assertSame( 'kb-variant--secondary', Style::variant_class( 'secondary' ) );
	}

	/**
	 * A grouped selection carries the group: "kb-variant--<group>--<variant>".
	 *
	 * @return void
	 */
	public function testGroupedVariantClass(): void {
		$this->assertSame( 'kb-variant--emphasis--outline', Style::group_variant_class( 'emphasis', 'outline' ) );
	}

	/**
	 * Each segment is sanitized independently, so a stray character in the group or variant cannot merge the
	 * two across the "--" delimiter.
	 *
	 * @dataProvider unsafeSegmentProvider
	 *
	 * @param string $group    The raw group slug.
	 * @param string $variant  The raw variant slug.
	 * @param string $expected The sanitized class.
	 *
	 * @return void
	 */
	public function testItSanitizesEachSegmentIndependently( string $group, string $variant, string $expected ): void {
		$this->assertSame( $expected, Style::group_variant_class( $group, $variant ) );
	}

	/**
	 * @return Generator
	 */
	public function unsafeSegmentProvider(): Generator {
		yield 'space in variant' => [
			'group'    => 'color',
			'variant'  => 'sea green',
			'expected' => 'kb-variant--color--sea-green',
		];
		yield 'slash in group' => [
			'group'    => 'a/b',
			'variant'  => 'x',
			'expected' => 'kb-variant--a-b--x',
		];
	}
}
