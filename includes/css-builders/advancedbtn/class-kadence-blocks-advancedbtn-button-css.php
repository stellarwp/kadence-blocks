<?php
/**
 * Advanced Buttons button.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the CSS of one saved button by running its sections one after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedbtn_Button_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the CSS of the button.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}
	}

	/**
	 * The sections of one button, in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function sections(): array {
		return array_merge( $this->surface_sections(), $this->state_sections(), $this->device_sections() );
	}

	/**
	 * The sections of the normal look of the button.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function surface_sections(): array {
		return [
			new Kadence_Blocks_Advancedbtn_Button_Assets_Css(),
			new Kadence_Blocks_Advancedbtn_Button_Gap_Css(),
			new Kadence_Blocks_Advancedbtn_Button_Selector_Css( '.wp-block-kadence-advancedbtn.kt-btns{id} .kt-btn-wrap-{key} .kt-button' ),
			new Kadence_Blocks_Advancedbtn_Button_Size_Css(),
			new Kadence_Blocks_Advancedbtn_Button_Background_Css(),
			new Kadence_Blocks_Advancedbtn_Button_Border_Css(),
			new Kadence_Blocks_Css_Legacy_Shadow_Section(
				'boxShadow',
				[
					'hOffset' => '1',
					'vOffset' => '1',
					'blur'    => '2',
					'spread'  => '0',
					'color'   => '#000000',
					'opacity' => 0.2,
				],
				null 
			),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', [ 'unit_key' => 'marginUnit' ] ),
		];
	}

	/**
	 * The sections of the hover state of the button.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function state_sections(): array {
		return [ new Kadence_Blocks_Advancedbtn_Button_Hover_Css() ];
	}

	/**
	 * The sections of the tablet and mobile look of the button, and its icon.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function device_sections(): array {
		return [
			new Kadence_Blocks_Advancedbtn_Button_Device_Css( 'tablet', 0, 0 ),
			new Kadence_Blocks_Advancedbtn_Button_Device_Css( 'mobile', 1, 1 ),
			new Kadence_Blocks_Advancedbtn_Button_Icon_Css(),
		];
	}
}
