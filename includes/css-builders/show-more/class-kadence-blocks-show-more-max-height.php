<?php
/**
 * Show more max height.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Limits the height of the content to the saved height, in the saved unit.
 *
 * @since TBD
 */
final class Kadence_Blocks_Show_More_Max_Height implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the height.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The height when none was saved.
	 *
	 * @since TBD
	 *
	 * @var int|null
	 */
	private $fallback;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string   $attribute The attribute that stores the height.
	 * @param int|null $fallback  The height when none was saved.
	 */
	public function __construct( $attribute, $fallback ) {
		$this->attribute = $attribute;
		$this->fallback  = $fallback;
	}

	/**
	 * Write the maximum height.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->add_property( 'max-height', $input->attribute( $this->attribute, $this->fallback ) . $input->attribute( 'heightType', 'px' ) );
	}
}
