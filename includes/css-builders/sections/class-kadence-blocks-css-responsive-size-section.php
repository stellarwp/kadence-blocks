<?php
/**
 * Writes a size that has one setting for every device, with its unit.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a size that has one setting for every device, with its unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Responsive_Size_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that store the size of desktop, tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $names;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the unit, or empty for the one named after the desktop attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string[] $names          The attributes that store the size of desktop, tablet and mobile.
	 * @param string   $property       The CSS property.
	 * @param string   $unit_attribute The attribute that stores the unit, or empty for the one named after the desktop attribute.
	 */
	public function __construct( $names, $property, $unit_attribute ) {
		$this->names          = $names;
		$this->property       = $property;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->render_responsive_size( $input->attributes(), $this->names, $this->property, $this->unit_attribute );
	}
}
