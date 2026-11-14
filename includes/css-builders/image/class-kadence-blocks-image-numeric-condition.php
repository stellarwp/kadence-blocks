<?php
/**
 * Whether an attribute stores a number.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Whether an attribute stores a number.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Numeric_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute.
	 */
	public function __construct( string $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Whether the attribute is saved and numeric.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$value = $input->attribute( $this->attribute );

		return isset( $value ) && is_numeric( $value );
	}
}
