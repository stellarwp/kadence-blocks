<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Accordion;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Accordion CSS sections.
 */
abstract class Accordion_Test_Case extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/accordion/loader.php';
	}

	/**
	 * Run a section the way the accordion runs it inside the styles of the pane titles.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_accordion( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.s' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->accordion_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of an accordion section, with the styles of the pane titles derived when there are some.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function accordion_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'accordion',
			static function () {
				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context, [ 'title_styles' => $attributes['titleStyles'][0] ?? [] ] );
	}
}
