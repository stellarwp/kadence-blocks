<?php
/**
 * Writes the typography of a part of the form.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes the typography of a part of the form.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Typography_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The settings group the font is saved in.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $group;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $group The settings group the font is saved in.
	 */
	public function __construct( $group ) {
		$this->group = $group;
	}

	/**
	 * Write the typography.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );

		$input->css()->render_typography( [ 'typography' => $settings->group( $this->group ) ], 'typography' );
	}
}
