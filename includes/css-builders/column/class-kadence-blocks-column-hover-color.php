<?php
/**
 * Writes the hover color of a column, and removes its image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Writes the hover color of a column, and removes its image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Column_Hover_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Whether the color is the one of the overlay, which has no opacity.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $overlay;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the color.
	 * @param bool   $overlay   Whether the color is the one of the overlay, which has no opacity.
	 */
	public function __construct( $attribute, $overlay ) {
		$this->attribute = $attribute;
		$this->overlay   = $overlay;
	}

	/**
	 * Write the color.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$color = $input->attribute( $this->attribute );

		if ( empty( $color ) ) {
			return;
		}

		$this->write_color( $input, $color );
		$input->css()->add_property( 'background-image', 'none' );
	}

	/**
	 * Write the color, with its opacity unless it is the one of the overlay.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param mixed                          $color The saved color.
	 *
	 * @return void
	 */
	private function write_color( Kadence_Blocks_Css_Build_Input $input, $color ): void {
		$css = $input->css();

		if ( $this->overlay ) {
			$css->add_property( 'background-color', $css->render_color( $color ) );
			return;
		}

		$css->render_color_output( $input->attributes(), $this->attribute, 'background-color' );
	}
}
