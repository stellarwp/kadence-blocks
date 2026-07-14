<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Variant;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Variant\Style;
use Tests\Support\Classes\TestCase;

/**
 * Guards the variant class shape the editor adds and the projector targets, so the "kb-variant--<variant>"
 * class can never drift from the selector the CSS hooks.
 */
final class StyleTest extends TestCase {

	/**
	 * A variant keeps the "kb-variant--<variant>" shape.
	 *
	 * @return void
	 */
	public function testVariantClass(): void {
		$this->assertSame( 'kb-variant--secondary', Style::variant_class( 'secondary' ) );
	}

	/**
	 * The variant slug is sanitized, so a stray character cannot break the class shape.
	 *
	 * @dataProvider unsafeSegmentProvider
	 *
	 * @param string $variant  The raw variant slug.
	 * @param string $expected The sanitized class.
	 *
	 * @return void
	 */
	public function testItSanitizesTheVariantSlug( string $variant, string $expected ): void {
		$this->assertSame( $expected, Style::variant_class( $variant ) );
	}

	/**
	 * @return Generator
	 */
	public function unsafeSegmentProvider(): Generator {
		yield 'space in variant' => [
			'variant'  => 'sea green',
			'expected' => 'kb-variant--sea-green',
		];
		yield 'slash in variant' => [
			'variant'  => 'a/b',
			'expected' => 'kb-variant--a-b',
		];
	}
}
