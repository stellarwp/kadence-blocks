<?php
/**
 * Writes the color of the icon of a pane title for one state.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the color of the icon of a pane title for one state.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Icon_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The state of the icon color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $state;

	/**
	 * The attribute of the title that stores the color to fall back to.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $title_key;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $state     The state of the icon color.
	 * @param string $title_key The attribute of the title that stores the color to fall back to.
	 */
	public function __construct( $state, $title_key ) {
		$this->state     = $state;
		$this->title_key = $title_key;
	}

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		if ( ! empty( $input->item( 'iconColor', $this->state ) ) ) {
			$css->render_color_output( $input->attribute( 'iconColor' ), $this->state, 'background' );
			return;
		}

		$title_styles = $input->derived( 'title_styles' );

		if ( ! empty( $title_styles[ $this->title_key ] ) ) {
			$css->render_color_output( $title_styles, $this->title_key, 'background' );
		}
	}
}
