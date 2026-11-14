<?php
/**
 * Writes the typography of the messages, which falls back on pixels.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the typography of the messages, which falls back on pixels.
 *
 * @since TBD
 */
final class Kadence_Blocks_Advanced_Form_Message_Typography_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the typography.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$settings = $input->derived( 'settings' );
		$font     = $settings->group( 'messageFont' );

		$font[0]['sizeType'] = ! empty( $font[0]['sizetype'] ) ? $font[0]['sizetype'] : 'px';

		$input->css()->render_typography( [ 'typography' => $font ], 'typography' );
	}
}
