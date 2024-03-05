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
	 * @param array $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
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
		$mediaStyles	   = $this->get_context( $block_instance->context, 'mediaStyles' );
		$ratingStyles	   = $this->get_context( $block_instance->context, 'ratingStyles' );
		$content = '';
		if ( $layout === 'carousel' ) {
			$content .= '<div class="kt-blocks-testimonial-carousel-item kb-slide-item">';
		}

		$classes = array(
			'kt-testimonial-item-wrap',
			'kt-testimonial-item-' . $unique_id,
		);

		if($containerVAlign) {
			$classes[] = 'testimonial-valign-' . $containerVAlign;
		}

		$wrapper_args = array(
			'id' => !empty($attributes['anchor']) ? $attributes['anchor'] : '',
			'class' => implode( ' ', $classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$content .= sprintf('<div %s>', $wrapper_attributes);
		$content .= '<div class="kt-testimonial-text-wrap">';

		if ( $displayIcon && $iconStyles[0]['icon'] && $style !== 'card' ) {
			$content .= $this->render_icon( $attributes, $iconStyles );
		}

		if ( $displayMedia && in_array( $style, array(
				'card',
				'inlineimage'
			) ) && ( ( $attributes['media'] !== 'icon' && $attributes['url'] ) || ( $attributes['media'] === 'icon' && $attributes['icon'] ) ) ) {
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
		if ( ( $displayMedia && ! in_array( $style, array(
					'card',
					'inlineimage'
				) ) ) || $displayOccupation || $displayName ) {
			$content .= '<div class="kt-testimonial-meta-wrap">';
			if ( $displayMedia && !in_array( $style, array(
					'card',
					'inlineimage'
				) ) && ( ( 'icon' !== $attributes['media'] && $attributes['url'] ) || ( 'icon' === $attributes['media'] && $attributes['icon'] ) ) ) {
				$content .= $this->render_media( $attributes, $mediaStyles, $style, $containerMaxWidth );
			}
			$content .= '<div class="kt-testimonial-meta-name-wrap">';

			if ( $displayName ) {
				$content .= '<div class="kt-testimonial-name-wrap">';
				$content .= '<div class="kt-testimonial-name">'. $attributes['name'] .'</div>';
				$content .= '</div>';
			}

			if ( $displayOccupation ) {
				$content .= '<div class="kt-testimonial-occupation-wrap">';
					$content .= '<div class="kt-testimonial-occupation">'. $attributes['occupation'] .'</div>';
				$content .= '</div>';
			}

			$content .= '</div>'; // end: kt-testimonial-meta-name-wrap
			$content .= '</div>'; // end: kt-testimonial-meta-wrap
		}

		$content .= '</div>';

		if ( $layout === 'carousel' ) {
			$content .= '</div>';
		}

		return $content;
	}

	private function get_context( $context, $key, $default = '' ) {
		return isset( $context['kadence/testimonials-' . $key] ) ? $context['kadence/testimonials-' . $key] : $default;
	}

	private function render_icon( $attributes, $iconStyles ) {
		$icon = '<div class="kt-svg-testimonial-global-icon-wrap">';

		$title = isset( $iconStyles[ 0 ]['title'] ) ? $iconStyles[ 0 ]['title'] : '';
		$type = substr($iconStyles[ 0 ]['icon'], 0, 2 );
		$line_icon = ( ! empty( $type ) && 'fe' == $type ? true : false );
		$fill = ( $line_icon ? 'none' : 'currentColor' );
		$stroke_width = false;
		if ( $line_icon ) {
			$stroke_width = ( ! empty( $iconStyles[ 0 ]['stroke'] ) ? $iconStyles[ 0 ]['stroke'] : 2 );
		}

		$svg = Kadence_Blocks_Svg_Render::render( $iconStyles[ 0 ]['icon'], $fill, $stroke_width, $title );

		$icon .= "<div class='kt-svg-testimonial-global-icon kt-svg-testimonial-global-icon-icon-" . $iconStyles[ 0 ]['icon'] . "'>";
		$icon .= $svg;
		$icon .= "</div>";

		$icon .= '</div>';

		return $icon;
	}

	private function render_media( $attributes, $mediaStyles, $style, $containerMaxWidth ) {
		$css_class = Kadence_Blocks_CSS::get_instance();
		$urlOutput = $this->get_media_url( $attributes, $mediaStyles, $style, $containerMaxWidth );
		$type = substr($attributes['icon'], 0, 2 );
		$line_icon = ( ! empty( $type ) && 'fe' == $type ? true : false );
		$fill = ( $line_icon ? 'none' : 'currentColor' );
		$stroke_width = false;
		if ( $line_icon ) {
			$stroke_width = ( ! empty( $attributes['istroke'] ) ? $attributes['istroke'] : 2 );
		}

		$media = '<div class="kt-testimonial-media-wrap">';
		$media .= '<div class="kt-testimonial-media-inner-wrap">';
		$media .= '<div class="kadence-testimonial-image-intrisic">';

		if( $attributes['media'] === 'icon' && $attributes['icon']) {
			$extras = ' height="'.$attributes['isize'].'" width="'.$attributes['isize'].'" style="color: ' . ( isset( $attributes['color'] ) ? $css_class->render_color( $attributes['color'] ) : 'undefined' ) . '"';
			$svg = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width, $attributes['ititle'], false, $extras);

			$media .= '<div class="kt-svg-testimonial-icon kt-svg-testimonial-icon-'. $attributes['icon'] .'">';
			$media .= $svg;
			$media .= '</div>';
		}
		if( $attributes['media'] !== 'icon' && $attributes['url'] ) {
			$media .= '<div class="kt-testimonial-image" style="background-image: url(' . $urlOutput . ');' . ( $style === 'card' ? 'background-size: '. $mediaStyles[0]['backgroundSize'] . ';' : '' ) . '' . ( isset( $mediaStyles[ 0 ]['borderRadius'] ) && is_numeric( $mediaStyles[ 0 ]['borderRadius'] ) ? 'border-radius: ' . $mediaStyles[ 0 ]['borderRadius'] . 'px;' : '' ) . '"></div>';
		}
		$media .= '</div>';
		$media .= '</div>';
		$media .= '</div>';
		return $media;
	}
	
	private function get_media_url( $attributes, $mediaStyles, $style, $containerMaxWidth ) {

		$urlOutput = $attributes['url'];

		if ( ! empty( $attributes['sizes'] ) && ! empty( $attributes['sizes']['thumbnail'] ) ) {
			if ( ( 'card' === $style && $containerMaxWidth > 500 ) || $mediaStyles[0]['width'] > 600 ) {
				$urlOutput = $attributes['url'];
			} else if ( 'card' === $style && $containerMaxWidth <= 500 && $containerMaxWidth > 100 ) {
				if ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 1000 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} else if ( 'card' === $style && $containerMaxWidth <= 100 ) {
				if ( isset( $attributes['sizes']['medium'] ) && $attributes['sizes']['medium'] && $attributes['sizes']['medium']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['medium']['url'];
				} else if ( isset( $attributes['sizes']['large'] ) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} else if ( $mediaStyles[0]['width'] <= 600 && $mediaStyles[0]['width'] > 100 ) {
				if ( isset($attributes['sizes']['large']) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 1000 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} else if ( $mediaStyles[0]['width'] <= 100 && $mediaStyles[0]['width'] > 75 ) {
				if ( isset($attributes['sizes']['medium']) && $attributes['sizes']['medium'] && $attributes['sizes']['medium']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['medium']['url'];
				} else if ( isset($attributes['sizes']['large']) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			} else if ( $mediaStyles[0]['width'] <= 75 ) {
				if ( isset($attributes['sizes']['thumbnail']) && $attributes['sizes']['thumbnail'] && $attributes['sizes']['thumbnail']['width'] > 140 ) {
					$urlOutput = $attributes['sizes']['thumbnail']['url'];
				} else if (isset($attributes['sizes']['medium']) && $attributes['sizes']['medium'] && $attributes['sizes']['medium']['width'] > 140 ) {
					$urlOutput = $attributes['sizes']['medium']['url'];
				} else if ( isset($attributes['sizes']['large']) && $attributes['sizes']['large'] && $attributes['sizes']['large']['width'] > 200 ) {
					$urlOutput = $attributes['sizes']['large']['url'];
				}
			}
		}

		return $urlOutput;
	}

	private function render_title( $attributes, $titleFont ) {
		$title = '<div class="kt-testimonial-title-wrap">';

		$title .= '<h'. $titleFont[0]['level'] .' class="kt-testimonial-title">';
		$title .= $attributes['title'];
		$title .= '</h'. $titleFont[0]['level'] .'>';

		$title .= '</div>';

		return $title;
	}

	private function render_rating( $attributes, $ratingStyles ) {
		if ( ! empty( $ratingStyles[ 0 ]['size'] ) ) {
			$extras = ' height="'. $ratingStyles[ 0 ]['size'] .'" width="'.$ratingStyles[ 0 ]['size'].'"';
		} else {
			$extras = '';
		}
		// translators: %d is the number for the star rating.
		$svg_title = sprintf( esc_html__( '%d star rating', 'kadence-blocks' ), $attributes['rating'] );
		$svg = Kadence_Blocks_Svg_Render::render( 'fas_star', 'currentColor', ( ! empty(  $ratingStyles[ 0 ]['size'] ) ? $ratingStyles[ 0 ]['size'] : '' ), $svg_title, false, $extras );

		$rating = '<div class="kt-testimonial-rating-wrap kt-testimonial-rating-'. $attributes['rating'] .'">';

		for( $i = 0; $i < $attributes['rating']; $i++ ) {
			$rating .= '<div class="kt-svg-testimonial-rating-icon kt-svg-testimonial-rating-icon-'. ($i + 1) .'">';
			$rating .= $svg;
			$rating .= '</div>';
		}

		$rating .= '</div>';

		return $rating;
	}

	private function render_content( $attributes ) {
		$content = '<div class="kt-testimonial-content-wrap">';
		$content .= '<div class="kt-testimonial-content">';
		$content .= $attributes['content'];
		$content .= '</div>';
		$content .= '</div>';

		return $content;
	}
}

Kadence_Blocks_Testimonial_Block::get_instance();
