<?php
/**
 * Writes the size of the icon, or of the number, on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Writes the size of the icon, or of the number, on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Icon_Size_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The key that stores the size.
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
	 * Whether the size has to be a number, or only has to be saved.
	 *
	 * @since TBD
	 *
	 * @var bool
	 */
	private $numbers_only;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $key          The key that stores the size.
	 * @param string $device       The device.
	 * @param bool   $numbers_only Whether the size has to be a number, or only has to be saved.
	 */
	public function __construct( $key, $device, $numbers_only ) {
		$this->key          = $key;
		$this->device       = $device;
		$this->numbers_only = $numbers_only;
	}

	/**
	 * Write the size.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$icon = $input->derived( 'media' )->icon();
		$size = $icon[ $this->key ] ?? null;

		if ( $this->numbers_only ? ! is_numeric( $size ) : empty( $size ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kadence-info-box-icon-container .kt-info-svg-icon, {base} .kt-info-svg-icon-flip, {base} .kt-blocks-info-box-number' );
		$css->add_property( 'font-size', $size . ( $icon['unit'] ?? 'px' ) );
		$css->set_media_state( 'desktop' );
	}
}
