<?php
/**
 * Advanced Buttons buttons.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the CSS of every saved button of the group.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Buttons_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the CSS of the buttons.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$buttons = $input->attribute( 'btns' );

		if ( ! is_array( $buttons ) ) {
			return;
		}

		foreach ( $buttons as $key => $button ) {
			$this->write_button( $input, $key, $button );
		}
	}

	/**
	 * Write the CSS of one button, when it was saved as a list of settings.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param int|string                     $key    The position of the button.
	 * @param mixed                          $button The saved button.
	 *
	 * @return void
	 */
	private function write_button( Kadence_Blocks_Css_Build_Input $input, $key, $button ): void {
		if ( ! is_array( $button ) ) {
			return;
		}

		$button_input = new Kadence_Blocks_Css_Build_Input(
			$button,
			$input->css(),
			$input->unique_id(),
			$input->unique_style_id(),
			$input->context(),
			[
				'key'        => $key,
				'width_type' => $input->attribute( 'widthType' ),
			]
		);

		( new Kadence_Blocks_Advancedbtn_Button_Css() )->write( $button_input );
	}
}
