<?php
/**
 * Writes the background color of the row, unless a class paints it.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';

/**
 * Writes the background color of the row, unless a class paints it.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Background_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * What the site offers.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Rowlayout_Environment
	 */
	private $environment;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Environment $environment What the site offers: the theme, the content width.
	 */
	public function __construct( $environment ) {
		$this->environment = $environment;
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
		$color = $input->attribute( 'bgColor' );

		if ( empty( $color ) || ! $this->is_painted_here( $input, $color ) ) {
			return;
		}

		$input->css()->render_color_output( $input->attributes(), 'bgColor', 'background-color' );
	}

	/**
	 * Whether the color is written here: when no class paints the row, or when it is a palette color
	 * outside the Kadence theme.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 * @param mixed                          $color The saved color.
	 *
	 * @return bool
	 */
	private function is_painted_here( Kadence_Blocks_Css_Build_Input $input, $color ): bool {
		return empty( $input->attribute( 'bgColorClass' ) ) || ( ! $this->environment->has_kadence_theme() && 0 === strpos( $color, 'palette' ) );
	}
}
