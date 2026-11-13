<?php
/**
 * Writes the custom padding of a field on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-form-selector.php';

/**
 * Writes the custom padding of a field on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Padding_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the padding.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $key;

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The selector template.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $selector;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $key      The attribute that stores the padding.
	 * @param string $device   The device.
	 * @param string $selector The selector template.
	 */
	public function __construct( $key, $device, $selector ) {
		$this->key      = $key;
		$this->device   = $device;
		$this->selector = $selector;
	}

	/**
	 * Write the padding.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$padding = $input->attribute( $this->key );

		if ( empty( $input->attribute( 'size' ) ) || ! is_array( $padding ) || ! is_numeric( $padding[0] ?? null ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Form_Selector::set( $input, $this->selector );
		( new Kadence_Blocks_Css_Writer( $css ) )->numeric_sides( 'padding', $padding, 'px' );
		$css->set_media_state( 'desktop' );
	}
}
