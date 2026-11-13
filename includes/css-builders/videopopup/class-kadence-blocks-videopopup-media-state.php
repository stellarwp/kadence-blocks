<?php
/**
 * Sets the media state of the CSS that follows.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Sets the media state of the CSS that follows.
 *
 * @since TBD
 */
final class Kadence_Blocks_Videopopup_Media_State_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The media state.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $state;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $state The media state.
	 */
	public function __construct( $state ) {
		$this->state = $state;
	}

	/**
	 * Set the media state.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$input->css()->set_media_state( $this->state );
	}
}
