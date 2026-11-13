<?php
/**
 * Writes the border styles of a part of the form.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes the border styles of a part of the form.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Border_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute of the desktop border.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $name;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $name The attribute of the desktop border.
	 */
	public function __construct( $name ) {
		$this->name = $name;
	}

	/**
	 * Write the borders.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );

		$input->css()->render_border_styles( $settings->border( $this->name ), $this->name );
	}
}
