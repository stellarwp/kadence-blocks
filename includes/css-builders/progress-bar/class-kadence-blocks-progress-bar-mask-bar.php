<?php
/**
 * Writes the CSS of a bar made of masks.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-progress-bar-mask.php';
require_once __DIR__ . '/class-kadence-blocks-progress-bar-mask-image.php';
require_once __DIR__ . '/class-kadence-blocks-progress-bar-mask-dimensions.php';

/**
 * Writes the CSS of a bar made of masks.
 *
 * @since TBD
 */
final class Kadence_Blocks_Progress_Bar_Mask_Bar_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the CSS of the bar.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$scoped = $input->with( 'mask', new Kadence_Blocks_Progress_Bar_Mask( $input->attributes() ) );

		foreach ( $this->sections() as $section ) {
			$section->write( $scoped );
		}
	}

	/**
	 * The sections of the bar: the image, then the size of every device.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	private function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-progress-bar-container{id} .kb-progress-bar-{id}' ),
			new Kadence_Blocks_Progress_Bar_Mask_Image_Css(),
			new Kadence_Blocks_Progress_Bar_Mask_Dimensions_Css( 'desktop' ),
			new Kadence_Blocks_Css_Static_Section( 'max-width', '100%' ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Progress_Bar_Mask_Dimensions_Css( 'tablet' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Progress_Bar_Mask_Dimensions_Css( 'mobile' ) ] ),
		];
	}
}
