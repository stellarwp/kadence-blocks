<?php
/**
 * Tells whether the number has a font.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Tells whether the first item of an attribute is a list, as the font of the number is.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countup_Font_Condition implements Kadence_Blocks_Css_Input_Condition {

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
	 * Whether the first item of the attribute is a list.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return is_array( $input->item( $this->attribute, 0 ) );
	}
}
