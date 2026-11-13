<?php
/**
 * Writes sections in a media query, when the site outputs media queries.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes sections in a media query, when the site outputs media queries.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Filtered_Media_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The media state.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $state;

	/**
	 * The sections to write.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Section[]
	 */
	private $sections;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $state    The media state.
	 * @param array  $sections The sections to write.
	 */
	public function __construct( $state, array $sections ) {
		$this->state    = $state;
		$this->sections = $sections;
	}

	/**
	 * Write the sections.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		if ( apply_filters( 'kadence_blocks_css_output_media_queries', true ) ) {
			$css->set_media_state( $this->state );
		}

		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}

		$css->set_media_state( 'desktop' );
	}
}
