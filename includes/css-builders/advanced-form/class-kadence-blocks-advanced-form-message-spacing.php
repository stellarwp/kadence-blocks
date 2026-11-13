<?php
/**
 * Writes the padding or the margin of the messages.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/class-kadence-blocks-advanced-form-settings.php';

/**
 * Writes the padding or the margin of the messages.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Message_Spacing_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the spacing.
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
	 * @param string $name     The attribute that stores the spacing.
	 * @param string $property The CSS property.
	 */
	public function __construct( $name, $property ) {
		$this->name     = $name;
		$this->property = $property;
	}

	/**
	 * Write the spacing.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );
		$unit     = $this->name . 'Unit';
		$type     = $this->name . 'Type';
		$args     = [
			$this->name => $settings->filled( $this->name, [] ),
			$type       => $settings->filled( $unit, 'px' ),
		];

		$input->css()->render_measure_output( $args, $this->name, $this->property );
	}
}
