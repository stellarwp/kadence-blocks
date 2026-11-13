<?php
/**
 * Tells whether any of the four sides of a list was filled.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether any of the four sides of a list was filled.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Filled_Sides_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The attribute that stores the sides.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The attribute that stores the settings the sides are in, if any.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $container;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string      $attribute The attribute that stores the sides.
	 * @param string|null $container    The attribute that stores the settings the sides are in, if any.
	 */
	public function __construct( $attribute, $container ) {
		$this->attribute = $attribute;
		$this->container = $container;
	}

	/**
	 * Whether any side is filled.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$sides = $this->sides( $input );

		foreach ( [ 0, 1, 2, 3 ] as $index ) {
			if ( ! empty( $sides[ $index ] ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * The sides.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return mixed
	 */
	private function sides( Kadence_Blocks_Css_Build_Input $input ) {
		$attributes = $input->attributes();

		if ( null === $this->container ) {
			return $attributes[ $this->attribute ] ?? null;
		}

		return $attributes[ $this->container ][0][ $this->attribute ] ?? null;
	}
}
