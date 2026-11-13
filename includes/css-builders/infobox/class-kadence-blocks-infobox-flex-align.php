<?php
/**
 * Aligns the text content of a full height info box on a device.
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
 * Aligns the text content of a full height info box on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Flex_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The flex values for what the editor saved.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const ALIGNMENTS = [
		'right'  => 'flex-end',
		'left'   => 'flex-start',
		'center' => 'center',
	];

	/**
	 * The attribute that stores the alignment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

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
	 * @param string $attribute The attribute that stores the alignment.
	 * @param string $device    The device.
	 */
	public function __construct( $attribute, $device ) {
		$this->attribute = $attribute;
		$this->device    = $device;
	}

	/**
	 * Write the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$alignment = $input->attribute( $this->attribute );

		if ( ! is_string( $alignment ) || ! isset( self::ALIGNMENTS[ $alignment ] ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap .kt-infobox-textcontent' );
		$css->add_property( 'align-items', self::ALIGNMENTS[ $alignment ] );
		$css->set_media_state( 'desktop' );
	}
}
