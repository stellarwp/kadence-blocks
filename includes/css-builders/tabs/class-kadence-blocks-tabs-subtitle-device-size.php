<?php
/**
 * Writes the size or the line height of the subtitle on a device. It runs on the settings of the subtitle font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the size or the line height of the subtitle on a device. It runs on the settings of the
 * subtitle font.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Subtitle_Device_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the sizes.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The attribute that stores the unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit_attribute;

	/**
	 * The position of the device: 1 tablet, 2 mobile.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property       The CSS property.
	 * @param string $attribute      The attribute that stores the sizes.
	 * @param string $unit_attribute The attribute that stores the unit.
	 * @param int    $index          The position of the device: 1 tablet, 2 mobile.
	 */
	public function __construct( $property, $attribute, $unit_attribute, $index ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->unit_attribute = $unit_attribute;
		$this->index          = $index;
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
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( $this->property, $input->item( $this->attribute, $this->index ), $input->attribute( $this->unit_attribute, 'px' ) );
	}
}
