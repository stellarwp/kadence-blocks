<?php
/**
 * Writes the sections of the type the editor chose, normal unless saved otherwise.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the sections of the type the editor chose, normal unless saved otherwise.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Typed_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the type.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The sections to run, by type.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private $sections;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the type.
	 * @param array  $sections  The sections to run, by type.
	 */
	public function __construct( $attribute, array $sections ) {
		$this->attribute = $attribute;
		$this->sections  = $sections;
	}

	/**
	 * Write the sections of the type.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$type = $input->attribute( $this->attribute );
		$type = empty( $type ) ? 'normal' : $type;

		if ( ! is_string( $type ) ) {
			return;
		}

		foreach ( $this->sections[ $type ] ?? [] as $section ) {
			$section->write( $input );
		}
	}
}
