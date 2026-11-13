<?php
/**
 * Runs sections when a setting was saved.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Runs sections only when one of a list of attributes was saved.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Gate_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attributes that switch the sections on when any of them was saved.
	 *
	 * @since TBD
	 *
	 * @var string[]
	 */
	private $keys;

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
	 * @param string[]                     $keys     The attributes that switch the sections on.
	 * @param Kadence_Blocks_Css_Section[] $sections The sections to run.
	 */
	public function __construct( array $keys, array $sections ) {
		$this->keys     = $keys;
		$this->sections = $sections;
	}

	/**
	 * Run the sections when any attribute was saved.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( ! $this->is_on( $input ) ) {
			return;
		}

		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}
	}

	/**
	 * Whether any of the attributes was saved. An empty value still counts; null does not.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return bool
	 */
	private function is_on( Kadence_Blocks_Css_Build_Input $input ): bool {
		foreach ( $this->keys as $key ) {
			if ( null !== $input->attribute( $key ) ) {
				return true;
			}
		}

		return false;
	}
}
