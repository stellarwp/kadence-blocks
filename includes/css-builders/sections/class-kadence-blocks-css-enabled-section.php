<?php
/**
 * Runs sections while a switch is on.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Runs sections only while a switch attribute is on.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Enabled_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that switches the sections on.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The sections to run.
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
	 * @param string                       $attribute The attribute that switches the sections on.
	 * @param Kadence_Blocks_Css_Section[] $sections  The sections to run.
	 */
	public function __construct( $attribute, array $sections ) {
		$this->attribute = $attribute;
		$this->sections  = $sections;
	}

	/**
	 * Run the sections when the switch is on.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->attribute( $this->attribute ) ) ) {
			return;
		}

		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}
	}
}
