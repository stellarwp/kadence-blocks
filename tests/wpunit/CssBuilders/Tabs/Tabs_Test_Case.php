<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Tabs;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Tabs_Gap;
use Kadence_Blocks_Tabs_Layouts;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Tabs CSS sections.
 */
abstract class Tabs_Test_Case extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/tabs/loader.php';
	}

	/**
	 * Run a section the way the tabs run it: with the layouts and the gap derived.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_tabs( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.s' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->tabs_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a tabs section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function tabs_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'tabs',
			static function () {
				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			'abc',
			'abc',
			$context,
			array_merge( Kadence_Blocks_Tabs_Layouts::resolve( $attributes ), [ 'gap' => Kadence_Blocks_Tabs_Gap::resolve( $attributes ) ] )
		);
	}
}
