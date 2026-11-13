<?php
/**
 * Writes the font size of a device: the old size first, then the one of the responsive list.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size of a device: the old size first, then the one of the responsive list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the old size, if the device has one.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $old_attribute;

	/**
	 * The attribute that stores the size of every device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $list_attribute;

	/**
	 * The position of the device in the list.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The attribute that stores the unit.
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
	 * @param string|null $old_attribute  The attribute that stores the old size, if the device has one.
	 * @param string      $list_attribute The attribute that stores the size of every device.
	 * @param int         $index          The position of the device in the list.
	 * @param string      $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( $old_attribute, $list_attribute, $index, $unit_attribute ) {
		$this->old_attribute  = $old_attribute;
		$this->list_attribute = $list_attribute;
		$this->index          = $index;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the font size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css  = $input->css();
		$unit = $input->attribute( $this->unit_attribute, 'px' );
		$old  = null === $this->old_attribute ? null : $input->attribute( $this->old_attribute );

		if ( ! empty( $old ) ) {
			$css->add_property( 'font-size', $old . $unit );

			return;
		}

		$size = $input->item( $this->list_attribute, $this->index );

		if ( ! empty( $size ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $size, $unit ) );
		}
	}
}
