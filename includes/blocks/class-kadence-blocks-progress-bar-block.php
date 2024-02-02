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
	 * Builds CSS for block.
	 *
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css        the css class for blocks.
	 * @param string             $unique_id  the blocks attr ID.
	 * @param string             $unique_style_id  the blocks style ID.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {

		wp_enqueue_script( 'kadence-blocks-' . $this->block_name );
		wp_enqueue_script( 'kadence-blocks-scroll-magic' );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		$css->set_selector( '.kb-progress-bar-container' . $unique_id );

		$css->render_responsive_size( $attributes, array( 'containerMaxWidth', 'tabletContainerMaxWidth', 'mobileContainerMaxWidth' ), 'width', 'containerMaxWidthUnits' );
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
		$barType = !empty( $attributes['barType'] ) ? $attributes['barType'] : 'line';

		if ( ! empty( $attributes['hAlign'] ) ) {
			$this->responsive_alignment( $attributes['hAlign'], $css );
		} else {
			$css->add_property( 'justify-content', 'space-between' );

			if( $is_inside && $barType === 'line' ) {
				$css->add_property( 'width', '100%' );
			}
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

		if( isset( $attributes['numberFont'], $attributes['labelFont'] ) ) {
			$default_font = $this->get_default_font();
			$diff = $this->arrayRecursiveDiff( $attributes['numberFont'], $default_font );
			$attributes['numberFont'] = array_merge( $attributes['labelFont'], $diff );

			$css->render_typography( $attributes, 'numberFont' );
		}  else if ( isset( $attributes['numberFont'] ) ) {
			$css->render_typography( $attributes, 'numberFont' );
		} else if ( isset( $attributes['labelFont'] ) ) {
			$css->render_typography( $attributes, 'labelFont' );
		}

		if ( isset( $attributes['barType'] ) && 'line-mask' == $attributes['barType'] ) {
			// We assume square masks for all this math.

			$iterations = $attributes['maskIterations'] ?? 5;
			$mask = ! empty( $attributes['maskSvg'] ) ? $attributes['maskSvg'] : 'star';
			$mask_base_url = KADENCE_BLOCKS_URL . 'includes/assets/images/masks/';
			$mask_url = $mask_base_url . $mask . '.svg';
			// $mask_gap = $attributes['maskGap'] ?? 10;
			$progress_width = ! empty( $attributes['progressWidth'] ) ? absint( $attributes['progressWidth'] ) : 2;
			$mask_height = ! empty( $progress_width ) ? ( absint( $progress_width ) * 11.5 ) : 80;
			$mask_height_tablet = ! empty( $attributes['progressWidthTablet'] ) ? ( absint( $attributes['progressWidthTablet'] ) * 11.5 ) : 0;
			$mask_height_mobile = ! empty( $attributes['progressWidthMobile'] ) ? ( absint( $attributes['progressWidthMobile'] ) * 11.5 ) : 0;
			// $mask_gap_aspect_ratio_adjustment = ( $iterations + 1 ) * ( $mask_gap / $mask_height );

			if ( 'custom' === $mask ) {
				if ( ! empty( $attributes['maskUrl'] ) ) {
					$mask_url = $attributes['maskUrl'];
				} else {
					$mask_url = $mask_base_url . 'star.svg';
				}
			}

			$mask_image_string = trim( str_repeat( 'url(' . $mask_url . '),', $iterations ), ',' );
			$mask_repeat_string = trim( str_repeat( 'no-repeat,', $iterations ), ',' );
			$mask_position_array = $iterations > 1 ? range( 0, 100, 100 / ( $iterations - 1 ) ) : array( 0 );
			$mask_position_string = trim( implode( '%,', $mask_position_array ) . '%', ',' );
			// $mask_position_string = 'calc(0% + ' . $mask_gap . 'px), calc(25% + ' . ( $mask_gap * 2 ) . 'px), calc(50% + ' . ( $mask_gap * 3 ) . 'px), calc(75% + ' . ( $mask_gap * 4 ) . 'px), calc(100% + ' . ( $mask_gap * 5 ) . 'px)';
			$mask_aspect_ratio_string = $iterations . '/1';
			// $mask_aspect_ratio_string = $iterations + $mask_gap_aspect_ratio_adjustment . '/1';
			$mask_height_string = $mask_height . 'px';
			$mask_height_tablet_string = $mask_height_tablet ? $mask_height_tablet . 'px' : '';
			$mask_height_mobile_string = $mask_height_mobile ? $mask_height_mobile . 'px' : '';

			$css->set_selector( '#kb-progress-bar' . $unique_id );
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

			if ( $mask_height_tablet_string ) {
				$css->set_media_state( 'tablet' );
				$css->add_property( 'height', $mask_height_tablet_string );
			}
			if ( $mask_height_mobile_string ) {
				$css->set_media_state( 'mobile' );
				$css->add_property( 'height', $mask_height_mobile_string );
			}
		}

		return $css->css_output();
	}
	/**
	 * Builds HTML for block.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		$css = new Kadence_Blocks_CSS();

		$simple_id = str_replace( '-', '', esc_attr( $unique_id ) );

		$bar_types = array(
			'line'       => 'Line',
			'circle'     => 'Circle',
			'semicircle' => 'SemiCircle'
		);

		$progress_color = ! empty( $attributes['progressColor'] ) ? $css->sanitize_color( $attributes['progressColor'], $attributes['progressOpacity'] ) : 'var(--global-palette1, #2B6CB0)';
		$bar_background = ! empty( $attributes['barBackground'] ) ? $css->sanitize_color( $attributes['barBackground'], $attributes['barBackgroundOpacity'] ) : 'var(--global-palette7, #EDF2F7)';

		$prefix       = isset( $attributes['numberPrefix'] ) ? $attributes['numberPrefix'] : '';
		$suffix       = isset( $attributes['numberSuffix'] ) ? $attributes['numberSuffix'] : '';
		$progress_min = 0;
		$progress_amount = ! empty( $attributes['progressAmount'] ) ? $attributes['progressAmount'] : 0;
		$progress_max = ! empty( $attributes['progressMax'] ) ? $attributes['progressMax'] : 100;
		$is_relative  = isset( $attributes['numberIsRelative'] ) ? $attributes['numberIsRelative'] : false;
		$decimal      = ! empty( $attributes['decimal'] ) ? $attributes['decimal'] : 'none';
		$delay        = isset( $attributes['delayUntilInView'] ) ? $attributes['delayUntilInView'] : true;
		$stroke_widths = array(
			! empty( $attributes['progressWidth'] ) ? $attributes['progressWidth'] : 2,
			! empty( $attributes['progressWidthTablet'] ) ? $attributes['progressWidthTablet'] : ( ! empty( $attributes['progressWidth'] ) ? $attributes['progressWidth'] : 2 ),
			! empty( $attributes['progressWidthMobile'] ) ? $attributes['progressWidthMobile'] : ( ! empty( $attributes['progressWidthTablet'] ) ? $attributes['progressWidthTablet'] : ( ! empty( $attributes['progressWidth'] ) ? $attributes['progressWidth'] : 2 ) ),
		);

		$content = '<div class="kb-progress-bar-container kb-progress-bar-container' . $unique_id . ' kb-progress-bar-type-' . $attributes['barType'] . ' ' . ( ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : '' ) . '">';

		$content .= $this->get_label( $attributes, 'above' );

		// aria-valuenow="50".
		
		$content .= '<div id="kb-progress-bar' . $unique_id . '" class="kb-progress-bar" role="progressbar" aria-label="' . esc_attr( strip_tags( $attributes['label'] ) ) . '" aria-valuemin="' . esc_attr( $progress_min ) . '" aria-valuemax="' . ( $is_relative ? 100 : $progress_max ) . '">' . ( $this->get_label( $attributes, 'inside' ) ) . '</div>';

		$content .= $this->get_label( $attributes, 'below' );

		$content .= '</div>';

		$bar_type_for_script = $attributes['barType'] == 'line-mask' ? 'line' : $attributes['barType'];

		$content .= '<script>
			function reportWindowSize() {
			  let barContainer = document.querySelector("#kb-progress-bar' . $unique_id . '");
			  let type = "' . $bar_type_for_script . '";
			  let barSvg = barContainer.querySelector("svg");
			  if ( ! barSvg ) {
			  	return;
			  }
			  let barPaths = barSvg.querySelectorAll("path");
			  let path1 = barPaths[0];
			  let path2 = barPaths[1];
			  let stokeWidths = [' . implode( ',', $stroke_widths ) . '];
			  if( window.innerWidth < 768 ) {
			    if( type === "line" ){
			        barSvg.setAttribute( "viewBox", "0 0 100 " + stokeWidths[2]);
	                path1.setAttribute( "d", "M 0," + ( stokeWidths[2] / 2) + " L 100," + ( stokeWidths[2] / 2));
	                path2.setAttribute( "d", "M 0," + ( stokeWidths[2] / 2) + " L 100," + ( stokeWidths[2] / 2));
				}
			    path1.setAttribute( "stroke-width", stokeWidths[2]);
                path2.setAttribute( "stroke-width", stokeWidths[2]);
			  } else if( window.innerWidth < 1025 ) {
                if( type === "line" ){
			        barSvg.setAttribute( "viewBox", "0 0 100 " + stokeWidths[1]);
	                path1.setAttribute( "d", "M 0," + ( stokeWidths[1] / 2) + " L 100," + ( stokeWidths[1] / 2));
	                path2.setAttribute( "d", "M 0," + ( stokeWidths[1] / 2) + " L 100," + ( stokeWidths[1] / 2));
			    }
                path1.setAttribute( "stroke-width", stokeWidths[1]);
                path2.setAttribute( "stroke-width", stokeWidths[1]);
			  } else {
			    if( type === "line" ){
			        barSvg.setAttribute( "viewBox", "0 0 100 " + stokeWidths[0]);
	                path1.setAttribute( "d", "M 0," + ( stokeWidths[0] / 2) + " L 100," + ( stokeWidths[0] / 2));
                    path2.setAttribute( "d", "M 0," + ( stokeWidths[0] / 2) + " L 100," + ( stokeWidths[0] / 2));
			    }
                path1.setAttribute( "stroke-width", stokeWidths[0]);
                path2.setAttribute( "stroke-width", stokeWidths[0]);
			  }
			}
			window.onresize = reportWindowSize;
			var waitForProgressBar' . $simple_id . ' = setInterval(function () {
				if (typeof ProgressBar !== "undefined" ) {
					clearInterval(waitForProgressBar' . $simple_id . ');
					let responsiveStrokeSizes = [' . implode( ',', $stroke_widths ) . '];
					let initialStroke;
				    if( window.innerWidth < 768 ) {
				        initialStroke = responsiveStrokeSizes[2];
			        } else if( window.innerWidth < 1025 ) {
                        initialStroke = responsiveStrokeSizes[1];
				    } else {
                        initialStroke = responsiveStrokeSizes[0];
                    }
					let progressBar' . $simple_id . ' = new ProgressBar.' . $bar_types[ $bar_type_for_script ] . '("#kb-progress-bar' . $unique_id . '", {
						color: "' . $progress_color . '",
						trailColor: "' . $bar_background . '",
						duration: "' . ( $attributes['duration'] * 1000 ) . '",
						easing: "' . $attributes['easing'] . '",
						strokeWidth: initialStroke,
					});';

		if ( $delay ) {
			$content .= '
				let progressBarController' . $simple_id . ' = new ScrollMagic.Controller();
				let desiredAnimation = new ScrollMagic.Scene({triggerElement: "#kb-progress-bar' . $unique_id . '"});
				desiredAnimation.triggerHook(0.88);
				desiredAnimation.addTo( progressBarController' . $simple_id . ' );
				desiredAnimation.on("start", function (e) {';
		}

		$content .= 'progressBar' . $simple_id . '.animate(
							' . $progress_amount / $progress_max . ' ,
				            {
								 duration: ' . ( $attributes['duration'] * 1000 ) . ',
	                             step: function(state, bar) {
	                                let value = 0;
                                    let elementContainer = document.getElementById("kb-progress-bar' . $unique_id . '");
	                                let elementAbove = document.getElementById("current-progress-above' . $unique_id . '");
	                                let elementInside = document.getElementById("current-progress-inside' . $unique_id . '");
	                                let elementBelow = document.getElementById("current-progress-below' . $unique_id . '");
	                                if( ' . ( $is_relative ? 'true' : 'false' ) . ' ) {
	                                    value = Math.round(bar.value() * 100 );
	                                } else {
	                                    value = Math.round(bar.value() * ' . $progress_max . ');
	                                }
									' . ( $is_relative ? 'value = bar.value() * 100;' : 'value = bar.value() * ' . $progress_max . ';' ) . '
									' . ( $decimal === 'one' ? 'value = Math.round( value * 10) / 10;value = value.toFixed(1);' : ( $decimal === 'two' ? 'value = Math.round( value * 100) / 100;value = value.toFixed(2);' : 'value = Math.round( value );' ) ) . '
									
									if( elementAbove ){
										elementAbove.innerHTML = "' . $prefix . '" + value + "' . $suffix . '";
									} else if ( elementInside ){
										elementInside.innerHTML = "' . $prefix . '" + value + "' . $suffix . '";
									} else if ( elementBelow ){
										elementBelow.innerHTML = "' . $prefix . '" + value + "' . $suffix . '";
									}

									elementContainer.setAttribute("aria-valuenow", value);
								 }
				            } ,
				            function(){}
				        );';

		if ( $delay ) {
			$content .= '});';
		}

		$content .= '} }, 125); </script>';

		return $content;
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

		$label = '<span role="textbox" class="kt-progress-label">' . $attributes['label'] . '</span>';
		if ( isset( $attributes['displayLabel'] ) && $attributes['displayLabel'] !== true ) {
			$label = '';
		}

		$response = '<div class="kb-progress-label-wrap ' . ( $position === 'inside' ? 'kt-progress-label-inside' : '' ) . '">';

		$percent = $this->get_percent( $attributes );

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

		$prefix   = isset( $attributes['numberPrefix'] ) ? $attributes['numberPrefix'] : '';
		$suffix   = isset( $attributes['numberSuffix'] ) ? $attributes['numberSuffix'] : '';
		$starting = 0;

		$position = isset( $attributes['labelPosition'] ) ? $attributes['labelPosition'] : 'above';

		return '<span id="current-progress-' . $position . $attributes['uniqueID'] . '" class="kt-progress-percent">' . $prefix . $starting . $suffix . '</span>';
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
		return array(
			"color"         => "",
			"level"         => 6,
			"size"          => array(
				"",
				"",
				""
			),
			"sizeType"      => "px",
			"lineHeight"    => array(
				"",
				"",
				""
			),
			"linetype"      => "px",
			"letterSpacing" => array(
				"",
				"",
				""
			),
			"textTransform" => "",
			"family"        => "",
			"google"        => false,
			"style"         => "",
			"weight"        => "",
			"variant"       => "",
			"subset"        => "",
			"loadGoogle"    => true,
			"padding"       => array(
				0,
				0,
				0,
				0
			),
			"margin"        => array(
				0,
				0,
				0,
				0
			)
		);
	}

	/**
	 * array_diff_assoc doesn't work on multidimensional arrays, so we need to use this function.
	 * If any sub-key value is different, to entire parent key is returned.
	 *
	 * @param $aArray1
	 * @param $aArray2
	 *
	 * @return array
	 */
	private function arrayRecursiveDiff($aArray1, $aArray2) {
		$aReturn = array();

		foreach ($aArray1 as $mKey => $mValue) {
			if (array_key_exists($mKey, $aArray2)) {
				if (is_array($mValue)) {
					$aRecursiveDiff = $this->arrayRecursiveDiff($mValue, $aArray2[$mKey]);
					if (count($aRecursiveDiff)) { $aReturn[$mKey] = $mValue; }
				} else {
					if ($mValue != $aArray2[$mKey]) {
						$aReturn[$mKey] = $mValue;
					}
				}
			} else {
				$aReturn[$mKey] = $mValue;
			}
		}
		return $aReturn;
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

		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/progressBar.min.js', array(), KADENCE_BLOCKS_VERSION, false );
		wp_register_script( 'kadence-blocks-scroll-magic', KADENCE_BLOCKS_URL . 'includes/assets/js/scroll-magic.min.js', array(), KADENCE_BLOCKS_VERSION, false );

	}
}

Kadence_Blocks_Progress_Bar_Block::get_instance();
