<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Css_Button_Types;
use Kadence_Blocks_Css_Section;

/**
 * Shared helpers for tests of the CSS sections of the single button and the submit button.
 */
abstract class Button_Test_Case extends Free_Section_Test_Case {

	/**
	 * The calls the block was asked to make, in order.
	 *
	 * @var array<int, array<int, mixed>>
	 */
	protected $calls = [];

	protected function setUp(): void {
		parent::setUp();

		$this->calls = [];

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/singlebtn/loader.php';
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/submit/loader.php';
	}

	/**
	 * Run a section the way a button builder runs it: with the types derived from the attributes.
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $selector   The selector that is current when the section runs.
	 * @param array<string, mixed>       $answers    What the block answers to a call, by method name.
	 *
	 * @return string
	 */
	protected function write_button( Kadence_Blocks_Css_Section $section, array $attributes = [], string $selector = '.btn', array $answers = [] ): string {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( $selector );

		$section->write( $this->button_input( $attributes, $css, $answers ) );

		return $css->css_output();
	}

	/**
	 * Build the input of a button section and record what the block is asked.
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param Kadence_Blocks_CSS   $css        The CSS builder.
	 * @param array<string, mixed> $answers    What the block answers to a call, by method name.
	 *
	 * @return Kadence_Blocks_Css_Build_Input
	 */
	protected function button_input( array $attributes, Kadence_Blocks_CSS $css, array $answers = [] ): Kadence_Blocks_Css_Build_Input {
		$context = new Kadence_Blocks_Css_Block_Context(
			'button',
			function ( $member ) use ( $answers ) {
				$this->calls[] = func_get_args();

				return $answers[ $member ] ?? null;
			}
		);

		return new Kadence_Blocks_Css_Build_Input( $attributes, $css, 'abc', 'abc', $context, Kadence_Blocks_Css_Button_Types::derive( $attributes ) );
	}
}
