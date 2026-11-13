<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Spacer;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Spacer_Width_Units;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Spacer CSS sections.
 */
abstract class Spacer_Test_Case extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/spacer/loader.php';
	}

	/**
	 * Run a section the way the spacer runs it: with the unit of the width of the divider derived.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_spacer( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.s' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->spacer_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a spacer section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function spacer_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'spacer',
			static function () {
				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context, [ 'width_units' => Kadence_Blocks_Spacer_Width_Units::resolve( $attributes ) ] );
	}
}
