<?php
/**
 * Writes the font size and the line height of a font on desktop.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the font size and the line height of a font on desktop.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Font_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the sizes.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $size;

	/**
	 * The attribute that stores the unit of the sizes.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $size_unit;

	/**
	 * The attribute that stores the unit of the line heights.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $line_unit;

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
	 * @param string $size      The attribute that stores the sizes.
	 * @param string $size_unit The attribute that stores the unit of the sizes.
	 * @param string $line_unit The attribute that stores the unit of the line heights.
	 * @param bool   $by_empty  Whether a unit that is empty counts as pixels, or only a unit that was never saved.
	 */
	public function __construct( $size, $size_unit, $line_unit, $by_empty ) {
		$this->size      = $size;
		$this->size_unit = $size_unit;
		$this->line_unit = $line_unit;
		$this->by_empty  = $by_empty;
	}

	/**
	 * Write the sizes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css  = $input->css();
		$size = $input->item( $this->size, 0 );
		$line = $input->attribute( 'lineHeight' );

		if ( ! empty( $size ) ) {
			$css->add_property( 'font-size', $css->get_font_size( $size, $this->unit( $input, $this->size_unit ) ) );
		}

		if ( is_array( $line ) && is_numeric( $line[0] ?? null ) ) {
			$css->add_property( 'line-height', $line[0] . $this->unit( $input, $this->line_unit ) );
		}
	}

	/**
	 * The unit of a size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input     What the section needs to write its CSS.
	 * @param string                         $attribute The attribute that stores the unit.
	 *
	 * @return string
	 */
	private function unit( Kadence_Blocks_Css_Build_Input $input, $attribute ) {
		if ( $this->by_empty ) {
			return $input->attribute( $attribute ) ?: 'px';
		}

		return $input->attribute( $attribute, 'px' );
	}
}
