<?php
/**
 * Writes the four corners of a legacy border radius.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the four corners of a legacy border radius.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Border_Radius_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the corners.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The unit of the corners.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the corners.
	 * @param string $unit      The unit of the corners.
	 */
	public function __construct( $attribute, $unit ) {
		$this->attribute = $attribute;
		$this->unit      = $unit;
	}

	/**
	 * Write the corners.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_border_radius( $input->attributes(), $this->attribute, $this->unit );
	}
}
