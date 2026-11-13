<?php
/**
 * Writes the border width or color of the fields as a CSS variable.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes the border width or color of the fields as a CSS variable.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Border_Variable_Css implements Kadence_Blocks_Css_Section {

	/**
	 * What to read from the border: `width` or `color`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $part;

	/**
	 * The CSS variable.
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
	 * @param string $part     What to read from the border: `width` or `color`.
	 * @param string $property The CSS variable.
	 */
	public function __construct( $part, $property ) {
		$this->part     = $part;
		$this->property = $property;
	}

	/**
	 * Write the variable.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );
		$args     = [
			'desktop_key' => 'fieldBorderStyle',
			'tablet_key'  => 'tabletFieldBorderStyle',
			'mobile_key'  => 'mobileFieldBorderStyle',
			'unit_key'    => 'unit',
			'first_prop'  => 'border-top',
			'second_prop' => 'border-right',
			'third_prop'  => 'border-bottom',
			'fourth_prop' => 'border-left',
		];
		$value    = $input->css()->get_border_value( $settings->border( 'fieldBorderStyle' ), $args, 'top', 'desktop', $this->part, true );

		if ( empty( $value ) ) {
			return;
		}

		$input->css()->add_property( $this->property, $value );
	}
}
