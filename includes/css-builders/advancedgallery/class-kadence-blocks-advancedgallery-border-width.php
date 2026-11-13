<?php
/**
 * Writes the width of a border in pixels.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the width of a border in pixels.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedgallery_Border_Width_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the width.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Whether the border is solid as well.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $solid;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the width.
	 * @param bool   $solid     Whether the border is solid as well.
	 */
	public function __construct( $attribute, $solid ) {
		$this->attribute = $attribute;
		$this->solid     = $solid;
	}

	/**
	 * Write the width.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		$css->add_property( 'border-width', $input->attribute( $this->attribute ) . 'px' );

		if ( $this->solid ) {
			$css->add_property( 'border-style', 'solid' );
		}
	}
}
