<?php
/**
 * Class to Build the Image Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Image Block.
 *
 * @category class
 */
class Kadence_Blocks_Image_Block extends Kadence_Blocks_Abstract_Block {

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $instance = null;

	/**
	 * Block name within this namespace.
	 *
	 * @var string
	 */
	protected $block_name = 'image';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	/**
	 * Instance Control
	 */
	public static function get_instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$key_positions = [ 'top', 'right', 'bottom', 'left' ];
		$css->set_selector( '.wp-block-kadence-image.kb-image' . $unique_id . ':not(.kb-specificity-added):not(.kb-extra-specificity-added)' );
		if ( ! empty( $attributes['align'] ) && ( 'left' === $attributes['align'] || 'right' === $attributes['align'] ) ) {
			$css->set_selector( '.wp-block-kadence-image.kb-image' . $unique_id . ':not(.kb-specificity-added):not(.kb-extra-specificity-added) > figure' );
		}

		// Margins
		$css->render_measure_output( $attributes, 'marginDesktop', 'margin', array(
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
			'unit_key' => 'marginUnit'
		) );
		$css->set_selector( '.wp-block-kadence-image.kb-image' . $unique_id );
		if ( ! empty( $attributes['zIndex'] ) ) {
			$css->add_property( 'position', 'relative' );
			$css->add_property( 'z-index', $attributes['zIndex'] );
		}
		$align = ( ! empty( $attributes['align'] ) ? $attributes['align'] : '' );
		if ( $align !== 'wide' && $align !== 'full' ) {
			if ( isset( $attributes['imgMaxWidth'] ) && is_numeric( $attributes['imgMaxWidth'] ) ) {
				$css->set_selector( '.kb-image' . $unique_id . '.kb-image-is-ratio-size, .kb-image' . $unique_id . ' .kb-image-is-ratio-size' );
				$css->add_property( 'max-width', $attributes['imgMaxWidth'] . 'px' );
				$css->add_property( 'width', '100%' );
				$css->set_selector( '.wp-block-kadence-column > .kt-inside-inner-col > .kb-image' . $unique_id . '.kb-image-is-ratio-size, .wp-block-kadence-column > .kt-inside-inner-col > .kb-image' . $unique_id . ' .kb-image-is-ratio-size' );
				$css->add_property( 'align-self', 'unset' );
			}
		}
		if ( $align === 'center' || $align === 'right' || $align === 'left' ) {
			$css->set_selector( '.kb-image' . $unique_id . ' figure' );
			if ( isset( $attributes['imgMaxWidth'] ) && is_numeric( $attributes['imgMaxWidth'] ) ) {
				$css->add_property( 'max-width', $attributes['imgMaxWidth'] . 'px' );
				$css->set_selector( '.kb-image' . $unique_id . ' .image-is-svg, .kb-image' . $unique_id . ' .image-is-svg img' );
				$css->add_property( 'width', '100%' );
			}
		} else if ( $align !== 'wide' && $align !== 'full' ) {
			$css->set_selector( '.kb-image' . $unique_id );
			if ( isset( $attributes['imgMaxWidth'] ) && is_numeric( $attributes['imgMaxWidth'] ) ) {
				$css->add_property( 'max-width', $attributes['imgMaxWidth'] . 'px' );
				$css->set_selector( '.image-is-svg.kb-image' . $unique_id );
				$css->add_property( 'flex', '0 1 100%' );
				$css->set_selector( '.image-is-svg.kb-image' . $unique_id . ' img' );
				$css->add_property( 'width', '100%' );
			}
		}

		// Tablet and Mobile Max Width.
		foreach ( [ 'Tablet', 'Mobile' ] as $breakpoint ) {
			$css->set_media_state( strtolower( $breakpoint ) );
			if ( isset( $attributes[ 'imgMaxWidth' . $breakpoint ] ) && is_numeric( $attributes[ 'imgMaxWidth' . $breakpoint ] ) ) {
				if ( $align !== 'wide' && $align !== 'full' ) {
					$css->set_selector( '.kb-image' . $unique_id . '.kb-image-is-ratio-size, .kb-image' . $unique_id . ' .kb-image-is-ratio-size' );
					$css->add_property( 'max-width', $attributes[ 'imgMaxWidth' . $breakpoint ] . 'px' );
					$css->add_property( 'width', '100%' );
				}
				if ( $align === 'center' || $align === 'right' || $align === 'left' ) {
					$css->set_selector( '.kb-image' . $unique_id . ' figure' );
					$css->add_property( 'max-width', $attributes[ 'imgMaxWidth' . $breakpoint ] . 'px' );
				} else if ( $align !== 'wide' && $align !== 'full' ) {
					$css->set_selector( '.kb-image' . $unique_id );
					$css->add_property( 'max-width', $attributes[ 'imgMaxWidth' . $breakpoint ] . 'px' );
				}
			}

			$css->set_media_state( 'desktop' );
		}
		$css->set_selector( '.kb-image' . $unique_id . ':not(.kb-image-is-ratio-size) .kb-img, .kb-image' . $unique_id . '.kb-image-is-ratio-size' );

