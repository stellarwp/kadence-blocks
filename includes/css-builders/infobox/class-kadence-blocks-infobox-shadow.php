<?php
/**
 * Writes the shadow of the info box and of its hover state, with the tablet and mobile shadows filling in what they leave empty.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-infobox-selector.php';

/**
 * Writes the shadow of the info box and of its hover state, with the tablet and mobile shadows filling
 * in what they leave empty.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Shadow_Css implements Kadence_Blocks_Css_Section {

	/**
	 * Write the shadows.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		if ( true !== $input->attribute( 'displayShadow' ) ) {
			return;
		}

		$attributes = $input->attributes();
		$css        = $input->css();

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap' );
		$attributes = $this->write_base( $css, $attributes, 'shadow' );
		$this->write_device( $css, $attributes, [ 'tabletShadow', 'tablet', 'shadow', null ] );
		$this->write_device( $css, $attributes, [ 'mobileShadow', 'mobile', 'shadow', 'tabletShadow' ] );
		$css->set_media_state( 'desktop' );

		Kadence_Blocks_Infobox_Selector::set( $input, '{base} .kt-blocks-info-box-link-wrap:hover' );
		$attributes = $this->write_hover( $css, $attributes );
		$this->write_device( $css, $attributes, [ 'tabletShadowHover', 'tablet', 'shadowHover', null ] );
		$this->write_device( $css, $attributes, [ 'mobileShadowHover', 'mobile', 'shadowHover', 'tabletShadowHover' ] );
	}

	/**
	 * Write the shadow of desktop, which is not inset unless it says so.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css        The CSS builder.
	 * @param array                                     $attributes The block attributes.
	 * @param string                                    $key        The attribute that stores the shadow.
	 *
	 * @return array
	 */
	private function write_base( $css, array $attributes, $key ): array {
		if ( ! is_array( $attributes[ $key ] ?? null ) || ! is_array( $attributes[ $key ][0] ?? null ) ) {
			return $attributes;
		}

		if ( ! isset( $attributes[ $key ][0]['inset'] ) ) {
			$attributes[ $key ][0]['inset'] = false;
		}

		$css->add_property( 'box-shadow', $css->render_shadow( $attributes[ $key ][0] ) );

		return $attributes;
	}

	/**
	 * Write the shadow of desktop on hover, or the default one.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css        The CSS builder.
	 * @param array                                     $attributes The block attributes.
	 *
	 * @return array
	 */
	private function write_hover( $css, array $attributes ): array {
		if ( is_array( $attributes['shadowHover'] ?? null ) && is_array( $attributes['shadowHover'][0] ?? null ) ) {
			return $this->write_base( $css, $attributes, 'shadowHover' );
		}

		$css->add_property( 'box-shadow', '0px 0px 14px 0px rgba(0,0,0,0.2)' );

		return $attributes;
	}

	/**
	 * Write the shadow of a device: what it saved, and for what it left empty the shadow before.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css        The CSS builder.
	 * @param array                                     $attributes The block attributes.
	 * @param array                                     $source     The attribute of the device, the device, the attribute of desktop and the attribute of tablet, or null.
	 *
	 * @return void
	 */
	private function write_device( $css, array $attributes, array $source ): void {
		list( $key, $device, $base, $before ) = $source;

		if ( ! is_array( $attributes[ $key ] ?? null ) || ! is_array( $attributes[ $key ][0] ?? null ) ) {
			return;
		}

		$css->set_media_state( $device );

		$shadow = $attributes[ $key ][0];

		foreach ( $shadow as $name => $value ) {
			$shadow[ $name ] = '' === $value ? $this->fallback( $attributes, $base, $before, $name ) : $value;
		}

		$css->add_property( 'box-shadow', $css->render_shadow( $shadow ) );
	}

	/**
	 * The value of a setting the device left empty: the one of the tablet when it saved one, or the one of
	 * desktop.
	 *
	 * @since TBD
	 *
	 * @param array       $attributes The block attributes.
	 * @param string      $base       The attribute of desktop.
	 * @param string|null $before     The attribute of tablet, or null for tablet itself.
	 * @param string      $name       The setting.
	 *
	 * @return mixed
	 */
	private function fallback( array $attributes, $base, $before, $name ) {
		if ( null === $before ) {
			return $attributes[ $base ][0][ $name ] ?? '';
		}

		$saved = $attributes[ $before ][0][ $name ] ?? null;

		return null !== $saved && '' !== $saved ? $saved : ( $attributes[ $base ][0][ $name ] ?? null );
	}
}
