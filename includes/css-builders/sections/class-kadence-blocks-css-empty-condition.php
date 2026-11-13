<?php
/**
 * Whether an attribute is empty.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-css-input-condition.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';

/**
 * Whether an attribute is empty.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Empty_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute to check.
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
	 * @param string $attribute The attribute to check.
	 */
	public function __construct( $attribute ) {
		$this->attribute = $attribute;
	}

	/**
	 * Whether the condition is met.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return empty( $input->attribute( $this->attribute ) );
	}
}
