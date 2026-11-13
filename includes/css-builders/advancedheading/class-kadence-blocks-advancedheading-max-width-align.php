<?php
/**
 * Pushes a block with a maximum width to the side it is aligned to.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * Pushes a block with a maximum width to the side it is aligned to.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advancedheading_Max_Width_Align_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The margins of every alignment.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const MARGINS = [
		'center' => [
			'margin-right' => 'auto',
			'margin-left'  => 'auto',
		],
		'right'  => [
			'margin-right' => '0px',
			'margin-left'  => 'auto',
		],
	];

	/**
	 * Write the margins.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$align = $input->attribute( 'align' );

		if ( empty( $input->item( 'maxWidth', 0 ) ) || ! is_string( $align ) || ! isset( self::MARGINS[ $align ] ) ) {
			return;
		}

		foreach ( self::MARGINS[ $align ] as $property => $value ) {
			$input->css()->add_property( $property, $value );
		}
	}
}
