<?php
/**
 * Limits the width of the popup video.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Limits the width of the popup video.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Popup_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the width.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Whether the value carries `!important`.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $important;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the width.
	 * @param bool   $important Whether the value carries `!important`.
	 */
	public function __construct( $attribute, $important ) {
		$this->attribute = $attribute;
		$this->important = $important;
	}

	/**
	 * Write the maximum width, with the unit stored or pixels.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$unit = $input->attribute( 'maxWidthUnit' );

		$input->css()->add_property( 'max-width', $input->attribute( $this->attribute ) . ( $unit ? $unit : 'px' ) . ( $this->important ? ' !important' : '' ) );
	}
}
