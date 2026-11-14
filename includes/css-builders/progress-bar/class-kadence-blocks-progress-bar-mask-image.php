<?php
/**
 * Writes the image of the mask, how it repeats and where it sits.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Writes the image of the mask, how it repeats and where it sits.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Mask_Image_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css  = $input->css();
		$mask = $input->derived( 'mask' );

		foreach ( [ '-webkit-mask', 'mask' ] as $prefix ) {
			$css->add_property( $prefix . '-image', $mask->image() );
			$css->add_property( $prefix . '-size', 'contain' );
			$css->add_property( $prefix . '-repeat', $mask->repeat() );
			$css->add_property( $prefix . '-position', $mask->position() );
		}

		$css->add_property( 'aspect-ratio', $mask->aspect_ratio() );
	}
}
