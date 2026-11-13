<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Videopopup;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Videopopup_Environment;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the video popup CSS sections.
 */
abstract class Videopopup_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-videopopup-css.php';
	}

	/**
	 * Run a section the way the video popup runs it, and return the CSS it wrote.
	 *
	 * @param Kadence_Blocks_Css_Section                  $section     The section under test.
	 * @param array<string, mixed>                        $attributes  The block attributes.
	 * @param string                                      $selector    The selector that is current when the section runs.
	 * @param Kadence_Blocks_Videopopup_Environment|null  $environment The site the section runs on.
	 *
	 * @return string
	 */
	protected function write_popup( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '', ?Kadence_Blocks_Videopopup_Environment $environment = null ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->popup_input( $attributes, $css, $environment ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a video popup section.
	 *
	 * @param array<string, mixed>                        $attributes  The block attributes.
	 * @param Kadence_Blocks_CSS                          $css         The CSS builder.
	 * @param Kadence_Blocks_Videopopup_Environment|null  $environment The site the section runs on.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function popup_input( array $attributes, Kadence_Blocks_CSS $css, ?Kadence_Blocks_Videopopup_Environment $environment = null ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'videopopup',
			function () {
				$this->calls[] = func_get_args();

				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context, [ 'environment' => $environment ] );
	}
}
