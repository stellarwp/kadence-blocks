<?php
/**
 * Aligns the button inside its field on a device.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Aligns the button inside its field on a device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Submit_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The flex values of the alignments, in the order they are tried.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const JUSTIFY = [
		'left'   => 'flex-start',
		'center' => 'center',
		'right'  => 'flex-end',
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

		if ( empty( $alignment ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		$this->write_justify( $css, $alignment );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Write the flex value of the alignment. The alignment is compared loosely, the first match wins.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css       The CSS builder.
	 * @param mixed                                     $alignment The saved alignment.
	 *
	 * @return void
	 */
	private function write_justify( $css, $alignment ): void {
		foreach ( self::JUSTIFY as $name => $justify ) {
			if ( $alignment == $name ) {
				$css->add_property( 'justify-content', $justify );
				return;
			}
		}
	}
}
