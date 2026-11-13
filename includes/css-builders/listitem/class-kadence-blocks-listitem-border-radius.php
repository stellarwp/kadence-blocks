<?php
/**
 * Writes the border radius of the highlight on a device, in the unit of the highlight.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border radius of the highlight on a device, in the unit of the highlight.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Border_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the radius.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the radius.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Write the radius.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$unit = $input->attribute( 'markBorderRadiusUnit' );

		$input->css()->render_border_radius( $input->attributes(), $this->attribute, ! empty( $unit ) ? $unit : 'px' );
	}
}
