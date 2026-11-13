<?php
/**
 * Writes the background of the row on tablet.
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
 * Writes the background of the row on tablet.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Tablet_Background_Css implements Kadence_Blocks_Css_Section {

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
		$tablet = $facts->tablet();

		if ( empty( $tablet['enable'] ) ) {
			return;
		}

		$input->css()->set_media_state( 'tabletPro' );
		Kadence_Blocks_Rowlayout_Selector::set( $input, 'margin' );
		$this->write_type( $input, $facts, $tablet );
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
	 * @param array                                     $tablet The tablet background.
	 *
	 * @return void
	 */
	private function write_type( Kadence_Blocks_Css_Build_Input $input, $facts, array $tablet ): void {
		$type = ! empty( $tablet['type'] ) ? $tablet['type'] : 'normal';

		if ( 'normal' === $type ) {
			$this->write_normal( $input, $facts, $tablet );
			return;
		}

		if ( 'gradient' === $type ) {
			$this->write_gradient( $input, $facts, $tablet );
		}
	}

	/**
	 * Write a color and an image, or the removal of the image of desktop.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input            $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $tablet The tablet background.
	 *
	 * @return void
	 */
	private function write_normal( Kadence_Blocks_Css_Build_Input $input, $facts, array $tablet ): void {
		$css = $input->css();

		if ( ! empty( $tablet['bgColor'] ) ) {
			$css->render_color_output( $tablet, 'bgColor', ! empty( $tablet['bgImg'] ) ? 'background-color' : 'background' );
		}

		$this->write_image( $input, $facts, $tablet );
		$this->write_forced( $input, $tablet );

		if ( $this->hides_parallax( $facts, $tablet ) ) {
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
	 * @param array                                     $tablet The tablet background.
	 *
	 * @return void
	 */
	private function write_image( Kadence_Blocks_Css_Build_Input $input, $facts, array $tablet ): void {
		if ( empty( $tablet['bgImg'] ) ) {
			return;
		}

		$important = $facts->is_inline() || ( $facts->has_main_parallax() && null !== ( $tablet['bgImgAttachment'] ?? null ) && 'parallax' !== $tablet['bgImgAttachment'] );

		( new Kadence_Blocks_Rowlayout_Responsive_Image() )->write( $input->css(), $tablet, 'bgImg', $important ? '!important' : '' );
	}

	/**
	 * Remove the image of desktop when the editor asked for it and tablet has none.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input  What the section needs to write its CSS.
	 * @param array                          $tablet The tablet background.
	 *
	 * @return void
	 */
	private function write_forced( Kadence_Blocks_Css_Build_Input $input, array $tablet ): void {
		if ( ! empty( $tablet['bgImg'] ) || empty( $tablet['forceOverDesk'] ) ) {
			return;
		}

		Kadence_Blocks_Rowlayout_Selector::set( $input, 'base' );
		$input->css()->add_property( 'background-image', 'none !important' );
		( new Kadence_Blocks_Rowlayout_Jarallax_Css() )->write( $input );
	}

	/**
	 * Whether the parallax container of desktop has to go: it has a parallax image and tablet has one that
	 * does not move.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $tablet The tablet background.
	 *
	 * @return bool
	 */
	private function hides_parallax( $facts, array $tablet ): bool {
		return $facts->has_main_parallax() && ! empty( $tablet['bgImg'] ) && ! empty( $tablet['bgImgAttachment'] ) && 'parallax' !== $tablet['bgImgAttachment'];
	}

	/**
	 * Write the gradient.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input            $input  What the section needs to write its CSS.
	 * @param Kadence_Blocks_Rowlayout_Background_Facts $facts  The facts about the background.
	 * @param array                                     $tablet The tablet background.
	 *
	 * @return void
	 */
	private function write_gradient( Kadence_Blocks_Css_Build_Input $input, $facts, array $tablet ): void {
		if ( empty( $tablet['gradient'] ) ) {
			return;
		}

		$css       = $input->css();
		$important = $facts->is_inline() || $facts->has_main_parallax();

		$css->add_property( 'background-image', $css->render_gradient( $tablet['gradient'] ) . ( $important ? '!important' : '' ) );

		if ( $facts->has_main_parallax() ) {
			( new Kadence_Blocks_Rowlayout_Jarallax_Css() )->write( $input );
		}
	}
}
