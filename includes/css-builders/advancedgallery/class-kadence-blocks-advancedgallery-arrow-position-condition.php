<?php
/**
 * Tells whether the arrows sit on the edge of the gallery.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the arrows sit on the edge of the gallery.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Arrow_Position_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * The positions that put the arrows next to each other.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const CENTERED = [ 'center', 'outside-top', 'outside-bottom' ];

	/**
	 * Whether the arrows have a position other than the centered ones.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$position = $input->attribute( 'arrowPosition' );

		return ! empty( $position ) && ! in_array( $position, self::CENTERED, true );
	}
}
