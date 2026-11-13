<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedgallery;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Advancedgallery_Settings;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Advancedgallery CSS sections.
 */
abstract class Advancedgallery_Test_Case extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedgallery/loader.php';
	}

	/**
	 * Run a section the way the gallery runs it: with the values derived from the attributes.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_gallery( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->gallery_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a gallery section.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function gallery_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'advancedgallery',
			static function () {
				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context, Kadence_Blocks_Advancedgallery_Settings::derive( $attributes ) );
	}
}
