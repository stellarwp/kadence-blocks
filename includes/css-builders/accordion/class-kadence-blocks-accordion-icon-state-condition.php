<?php
/**
 * Whether the icon of a pane title has a color for one state.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the icon of a pane title has a color for one state.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Icon_State_Condition implements Kadence_Blocks_Css_Input_Condition {

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
	 * The icon or the title has a color for the state.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$title_styles = $input->derived( 'title_styles' );

		return ! empty( $input->item( 'iconColor', $this->state ) ) || ! empty( $title_styles[ $this->title_key ] );
	}
}
