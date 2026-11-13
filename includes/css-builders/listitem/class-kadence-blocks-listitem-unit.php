<?php
/**
 * Writes a value of the highlight with its unit, for one device or for all of them.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a value of the highlight with its unit, for one device or for all of them.
 *
 * @since TBD
 */
final class Kadence_Blocks_Listitem_Unit_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute that stores the value.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The position of the device in the attribute, or null when it is not a list.
	 *
	 * @since TBD
	 *
	 * @var int|null
	 */
	private $index;

	/**
	 * The attribute that stores the unit, or null for pixels.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $unit_attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $property       The CSS property.
	 * @param string      $attribute      The attribute that stores the value.
	 * @param int|null    $index          The position of the device in the attribute, or null when it is not a list.
	 * @param string|null $unit_attribute The attribute that stores the unit, or null for pixels.
	 */
	public function __construct( $property, $attribute, $index, $unit_attribute ) {
		$this->property       = $property;
		$this->attribute      = $attribute;
		$this->index          = $index;
		$this->unit_attribute = $unit_attribute;
	}

	/**
	 * Write the value.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$value = null === $this->index ? $input->attribute( $this->attribute ) : $input->item( $this->attribute, $this->index );
		$unit  = null === $this->unit_attribute ? 'px' : $input->attribute( $this->unit_attribute, 'px' );

		( new Kadence_Blocks_Css_Writer( $input->css() ) )->not_empty_with_unit( $this->property, $value, $unit );
	}
}
