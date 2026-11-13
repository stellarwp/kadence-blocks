<?php
/**
 * Tells whether the style of the block is one of a list.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the style of the block is one of a list.
 *
 * @since TBD
 */
final class Kadence_Blocks_Testimonials_Style_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The styles.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $styles;

	/**
	 * Whether the styles are compared strictly.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $strict;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param string[] $styles The styles.
	 * @param bool     $strict Whether the styles are compared strictly.
	 */
	public function __construct( $styles, $strict ) {
		$this->styles = $styles;
		$this->strict = $strict;
	}

	/**
	 * Whether the style is one of the styles.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		return in_array( $input->derived( 'style' ), $this->styles, $this->strict );
	}
}