		// Padding
		$css->render_measure_output( $attributes, 'paddingDesktop', 'padding', array(
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
			'unit_key' => 'paddingUnit'
		) );

		// Overlay.
		$overlay_type = ! empty( $attributes['overlayType'] ) ? $attributes['overlayType'] : 'normal';
		$css->set_selector( '.kb-image' . $unique_id . ' .kb-image-has-overlay:after' );
		$opacity = isset( $attributes['overlayOpacity'] ) ? $attributes['overlayOpacity'] : 0.3;
		if ( $css->is_number( $opacity ) ) {
			$css->add_property( 'opacity', $opacity );
		}
		if ( ! empty( $attributes['overlayBlendMode'] ) ) {
			$css->add_property( 'mix-blend-mode', $attributes['overlayBlendMode'] );
		}
		switch ( $overlay_type ) {
			case 'normal':
				if ( ! empty( $attributes['overlay'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['overlay'] ) );
				}
				break;
			case 'gradient':
				if ( ! empty( $attributes['overlayGradient'] ) ) {
					$css->add_property( 'background-image', $attributes['overlayGradient'] );
				}
				break;
		}
		$css->set_selector( '.kb-image' . $unique_id . ' img.kb-img, .kb-image' . $unique_id . ' .kb-img img' );

		// Support borders saved pre 3.0
		if ( !empty( $attributes['borderColor'] ) ) {
			$css->add_property( 'border-style', 'solid' );
			$css->add_property( 'border-color', $css->render_color( $attributes['borderColor'] ) );

			// Border widths
			foreach ( [ 'Desktop', 'Tablet', 'Mobile' ] as $breakpoint ) {
				$css->set_media_state( strtolower( $breakpoint ) );

				if ( isset( $attributes[ 'borderWidth' . $breakpoint ] ) && is_array( $attributes[ 'borderWidth' . $breakpoint ] ) ) {

					foreach ( $attributes[ 'borderWidth' . $breakpoint ] as $key => $bDesktop ) {
						if ( is_numeric( $bDesktop ) ) {
							$css->add_property( 'border-' . $key_positions[ $key ] . '-width', $bDesktop . ( ! isset( $attributes['borderWidthUnit'] ) ? 'px' : $attributes['borderWidthUnit'] ) );
						}
					}
				}

				$css->set_media_state( 'desktop' );
			}
		} else {
			$css->render_border_styles( $attributes, 'borderStyle', true );
		}


