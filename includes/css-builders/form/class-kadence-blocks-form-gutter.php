<?php
/**
 * Writes the space between the fields on a device.
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
 * Writes the space between the fields on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Form_Gutter_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The attribute that stores the gutter.
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
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $key    The attribute that stores the gutter.
	 * @param string $device The device.
	 */
	public function __construct( $key, $device ) {
		$this->key    = $key;
		$this->device = $device;
	}

	/**
	 * Write the gutter.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$gutter = $input->attribute( $this->key );

		if ( ! is_numeric( $gutter ) ) {
			return;
		}

		$css  = $input->css();
		$half = floor( $gutter / 2 ) . ( $input->attribute( 'gutterType' ) ?: 'px' );

		$css->set_media_state( $this->device );
		Kadence_Blocks_Form_Selector::set( $input, '.kadence-form-{id} .kb-form .kadence-blocks-form-field' );
		$css->add_property( 'padding-right', $half );
		$css->add_property( 'padding-left', $half );
		Kadence_Blocks_Form_Selector::set( $input, '.kadence-form-{id} .kb-form' );
		$css->add_property( 'margin-right', '-' . $half );
		$css->add_property( 'margin-left', '-' . $half );
		$css->set_media_state( 'desktop' );
	}
}
