<?php
/**
 * Class to Build the Countup Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Countup Block.
 *
 * @category class
 */
class Kadence_Blocks_Countup_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'countup';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

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
		$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
		if ( ! empty( $attributes['titleColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['titleColor'] ) );
		}
		$css->render_typography( $attributes, 'titleFont' );
		$title_padding_args = [
			'desktop_key' => 'titlePadding',
			'tablet_key'  => 'titleTabletPadding',
			'mobile_key'  => 'titleMobilePadding',
		];
		$css->render_measure_output( $attributes, 'titlePadding', 'padding', $title_padding_args );
		$title_margin_args = [
			'desktop_key' => 'titleMargin',
			'tablet_key'  => 'titleTabletMargin',
			'mobile_key'  => 'titleMobileMargin',
		];
		$css->render_measure_output( $attributes, 'titleMargin', 'margin', $title_margin_args );
		
		if ( isset( $attributes['titleMinHeight'] ) && is_array( $attributes['titleMinHeight'] ) && isset( $attributes['titleMinHeight'][0] ) ) {
			if ( is_numeric( $attributes['titleMinHeight'][0] ) ) {
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'min-height', $attributes['titleMinHeight'][0] . 'px' );
			}
			if ( isset( $attributes['titleMinHeight'][1] ) && is_numeric( $attributes['titleMinHeight'][1] ) ) {
				$css->set_media_state( 'tablet' ); // 767px) and (max-width: 1024px
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'min-height', $attributes['titleMinHeight'][1] . 'px' );
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $attributes['titleMinHeight'][2] ) && is_numeric( $attributes['titleMinHeight'][2] ) ) {
				$css->set_media_state( 'mobile' ); // 767px
				$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );
				$css->add_property( 'min-height', $attributes['titleMinHeight'][2] . 'px' );
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['titleAlign'] ) ) {
			$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-title' );

			if ( ! empty( $attributes['titleAlign'][0] ) ) {
				$css->add_property( 'text-align', $attributes['titleAlign'][0] );
			}

			if ( ! empty( $attributes['titleAlign'][1] ) ) {
				$css->set_media_state( 'tablet' ); // 767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['titleAlign'][1] );
				$css->set_media_state( 'desktop' );
			}

			if ( ! empty( $attributes['titleAlign'][2] ) ) {
				$css->set_media_state( 'mobile' ); // 767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['titleAlign'][2] );
				$css->set_media_state( 'desktop' );
			}       
		}
		$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );

		if ( ! empty( $attributes['numberColor'] ) ) {
			$css->add_property( 'color', $css->render_color( $attributes['numberColor'] ) );
		}
		if ( isset( $attributes['numberFont'][0] ) && is_array( $attributes['numberFont'][0] ) ) {
			$css->render_typography( $attributes, 'numberFont' );
			// $number_font = $attributes['numberFont'][0];
			// if ( isset( $number_font['size'] ) && is_array( $number_font['size'] ) && ! empty( $number_font['size'][0] ) ) {
			// $css->add_property( 'font-size', $number_font['size'][0] . ( ! isset( $number_font['sizeType'] ) ? 'px' : $number_font['sizeType'] ) );
			// }
			// if ( isset( $number_font['lineHeight'] ) && is_array( $number_font['lineHeight'] ) && ! empty( $number_font['lineHeight'][0] ) ) {
			// $css->add_property( 'line-height', $number_font['lineHeight'][0] . ( ! isset( $number_font['lineType'] ) ? 'px' : $number_font['lineType'] ) );
			// }
			// if ( isset( $number_font['letterSpacing'] ) && ! empty( $number_font['letterSpacing'] ) ) {
			// $css->add_property( 'letter-spacing', $number_font['letterSpacing'] . 'px' );
			// }
			// if ( isset( $number_font['textTransform'] ) && ! empty( $number_font['textTransform'] ) ) {
			// $css->add_property( 'text-transform', $number_font['textTransform'] );
			// }
			// if ( isset( $number_font['family'] ) && ! empty( $number_font['family'] ) ) {
			// $css->add_property( 'font-family', $number_font['family'] );
			// }
			// if ( isset( $number_font['style'] ) && ! empty( $number_font['style'] ) ) {
			// $css->add_property( 'font-style', $number_font['style'] );
			// }
			// if ( isset( $number_font['weight'] ) && ! empty( $number_font['weight'] ) ) {
			// $css->add_property( 'font-weight', $number_font['weight'] );
			// }
			// if ( isset( $number_font['padding'] ) && is_array( $number_font['padding'] ) ) {
			// $css->add_property( 'padding', $number_font['padding'][0] . 'px ' . $number_font['padding'][1] . 'px ' . $number_font['padding'][2] . 'px ' . $number_font['padding'][3] . 'px' );
			// }
			// if ( isset( $number_font['margin'] ) && is_array( $number_font['margin'] ) ) {
			// $css->add_property( 'margin', $number_font['margin'][0] . 'px ' . $number_font['margin'][1] . 'px ' . $number_font['margin'][2] . 'px ' . $number_font['margin'][3] . 'px' );
			// }
		} else {
			$css->add_property( 'font-size', '50px' );
		}
		$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
		$number_padding_args = [
			'desktop_key' => 'numberPadding',
			'tablet_key'  => 'numberTabletPadding',
			'mobile_key'  => 'numberMobilePadding',
		];
		$css->render_measure_output( $attributes, 'numberPadding', 'padding', $number_padding_args );
		$number_margin_args = [
			'desktop_key' => 'numberMargin',
			'tablet_key'  => 'numberTabletMargin',
			'mobile_key'  => 'numberMobileMargin',
		];
		$css->render_measure_output( $attributes, 'numberMargin', 'margin', $number_margin_args );
		if ( isset( $attributes['numberAlign'] ) ) {
			if ( ! empty( $attributes['numberAlign'][0] ) ) {
				$css->add_property( 'text-align', $attributes['numberAlign'][0] );
			}
			if ( ! empty( $attributes['numberAlign'][1] ) ) {
				$css->set_media_state( 'tablet' ); // 767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['numberAlign'][1] );
			}
			if ( ! empty( $attributes['numberAlign'][2] ) ) {
				$css->set_media_state( 'mobile' ); // 767px) and (max-width: 1024px
				$css->add_property( 'text-align', $attributes['numberAlign'][2] );
			}
			$css->set_media_state( 'desktop' );
		}
		$css->set_selector( '.kb-count-up-' . $unique_id . ' .kb-count-up-number' );
		if ( $css->is_number( $attributes['numberMinHeight'][0] ) ) {
			$css->add_property( 'min-height', $attributes['numberMinHeight'][0] . 'px' );
		}
		if ( $css->is_number( $attributes['numberMinHeight'][1] ) ) {
			$css->set_media_state( 'tablet' );
			$css->add_property( 'min-height', $attributes['numberMinHeight'][1] . 'px' );
		}
		if ( $css->is_number( $attributes['numberMinHeight'][2] ) ) {
			$css->set_media_state( 'mobile' );
			$css->add_property( 'min-height', $attributes['numberMinHeight'][2] . 'px' );
		}
		$css->set_media_state( 'desktop' );

		return $css->css_output();
	}
	/**
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		if ( $this->has_script ) {
			if ( ! wp_script_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_script( 'kadence-blocks-' . $this->block_name );
			}
		}
	}
	/**
	 * Builds HTML for block.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		if ( apply_filters( 'kadence-blocks-countup-static', false, $attributes, $block_instance ) ) {
			$prefix         = ( $attributes['prefix'] ?? '' );
			$suffix         = ( $attributes['suffix'] ?? '' );
			$start          = ( $attributes['start'] ?? 0 );
			$ending_number  = ( $attributes['end'] ?? 100 );
			$separator      = ( $attributes['separator'] ?? '' );
			$decimal        = ( $attributes['decimal'] ?? '' );
			$decimal_spaces = ( $attributes['decimalSpaces'] ?? 2 );
			$duration       = ( $attributes['duration'] ?? '2.5' );
			$countup_args   = [
				'class'         => 'wp-block-kadence-countup kb-count-up-' . $unique_id . ' kb-count-up',
				'data-start'    => $start,
				'data-end'      => $ending_number,
				'data-duration' => $duration,
				'data-prefix'   => $prefix,
				'data-suffix'   => $suffix,
			];
			if ( ! empty( $separator ) ) {
				$countup_args['data-separator'] = $separator;
			}
			if ( ! empty( $separator ) ) {
				$countup_args['data-separator'] = $separator;
			}
			if ( ! empty( $decimal ) ) {
				$countup_args['data-decimal']        = $decimal;
				$countup_args['data-decimal-spaces'] = $decimal_spaces;

			}
			foreach ( $countup_args as $key => $value ) {
				$countup_div_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
			$countup_attributes = implode( ' ', $countup_div_attributes );
			$countup_content    = '<div class="kb-count-up-process kb-count-up-number">' . esc_html( $prefix . $ending_number . $suffix ) . '</div>';
			$countup_title      = '';
			if ( ! empty( $attributes['title'] ) && isset( $attributes['displayTitle'] ) && $attributes['displayTitle'] ) {
				$title_tag     = ( ! empty( $attributes['titleFont'][0]['htmlTag'] ) && 'heading' !== $attributes['titleFont'][0]['htmlTag'] ? $attributes['titleFont'][0]['htmlTag'] : 'h' . $attributes['titleFont'][0]['level'] );
				$countup_title = '<' . esc_attr( $title_tag ) . ' class="kb-count-up-title">' . esc_html( $attributes['title'] ) . '</' . esc_attr( $title_tag ) . '>';
			}
			$content = sprintf( '<div %1$s>%2$s%3$s</div>', $countup_attributes, $countup_content, $countup_title );
		}
		return $content;
	}
	
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS file.
		// parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}
		wp_register_script( 'kadence-countup', KADENCE_BLOCKS_URL . 'includes/assets/js/countUp.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-countup', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-countup.min.js', [ 'kadence-countup' ], KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Countup_Block::get_instance();
