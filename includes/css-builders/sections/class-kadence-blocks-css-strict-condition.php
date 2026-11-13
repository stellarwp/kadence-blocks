<?php
/**
 * A condition on one attribute.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-css-input-condition.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';

/**
 * Tells whether an attribute is exactly one value.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Strict_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The value it has to be.
	 *
	 * @since TBD
	 *
	 * @var mixed
	 */
	private $value;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute.
	 * @param mixed  $value     The value it has to be.
	 */
	public function __construct( $attribute, $value ) {
		$this->attribute = $attribute;
		$this->value     = $value;
	}

	/**
	 * Whether the attribute is exactly the value.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return $this->value === $input->attribute( $this->attribute );
	}
}
