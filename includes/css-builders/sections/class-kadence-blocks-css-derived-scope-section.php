<?php
/**
 * Writes sections against a settings array an outer section derived.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes sections against a settings array an outer section derived.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Derived_Scope_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The name of the derived settings.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The sections that write against the settings.
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
	 * @param string $name     The name of the derived settings.
	 * @param array  $sections The sections that write against the settings.
	 */
	public function __construct( $name, array $sections ) {
		$this->name     = $name;
		$this->sections = $sections;
	}

	/**
	 * Write the sections with the derived settings as their attributes.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$scoped = $input->with_attributes( (array) $input->derived( $this->name ) );

		foreach ( $this->sections as $section ) {
			$section->write( $scoped );
		}
	}
}
