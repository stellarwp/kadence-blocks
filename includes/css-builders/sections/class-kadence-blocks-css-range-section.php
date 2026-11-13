<?php
/**
 * Range section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a range attribute as a size with a unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Range_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the range.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The CSS property to write.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The unit of the range.
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
	 * @param string $attribute The attribute that stores the range.
	 * @param string $property  The CSS property to write.
	 * @param string $unit      The unit of the range.
	 */
	public function __construct( $attribute, $property, $unit ) {
		$this->attribute = $attribute;
		$this->property  = $property;
		$this->unit      = $unit;
	}

	/**
	 * Write the range.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_range( $input->attributes(), $this->attribute, $this->property, $this->unit );
	}
}