		// Background Color.
		if ( ! empty( $attributes['backgroundColor'] ) ) {
			$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColor'] ) );
		}
		// Border Radius.
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array( 'unit_key' => 'borderRadiusUnit' ) );

		if ( ! empty( $attributes['maskSvg'] ) && 'none' !== $attributes['maskSvg'] ) {
			if ( 'custom' === $attributes['maskSvg'] ) {
				if ( ! empty( $attributes['maskUrl'] ) ) {
					$mask_size     = ( ! empty( $attributes['maskSize'] ) ? $attributes['maskSize'] : 'auto' );
					$mask_position = ( ! empty( $attributes['maskPosition'] ) ? $attributes['maskPosition'] : 'center center' );
					$mask_repeat   = ( ! empty( $attributes['maskRepeat'] ) ? $attributes['maskRepeat'] : 'no-repeat' );
					$css->add_property( '-webkit-mask-image', 'url(' . $attributes['maskUrl'] . ')' );
					$css->add_property( 'mask-image', 'url(' . $attributes['maskUrl'] . ')' );

					$css->add_property( '-webkit-mask-size', $mask_size );
					$css->add_property( 'mask-size', $mask_size );

					$css->add_property( '-webkit-mask-repeat', $mask_repeat );
					$css->add_property( 'mask-repeat', $mask_repeat );

					$css->add_property( '-webkit-mask-position', $mask_position );
					$css->add_property( 'mask-position', $mask_position );
				}
			} else {
				$mask_base_url = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/';
				$css->add_property( '-webkit-mask-image', 'url(' . $mask_base_url . $attributes['maskSvg'] . '.svg)' );
				$css->add_property( 'mask-image', 'url(' . $mask_base_url . $attributes['maskSvg'] . '.svg)' );

				$css->add_property( '-webkit-mask-size', 'auto' );
				$css->add_property( 'mask-size', 'auto' );

				$css->add_property( '-webkit-mask-repeat', 'no-repeat' );
				$css->add_property( 'mask-repeat', 'no-repeat' );

				$css->add_property( '-webkit-mask-position', 'center' );
				$css->add_property( 'mask-position', 'center' );
			}
		}

		// Box shadow
		if ( isset( $attributes['displayBoxShadow'] ) && true == $attributes['displayBoxShadow'] ) {
			if ( isset( $attributes['boxShadow'] ) && is_array( $attributes['boxShadow'] ) && isset( $attributes['boxShadow'][0] ) && is_array( $attributes['boxShadow'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['boxShadow'][0]['inset'] ) && true === $attributes['boxShadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['boxShadow'][0]['hOffset'] ) && is_numeric( $attributes['boxShadow'][0]['hOffset'] ) ? $attributes['boxShadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['boxShadow'][0]['vOffset'] ) && is_numeric( $attributes['boxShadow'][0]['vOffset'] ) ? $attributes['boxShadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['boxShadow'][0]['blur'] ) && is_numeric( $attributes['boxShadow'][0]['blur'] ) ? $attributes['boxShadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['boxShadow'][0]['spread'] ) && is_numeric( $attributes['boxShadow'][0]['spread'] ) ? $attributes['boxShadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['boxShadow'][0]['color'] ) && ! empty( $attributes['boxShadow'][0]['color'] ) ? $attributes['boxShadow'][0]['color'] : '#000000' ), ( isset( $attributes['boxShadow'][0]['opacity'] ) && is_numeric( $attributes['boxShadow'][0]['opacity'] ) ? $attributes['boxShadow'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}

		// Drop Shadow
		if ( isset( $attributes['displayDropShadow'] ) && true == $attributes['displayDropShadow'] ) {
			if ( isset( $attributes['dropShadow'] ) && is_array( $attributes['dropShadow'] ) && isset( $attributes['dropShadow'][0] ) && is_array( $attributes['dropShadow'][0] ) ) {
				$css->add_property( 'filter', 'drop-shadow(' . ( isset( $attributes['dropShadow'][0]['hOffset'] ) && is_numeric( $attributes['dropShadow'][0]['hOffset'] ) ? $attributes['dropShadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['dropShadow'][0]['vOffset'] ) && is_numeric( $attributes['dropShadow'][0]['vOffset'] ) ? $attributes['dropShadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['dropShadow'][0]['blur'] ) && is_numeric( $attributes['dropShadow'][0]['blur'] ) ? $attributes['dropShadow'][0]['blur'] : '14' ) . 'px ' . $css->render_color( ( isset( $attributes['dropShadow'][0]['color'] ) && ! empty( $attributes['dropShadow'][0]['color'] ) ? $attributes['dropShadow'][0]['color'] : '#000000' ), ( isset( $attributes['dropShadow'][0]['opacity'] ) && is_numeric( $attributes['dropShadow'][0]['opacity'] ) ? $attributes['dropShadow'][0]['opacity'] : 0.2 ) ) . ')' );
			} else {
				$css->add_property( 'filter', 'drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.2) )' );
			}
		}

		// Caption Font
		if ( ! isset( $attributes['showCaption'] ) && isset( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'][0] ) ) {
			$caption_font = $attributes['captionStyles'][0];

			$css->set_selector( '.kb-image' . $unique_id . ' figcaption' );
			if ( isset( $caption_font['color'] ) && ! empty( $caption_font['color'] ) ) {
				$css->add_property( 'color', $css->render_color( $caption_font['color'] ) );
			}
			if ( isset( $caption_font['background'] ) && ! empty( $caption_font['background'] ) ) {
				$css->add_property( 'background', $css->render_color( $caption_font['background'] ) );
			}
			if ( isset( $caption_font['size'] ) && is_array( $caption_font['size'] ) ) {
				$caption_font_unit = !empty( $caption_font['sizeType'] ) ? $caption_font['sizeType'] : 'px';
				if ( ! empty( $caption_font['size'][0] ) ) {
					$css->add_property( 'font-size', $css->get_font_size( $caption_font['size'][0], $caption_font_unit ) );
				}

				if ( ! empty( $caption_font['size'][1] ) ) {
					$css->set_media_state('tablet');
					$css->add_property( 'font-size', $css->get_font_size( $caption_font['size'][1], $caption_font_unit ) );
					$css->set_media_state('desktop');
				}

				if ( ! empty( $caption_font['size'][2] ) ) {
					$css->set_media_state('mobile');
					$css->add_property( 'font-size', $css->get_font_size( $caption_font['size'][2], $caption_font_unit ) );
					$css->set_media_state('desktop');
				}
			}
			if ( isset( $caption_font['lineHeight'] ) && is_array( $caption_font['lineHeight'] ) && ! empty( $caption_font['lineHeight'][0] ) ) {
				$css->add_property( 'line-height', $caption_font['lineHeight'][0] . ( ! isset( $caption_font['lineType'] ) ? 'px' : $caption_font['lineType'] ) );
			}
			if ( isset( $caption_font['letterSpacing'] ) && ! empty( $caption_font['letterSpacing'] ) ) {
				$css->add_property( 'letter-spacing', $caption_font['letterSpacing'] . 'px' );
			}
			if ( isset( $caption_font['textTransform'] ) && ! empty( $caption_font['textTransform'] ) ) {
				$css->add_property( 'text-transform', $caption_font['textTransform'] );
			}
			if ( isset( $caption_font['family'] ) && ! empty( $caption_font['family'] ) ) {
				$css->add_property( 'font-family', $caption_font['family'] );
			}
			if ( isset( $caption_font['style'] ) && ! empty( $caption_font['style'] ) ) {
				$css->add_property( 'font-style', $caption_font['style'] );
			}
			if ( isset( $caption_font['weight'] ) && ! empty( $caption_font['weight'] ) ) {
				$css->add_property( 'font-weight', $caption_font['weight'] );
			}
		}
		if ( ! isset( $attributes['showCaption'] ) && isset( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'] ) && isset( $attributes['captionStyles'][0] ) && is_array( $attributes['captionStyles'][0] ) && ( ( isset( $attributes['captionStyles'][0]['size'] ) && is_array( $attributes['captionStyles'][0]['size'] ) && isset( $attributes['captionStyles'][0]['size'][1] ) && ! empty( $attributes['captionStyles'][0]['size'][1] ) ) || ( isset( $attributes['captionStyles'][0]['lineHeight'] ) && is_array( $attributes['captionStyles'][0]['lineHeight'] ) && isset( $attributes['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][1] ) ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-image' . $unique_id . ' figcaption' );
			if ( isset( $attributes['captionStyles'][0]['size'][1] ) && ! empty( $attributes['captionStyles'][0]['size'][1] ) ) {
				$css->add_property( 'font-size', $attributes['captionStyles'][0]['size'][1] . ( ! isset( $attributes['captionStyles'][0]['sizeType'] ) ? 'px' : $attributes['captionStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['captionStyles'][0]['lineHeight'][1] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][1] ) ) {
				$css->add_property( 'line-height', $attributes['captionStyles'][0]['lineHeight'][1] . ( ! isset( $attributes['captionStyles'][0]['lineType'] ) ? 'px' : $attributes['captionStyles'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( ! isset( $attributes['showCaption'] ) && isset( $attributes['captionStyles'] ) && is_array( $attributes['captionStyles'] ) && isset( $attributes['captionStyles'][0] ) && is_array( $attributes['captionStyles'][0] ) && ( ( isset( $attributes['captionStyles'][0]['size'] ) && is_array( $attributes['captionStyles'][0]['size'] ) && isset( $attributes['captionStyles'][0]['size'][2] ) && ! empty( $attributes['captionStyles'][0]['size'][2] ) ) || ( isset( $attributes['captionStyles'][0]['lineHeight'] ) && is_array( $attributes['captionStyles'][0]['lineHeight'] ) && isset( $attributes['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][2] ) ) ) ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( '.kb-image' . $unique_id . ' figcaption' );
			if ( isset( $attributes['captionStyles'][0]['size'][2] ) && ! empty( $attributes['captionStyles'][0]['size'][2] ) ) {
				$css->add_property( 'font-size', $attributes['captionStyles'][0]['size'][2] . ( ! isset( $attributes['captionStyles'][0]['sizeType'] ) ? 'px' : $attributes['captionStyles'][0]['sizeType'] ) );
			}
			if ( isset( $attributes['captionStyles'][0]['lineHeight'][2] ) && ! empty( $attributes['captionStyles'][0]['lineHeight'][2] ) ) {
				$css->add_property( 'line-height', $attributes['captionStyles'][0]['lineHeight'][2] . ( ! isset( $attributes['captionStyles'][0]['lineType'] ) ? 'px' : $attributes['captionStyles'][0]['lineType'] ) );
			}
			$css->set_media_state( 'desktop' );
		}

		return $css->css_output();
	}
	/**
	 * Build HTML for dynamic blocks
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$update_alt_globally = isset( $attributes['globalAlt'] ) && true === $attributes['globalAlt'] ? true : false;
		if ( apply_filters( 'kadence_blocks_update_alt_text_globally', $update_alt_globally, $attributes ) && ! empty( $attributes['id'] ) ) {
			// Check if we can get the alt text.
			$alt = get_post_meta( $attributes['id'], '_wp_attachment_image_alt', true );
			if ( ! empty( $alt ) ) {
				$content = str_replace( 'alt=""', 'alt="' . esc_attr( $alt ) . '"', $content );
			}
		}
		return $content;
	}

}

Kadence_Blocks_Image_Block::get_instance();
