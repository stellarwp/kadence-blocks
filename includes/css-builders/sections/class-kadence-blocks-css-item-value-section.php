<?php
/**
 * Writes one item of a list attribute.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes a property when one item of a list attribute is not empty, such as the alignment of one device, followed by a unit when there is one.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Item_Value_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * The list attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The item to read.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * The unit appended to the item, or null to write it as it is stored.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $unit;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string      $property The CSS property.
	 * @param string      $attribute The list attribute.
	 * @param int         $index The item to read.
	 * @param string|null $unit The unit appended to the item, or null to write it as it is stored.
	 */
	public function __construct( string $property, string $attribute, int $index, ?string $unit = null ) {
		$this->property  = $property;
		$this->attribute = $attribute;
		$this->index     = $index;
		$this->unit      = $unit;
	}

	/**
	 * Write the property when the item is not empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$writer = new Kadence_Blocks_Css_Writer( $input->css() );
		$value  = $input->item( $this->attribute, $this->index );

		if ( null === $this->unit ) {
			$writer->not_empty( $this->property, $value );
			return;
		}

		$writer->not_empty_with_unit( $this->property, $value, $this->unit );
	}
}
