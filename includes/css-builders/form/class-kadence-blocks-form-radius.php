<?php
/**
 * Writes the border radius.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the border radius.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Radius_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the radius.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Whether the radius has to be a number, or only has to be saved.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $numbers_only;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute    The attribute that stores the radius.
	 * @param bool   $numbers_only Whether the radius has to be a number, or only has to be saved.
	 */
	public function __construct( $attribute, $numbers_only ) {
		$this->attribute    = $attribute;
		$this->numbers_only = $numbers_only;
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
		$writer = new Kadence_Blocks_Css_Writer( $input->css() );
		$radius = $input->attribute( $this->attribute );

		if ( $this->numbers_only ) {
			$writer->numeric_with_unit( 'border-radius', $radius, 'px' );
			return;
		}

		$writer->not_empty_with_unit( 'border-radius', $radius, 'px' );
	}
}
