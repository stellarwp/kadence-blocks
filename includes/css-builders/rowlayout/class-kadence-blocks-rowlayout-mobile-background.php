<?php
/**
 * Writes the background of the row on mobile.
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
require_once __DIR__ . '/class-kadence-blocks-rowlayout-background-facts.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-responsive-image.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-jarallax.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-video-hide.php';

/**
 * Writes the background of the row on mobile.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Mobile_Background_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the background.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$facts  = new Kadence_Blocks_Rowlayout_Background_Facts( $input );
		$mobile = $facts->mobile();

		if ( empty( $mobile['enable'] ) ) {
			return;
		}

		$input->css()->set_media_state( 'mobile' );
		Kadence_Blocks_Rowlayout_Selector::set( $input, 'margin' );
		$this->write_type( $input, $facts, $mobile );
		( new Kadence_Blocks_Rowlayout_Video_Hide_Css() )->write( $input );
		$input->css()->set_media_state( 'desktop' );
	}

	/**
	 * Write the background of the type the editor chose.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input            $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $mobile The mobile background.
	 *
	 * @return void
	 */
	private function write_type( Kadence_Blocks_Css_Build_Input $input, $facts, array $mobile ): void {
		$type = ! empty( $mobile['type'] ) ? $mobile['type'] : 'normal';

		if ( 'normal' === $type ) {
			$this->write_normal( $input, $facts, $mobile );
			return;
		}

		if ( 'gradient' === $type ) {
			$this->write_gradient( $input, $facts, $mobile );
		}
	}

	/**
	 * Write a color and an image, or the removal of the image of the larger devices.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input            $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $mobile The mobile background.
	 *
	 * @return void
	 */
	private function write_normal( Kadence_Blocks_Css_Build_Input $input, $facts, array $mobile ): void {
		$css = $input->css();

		if ( ! empty( $mobile['bgColor'] ) ) {
			$css->render_color_output( $mobile, 'bgColor', ! empty( $mobile['bgImg'] ) ? 'background-color' : 'background' );
		}

		$this->write_image( $input, $facts, $mobile );
		$this->write_forced( $input, $mobile );

		if ( $this->hides_parallax( $facts, $mobile ) ) {
			( new Kadence_Blocks_Rowlayout_Jarallax_Css() )->write( $input );
		}
	}

	/**
	 * Write the image.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input            $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $mobile The mobile background.
	 *
	 * @return void
	 */
	private function write_image( Kadence_Blocks_Css_Build_Input $input, $facts, array $mobile ): void {
		if ( empty( $mobile['bgImg'] ) ) {
			return;
		}

		$important = $facts->is_inline() || ( $this->stops_parallax( $mobile ) && ( $facts->has_parallax_image() || $facts->has_tablet_parallax() ) );

		( new Kadence_Blocks_Rowlayout_Responsive_Image() )->write( $input->css(), $mobile, 'bgImg', $important ? '!important' : '' );
	}

	/**
	 * Whether mobile has an attachment that is not parallax.
	 *
	 * @since TBD
	 *
	 * @param array $mobile The mobile background.
	 *
	 * @return bool
	 */
	private function stops_parallax( array $mobile ): bool {
		return null !== ( $mobile['bgImgAttachment'] ?? null ) && 'parallax' !== $mobile['bgImgAttachment'];
	}

	/**
	 * Remove the image of the larger devices when the editor asked for it and mobile has none.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param array                          $mobile The mobile background.
	 *
	 * @return void
	 */
	private function write_forced( Kadence_Blocks_Css_Build_Input $input, array $mobile ): void {
		if ( ! empty( $mobile['bgImg'] ) || empty( $mobile['forceOverDesk'] ) ) {
			return;
		}

		$input->css()->add_property( 'background-image', 'none !important' );
		( new Kadence_Blocks_Rowlayout_Jarallax_Css() )->write( $input );
	}

	/**
	 * Whether the parallax container has to go: a larger device has a parallax image and mobile has one
	 * that does not move.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $mobile The mobile background.
	 *
	 * @return bool
	 */
	private function hides_parallax( $facts, array $mobile ): bool {
		return ( $facts->has_main_parallax() || $facts->has_tablet_parallax() ) && ! empty( $mobile['bgImg'] ) && $this->stops_parallax( $mobile );
	}

	/**
	 * Write the gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input            $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $mobile The mobile background.
	 *
	 * @return void
	 */
	private function write_gradient( Kadence_Blocks_Css_Build_Input $input, $facts, array $mobile ): void {
		if ( empty( $mobile['gradient'] ) ) {
			return;
		}

		$css       = $input->css();
		$important = $facts->is_inline() || $facts->has_parallax_image();

		$css->add_property( 'background-image', $css->render_gradient( $mobile['gradient'] ) . ( $important ? '!important' : '' ) );

		if ( $facts->has_main_parallax() ) {
			( new Kadence_Blocks_Rowlayout_Jarallax_Css() )->write( $input );
		}
	}
}
