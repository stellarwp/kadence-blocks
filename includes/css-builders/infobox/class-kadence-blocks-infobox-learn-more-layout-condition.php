<?php
/**
 * Tells whether the learn more link sits at the bottom of a full height info box.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells whether the learn more link sits at the bottom of a full height info box.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Learn_More_Layout_Condition implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the learn more link is shown, the media is on top and the link is aligned.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$align = $input->attribute( 'mediaAlign' );
		$learn = $input->attribute( 'alignLearnMore' );

		return ! empty( $input->attribute( 'displayLearnMore' ) ) && ( null === $align || 'top' === $align ) && ( null === $learn || ! empty( $learn ) );
	}
}
