<?php
/**
 * Tells whether a scrolling gallery has one value of an attribute.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advancedgallery-type-condition.php';

/**
 * Tells whether a scrolling gallery has one value of an attribute.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Carousel_Style_Condition implements Kadence_Blocks_Css_Input_Condition {

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
	 * @var string
	 */
	private $value;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute.
	 * @param string $value     The value it has to be.
	 */
	public function __construct( $attribute, $value ) {
		$this->attribute = $attribute;
		$this->value     = $value;
	}

	/**
	 * Whether the gallery scrolls and the attribute is exactly the value.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return Kadence_Blocks_Advancedgallery_Type_Condition::carousel()->is_met( $input ) && $this->value === $input->attribute( $this->attribute );
	}
}
