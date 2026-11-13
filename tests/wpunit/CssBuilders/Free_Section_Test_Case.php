<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\Support\Classes\Css_Normalizer;
use Tests\Support\Classes\TestCase;

/**
 * Shared helpers for tests of the CSS section classes.
 */
abstract class Free_Section_Test_Case extends TestCase {

	/**
	 * Run a section with the given attributes and return the CSS it wrote.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $unique_id  The block unique id.
	 * @param string|null                $selector   A selector to set first, for sections that never set their own.
	 *
	 * @return string
	 */
	protected function write_section( Kadence_Blocks_Css_Section $section, array $attributes, string $unique_id = 'abc', ?string $selector = null ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );

		if ( null !== $selector ) {
			$css->set_selector( $selector );
		}

		$section->write( $this->input( $attributes, $css, $unique_id ) );

		return $css->css_output();
	}

	/**
	 * Assert two stylesheets mean the same thing: the same final property values for every media query and selector.
	 *
	 * Rule order, how a selector's declarations are split across blocks and repeated declarations do not matter.
	 *
	 * @param string $expected The expected CSS.
	 * @param string $actual   The CSS written.
	 *
	 * @return void
	 */
	protected function assertSameCss( string $expected, string $actual ): void {
		$normalizer = new Css_Normalizer();

		$this->assertSame( $normalizer->normalize( $expected ), $normalizer->normalize( $actual ) );
	}

	/**
	 * Build the input a section receives.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 * @param string               $unique_id  The block unique id.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function input( array $attributes, Kadence_Blocks_CSS $css, string $unique_id = 'abc' ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'section-test',
			static function () {
				return null;
			} 
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, $unique_id, $unique_id, $context );
	}
}
