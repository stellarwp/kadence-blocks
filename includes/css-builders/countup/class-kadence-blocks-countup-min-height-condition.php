<?php
/**
 * Tells whether the title has a minimum height.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Tells whether an attribute is a list with a first item, as the minimum heights of the title are.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countup_Min_Height_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the object.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute.
	 */
	public function __construct( string $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Whether the attribute is a list with a first item.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return is_array( $input->attribute( $this->attribute ) ) && null !== $input->item( $this->attribute, 0 );
	}
}
