<?php
/**
 * Sizes the checkbox of the accept field after the line height of the label.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-form-selector.php';

/**
 * Sizes the checkbox of the accept field after the line height of the label.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Checkbox_Style_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The position of the device.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Whether a unit that is empty counts as pixels, or only a unit that was never saved.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $by_empty;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int  $index    The position of the device.
	 * @param bool $by_empty Whether a unit that is empty counts as pixels, or only a unit that was never saved.
	 */
	public function __construct( $index, $by_empty ) {
		$this->index    = $index;
		$this->by_empty = $by_empty;
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
		$line = $input->item( 'lineHeight', $this->index );

		if ( empty( $line ) ) {
			return;
		}

		$css  = $input->css();
		$unit = $this->by_empty ? ( $input->attribute( 'lineType' ) ?: 'px' ) : $input->attribute( 'lineType', 'px' );

		Kadence_Blocks_Form_Selector::set( $input, '.kadence-form-{id} .kb-form .kadence-blocks-form-field.kb-accept-form-field .kb-checkbox-style' );
		$css->add_property( 'font-size', $css->get_font_size( $line, $unit ) );
		$css->add_property( 'height', '1em' );
		$css->add_property( 'margin-top', '0' );
	}
}
