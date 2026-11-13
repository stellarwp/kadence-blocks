<?php
/**
 * Tells whether a shadow switched on in the editor has something to show.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether a shadow switched on in the editor has something to show.
 *
 * @since TBD
 */
final class Kadence_Blocks_Singlebtn_Visible_Shadow_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that switches the shadow on.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $display;

	/**
	 * The attribute that stores the shadow.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $shadow;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $display The attribute that switches the shadow on.
	 * @param string $shadow  The attribute that stores the shadow.
	 */
	public function __construct( $display, $shadow ) {
		$this->display = $display;
		$this->shadow  = $shadow;
	}

	/**
	 * Whether the shadow is switched on, saved and visible.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		if ( empty( $input->attribute( $this->display ) ) ) {
			return false;
		}

		$shadow = $this->shadow( $input );

		return is_array( $shadow ) && $input->context()->call( 'has_visible_shadow', $shadow );
	}

	/**
	 * The first saved shadow.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	public function shadow( Kadence_Blocks_Css_Build_Input $input ) {
		return $input->item( $this->shadow, 0 );
	}
}
