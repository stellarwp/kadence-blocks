<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Advancedheading;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Section;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared helpers for tests of the Advancedheading CSS sections.
 */
abstract class Advancedheading_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/advancedheading/loader.php';
	}

	/**
	 * Run a section the way the heading runs it: under a selector, with a block that records what it is asked.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return string
	 */
	protected function write_heading( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.heading' ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test-' . wp_generate_uuid4() );
		$css->set_selector( $selector );

		$section->write( $this->heading_input( $attributes, $css ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a heading section, with a block that records what it is asked.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function heading_input( array $attributes, Kadence_Blocks_CSS $css ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'advancedheading',
			function () {
				$this->calls[] = func_get_args();

				return null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context );
	}
}
