<?php
/**
 * Tells whether any of some attributes has a value.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether any of some attributes has a value.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Filled_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attributes.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $attributes;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param array $attributes The attributes.
	 */
	public function __construct( array $attributes ) {
		$this->attributes = $attributes;
	}

	/**
	 * Whether any attribute is not empty.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->attributes as $attribute ) {
			if ( ! empty( $input->attribute( $attribute ) ) ) {
				return true;
			}
		}

		return false;
	}
}
