<?php
/**
 * Writes a color of the form.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes a color of the form.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Color_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The settings group the color is saved in, or nothing for the form itself.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private $group;

	/**
	 * The attribute that stores the color.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $name;

	/**
	 * The CSS property.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $property;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string|null $group    The settings group the color is saved in, or nothing for the form itself.
	 * @param string      $name     The attribute that stores the color.
	 * @param string      $property The CSS property.
	 */
	public function __construct( $group, $name, $property ) {
		$this->group    = $group;
		$this->name     = $name;
		$this->property = $property;
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
		$settings = $input->derived( 'settings' );

		$input->css()->render_color_output( $settings->group( $this->group ), $this->name, $this->property );
	}
}
