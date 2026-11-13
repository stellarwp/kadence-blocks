<?php
/**
 * Writes the overlay of the row on tablet or mobile.
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
require_once __DIR__ . '/class-kadence-blocks-rowlayout-responsive-image.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-old-gradient.php';

/**
 * Writes the overlay of the row on tablet or mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Responsive_Overlay_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $device;

	/**
	 * The attribute that stores the overlay.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $attribute;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $device    The device.
	 * @param string $attribute The attribute that stores the overlay.
	 */
	public function __construct( $device, $attribute ) {
		$this->device    = $device;
		$this->attribute = $attribute;
	}

	/**
	 * Write the overlay.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$overlay = $input->item( $this->attribute, 0 );

		if ( ! is_array( $overlay ) || empty( $overlay['enable'] ) ) {
			return;
		}

		$css = $input->css();

		$css->set_media_state( $this->device );
		Kadence_Blocks_Rowlayout_Selector::set( $input, 'overlay' );
		$css->render_opacity_from_100( $overlay, 'overlayOpacity' );
		$this->write_type( $css, $overlay );
		( new Kadence_Blocks_Css_Writer( $css ) )->not_empty( 'mix-blend-mode', $overlay['overlayBlendMode'] ?? null );
		$css->set_media_state( 'desktop' );
	}

	/**
	 * Write the overlay of the type the editor chose.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css     The CSS builder.
	 * @param array                                     $overlay The saved overlay.
	 *
	 * @return void
	 */
	private function write_type( $css, array $overlay ): void {
		$type = ! empty( $overlay['currentOverlayTab'] ) ? $overlay['currentOverlayTab'] : 'normal';

		if ( 'normal' === $type ) {
			$this->write_normal( $css, $overlay );
			return;
		}

		if ( 'gradient' === $type ) {
			$css->add_property( 'background', $css->render_gradient( $overlay['gradient'] ?? null ) );
			return;
		}

		if ( 'grad' === $type ) {
			$this->write_old_gradient( $css, $overlay );
		}
	}

	/**
	 * Write the color and the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css     The CSS builder.
	 * @param array                                     $overlay The saved overlay.
	 *
	 * @return void
	 */
	private function write_normal( $css, array $overlay ): void {
		if ( ! empty( $overlay['overlay'] ) ) {
			$css->render_color_output( $overlay, 'overlay', ! empty( $overlay['overlayBgImg'] ) ? 'background-color' : 'background' );
		}

		if ( ! empty( $overlay['overlayBgImg'] ) ) {
			( new Kadence_Blocks_Rowlayout_Responsive_Image() )->write( $css, $overlay, 'overlayBgImg', '' );
		}
	}

	/**
	 * Write the old gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css     The CSS builder.
	 * @param array                                     $overlay The saved overlay.
	 *
	 * @return void
	 */
	private function write_old_gradient( $css, array $overlay ): void {
		$type   = ! empty( $overlay['overlayGradType'] ) ? $overlay['overlayGradType'] : 'linear';
		$angle  = ! empty( $overlay['overlayGradAngle'] ) ? $overlay['overlayGradAngle'] . 'deg' : '180deg';
		$place  = ! empty( $overlay['overlayBgImgPosition'] ) ? 'at ' . $overlay['overlayBgImgPosition'] : 'at center center';
		$first  = ! empty( $overlay['overlay'] ) ? $css->render_color( $overlay['overlay'] ) : 'transparent';
		$second = ! empty( $overlay['overlaySecond'] ) ? $css->render_color( $overlay['overlaySecond'] ) : '#00B5E2';

		$css->add_property(
			'background-image',
			( new Kadence_Blocks_Rowlayout_Old_Gradient() )->compose(
				$type,
				'radial' === $type ? $place : $angle,
				$first,
				! empty( $overlay['overlayGradLoc'] ) ? $overlay['overlayGradLoc'] : '0',
				$second,
				! empty( $overlay['overlayGradLocSecond'] ) ? $overlay['overlayGradLocSecond'] : '100'
			)
		);
	}
}
