<?php
/**
 * Writes padding and margin lists.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the four sides of padding or margin when they are saved as a list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Spacing_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property, `padding` or `margin`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the four values.
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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $property       The CSS property.
	 * @param string $attribute      The attribute that stores the four values.
	 * @param string $unit_attribute The attribute that stores the unit.
	 */
	public function __construct( $property, $attribute, $unit_attribute ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$values = $input->attribute( $this->attribute );

		if ( ! is_array( $values ) ) {
			return;
		}

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_sides( $this->property, $values, $input->attribute( $this->unit_attribute ) ?: 'px' );
	}
}
