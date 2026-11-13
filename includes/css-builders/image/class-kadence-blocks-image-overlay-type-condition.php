<?php
/**
 * Whether the overlay is of a type.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether the overlay is of a type.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Overlay_Type_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The overlay type.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $type;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string $type The overlay type.
	 */
	public function __construct( string $type ) {
		$this->type = $type;
	}

	/**
	 * Whether the overlay type, normal when none is saved, loosely equals the type.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$saved = $input->attribute( 'overlayType' );
		$type  = ! empty( $saved ) ? $saved : 'normal';

		return $this->type == $type; // phpcs:ignore Universal.Operators.StrictComparisons.LooseEqual
	}
}
