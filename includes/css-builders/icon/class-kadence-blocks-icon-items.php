<?php
/**
 * Icon items section.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-icon-item-selector.php';

/**
 * Writes the sections for each of the icons saved before the icon block used single icons inside.
 *
 * @since TBD
 */
final class Kadence_Blocks_Icon_Items_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The sections to write for each icon.
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
	 * @param Kadence_Blocks_Css_Section[] $sections The sections to write for each icon.
	 */
	public function __construct( $sections ) {
		$this->sections = $sections;
	}

	/**
	 * Write the sections for every icon that is a list of settings.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$icons = $input->attribute( 'icons' );

		if ( empty( $icons ) || ! is_array( $icons ) ) {
			return;
		}

		foreach ( array_filter( $icons, 'is_array' ) as $key => $icon ) {
			$this->write_icon( $input->with_attributes( $icon )->with( 'icon_key', $key ) );
		}
	}

	/**
	 * Write the sections for one icon.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input The input scoped to the icon.
	 *
	 * @return void
	 */
	private function write_icon( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}
	}
}
