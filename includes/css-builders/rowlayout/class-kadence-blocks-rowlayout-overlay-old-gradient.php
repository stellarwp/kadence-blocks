<?php
/**
 * Writes the old gradient of the overlay.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-old-gradient.php';

/**
 * Writes the old gradient of the overlay.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Overlay_Old_Gradient_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$css     = $input->css();
		$type    = $input->attribute( 'overlayGradType', 'linear' );
		$angle   = 'radial' === $type ? 'at ' . $input->attribute( 'overlayBgImgPosition', 'center center' ) : $this->angle( $input );
		$first   = $input->attribute( 'overlay' );
		$second  = $input->attribute( 'overlaySecond' );
		$opacity = $input->attribute( 'overlayFirstOpacity' );
		$after   = $input->attribute( 'overlaySecondOpacity' );

		$css->add_property(
			'background-image',
			( new Kadence_Blocks_Rowlayout_Old_Gradient() )->compose(
				$type,
				$angle,
				null !== $first ? $css->render_color( $first, is_numeric( $opacity ) ? $opacity : 1 ) : 'transparent',
				$input->attribute( 'overlayGradLoc', '0' ),
				null !== $second ? $css->render_color( $second, is_numeric( $after ) ? $after : 1 ) : '#00B5E2',
				$input->attribute( 'overlayGradLocSecond', '100' )
			)
		);
	}

	/**
	 * The angle of a linear gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return string
	 */
	private function angle( Kadence_Blocks_Css_Build_Input $input ) {
		$angle = $input->attribute( 'overlayGradAngle' );

		return null !== $angle ? $angle . 'deg' : '180deg';
	}
}
