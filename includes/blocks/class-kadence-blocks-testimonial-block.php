<?php
/**
 * Class to Build the Testimonial Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Testimonial Block.
 *
 * @category class
 */
class Kadence_Blocks_Testimonial_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'testimonial';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string             $unique_id the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		return $css->css_output();
	}

	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$layout            = $this->get_context( $block_instance->context, 'layout' );
		$containerVAlign   = $this->get_context( $block_instance->context, 'containerVAlign' );
		$containerMaxWidth = $this->get_context( $block_instance->context, 'containerMaxWidth' );
		$style             = $this->get_context( $block_instance->context, 'style' );
		$displayIcon       = $this->get_context( $block_instance->context, 'displayIcon' );
		$displayMedia      = $this->get_context( $block_instance->context, 'displayMedia' );
		$iconStyles        = $this->get_context( $block_instance->context, 'iconStyles' );
		$displayTitle      = $this->get_context( $block_instance->context, 'displayTitle' );
		$displayRating     = $this->get_context( $block_instance->context, 'displayRating' );
		$displayContent    = $this->get_context( $block_instance->context, 'displayContent' );
		$displayOccupation = $this->get_context( $block_instance->context, 'displayOccupation' );
		$displayName       = $this->get_context( $block_instance->context, 'displayName' );
		$titleFont         = $this->get_context( $block_instance->context, 'titleFont' );
		$mediaStyles       = $this->get_context( $block_instance->context, 'mediaStyles' );
		$ratingStyles      = $this->get_context( $block_instance->context, 'ratingStyles' );
		$content           = '';
		if ( $layout === 'carousel' ) {
			$content .= '<li class="kt-blocks-testimonial-carousel-item kb-slide-item">';
		} elseif ( $layout === 'grid' ) {
			$content .= '<li class="kt-testimonial-grid-item">';
		}

		$classes = [
			'kt-testimonial-item-wrap',
			'kt-testimonial-item-' . $unique_id,
		];

		if ( $containerVAlign ) {
			$classes[] = 'testimonial-valign-' . $containerVAlign;
		}

		$wrapper_args       = [
			'id'    => ! empty( $attributes['anchor'] ) ? $attributes['anchor'] : '',
			'class' => implode( ' ', $classes ),
		];
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$content .= sprintf( '<div %s>', $wrapper_attributes );
		$content .= '<div class="kt-testimonial-text-wrap">';

		if ( $displayIcon && $iconStyles[0]['icon'] && $style !== 'card' ) {
			$content .= $this->render_icon( $attributes, $iconStyles );
		}

		if ( $displayMedia && in_array(
			$style,
			[
				'card',
				'inlineimage',
			] 
		) && ( ( $attributes['media'] !== 'icon' && $attributes['url'] ) || ( $attributes['media'] === 'icon' && $attributes['icon'] ) ) ) {
			$content .= $this->render_media( $attributes, $mediaStyles, $style, $containerMaxWidth );
		}

		if ( $displayIcon && $iconStyles[0]['icon'] && $style === 'card' ) {
			$content .= $this->render_icon( $attributes, $iconStyles );
		}

		if ( $displayTitle ) {
			$content .= $this->render_title( $attributes, $titleFont );
		}

		if ( $displayRating ) {
			$content .= $this->render_rating( $attributes, $ratingStyles );
		}

		if ( $displayContent ) {
			$content .= $this->render_content( $attributes );
		}

		// end: kt-testimonial-text-wrap
		$content .= '</div>';
		if ( ( $displayMedia && ! in_array(
			$style,
			[
				'card',
				'inlineimage',
			] 
		) ) || $displayOccupation || $displayName ) {
			$content .= '<div class="kt-testimonial-meta-wrap">';
			if ( $displayMedia && ! in_array(
				$style,
				[
					'card',
					'inlineimage',
				] 
			) && ( ( 'icon' !== $attributes['media'] && $attributes['url'] ) || ( 'icon' === $attributes['media'] && $attributes['icon'] ) ) ) {
				$content .= $this->render_media( $attributes, $mediaStyles, $style, $containerMaxWidth );
			}
			$content .= '<div class="kt-testimonial-meta-name-wrap">';

			if ( $displayName ) {
				$content .= '<div class="kt-testimonial-name-wrap">';
				$content .= '<div class="kt-testimonial-name">' . $attributes['name'] . '</div>';
				$content .= '</div>';
			}

			if ( $displayOccupation ) {
				$content     .= '<div class="kt-testimonial-occupation-wrap">';
					$content .= '<div class="kt-testimonial-occupation">' . $attributes['occupation'] . '</div>';
				$content     .= '</div>';
			}

			$content .= '</div>'; // end: kt-testimonial-meta-name-wrap
			$content .= '</div>'; // end: kt-testimonial-meta-wrap
		}

		$content .= '</div>';

		if ( $layout === 'carousel' || $layout === 'grid' ) {
			$content .= '</li>';
		}

		return $content;
	}

	private function get_context( $context, $key, $default = '' ) {
		return $context[ 'kadence/testimonials-' . $key ] ?? $default;
	}

	private function render_icon( $attributes, $iconStyles ) {
		$icon = '<div class="kt-svg-testimonial-global-icon-wrap">';

		$title        = $iconStyles[0]['title'] ?? '';
		$type         = substr( $iconStyles[0]['icon'], 0, 2 );
		$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
		$fill         = ( $line_icon ? 'none' : 'currentColor' );
		$stroke_width = false;
		if ( $line_icon ) {
			$stroke_width = ( ! empty( $iconStyles[0]['stroke'] ) ? $iconStyles[0]['stroke'] : 2 );
		}

		$svg = Kadence_Blocks_Svg_Render::render( $iconStyles[0]['icon'], $fill, $stroke_width, $title );

		$icon .= "<div class='kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-icon-" . $iconStyles[0]['icon'] . "'>";
		$icon .= $svg;
		$icon .= '</div>';

		$icon .= '</div>';

		return $icon;
	}

	private function render_media( $attributes, $media_styles, $style, $container_max_width ) {
		$css_class = Kadence_Blocks_CSS::get_instance();
		$type         = substr( $attributes['icon'], 0, 2 );
		$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
		$fill         = ( $line_icon ? 'none' : 'currentColor' );
		$stroke_width = false;
		if ( $line_icon ) {
			$stroke_width = ( ! empty( $attributes['istroke'] ) ? $attributes['istroke'] : 2 );
		}

		$media  = '<div class="kt-testimonial-media-wrap">';
		$media .= '<div class="kt-testimonial-media-inner-wrap">';
		$media .= '<div class="kadence-testimonial-image-intrisic">';

		if ( $attributes['media'] === 'icon' && $attributes['icon'] ) {
			$extras = ' height="' . esc_attr( $attributes['isize'] ) . '" width="' . esc_attr( $attributes['isize'] ) . '" style="color: ' . ( isset( $attributes['color'] ) ? $css_class->render_color( $attributes['color'] ) : 'undefined' ) . '"';
			$svg    = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width, $attributes['ititle'], false, $extras );

			$media .= '<div class="kt-svg-testimonial-icon kt-svg-testimonial-icon-' . esc_attr( $attributes['icon'] ) . '">';
			$media .= $svg;
			$media .= '</div>';
		}
		if ( $attributes['media'] !== 'icon' && $attributes['url'] ) {
			$media .= $this->get_media_output_html( $attributes, $media_styles, $style, $container_max_width );
		}
		$media .= '</div>';
		$media .= '</div>';
		$media .= '</div>';
		return $media;
	}
	/**
	 * Get the media output HTML
	 *
	 * @param array  $attributes The attributes.
	 * @param array  $mediaStyles The media styles.
	 * @param string $style The style.
	 * @param int    $containerMaxWidth The container max width.
	 * @return string The media output HTML.
	 */
	private function get_media_output_html( $attributes, $media_styles, $style, $container_max_width ) {
		$use_attachment = false;
		if ( ! empty( $attributes['id'] ) ) {
			$image_attachment = wp_get_attachment_image_url( $attributes['id'], 'full' );
			if ( ! empty( $image_attachment ) && $attributes['url'] === $image_attachment ) {
				$use_attachment = true;
			}
		}
		// Figure out the Media size.
		$media_width = ( ! empty( $media_styles[0]['width'] ) ) ? $media_styles[0]['width'] : 60;
		if ( ( 'card' === $style && $container_max_width > 500 ) || $media_width > 600 ) {
			$size = 'full';
		} elseif ( 'card' === $style && $container_max_width <= 500 && $container_max_width > 100 ) {
			$size = 'large';
		} elseif ( 'card' === $style && $container_max_width <= 100 ) {
			$size = 'medium';
		} elseif ( $media_width <= 600 && $media_width > 100 ) {
			$size = 'large';
		} elseif ( $media_width <= 100 && $media_width > 75 ) {
			$size = 'medium';
		} elseif ( $media_width <= 75 ) {
			$size = 'thumbnail';
		} else {
			$size = 'full';
		}
		$object_fit = ( ! empty( $media_styles[0]['backgroundSize'] ) ) ? $media_styles[0]['backgroundSize'] : '';
		$object_fit = ( 'auto' === $object_fit ) ? 'none' : $object_fit;
		$css_style  = ( $style === 'card' && ! empty( $object_fit ) ? 'object-fit: ' . $object_fit . ';' : '' );
		if ( isset( $media_styles[0]['borderRadius'] ) && is_numeric( $media_styles[0]['borderRadius'] ) ) {
			$css_style .= 'border-radius: ' . $media_styles[0]['borderRadius'] . 'px;';
		}
		if ( $use_attachment ) {
			$classes = [ 'kt-testimonial-image', 'wp-image-' . $attributes['id'], 'size-' . $size ];
			$args    = [ 'class' => implode( ' ', $classes ) ];
			if ( ! empty( $css_style ) ) {
				$args['style'] = $css_style;
			}
			return wp_get_attachment_image( $attributes['id'], $size, false, $args );
		}
		$image_url = $this->get_media_url( $attributes, $media_styles, $style, $container_max_width );
		return '<img src="' . $image_url . '" class="kt-testimonial-image"' . ( ! empty( $css_style ) ? ' style="' . $css_style . '"' : '' ) . ' />';
	}
	/**
	 * Get the media URL
	 *
	 * @param array  $attributes The attributes.
	 * @param array  $mediaStyles The media styles.
	 * @param string $style The style.
	 * @param int    $containerMaxWidth The container max width.
	 * @return string The media URL.
	 */
	private function get_media_url( $attributes, $mediaStyles, $style, $containerMaxWidth ) {

		$urlOutput = $attributes['url'];

		if ( ! empty( $attributes['sizes'] ) && ! empty( $attributes['sizes']['thumbnail'] ) ) {
			if ( ( 'card' === $style && $containerMaxWidth > 500 ) || $mediaStyles[0]['width'] > 600 ) {
				$urlOutput = $attributes['url'];
			} elseif ( 'card' === $style && $containerMaxWidth <= 500 && $containerMaxWidth > 100 ) {
				if ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 1000 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} elseif ( 'card' === $style && $containerMaxWidth <= 100 ) {
				if ( isset( $attributes['sizes']['medium'] ) && $attributes['sizes']['medium'] && $attributes['sizes']['medium']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['medium']['url'];
				} elseif ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} elseif ( $mediaStyles[0]['width'] <= 600 && $mediaStyles[0]['width'] > 100 ) {
				if ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 1000 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} elseif ( $mediaStyles[0]['width'] <= 100 && $mediaStyles[0]['width'] > 75 ) {
				if ( isset( $attributes['sizes']['medium'] ) && $attributes['sizes']['medium'] && $attributes['sizes']['medium']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['medium']['url'];
				} elseif ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} elseif ( $mediaStyles[0]['width'] <= 75 ) {
				if ( isset( $attributes['sizes']['thumbnail'] ) && $attributes['sizes']['thumbnail'] && $attributes['sizes']['thumbnail']['width'] > 140 ) {
					$urlOutput = $attributes['sizes']['thumbnail']['url'];
				} elseif ( isset( $attributes['sizes']['medium'] ) && $attributes['sizes']['medium'] && $attributes['sizes']['medium']['width'] > 140 ) {
					$urlOutput = $attributes['sizes']['medium']['url'];
				} elseif ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			}
		}

		return $urlOutput;
	}

	private function render_title( $attributes, $titleFont ) {
		$title = '<div class="kt-testimonial-title-wrap">';

		$level = ( ! empty( $titleFont[0]['level'] ) && is_numeric( $titleFont[0]['level'] ) ? $titleFont[0]['level'] : 2 );

		$title .= '<h' . $level . ' class="kt-testimonial-title">';
		$title .= $attributes['title'];
		$title .= '</h' . $level . '>';

		$title .= '</div>';

		return $title;
	}

	private function render_rating( $attributes, $ratingStyles ) {
		if ( ! empty( $ratingStyles[0]['size'] ) ) {
			$extras = ' height="' . esc_attr( $ratingStyles[0]['size'] ) . '" width="' . esc_attr( $ratingStyles[0]['size'] ) . '"';
		} else {
			$extras = '';
		}
		// Remove title from individual SVGs since we'll use aria-label on container
		$svg = Kadence_Blocks_Svg_Render::render( 'fas_star', 'currentColor', ( ! empty( $ratingStyles[0]['size'] ) ? $ratingStyles[0]['size'] : '' ), '', false, $extras . ' aria-hidden="true"' );

		// translators: %1$d is the rating number, %2$d is the total number of stars.
		$aria_label = sprintf( esc_attr__( '%1$d out of %2$d stars', 'kadence-blocks' ), $attributes['rating'], 5 );
		
		$rating = '<div class="kt-testimonial-rating-wrap kt-testimonial-rating-' . esc_attr( $attributes['rating'] ) . '" role="img" aria-label="' . $aria_label . '">';

		for ( $i = 0; $i < $attributes['rating']; $i++ ) {
			$rating .= '<div class="kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-' . ( $i + 1 ) . '" aria-hidden="true">';
			$rating .= $svg;
			$rating .= '</div>';
		}

		$rating .= '</div>';

		return $rating;
	}

	private function render_content( $attributes ) {
		$content  = '<div class="kt-testimonial-content-wrap">';
		$content .= '<blockquote class="kt-testimonial-content">';
		$content .= $attributes['content'];
		$content .= '</blockquote>';
		$content .= '</div>';

		return $content;
	}
}

Kadence_Blocks_Testimonial_Block::get_instance();
