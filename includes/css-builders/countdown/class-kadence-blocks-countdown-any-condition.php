<?php
/**
 * Tells whether any setting of a part of the block was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';

/**
 * Tells whether any of some attributes was saved or any of some other attributes is a list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Countdown_Any_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attributes that count when they are set.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $saved;

	/**
	 * The attributes that count when they are lists.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $lists;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param array $saved The attributes that count when they are set.
	 * @param array $lists The attributes that count when they are lists.
	 */
	public function __construct( array $saved, array $lists ) {
		$this->saved = $saved;
		$this->lists = $lists;
	}

	/**
	 * Whether any attribute was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->saved as $attribute ) {
			if ( null !== $input->attribute( $attribute ) ) {
				return true;
			}
		}

		foreach ( $this->lists as $attribute ) {
			if ( is_array( $input->attribute( $attribute ) ) ) {
				return true;
			}
		}

		return false;
	}
}
