<?php
/**
 * Writes the sections for the styles of the pane titles, when the editor saved them.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the sections for the styles of the pane titles, when the editor saved them.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Title_Styles_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The sections that write the styles.
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
	 * @param array $sections The sections that write the styles.
	 */
	public function __construct( array $sections ) {
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
		$title_styles = $input->item( 'titleStyles', 0 );

		if ( ! is_array( $input->attribute( 'titleStyles' ) ) || ! is_array( $title_styles ) ) {
			return;
		}

		$scoped = $input->with( 'title_styles', $title_styles );

		foreach ( $this->sections as $section ) {
			$section->write( $scoped );
		}
	}
}
