<?php
/**
 * Writes the line height of a device: the old height first, then the one of the responsive list.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the line height of a device: the old height first, then the one of the responsive list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Line_Height_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the old height.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $old_attribute;

	/**
	 * The position of the device in the list.
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
	 * @param string $old_attribute The attribute that stores the old height.
	 * @param int    $index         The position of the device in the list.
	 */
	public function __construct( $old_attribute, $index ) {
		$this->old_attribute = $old_attribute;
		$this->index         = $index;
	}

	/**
	 * Write the line height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();
		$old = $input->attribute( $this->old_attribute );

		if ( ! empty( $old ) ) {
			$unit = $input->attribute( 'lineType' );
			$css->add_property( 'line-height', $old . ( empty( $unit ) ? 'px' : $unit ) );

			return;
		}

		$height = $input->item( 'fontHeight', $this->index );

		if ( ! empty( $height ) ) {
			$unit = $input->attribute( 'fontHeightType' );
			$css->add_property( 'line-height', $height . ( empty( $unit ) ? '' : $unit ) );
		}
	}
}
