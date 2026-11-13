<?php
/**
 * Writes a numeric attribute with a unit.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a property when an attribute, or one item of a list attribute, is numeric, followed by a unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Numeric_Unit_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The unit appended to the number.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $unit;

	/**
	 * The item of the attribute to read, or null to read the attribute itself.
	 *
	 * @since TBD
	 *
	 * @var int|null
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string   $property The CSS property.
	 * @param string   $attribute The attribute.
	 * @param string   $unit The unit appended to the number.
	 * @param int|null $index The item of the attribute to read, or null to read the attribute itself.
	 */
	public function __construct( string $property, string $attribute, string $unit, ?int $index = null ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->unit      = $unit;
		$this->index     = $index;
	}

	/**
	 * Write the property when the value is numeric.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		( new Kadence_Blocks_Css_Writer( $input->css() ) )->numeric_with_unit( $this->property, $this->value( $input ), $this->unit );
	}

	/**
	 * The value to write.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	private function value( Kadence_Blocks_Css_Build_Input $input ) {
		if ( null === $this->index ) {
			return $input->attribute( $this->attribute );
		}

		return $input->item( $this->attribute, $this->index );
	}
}
