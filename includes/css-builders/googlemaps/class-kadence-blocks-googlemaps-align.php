<?php
/**
 * Writes the alignment of the map.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';

/**
 * Writes the auto margins that align the map for one device.
 *
 * @since TBD
 */
final class Kadence_Blocks_Googlemaps_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 *
	 * @since TBD
	 *
	 * @var int
	 */
	private $index;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param int $index The device, 0 for desktop, 1 for tablet, 2 for mobile.
	 */
	public function __construct( int $index ) {
		$this->index = $index;
	}

	/**
	 * Write the auto margins of the alignment.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css = $input->css();

		foreach ( $this->margins( $input->item( 'textAlign', $this->index ) ) as $property ) {
			$css->add_property( $property, 'auto !important' );
		}
	}

	/**
	 * The margin properties an alignment sets to auto.
	 *
	 * @since TBD
	 *
	 * @param mixed $align The stored alignment.
	 *
	 * @return array
	 */
	private function margins( $align ): array {
		if ( ! is_string( $align ) ) {
			return [];
		}

		$margins = [
			'center' => [ 'margin-left', 'margin-right' ],
			'left'   => [ 'margin-right' ],
			'right'  => [ 'margin-left' ],
		];

		return $margins[ $align ] ?? [];
	}
}
