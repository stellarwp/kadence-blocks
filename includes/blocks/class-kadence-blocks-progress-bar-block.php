<?php
/**
 * Class to Build the Progress Bar Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Progress Bar Block.
 *
 * @category class
 */
class Kadence_Blocks_Progress_Bar_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'progress-bar';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected static $progress_bars = [];

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

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
	 * Class Constructor.
	 */
	public function __construct() {
		parent::__construct();
		add_action( 'wp_footer', [ $this, 'data_enqueue' ], 9 );
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css        the css class for blocks.
	 * @param string             $unique_id  the blocks attr ID.
	 * @param string             $unique_style_id  the blocks style ID.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$css->set_selector( '.kb-progress-bar-container' . $unique_id . ',  .kt-inside-inner-col > .aligncenter.kb-progress-bar-container' . $unique_id );
		$css->render_responsive_size( $attributes, [ 'containerMaxWidth', 'tabletContainerMaxWidth', 'mobileContainerMaxWidth' ], 'width', 'containerMaxWidthUnits' );

		$css->set_selector( '.kb-progress-bar-container' . $unique_id );
		$css->render_measure_output( $attributes, 'margin', 'margin' );

		if ( ! isset( $attributes['barType'] ) || ( isset( $attributes['barType'] ) && 'line' === $attributes['barType'] ) ) {
			$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' svg' );

			if ( ! empty( $attributes['progressBorderRadius'][0] ) ) {
				$css->add_property( 'border-radius', $attributes['progressBorderRadius'][0] . 'px' );
			}

			if ( ! empty( $attributes['progressBorderRadius'][1] ) ) {
				$css->set_media_state( 'tablet' );
				$css->add_property( 'border-radius', $attributes['progressBorderRadius'][1] . 'px' );
				$css->set_media_state( 'desktop' );
			}

			if ( ! empty( $attributes['progressBorderRadius'][2] ) ) {
				$css->set_media_state( 'mobile' );
				$css->add_property( 'border-radius', $attributes['progressBorderRadius'][2] . 'px' );
				$css->set_media_state( 'desktop' );
			}
		}

		$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' .kb-progress-label-wrap' );
		$css->render_measure_output( $attributes, 'labelPadding', 'padding' );

		$is_inside = ! isset( $attributes['labelPosition'] ) || ( isset( $attributes['labelPosition'] ) && $attributes['labelPosition'] === 'inside' );
		$barType   = ! empty( $attributes['barType'] ) ? $attributes['barType'] : 'line';

		if ( ! empty( $attributes['hAlign'] ) ) {
			$this->responsive_alignment( $attributes['hAlign'], $css );
		} else {
			$css->add_property( 'justify-content', 'space-between' );
		}

		if ( $is_inside && $barType === 'line' ) {
			$css->add_property( 'width', '100%' );
		}

		if ( ! empty( $attributes['thAlign'] ) ) {
			$css->set_media_state( 'tablet' );
			$this->responsive_alignment( $attributes['thAlign'], $css );
			$css->set_media_state( 'desktop' );
		}

		if ( ! empty( $attributes['mhAlign'] ) ) {
			$css->set_media_state( 'mobile' );
			$this->responsive_alignment( $attributes['mhAlign'], $css );
			$css->set_media_state( 'desktop' );
		}

		if ( isset( $attributes['labelLayout'] ) && ( $attributes['labelLayout'] === 'lt' || $attributes['labelLayout'] === 'lb' ) ) {
			$css->add_property( 'flex-direction', 'column' );
		}

		$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' .kb-progress-label-wrap .kt-progress-label' );
		$css->render_typography( $attributes, 'labelFont' );

		$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' .kb-progress-label-wrap .kt-progress-percent' );

		if ( isset( $attributes['numberFont'], $attributes['labelFont'] ) ) {
			$default_font = $this->get_default_font();
			$diff         = $this->array_recursive_diff( $attributes['numberFont'], $default_font );

			$attributes['numberFont'] = array_merge( $attributes['labelFont'], $diff );
			$css->render_typography( $attributes, 'numberFont' );
		} elseif ( isset( $attributes['numberFont'] ) ) {
			$css->render_typography( $attributes, 'numberFont' );
		} elseif ( isset( $attributes['labelFont'] ) ) {
			$css->render_typography( $attributes, 'labelFont' );
		}

		if ( isset( $attributes['barType'] ) && 'line-mask' == $attributes['barType'] ) {
			// We assume square masks for all this math.

			$iterations    = $attributes['maskIterations'] ?? 5;
			$mask          = ! empty( $attributes['maskSvg'] ) ? $attributes['maskSvg'] : 'star';
			$mask_base_url = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/';
			$mask_url      = $mask_base_url . $mask . '.svg';
			// $mask_gap = $attributes['maskGap'] ?? 10;
			$progress_width     = ! empty( $attributes['progressWidth'] ) ? absint( $attributes['progressWidth'] ) : 2;
			$mask_height        = ! empty( $progress_width ) ? ( absint( $progress_width ) * 11.5 ) : 80;
			$mask_height_tablet = ! empty( $attributes['progressWidthTablet'] ) ? ( absint( $attributes['progressWidthTablet'] ) * 11.5 ) : 0;
			$mask_height_mobile = ! empty( $attributes['progressWidthMobile'] ) ? ( absint( $attributes['progressWidthMobile'] ) * 11.5 ) : 0;
			$mask_width         = $mask_height * $iterations;
			$mask_width_tablet  = $mask_height_tablet ? ( $mask_height_tablet * $iterations ) : 0;
			$mask_width_mobile  = $mask_height_mobile ? ( $mask_height_mobile * $iterations ) : 0;
			// $mask_gap_aspect_ratio_adjustment = ( $iterations + 1 ) * ( $mask_gap / $mask_height );

			if ( 'custom' === $mask ) {
				if ( ! empty( $attributes['maskUrl'] ) ) {
					$mask_url = $attributes['maskUrl'];
				} else {
					$mask_url = $mask_base_url . 'star.svg';
				}
			}

			$mask_image_string    = trim( str_repeat( 'url(' . $mask_url . '),', $iterations ), ',' );
			$mask_repeat_string   = trim( str_repeat( 'no-repeat,', $iterations ), ',' );
			$mask_position_array  = $iterations > 1 ? range( 0, 100, 100 / ( $iterations - 1 ) ) : [ 0 ];
			$mask_position_string = trim( implode( '%,', $mask_position_array ) . '%', ',' );
			// $mask_position_string = 'calc(0% + ' . $mask_gap . 'px), calc(25% + ' . ( $mask_gap * 2 ) . 'px), calc(50% + ' . ( $mask_gap * 3 ) . 'px), calc(75% + ' . ( $mask_gap * 4 ) . 'px), calc(100% + ' . ( $mask_gap * 5 ) . 'px)';
			$mask_aspect_ratio_string = $iterations . '/1';
			// $mask_aspect_ratio_string = $iterations + $mask_gap_aspect_ratio_adjustment . '/1';
			$mask_height_string        = $mask_height . 'px';
			$mask_height_tablet_string = $mask_height_tablet ? $mask_height_tablet . 'px' : '';
			$mask_height_mobile_string = $mask_height_mobile ? $mask_height_mobile . 'px' : '';
			$mask_width_string         = $mask_width . 'px';
			$mask_width_tablet_string  = $mask_width_tablet ? $mask_width_tablet . 'px' : '';
			$mask_width_mobile_string  = $mask_width_mobile ? $mask_width_mobile . 'px' : '';

			$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' .kb-progress-bar-' . $unique_id );
			$css->add_property( '-webkit-mask-image', $mask_image_string );
			$css->add_property( 'mask-image', $mask_image_string );

			$css->add_property( '-webkit-mask-size', 'contain' );
			$css->add_property( 'mask-size', 'contain' );

			$css->add_property( '-webkit-mask-repeat', $mask_repeat_string );
			$css->add_property( 'mask-repeat', $mask_repeat_string );

			$css->add_property( '-webkit-mask-position', $mask_position_string );
			$css->add_property( 'mask-position', $mask_position_string );

			$css->add_property( 'aspect-ratio', $mask_aspect_ratio_string );

			$css->add_property( 'height', $mask_height_string );
			$css->add_property( 'width', $mask_width_string );
			$css->add_property( 'max-width', '100%' );

			if ( $mask_height_tablet_string || $mask_width_tablet_string ) {
				$css->set_media_state( 'tablet' );
				if ( $mask_height_tablet_string ) {
					$css->add_property( 'height', $mask_height_tablet_string );
				}
				if ( $mask_width_tablet_string ) {
					$css->add_property( 'width', $mask_width_tablet_string );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( $mask_height_mobile_string || $mask_width_mobile_string ) {
				$css->set_media_state( 'mobile' );
				if ( $mask_height_mobile_string ) {
					$css->add_property( 'height', $mask_height_mobile_string );
				}
				if ( $mask_width_mobile_string ) {
					$css->add_property( 'width', $mask_width_mobile_string );
				}
				$css->set_media_state( 'desktop' );
			}
		}

		return $css->css_output();
	}
	/**
	 * Builds HTML for block.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		$css = new Kadence_Blocks_CSS();

		$simple_id      = str_replace( '-', '', esc_attr( $unique_id ) );
		$progress_color = ! empty( $attributes['progressColor'] ) ? $css->sanitize_color( $attributes['progressColor'], $attributes['progressOpacity'] ) : 'var(--global-palette1, #2B6CB0)';
		$bar_background = ! empty( $attributes['barBackground'] ) ? $css->sanitize_color( $attributes['barBackground'], $attributes['barBackgroundOpacity'] ) : 'var(--global-palette7, #EDF2F7)';

		$prefix          = isset( $attributes['numberPrefix'] ) ? esc_attr( $attributes['numberPrefix'] ) : '';
		$suffix          = isset( $attributes['numberSuffix'] ) ? esc_attr( $attributes['numberSuffix'] ) : '';
		$progress_min    = 0;
		$progress_amount = ! empty( $attributes['progressAmount'] ) ? $attributes['progressAmount'] : 0;
		$progress_max    = ! empty( $attributes['progressMax'] ) ? $attributes['progressMax'] : 100;
		$is_relative     = $attributes['numberIsRelative'] ?? false;
		$decimal         = ! empty( $attributes['decimal'] ) ? $attributes['decimal'] : 'none';
		$delay           = $attributes['delayUntilInView'] ?? true;
		$stroke_widths   = [
			! empty( $attributes['progressWidth'] ) ? $attributes['progressWidth'] : 2,
			! empty( $attributes['progressWidthTablet'] ) ? $attributes['progressWidthTablet'] : ( ! empty( $attributes['progressWidth'] ) ? $attributes['progressWidth'] : 2 ),
			! empty( $attributes['progressWidthMobile'] ) ? $attributes['progressWidthMobile'] : ( ! empty( $attributes['progressWidthTablet'] ) ? $attributes['progressWidthTablet'] : ( ! empty( $attributes['progressWidth'] ) ? $attributes['progressWidth'] : 2 ) ),
		];

		$content = '<div class="kb-progress-bar-container kb-progress-bar-container' . $unique_id . ' kb-progress-bar-init kb-progress-bar-type-' . $attributes['barType'] . ' ' . ( ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : '' ) . '">';

		$content .= $this->get_label( $attributes, 'above' );

		$progress_args = [
			'class' => 'kb-progress-bar kb-progress-bar-' . esc_attr( $unique_id ),
		];
		$mask = ! empty( $attributes['maskSvg'] ) ? $attributes['maskSvg'] : 'star';
		if ( ! empty( $attributes['ariaLabel'] ) ) {
			$progress_args['aria-label'] = $attributes['ariaLabel'];
			$progress_args['role'] = 'note';
		} elseif ( ! empty( $attributes['barType'] ) && $attributes['barType'] === 'line-mask' && 'star' === $mask ) {
			// translators: %1$s is the current progress amount, %2$s is the max progress amount.
			$progress_args['aria-label'] = sprintf( __( '%1$s out of %2$s Stars', 'kadence-blocks' ), $progress_amount, $progress_max );
			$progress_args['role'] = 'note';
		}
		$progress_div_attributes = [];
		foreach ( $progress_args as $key => $value ) {
			$progress_div_attributes[] = $key . '="' . esc_attr( $value ) . '"';
		}
		$progress_attributes = implode( ' ', $progress_div_attributes );
		$bar_type_for_script = $attributes['barType'] == 'line-mask' ? 'line' : $attributes['barType'];
		$progress_real       = $progress_amount <= $progress_max ? $progress_amount : $progress_max;

		$progress_bar_script_args = [
			'unique_id'     => $unique_id,
			'simple_id'     => $simple_id,
			'type'          => $bar_type_for_script,
			'progressColor' => $progress_color,
			'barBackground' => $bar_background,
			'stokeWidths'   => $stroke_widths,
			'decimal'       => $decimal,
			'delay'         => $delay,
			'duration'      => ! empty( $attributes['duration'] ) ? $attributes['duration'] : 1,
			'easing'        => ! empty( $attributes['easing'] ) ? $attributes['easing'] : 'linear',
			'prefix'        => $prefix,
			'suffix'        => $suffix,
			'progress_real' => $progress_real,
			'progress_max'  => $progress_max,
			'is_relative'   => $is_relative,
		];

		$inside_label = $this->get_label( $attributes, 'inside' );

		$static_content = '';
		if ( apply_filters( 'kadence-blocks-progress-bar-static', false, $attributes, $block_instance ) ) {
			$static_content = $this->get_content_svg( $progress_bar_script_args );
		} else {
			self::$progress_bars[ $unique_id ] = $progress_bar_script_args;
		}

		$content .= sprintf( '<div %1$s>%2$s%3$s</div>', $progress_attributes, $inside_label, $static_content );
		$content .= $this->get_label( $attributes, 'below' );

		$content .= '</div>';

		wp_enqueue_script( 'kadence-blocks-' . $this->block_name );
		return $content;
	}
	/**
	 * Get HTML for displaying the svg.
	 *
	 * @param array $args the arguments for the progress bar.
	 *
	 * @return string HTML that creates the svg on the front end.
	 */
	private function get_content_svg( $args ) {
		$svg          = '';
		$stroke_width = ! empty( $args['stokeWidths'][0] ) ? $args['stokeWidths'][0] : 2;
		switch ( $args['type'] ) {
			case 'line':
				$view_box_str = '0 0 100 ' . $stroke_width;
				$path_center  = $stroke_width / 2;
				$path_str     = 'M 0, ' . $path_center . ' L 100, ' . $path_center;
				$path_offset  = 100 - ( ( $args['progress_real'] / $args['progress_max'] ) * 100 );
				$svg          = '<svg viewBox="' . esc_attr( $view_box_str ) . '" preserveAspectRatio="none" style="display: block; width: 100%;">';
				$svg         .= '<path d="' . esc_attr( $path_str ) . '" stroke="' . esc_attr( $args['barBackground'] ) . '" stroke-width="' . esc_attr( $stroke_width ) . '" fill-opacity="0"></path>';
				$svg         .= '<path d="' . esc_attr( $path_str ) . '" stroke="' . esc_attr( $args['progressColor'] ) . '" stroke-width="' . esc_attr( $stroke_width ) . '" fill-opacity="0" style="stroke-dasharray: 100, 100; stroke-dashoffset: ' . esc_attr( $path_offset ) . ';"></path>';
				$svg         .= '</svg>';
				break;
			case 'semicircle':
				$r           = 50 - ( $stroke_width / 2 );
				$r2          = $r * 2;
				$length      = round( 2 * 3.141592653589793 * $r, 2 ) / 2;
				$path_str    = 'M 50,50 m -' . $r . ',0 a ' . $r . ',' . $r . ' 0 1 1 ' . $r2 . ',0';
				$path_offset = $length - ( ( $args['progress_real'] / $args['progress_max'] ) * $length );
				$svg         = '<svg viewBox="0 0 100 50" style="display: block; width: 100%;">';
				$svg        .= '<path d="' . esc_attr( $path_str ) . '" stroke="' . esc_attr( $args['barBackground'] ) . '" stroke-width="' . esc_attr( $stroke_width ) . '" fill-opacity="0"></path>';
				$svg        .= '<path d="' . esc_attr( $path_str ) . '" stroke="' . esc_attr( $args['progressColor'] ) . '" stroke-width="' . esc_attr( $stroke_width ) . '" fill-opacity="0" style="stroke-dasharray:' . esc_attr( $length ) . ', ' . esc_attr( $length ) . '; stroke-dashoffset: ' . esc_attr( $path_offset ) . ';"></path></svg>';
				break;
			case 'circle':
				$r           = 50 - ( $stroke_width / 2 );
				$r2          = $r * 2;
				$length      = round( 2 * 3.141592653589793 * $r, 2 );
				$path_offset = $length - ( ( $args['progress_real'] / $args['progress_max'] ) * $length );
				$path_str    = 'M 50,50 m 0,-' . $r . ' a ' . $r . ',' . $r . ' 0 1 1 0,' . $r2 . ' a ' . $r . ',' . $r . ' 0 1 1 0,-' . $r2 . '';
				$svg         = '<svg viewBox="0 0 100 100" style="display: block; width: 100%;">';
				$svg        .= '<path d="' . esc_attr( $path_str ) . '" stroke="' . esc_attr( $args['barBackground'] ) . '" stroke-width="' . esc_attr( $stroke_width ) . '" fill-opacity="0"></path>';
				$svg        .= '<path d="' . esc_attr( $path_str ) . '" stroke="' . esc_attr( $args['progressColor'] ) . '" stroke-width="' . esc_attr( $stroke_width ) . '" fill-opacity="0" style="stroke-dasharray:' . esc_attr( $length ) . ', ' . esc_attr( $length ) . '; stroke-dashoffset: ' . esc_attr( $path_offset ) . ';"></path></svg>';
				break;
		}
		return $svg;
	}

	/**
	 * Get HTML for displaying the label and percentage completed.
	 *
	 * @param $attributes
	 * @param $position
	 *
	 * @return string HTML that creates the labels on the front end.
	 */
	private function get_label( $attributes, $position ) {

		if ( isset( $attributes['labelPosition'] ) && $attributes['labelPosition'] !== $position ) {
			return '';
		}
		$label = '';
		if ( ! empty( $attributes['label'] ) && ( ! isset( $attributes['displayLabel'] ) || ( isset( $attributes['displayLabel'] ) && $attributes['displayLabel'] !== false ) ) ) {
			$label = '<span id="kt-progress-label' . esc_attr( $attributes['uniqueID'] ) . '" role="textbox" class="kt-progress-label" contenteditable="false" aria-label="' . esc_attr__( 'Progressbar Label', 'kadence-blocks' ) . '">' . wp_kses_post( $attributes['label'] ) . '</span>';
		}
		$percent = $this->get_percent( $attributes );

		if ( empty( $label ) && empty( $percent ) ) {
			return '';
		}

		$response = '<div class="kb-progress-label-wrap' . ( $position === 'inside' ? ' kt-progress-label-inside' : '' ) . '">';

		if ( isset( $attributes['labelLayout'] ) && ( $attributes['labelLayout'] === 'pl' || $attributes['labelLayout'] === 'lb' ) ) {
			$response .= $percent . $label;
		} else {
			$response .= $label . $percent;
		}

		$response .= '</div>';

		return $response;
	}

	/**
	 * Get HTML for displaying the percent complete.
	 *
	 * @param $attributes
	 *
	 * @return string
	 */
	private function get_percent( $attributes ) {
		if ( isset( $attributes['displayPercent'] ) && $attributes['displayPercent'] !== true ) {
			return '';
		}

		$prefix          = $attributes['numberPrefix'] ?? '';
		$suffix          = $attributes['numberSuffix'] ?? '';
		$progress_amount = ! empty( $attributes['progressAmount'] ) ? $attributes['progressAmount'] : 0;
		$progress_max    = ! empty( $attributes['progressMax'] ) ? $attributes['progressMax'] : 100;

		$progress_real = $progress_amount <= $progress_max ? $progress_amount : $progress_max;
		$starting      = ! empty( $progress_real ) && ! empty( $attributes['showMaxProgressOnPageLoad'] ) ? $progress_real : 0;

		$position = $attributes['labelPosition'] ?? 'above';

		return '<span id="current-progress-' . $position . $attributes['uniqueID'] . '" class="kb-current-progress-' . $position . ' kt-progress-percent">' . $prefix . $starting . $suffix . '</span>';
	}

	/**
	 * Set responsive alignment CSS based on alignment.
	 *
	 * @param $alignment
	 * @param $css
	 *
	 * @return void
	 */
	private function responsive_alignment( $alignment, $css ) {

		if ( $alignment === 'space-between' ) {
			$css->add_property( 'justify-content', 'space-between' );
		} elseif ( $alignment === 'center' ) {
			$css->add_property( 'justify-content', 'center' );
			$css->add_property( 'text-align', 'center' );
		} elseif ( $alignment === 'left' ) {
			$css->add_property( 'justify-content', 'flex-start' );
		} elseif ( $alignment === 'right' ) {
			$css->add_property( 'justify-content', 'flex-end' );
			$css->add_property( 'text-align', 'right' );
		}
	}

	private function get_default_font() {
		return [
			'color'         => '',
			'level'         => 6,
			'size'          => [
				'',
				'',
				'',
			],
			'sizeType'      => 'px',
			'lineHeight'    => [
				'',
				'',
				'',
			],
			'linetype'      => 'px',
			'letterSpacing' => [
				'',
				'',
				'',
			],
			'textTransform' => '',
			'family'        => '',
			'google'        => false,
			'style'         => '',
			'weight'        => '',
			'variant'       => '',
			'subset'        => '',
			'loadGoogle'    => true,
			'padding'       => [
				0,
				0,
				0,
				0,
			],
			'margin'        => [
				0,
				0,
				0,
				0,
			],
		];
	}

	/**
	 * array_diff_assoc doesn't work on multidimensional arrays, so we need to use this function.
	 * If any sub-key value is different, to entire parent key is returned.
	 *
	 * @param $a_array
	 * @param $b_array
	 *
	 * @return array
	 */
	private function array_recursive_diff( $a_array, $b_array ) {
		$a_return = [];

		foreach ( $a_array as $m_key => $m_value ) {
			if ( array_key_exists( $m_key, $b_array ) ) {
				if ( is_array( $m_value ) ) {
					$a_recursive_diff = $this->array_recursive_diff( $m_value, $b_array[ $m_key ] );
					if ( count( $a_recursive_diff ) ) {
						$a_return[ $m_key ] = $m_value;
					}
				} elseif ( $m_value != $b_array[ $m_key ] ) {
						$a_return[ $m_key ] = $m_value;
				}
			} else {
				$a_return[ $m_key ] = $m_value;
			}
		}
		return $a_return;
	}
	/**
	 * Enqueue the block's items.
	 */
	public function data_enqueue() {
		if ( empty( self::$progress_bars ) ) {
			return;
		}
		wp_localize_script(
			'kadence-blocks-' . $this->block_name,
			'kadence_blocks_progress_bars',
			[
				'items' => wp_json_encode( self::$progress_bars ),
			]
		);
	}
	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		parent::register_scripts();

		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_script( 'kadence-blocks-scroll-magic', KADENCE_BLOCKS_URL . 'includes/assets/js/scroll-magic.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-progress', KADENCE_BLOCKS_URL . 'includes/assets/js/progressBar.min.js', [], KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-progress-bars.min.js', [ 'kadence-blocks-scroll-magic', 'kadence-blocks-progress' ], KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Progress_Bar_Block::get_instance();
