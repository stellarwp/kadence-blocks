<?php
/**
 * Writes one side of the padding or of the margin of the block on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes one side of the padding or of the margin of the block on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Wrapper_Side_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the sides.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The index of the side.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The name of the derived unit.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * Whether the value is made usable by the block, or only given its unit.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $usable;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the sides.
	 * @param int    $index     The index of the side.
	 * @param string $property  The CSS property.
	 * @param string $unit      The name of the derived unit.
	 * @param bool   $usable    Whether the value is made usable by the block, or only given its unit.
	 */
	public function __construct( $attribute, $index, $property, $unit, $usable ) {
		$this->attribute = $attribute;
		$this->index     = $index;
		$this->property  = $property;
		$this->unit      = $unit;
		$this->usable    = $usable;
	}

	/**
	 * Write the side.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$value = $input->item( $this->attribute, $this->index );

		if ( null === $value ) {
			return;
		}

		$css  = $input->css();
		$unit = $input->derived( $this->unit );

		$css->add_property( $this->property, $this->usable ? $input->context()->call( 'get_usable_value', $css, $value, $unit ) : $value . $unit );
	}
}
