<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Responsive_Attribute_Writer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\TestCase;

final class Responsive_Attribute_WriterTest extends TestCase {

	/**
	 * A responsive token fans into the indexed [desktop, tablet, mobile] array render_typography reads.
	 *
	 * @return void
	 */
	public function testItFansAResponsiveTokenIntoAnIndexedArray(): void {
		$writer = new Responsive_Attribute_Writer( $this->resolved() );

		$this->assertSame( [ '1.125rem', '1.0625rem', '1rem' ], $writer->indexed( 'semantic.font-size.control' ) );
	}

	/**
	 * A responsive token fans into the desktop / tablet<Attr> / mobile<Attr> sibling attributes
	 * render_measure_output reads.
	 *
	 * @return void
	 */
	public function testItFansAResponsiveTokenIntoSuffixedSiblings(): void {
		$writer = new Responsive_Attribute_Writer( $this->resolved() );

		$this->assertSame(
			[
				'padding'       => '1.125rem',
				'tabletPadding' => '1.0625rem',
				'mobilePadding' => '1rem',
			],
			$writer->siblings( 'semantic.font-size.control', 'padding' )
		);
	}

	/**
	 * A breakpoint with no override is left empty (not back-filled with desktop) so the block renderer
	 * inherits the desktop value there.
	 *
	 * @return void
	 */
	public function testAnAbsentBreakpointIsEmpty(): void {
		$resolved = new Resolved_Tokens(
			[ 'semantic.font-size.control' => '1.125rem' ],
			[],
			[],
			[],
			[],
			[ 'semantic.font-size.control' => [ 'mobile' => '1rem' ] ]
		);

		$writer = new Responsive_Attribute_Writer( $resolved );

		$this->assertSame( [ '1.125rem', '', '1rem' ], $writer->indexed( 'semantic.font-size.control' ) );
	}

	/**
	 * A flat token (no responsive overrides) fans into the desktop value with empty tablet / mobile slots.
	 *
	 * @return void
	 */
	public function testAFlatTokenHasEmptyBreakpoints(): void {
		$resolved = new Resolved_Tokens( [ 'semantic.radius.control' => '3px' ], [] );

		$writer = new Responsive_Attribute_Writer( $resolved );

		$this->assertSame( [ '3px', '', '' ], $writer->indexed( 'semantic.radius.control' ) );
	}

	/**
	 * A resolved-tokens fixture carrying a base value plus tablet / mobile literal overrides.
	 *
	 * @return Resolved_Tokens
	 */
	private function resolved(): Resolved_Tokens {
		return new Resolved_Tokens(
			[ 'semantic.font-size.control' => '1.125rem' ],
			[],
			[],
			[],
			[],
			[ 'semantic.font-size.control' => [ 'tablet' => '1.0625rem', 'mobile' => '1rem' ] ]
		);
	}
}
