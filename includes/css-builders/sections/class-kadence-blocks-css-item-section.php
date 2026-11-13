<?php
/**
 * Runs sections when one entry of a list attribute is filled.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/../class-kadence-blocks-css-section.php';
require_once __DIR__ . '/../class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Runs sections when one entry of a list attribute is filled.
 *
 * @since TBD
 */
final class Kadence_Blocks_Css_Item_Section implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the list.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * The position of the entry in the list.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

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
	 * @param string $attribute The attribute that stores the list.
	 * @param int    $index     The position of the entry in the list.
	 * @param array  $sections  The sections to run.
	 */
	public function __construct( $attribute, $index, array $sections ) {
		$this->attribute = $attribute;
		$this->index     = $index;
		$this->sections  = $sections;
	}

	/**
	 * Run the sections when the entry is filled.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( empty( $input->item( $this->attribute, $this->index ) ) ) {
			return;
		}

		foreach ( $this->sections as $section ) {
			$section->write( $input );
		}
	}
}
