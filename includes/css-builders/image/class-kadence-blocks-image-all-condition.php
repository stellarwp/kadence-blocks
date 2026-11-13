<?php
/**
 * Whether every condition of a list is met.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Whether every condition of a list is met.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_All_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The conditions.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Input_Condition[]
	 */
	private $conditions;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Input_Condition[] $conditions The conditions.
	 */
	public function __construct( array $conditions ) {
		$this->conditions = $conditions;
	}

	/**
	 * Whether every condition is met.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->conditions as $condition ) {
			if ( ! $condition->is_met( $input ) ) {
				return false;
			}
		}

		return true;
	}
}
