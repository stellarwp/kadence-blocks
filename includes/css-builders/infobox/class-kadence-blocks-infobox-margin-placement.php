<?php
/**
 * Tells where the margin of the media goes.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Tells where the margin of the media goes.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Margin_Placement implements Kadence_Blocks_Css_Input_Condition {

	/**
	 * Whether the media is on top, where the margin goes on its container.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $top;

	/**
	 * Create the condition.
	 *
	 * @since TBD
	 *
	 * @param bool $top Whether the media is on top, where the margin goes on its container.
	 */
	public function __construct( $top ) {
		$this->top = $top;
	}

	/**
	 * Whether the media has a margin and it goes where this condition looks.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	public function is_met( Kadence_Blocks_Css_Build_Input $input ): bool {
		$align = $input->attribute( 'mediaAlign' );

		if ( ! is_array( $input->derived( 'media' )->style()['margin'] ?? null ) ) {
			return false;
		}

		return $this->top ? ( null === $align || 'top' === $align ) : ( null !== $align && 'top' !== $align );
	}
}
