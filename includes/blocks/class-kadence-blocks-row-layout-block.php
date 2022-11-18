<?php
/**
 * Class to Build the RowLayout Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the RowLayout Block.
 *
 * @category class
 */
class Kadence_Blocks_RowLayout_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'row-layout';

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
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		// Figure out which scripts need to be enqueued.
		if ( $this->has_style ) {
			if ( ! wp_style_is( 'kadence-blocks-' . $this->block_name, 'enqueued' ) ) {
				$this->enqueue_style( 'kadence-blocks-' . $this->block_name );
				if ( $inline ) {
					$this->should_render_inline_stylesheet( 'kadence-blocks-' . $this->block_name );
				}
			}
		}
		if ( ( isset( $attributes['bgImg'] ) && ! empty( $attributes['bgImg'] ) && isset( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ) || ( isset( $attributes['overlayBgImg'] ) && ! empty( $attributes['overlayBgImg'] ) && isset( $attributes['overlayBgImgAttachment'] ) && 'parallax' === $attributes['overlayBgImgAttachment'] ) ) {
			$this->enqueue_script( 'kadence-blocks-parallax-js' );
		}
		if ( isset( $attributes['backgroundSettingTab'] ) && 'slider' === $attributes['backgroundSettingTab'] ) {
			$this->enqueue_style( 'kadence-blocks-pro-slick' );
			if ( $inline ) {
				$this->should_render_inline_stylesheet( 'kadence-blocks-pro-slick' );
			}
			$this->enqueue_script( 'kadence-blocks-slick-init' );
		}
		if ( isset( $attributes['backgroundSettingTab'] ) && 'video' === $attributes['backgroundSettingTab'] && isset( $attributes['backgroundVideo'] ) && isset( $attributes['backgroundVideo'][0] ) && isset( $attributes['backgroundVideo'][0]['btns'] ) && true === $attr['backgroundVideo'][0]['btns'] ) {
			$this->enqueue_script( 'kadence-blocks-video-bg' );
		}
	}
	/**
	 * Render for block scripts block.
	 *
	 * @param object $css the css object.
	 * @param int    $columns the amount of columns.
	 * @param string $layout the layout of the row.
	 * @param string $unique_id the $unique_id.
	 * @param int    $column1 the first column width.
	 * @param int    $column2 the second column width.
	 * @param int    $column3 the third column width.
	 */
	public function get_template_columns( $css, $columns, $layout, $unique_id, $column1 = null, $column2 = null, $column3 = null ) {
		$grid_layout = 'minmax(0, 1fr)';
		switch ( $columns ) {
			case 2:
				if ( ! empty( $column1 ) ) {
					$grid_layout = 'minmax(0, ' . $column1 . '%) minmax(0, ' . abs( $column1 - 100 ) . '%)';
				} else {
					switch ( $layout ) {
						case 'left-golden':
							$grid_layout = 'minmax(0, 2fr) minmax(0, 1fr)';
							break;
						case 'right-golden':
							$grid_layout = 'minmax(0, 1fr) minmax(0, 2fr)';
							break;
						case 'row':
							$grid_layout = 'minmax(0, 1fr)';
							break;
						default:
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							break;
					}
				}
				break;
			case 3:
				if ( ! empty( $column1 ) && ! empty( $column2 ) ) {
					$grid_layout = 'minmax(0, ' . $column1 . '%) minmax(0, ' . $column2 . '%) minmax(0, ' . abs( ( $column1 + $column2 ) - 100 ) . '%)';
				} else {
					switch ( $layout ) {
						case 'left-half':
							$grid_layout = 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)';
							break;
						case 'right-half':
							$grid_layout = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)';
							break;
						case 'center-half':
							$grid_layout = 'minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)';
							break;
						case 'center-wide':
							$grid_layout = 'minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr)';
							break;
						case 'center-exwide':
							$grid_layout = 'minmax(0, 1fr) minmax(0, 6fr) minmax(0, 1fr)';
							break;
						case 'first-row':
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > *:nth-child(3n+1)' );
							$css->add_property( 'grid-column', '1 / -1' );
							break;
						case 'last-row':
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > *:nth-child(3n)' );
							$css->add_property( 'grid-column', '1 / -1' );
							break;
						case 'row':
							$grid_layout = 'minmax(0, 1fr)';
							break;
						default:
							$grid_layout = 'repeat(3, minmax(0, 1fr))';
							break;
					}
				}
				break;
			case 4:
				switch ( $layout ) {
					case 'left-forty':
						$grid_layout = 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)';
						break;
					case 'right-forty':
						$grid_layout = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)';
						break;
					case 'two-grid':
						$grid_layout = 'repeat(2, minmax(0, 1fr))';
						break;
					case 'row':
						$grid_layout = 'minmax(0, 1fr)';
						break;
					default:
						$grid_layout = 'repeat(4, minmax(0, 1fr))';
						break;
				}
				break;
			case 5:
				switch ( $layout ) {
					case 'first-row':
						$grid_layout = 'repeat(4, minmax(0, 1fr))';
						$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > *:nth-child(5n+1)' );
						$css->add_property( 'grid-column', '1 / -1' );
						break;
					case 'last-row':
						$grid_layout = 'repeat(4, minmax(0, 1fr))';
						$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap > *:nth-child(5n)' );
						$css->add_property( 'grid-column', '1 / -1' );
						break;
					case 'row':
						$grid_layout = 'minmax(0, 1fr)';
						break;
					default:
						$grid_layout = 'repeat(5, minmax(0, 1fr))';
						break;
				}
				break;
			case 6:
				switch ( $layout ) {
					case 'two-grid':
						$grid_layout = 'repeat(2, minmax(0, 1fr))';
						break;
					case 'three-grid':
						$grid_layout = 'repeat(3, minmax(0, 1fr))';
						break;
					case 'row':
						$grid_layout = 'minmax(0, 1fr)';
						break;
					default:
						$grid_layout = 'repeat(6, minmax(0, 1fr))';
						break;
				}
				break;
		}
		return $grid_layout;
	}
	/**
	 * Builds CSS for block.
	 *
	 * @param array $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );
		// Vertical Alignment.
		if ( ! empty( $attributes['verticalAlignment'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			switch ( $attributes['verticalAlignment'] ) {
				case 'middle':
					$css->add_property( 'align-content', 'center' );
					break;
				case 'bottom':
					$css->add_property( 'align-content', 'end' );
					break;
				case 'top':
					$css->add_property( 'align-content', 'start' );
					break;
			}
		}
		// Layout.
		//print_r( $attributes );
		$columns = ( ! empty( $attributes['columns'] ) ? $attributes['columns'] : 2 );
		$layout  = ( ! empty( $attributes['colLayout'] ) ? $attributes['colLayout'] : 'equal' );
		$column1  = ( ! empty( $attributes['firstColumnWidth'] ) ? $attributes['firstColumnWidth'] : '' );
		$column2  = ( ! empty( $attributes['secondColumnWidth'] ) ? $attributes['secondColumnWidth'] : '' );
		$grid_layout = $this->get_template_columns( $css, $columns, $layout, $unique_id, $column1, $column2 );
		$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
		$css->add_property( 'grid-template-columns', $grid_layout );
		if ( ! empty( $attributes['tabletLayout'] ) ) {
			$css->set_media_state( 'tablet' );
			$grid_layout = $this->get_template_columns( $css, $columns, $attributes['tabletLayout'], $unique_id );
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			$css->add_property( 'grid-template-columns', $grid_layout );
			$css->set_media_state( 'desktop' );
		}
		$mobile_layout  = ( ! empty( $attributes['mobileLayout'] ) ? $attributes['mobileLayout'] : 'row' );
		$css->set_media_state( 'mobile' );
		$grid_layout = $this->get_template_columns( $css, $columns, $mobile_layout, $unique_id );
		$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
		$css->add_property( 'grid-template-columns', $grid_layout );
		$css->set_media_state( 'desktop' );

		// Margin, check for old attributes and use if present.
		if ( $css->is_number( $attributes['topMargin'] ) || $css->is_number( $attributes['bottomMargin'] ) || $css->is_number( $attributes['topMarginT'] ) || $css->is_number( $attributes['bottomMarginT'] ) || $css->is_number( $attributes['topMarginM'] ) || $css->is_number( $attributes['bottomMarginM'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id );
			if ( $css->is_number( $attributes['topMargin'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMargin'] . ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomMargin'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMargin'] . ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
			}
			$css->set_media_state( 'tablet' );
			if ( $css->is_number( $attributes['topMarginT'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMarginT'] . ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomMarginT'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMarginT'] . ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
			}
			$css->set_media_state( 'mobile' );
			if ( $css->is_number( $attributes['topMarginM'] ) ) {
				$css->add_property( 'margin-top', $attributes['topMarginM'] . ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomMarginM'] ) ) {
				$css->add_property( 'margin-bottom', $attributes['bottomMarginM'] . ( ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		} else {
			$css->set_selector( '#kt-layout-id' . $unique_id );
			$css->render_measure_output( $attributes, 'margin', 'margin' );
		}
		// Padding, check for old attributes and use if present.
		if ( $css->is_number( $attributes['topPadding'] ) || $css->is_number( $attributes['bottomPadding'] ) || $css->is_number( $attributes['leftPadding'] ) || $css->is_number( $attributes['rightPadding'] ) || $css->is_number( $attributes['topMarginT'] ) || $css->is_number( $attributes['bottomMarginT'] ) || $css->is_number( $attributes['topMarginM'] ) || $css->is_number( $attributes['bottomMarginM'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			if ( $css->is_number( $attributes['topPadding'] ) || ( ! empty( $attributes['paddingUnit'] ) && 'px' !== $attributes['paddingUnit'] ) ) {
				$css->add_property( 'padding-top', ( $css->is_number( $attributes['topPadding'] ) ? $attributes['topPadding'] : '25' ) . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomPadding'] ) || ( ! empty( $attributes['paddingUnit'] ) && 'px' !== $attributes['paddingUnit'] ) ) {
				$css->add_property( 'padding-bottom', ( $css->is_number( $attributes['bottomPadding'] ) ? $attributes['bottomPadding'] : '25' ) . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftPadding'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPadding'] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightPadding'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPadding'] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			$css->set_media_state( 'tablet' );
			if ( $css->is_number( $attributes['tabletPadding'][0] ) ) {
				$css->add_property( 'padding-top', $attributes['tabletPadding'][0] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['tabletPadding'][1] ) ) {
				$css->add_property( 'padding-right', $attributes['tabletPadding'][1] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['tabletPadding'][2] ) ) {
				$css->add_property( 'padding-bottom', $attributes['tabletPadding'][2] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['tabletPadding'][3] ) ) {
				$css->add_property( 'padding-left', $attributes['tabletPadding'][3] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			$css->set_media_state( 'mobile' );
			if ( $css->is_number( $attributes['topPaddingM'] ) ) {
				$css->add_property( 'padding-top', $attributes['topPaddingM'] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['bottomPaddingM'] ) ) {
				$css->add_property( 'padding-bottom', $attributes['bottomPaddingM'] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['leftPaddingM'] ) ) {
				$css->add_property( 'padding-left', $attributes['leftPaddingM'] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			if ( $css->is_number( $attributes['rightPaddingM'] ) ) {
				$css->add_property( 'padding-right', $attributes['rightPaddingM'] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' ) );
			}
			$css->set_media_state( 'desktop' );
		} else {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			$css->render_measure_output( $attributes, 'padding', 'padding' );
		}
		// Min Height.
		$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
		if ( ! empty( $attributes['minHeight'] ) ) {
			$css->add_property( 'min-height', $attributes['minHeight'] . ( ! empty( $attributes['minHeightUnit'] ) ? $attributes['minHeightUnit'] : 'px' ) );
		}
		if ( $css->is_number( $attributes['minHeightTablet'] ) ) {
			$css->set_media_state( 'tablet' );
			$css->add_property( 'min-height', $attributes['minHeightTablet'] . ( ! empty( $attributes['minHeightUnit'] ) ? $attributes['minHeightUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		if ( $css->is_number( $attributes['minHeightMobile'] ) ) {
			$css->set_media_state( 'mobile' );
			$css->add_property( 'min-height', $attributes['minHeightMobile'] . ( ! empty( $attributes['minHeightUnit'] ) ? $attributes['minHeightUnit'] : 'px' ) );
			$css->set_media_state( 'desktop' );
		}
		// Max Width.
		if ( isset( $attributes['inheritMaxWidth'] ) && true === $attributes['inheritMaxWidth'] ) {
			global $content_width;
			if ( isset( $content_width ) ) {
				if ( class_exists( 'Kadence\Theme' ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
					$css->add_property( 'max-width', 'var( --global-content-width, ' . absint( $content_width ) . 'px )' );
					$css->add_property( 'padding-left', 'var(--global-content-edge-padding)' );
					$css->add_property( 'padding-right', 'var(--global-content-edge-padding)' );
				} else {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
					$css->add_property( 'max-width', absint( $content_width ) . 'px' );
				}
			}
		} else {
			if ( $css->is_number( $attributes['maxWidth'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
				$css->add_property( 'max-width', $attributes['maxWidth'] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
				$css->add_property( 'margin-left', 'auto' );
				$css->add_property( 'margin-right', 'auto' );
			}
			if ( $css->is_number( $attributes['responsiveMaxWidth'][0] ) ) {
				$css->set_media_state( 'tablet' );
				$css->add_property( 'max-width', $attributes['responsiveMaxWidth'][0] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
				$css->add_property( 'margin-left', 'auto' );
				$css->add_property( 'margin-right', 'auto' );
				$css->set_media_state( 'desktop' );
			}
			if ( $css->is_number( $attributes['responsiveMaxWidth'][1] ) ) {
				$css->set_media_state( 'mobile' );
				$css->add_property( 'max-width', $attributes['responsiveMaxWidth'][1] . ( ! empty( $attributes['maxWidthUnit'] ) ? $attributes['maxWidthUnit'] : 'px' ) );
				$css->add_property( 'margin-left', 'auto' );
				$css->add_property( 'margin-right', 'auto' );
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['bgColor'] ) || isset( $attributes['bgImg'] ) || isset( $attributes['border'] ) || isset( $attributes['borderWidth'] ) || isset( $attributes['borderRadius'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id );
			if ( isset( $attributes['border'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['border'] ) );
			}
			if ( isset( $attributes['borderWidth'] ) && is_array( $attributes['borderWidth'] ) ) {
				if ( isset( $attributes['borderWidth'][0] ) && is_numeric( $attributes['borderWidth'][0] ) ) {
					$css->add_property( 'border-top-width', $attributes['borderWidth'][0] . 'px' );
				}
				if ( isset( $attributes['borderWidth'][1] ) && is_numeric( $attributes['borderWidth'][1] ) ) {
					$css->add_property( 'border-right-width', $attributes['borderWidth'][1] . 'px' );
				}
				if ( isset( $attributes['borderWidth'][2] ) && is_numeric( $attributes['borderWidth'][2] ) ) {
					$css->add_property( 'border-bottom-width', $attributes['borderWidth'][2] . 'px' );
				}
				if ( isset( $attributes['borderWidth'][3] ) && is_numeric( $attributes['borderWidth'][3] ) ) {
					$css->add_property( 'border-left-width', $attributes['borderWidth'][3] . 'px' );
				}
			}
			$has_radius = false;
			if ( isset( $attributes['borderRadius'] ) && is_array( $attributes['borderRadius'] ) ) {
				if ( isset( $attributes['borderRadius'][0] ) && is_numeric( $attributes['borderRadius'][0] ) ) {
					if ( 0 !== $attributes['borderRadius'][0] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-top-left-radius', $attributes['borderRadius'][0] . 'px' );
				}
				if ( isset( $attributes['borderRadius'][1] ) && is_numeric( $attributes['borderRadius'][1] ) ) {
					if ( 0 !== $attributes['borderRadius'][1] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-top-right-radius', $attributes['borderRadius'][1] . 'px' );
				}
				if ( isset( $attributes['borderRadius'][2] ) && is_numeric( $attributes['borderRadius'][2] ) ) {
					if ( 0 !== $attributes['borderRadius'][2] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-bottom-right-radius', $attributes['borderRadius'][2] . 'px' );
				}
				if ( isset( $attributes['borderRadius'][3] ) && is_numeric( $attributes['borderRadius'][3] ) ) {
					if ( 0 !== $attributes['borderRadius'][3] ) {
						$has_radius = true;
					}
					$css->add_property( 'border-bottom-left-radius', $attributes['borderRadius'][3] . 'px' );
				}
			}
			if ( $has_radius ) {
				$css->add_property( 'overflow', 'hidden' );
			}
			if ( isset( $attributes['bgColor'] ) && ! empty( $attributes['bgColor'] ) ) {
				if ( class_exists( 'Kadence\Theme' ) ) {
					if ( isset( $attributes['bgColorClass'] ) && empty( $attributes['bgColorClass'] ) || ! isset( $attributes['bgColorClass'] ) ) {
						$css->add_property( 'background-color', $css->render_color( $attributes['bgColor'] ) );
					}
				} else if ( strpos( $attributes['bgColor'], 'palette' ) === 0 ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['bgColor'] ) );
				} else if ( isset( $attributes['bgColorClass'] ) && empty( $attributes['bgColorClass'] ) || ! isset( $attributes['bgColorClass'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['bgColor'] ) );
				}
			}
			if ( isset( $attributes['bgImg'] ) && ! empty( $attributes['bgImg'] ) && ( ! isset( $attributes['backgroundSettingTab'] ) || empty( $attributes['backgroundSettingTab'] ) || 'normal' === $attributes['backgroundSettingTab'] ) ) {
				if ( isset( $attributes['bgImgAttachment'] ) ) {
					if ( 'parallax' === $attributes['bgImgAttachment'] ) {
						$bg_attach = 'fixed';
					} else {
						$bg_attach = $attributes['bgImgAttachment'];
					}
				} else {
					$bg_attach = 'scroll';
				}
				$css->add_property( 'background-image', sprintf( "url('%s')", $attributes['bgImg'] ) );
				$css->add_property( 'background-size', ( isset( $attributes['bgImgSize'] ) ? $attributes['bgImgSize'] : 'cover' ) );
				$css->add_property( 'background-position', ( isset( $attributes['bgImgPosition'] ) ? $attributes['bgImgPosition'] : 'center center' ) );
				$css->add_property( 'background-attachment', $bg_attach );
				$css->add_property( 'background-repeat', ( isset( $attributes['bgImgRepeat'] ) ? $attributes['bgImgRepeat'] : 'no-repeat' ) );
			}
		}
		if ( isset( $attributes['zIndex'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ' > .kt-row-column-wrap' );
			$css->add_property( 'z-index', $attributes['zIndex'] );
		}
		if ( isset( $attributes['textColor'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ', .kt-layout-id' . $unique_id . ' h1, .kt-layout-id' . $unique_id . ' h2, .kt-layout-id' . $unique_id . ' h3, .kt-layout-id' . $unique_id . ' h4, .kt-layout-id' . $unique_id . ' h5, .kt-layout-id' . $unique_id . ' h6' );
			$css->add_property( 'color', $css->render_color( $attributes['textColor'] ) );
		}
		if ( isset( $attributes['linkColor'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ' a' );
			$css->add_property( 'color', $css->render_color( $attributes['linkColor'] ) );
		}
		if ( isset( $attributes['linkHoverColor'] ) ) {
			$css->set_selector( '.kt-layout-id' . $unique_id . ' a:hover' );
			$css->add_property( 'color', $css->render_color( $attributes['linkHoverColor'] ) );
		}
		if ( isset( $attributes['bottomSep'] ) && 'none' != $attributes['bottomSep'] ) {
			if ( isset( $attributes['bottomSepHeight'] ) || isset( $attributes['bottomSepWidth'] ) || isset( $attributes['bottomSepColor'] ) ) {
				if ( isset( $attributes['bottomSepHeight'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attributes['bottomSepHeight'] . 'px' );
				}
				if ( isset( $attributes['bottomSepWidth'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attributes['bottomSepWidth'] . '%' );
				}
			}
			if ( ! empty( $attributes['bottomSepColor'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
				$css->add_property( 'fill', $css->render_color( $attributes['bottomSepColor'] ) . '!important' );
			}
			if ( isset( $attributes['bottomSepHeightTab'] ) || isset( $attributes['bottomSepWidthTab'] ) ) {
				$css->set_media_state( 'tablet' );
				if ( isset( $attributes['bottomSepHeightTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attributes['bottomSepHeightTab'] . 'px' );
				}
				if ( isset( $attributes['bottomSepWidthTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attributes['bottomSepWidthTab'] . '%' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $attributes['bottomSepHeightMobile'] ) || isset( $attributes['bottomSepWidthMobile'] ) ) {
				$css->set_media_state( 'mobile' );
				if ( isset( $attributes['bottomSepHeightMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attributes['bottomSepHeightMobile'] . 'px' );
				}
				if ( isset( $attributes['bottomSepWidthMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attributes['bottomSepWidthMobile'] . '%' );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['topSep'] ) && 'none' != $attributes['topSep'] ) {
			if ( isset( $attributes['topSepHeight'] ) || isset( $attributes['topSepWidth'] )|| isset( $attributes['topSepColor'] ) ) {
				if ( isset( $attributes['topSepHeight'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep' );
					$css->add_property( 'height', $attributes['topSepHeight'] . 'px' );
				}
				if ( isset( $attributes['topSepWidth'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg' );
					$css->add_property( 'width', $attributes['topSepWidth'] . '%' );
				}
				if ( ! empty( $attributes['topSepColor'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg'  );
					$css->add_property( 'fill', $css->render_color( $attributes['topSepColor'] ) . '!important' );
				}
			}
			if ( isset( $attributes['topSepHeightTab'] ) || isset( $attributes['topSepWidthTab'] ) ) {
				$css->set_media_state( 'tablet' );
				if ( isset( $attributes['topSepHeightTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep' );
					$css->add_property( 'height', $attributes['topSepHeightTab'] . 'px' );
				}
				if ( isset( $attributes['topSepWidthTab'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg' );
					$css->add_property( 'width', $attributes['topSepWidthTab'] . '%' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $attributes['topSepHeightMobile'] ) || isset( $attributes['topSepWidthMobile'] ) ) {
				$css->set_media_state( 'mobile' );
				if ( isset( $attributes['topSepHeightMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep' );
					$css->add_property( 'height', $attributes['topSepHeightMobile'] . 'px' );
				}
				if ( isset( $attributes['topSepWidthMobile'] ) ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kt-row-layout-top-sep svg' );
					$css->add_property( 'width', $attributes['topSepWidthMobile'] . '%' );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		if ( isset( $attributes['overlay'] ) || isset( $attributes['overlayBgImg'] ) || isset( $attributes['overlaySecond'] ) ) {
			$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay' );
			if ( isset( $attributes['overlayOpacity'] ) ) {
				if ( $attributes['overlayOpacity'] < 10 ) {
					$css->add_property( 'opacity', '0.0' . $attributes['overlayOpacity'] );
				} else if ( $attributes['overlayOpacity'] >= 100 ) {
					$css->add_property( 'opacity', '1' );
				} else {
					$css->add_property( 'opacity', '0.' . $attributes['overlayOpacity'] );
				}
			}
			if ( isset( $attributes['currentOverlayTab'] ) && 'grad' == $attributes['currentOverlayTab'] ) {
				$type = ( isset( $attributes['overlayGradType'] ) ? $attributes['overlayGradType'] : 'linear' );
				if ( 'radial' === $type ) {
					$angle = ( isset( $attributes['overlayBgImgPosition'] ) ? 'at ' . $attributes['overlayBgImgPosition'] : 'at center center' );
				} else {
					$angle = ( isset( $attributes['overlayGradAngle'] ) ? $attributes['overlayGradAngle'] . 'deg' : '180deg' );
				}
				$loc         = ( isset( $attributes['overlayGradLoc'] ) ? $attributes['overlayGradLoc'] : '0' );
				$color       = ( isset( $attributes['overlay'] ) ? $css->render_color( $attributes['overlay'], ( isset( $attributes['overlayFirstOpacity'] ) && is_numeric( $attributes['overlayFirstOpacity'] ) ? $attributes['overlayFirstOpacity'] : 1 ) ) : 'transparent' );
				$locsecond   = ( isset( $attributes['overlayGradLocSecond'] ) ? $attributes['overlayGradLocSecond'] : '100' );
				$colorsecond = ( isset( $attributes['overlaySecond'] ) ? $css->render_color( $attributes['overlaySecond'], ( isset( $attributes['overlaySecondOpacity'] ) && is_numeric( $attributes['overlaySecondOpacity'] ) ? $attributes['overlaySecondOpacity'] : 1 ) ) : '#00B5E2' );
				$css->add_property( 'background-image', $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
			} else {
				if ( isset( $attributes['overlay'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $attributes['overlay'], ( isset( $attributes['overlayFirstOpacity'] ) && is_numeric( $attributes['overlayFirstOpacity'] ) ? $attributes['overlayFirstOpacity'] : 1 ) ) );
				}
				if ( isset( $attributes['overlayBgImg'] ) ) {
					if ( isset( $attributes['overlayBgImgAttachment'] ) ) {
						if ( 'parallax' === $attributes['overlayBgImgAttachment'] ) {
							$overbg_attach = 'fixed';
						} else {
							$overbg_attach = $attributes['overlayBgImgAttachment'];
						}
					} else {
						$overbg_attach = 'scroll';
					}
					$css->add_property( 'background-image', sprintf( "url('%s')", $attributes['overlayBgImg'] ) );
					$css->add_property( 'background-size', ( isset( $attributes['overlayBgImgSize'] ) ? $attributes['overlayBgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( isset( $attributes['overlayBgImgPosition'] ) ? $attributes['overlayBgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', $overbg_attach );
					$css->add_property( 'background-repeat', ( isset( $attributes['overlayBgImgRepeat'] ) ? $attributes['overlayBgImgRepeat'] : 'no-repeat' ) );
				}
			}
			if ( isset( $attributes['overlayBlendMode'] ) ) {
				$css->add_property( 'mix-blend-mode', $attributes['overlayBlendMode'] );
			}
		}
		$tablet_overlay    = ( isset( $attributes['tabletOverlay'] ) && is_array( $attributes['tabletOverlay'] ) && isset( $attributes['tabletOverlay'][0] ) && is_array( $attributes['tabletOverlay'][0] ) ? $attributes['tabletOverlay'][0] : array() );
		$tablet_background = ( isset( $attributes['tabletBackground'] ) && is_array( $attributes['tabletBackground'] ) && isset( $attributes['tabletBackground'][0] ) && is_array( $attributes['tabletBackground'][0] ) ? $attributes['tabletBackground'][0] : array() );
		if ( isset( $attributes['tabletPadding'] ) || isset( $attributes['tabletBorder'] ) || isset( $attributes['tabletBorderWidth'] ) || isset( $attributes['tabletBorderRadius'] ) || isset( $attributes['minHeightTablet'] ) || isset( $attributes['bottomMarginT'] ) || ( isset( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) || ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] ) || isset( $attributes['responsiveMaxWidth'] ) ) {
			$css->set_media_state( 'tablet' );
			if ( isset( $attributes['tabletBorder'] ) || isset( $attributes['tabletBorderWidth'] ) || isset( $attributes['tabletBorderRadius'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $attributes['tabletBorder'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $attributes['tabletBorder'] ) );
				}
				if ( isset( $attributes['tabletBorderWidth'] ) && is_array( $attributes['tabletBorderWidth'] ) ) {
					if ( isset( $attributes['tabletBorderWidth'][0] ) && is_numeric( $attributes['tabletBorderWidth'][0] ) ) {
						$css->add_property( 'border-top-width', $attributes['tabletBorderWidth'][0] . 'px' );
					}
					if ( isset( $attributes['tabletBorderWidth'][1] ) && is_numeric( $attributes['tabletBorderWidth'][1] ) ) {
						$css->add_property( 'border-right-width', $attributes['tabletBorderWidth'][1] . 'px' );
					}
					if ( isset( $attributes['tabletBorderWidth'][2] ) && is_numeric( $attributes['tabletBorderWidth'][2] ) ) {
						$css->add_property( 'border-bottom-width', $attributes['tabletBorderWidth'][2] . 'px' );
					}
					if ( isset( $attributes['tabletBorderWidth'][3] ) && is_numeric( $attributes['tabletBorderWidth'][3] ) ) {
						$css->add_property( 'border-left-width', $attributes['tabletBorderWidth'][3] . 'px' );
					}
				}
				if ( isset( $attributes['tabletBorderRadius'] ) && is_array( $attributes['tabletBorderRadius'] ) ) {
					if ( isset( $attributes['tabletBorderRadius'][0] ) && is_numeric( $attributes['tabletBorderRadius'][0] ) ) {
						$css->add_property( 'border-top-left-radius', $attributes['tabletBorderRadius'][0] . 'px' );
					}
					if ( isset( $attributes['tabletBorderRadius'][1] ) && is_numeric( $attributes['tabletBorderRadius'][1] ) ) {
						$css->add_property( 'border-top-right-radius', $attributes['tabletBorderRadius'][1] . 'px' );
					}
					if ( isset( $attributes['tabletBorderRadius'][2] ) && is_numeric( $attributes['tabletBorderRadius'][2] ) ) {
						$css->add_property( 'border-bottom-right-radius', $attributes['tabletBorderRadius'][2] . 'px' );
					}
					if ( isset( $attributes['tabletBorderRadius'][3] ) && is_numeric( $attributes['tabletBorderRadius'][3] ) ) {
						$css->add_property( 'border-bottom-left-radius', $attributes['tabletBorderRadius'][3] . 'px' );
					}
				}
			}
			if ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( ! empty( $tablet_background['bgColor'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $tablet_background['bgColor'] ) );
				}
				if ( ! empty( $tablet_background['bgImg'] ) ) {
					if ( ! empty( $tablet_background['bgImgAttachment'] ) ) {
						if ( 'parallax' === $tablet_background['bgImgAttachment'] ) {
							$bg_attach = 'fixed';
						} else {
							$bg_attach = $tablet_background['bgImgAttachment'];
						}
					} else {
						$bg_attach = 'scroll';
					}

					$is_important = ( isset( $attributes['bgImg'] ) && ! empty( $attributes['bgImg'] ) && isset( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ? '!important' : '' );
					if ( isset( $attributes['backgroundInline'] ) && true === $attributes['backgroundInline'] ) {
						$is_important = '!important';
					}
					$css->add_property( 'background-image', sprintf( "url('%s')", $tablet_background['bgImg'] ) . $is_important );
					$css->add_property( 'background-size', ( ! empty( $tablet_background['bgImgSize'] ) ? $tablet_background['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( ! empty( $tablet_background['bgImgPosition'] ) ? $tablet_background['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', $bg_attach );
					$css->add_property( 'background-repeat', ( ! empty( $tablet_background['bgImgRepeat'] ) ? $tablet_background['bgImgRepeat'] : 'no-repeat' ) );
				}
				if ( isset( $attributes['bgImg'] ) && ! empty( $attributes['bgImg'] ) && isset( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] && isset( $tablet_background['bgImg'] ) && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
					$css->add_property( 'display', 'none !important' );
				}
				if ( isset( $attributes['backgroundSettingTab'] ) && ! empty( $attributes['backgroundSettingTab'] ) && 'normal' !== $attributes['backgroundSettingTab'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kb-blocks-bg-video-container, #kt-layout-id' . $unique_id . ' .kb-blocks-bg-slider' );
					$css->add_property( 'display', 'none' );
				}
			}
			if ( ! empty( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay' );
				if ( isset( $tablet_overlay['overlayOpacity'] ) && is_numeric( $tablet_overlay['overlayOpacity'] ) ) {
					if ( $tablet_overlay['overlayOpacity'] < 10 ) {
						$css->add_property( 'opacity', '0.0' . $tablet_overlay['overlayOpacity'] );
					} else if ( $tablet_overlay['overlayOpacity'] >= 100 ) {
						$css->add_property( 'opacity', '1' );
					} else {
						$css->add_property( 'opacity', '0.' . $tablet_overlay['overlayOpacity'] );
					}
				}
				if ( ! empty( $tablet_overlay['currentOverlayTab'] ) && 'grad' == $tablet_overlay['currentOverlayTab'] ) {
					$type = ( ! empty( $tablet_overlay['overlayGradType'] ) ? $tablet_overlay['overlayGradType'] : 'linear' );
					if ( 'radial' === $type ) {
						$angle = ( ! empty( $tablet_overlay['overlayBgImgPosition'] ) ? 'at ' . $tablet_overlay['overlayBgImgPosition'] : 'at center center' );
					} else {
						$angle = ( ! empty( $tablet_overlay['overlayGradAngle'] ) ? $tablet_overlay['overlayGradAngle'] . 'deg' : '180deg' );
					}
					$loc         = ( ! empty( $tablet_overlay['overlayGradLoc'] ) ? $tablet_overlay['overlayGradLoc'] : '0' );
					$color       = ( ! empty( $tablet_overlay['overlay'] ) ? $css->render_color( $tablet_overlay['overlay'] ) : 'transparent' );
					$locsecond   = ( ! empty( $tablet_overlay['overlayGradLocSecond'] ) ? $tablet_overlay['overlayGradLocSecond'] : '100' );
					$colorsecond = ( ! empty( $tablet_overlay['overlaySecond'] ) ? $css->render_color( $tablet_overlay['overlaySecond'] ) : '#00B5E2' );
					$css->add_property( 'background-image', $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
				} else {
					if ( ! empty( $tablet_overlay['overlay'] ) ) {
						$css->add_property( 'background-color', $css->render_color( $tablet_overlay['overlay'] ) );
					}
					if ( ! empty( $tablet_overlay['overlayBgImg'] ) ) {
						if ( ! empty( $tablet_overlay['overlayBgImgAttachment'] ) ) {
							if ( 'parallax' === $tablet_overlay['overlayBgImgAttachment'] ) {
								$overbg_attach = 'fixed';
							} else {
								$overbg_attach = $tablet_overlay['overlayBgImgAttachment'];
							}
						} else {
							$overbg_attach = 'scroll';
						}
						$css->add_property( 'background-image', sprintf( "url('%s')", $tablet_overlay['overlayBgImg'] ) );
						$css->add_property( 'background-size', ( ! empty( $tablet_overlay['overlayBgImgSize'] ) ? $tablet_overlay['overlayBgImgSize'] : 'cover' ) );
						$css->add_property( 'background-position', ( ! empty( $tablet_overlay['overlayBgImgPosition'] ) ? $tablet_overlay['overlayBgImgPosition'] : 'center center' ) );
						$css->add_property( 'background-attachment', $overbg_attach );
						$css->add_property( 'background-repeat', ( ! empty( $tablet_overlay['overlayBgImgRepeat'] ) ? $tablet_overlay['overlayBgImgRepeat'] : 'no-repeat' ) );
					}
				}
				if ( ! empty( $tablet_overlay['overlayBlendMode'] ) ) {
					$css->add_property( 'mix-blend-mode', $tablet_overlay['overlayBlendMode'] );
				}

			}
			$css->set_media_state( 'desktop' );
			if ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] && isset( $tablet_background['forceOverDesk'] ) && $tablet_background['forceOverDesk'] ) {
				$css->set_media_state( 'tabletOnly' );
				$css->set_selector( '#kt-layout-id' . $unique_id );
				$css->add_property( 'background-image', 'none !important' );
				$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
				$css->add_property( 'display', 'none !important' );
				$css->set_media_state( 'desktop' );
			}
		}
		$mobile_overlay    = ( isset( $attributes['mobileOverlay'] ) && is_array( $attributes['mobileOverlay'] ) && isset( $attributes['mobileOverlay'][0] ) && is_array( $attributes['mobileOverlay'][0] ) ? $attributes['mobileOverlay'][0] : array() );
		$mobile_background = ( isset( $attributes['mobileBackground'] ) && is_array( $attributes['mobileBackground'] ) && isset( $attributes['mobileBackground'][0] ) && is_array( $attributes['mobileBackground'][0] ) ? $attributes['mobileBackground'][0] : array() );
		if ( isset( $attributes['topPaddingM'] ) || isset( $attributes['bottomPaddingM'] ) || isset( $attributes['leftPaddingM'] ) || isset( $attributes['rightPaddingM'] ) || isset( $attributes['topMarginM'] ) || isset( $attributes['bottomMarginM'] ) || isset( $attributes['mobileBorder'] ) || isset( $attributes['mobileBorderWidth'] ) || isset( $attributes['mobileBorderRadius'] ) || ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) || isset( $attributes['minHeightMobile'] ) || ( isset( $mobile_background['enable'] ) && $mobile_background['enable'] == 'true' ) || isset( $attributes['responsiveMaxWidth'] ) ) {
			$css->set_media_state( 'mobile' );
			if ( isset( $attributes['topMarginM'] ) || isset( $attributes['bottomMarginM'] ) || isset( $attributes['mobileBorder'] ) || isset( $attributes['mobileBorderWidth'] ) || isset( $attributes['mobileBorderRadius'] ) ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $attributes['topMarginM'] ) ) {
					$css->add_property( 'margin-top', $attributes['topMarginM'] . ( isset( $attributes['marginUnit'] ) && ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
				}
				if ( isset( $attributes['bottomMarginM'] ) ) {
					$css->add_property( 'margin-bottom', $attributes['bottomMarginM'] . ( isset( $attributes['marginUnit'] ) && ! empty( $attributes['marginUnit'] ) ? $attributes['marginUnit'] : 'px' ) );
				}
				if ( isset( $attributes['mobileBorder'] ) ) {
					$css->add_property( 'border-color', $css->render_color( $attributes['mobileBorder'] ) );
				}
				if ( isset( $attributes['mobileBorderWidth'] ) && is_array( $attributes['mobileBorderWidth'] ) ) {
					if ( isset( $attributes['mobileBorderWidth'][0] ) && is_numeric( $attributes['mobileBorderWidth'][0] ) ) {
						$css->add_property( 'border-top-width', $attributes['mobileBorderWidth'][0] . 'px' );
					}
					if ( isset( $attributes['mobileBorderWidth'][1] ) && is_numeric( $attributes['mobileBorderWidth'][1] ) ) {
						$css->add_property( 'border-right-width', $attributes['mobileBorderWidth'][1] . 'px' );
					}
					if ( isset( $attributes['mobileBorderWidth'][2] ) && is_numeric( $attributes['mobileBorderWidth'][2] ) ) {
						$css->add_property( 'border-bottom-width', $attributes['mobileBorderWidth'][2] . 'px' );
					}
					if ( isset( $attributes['mobileBorderWidth'][3] ) && is_numeric( $attributes['mobileBorderWidth'][3] ) ) {
						$css->add_property( 'border-left-width', $attributes['mobileBorderWidth'][3] . 'px' );
					}
				}
				if ( isset( $attributes['mobileBorderRadius'] ) && is_array( $attributes['mobileBorderRadius'] ) ) {
					if ( isset( $attributes['mobileBorderRadius'][0] ) && is_numeric( $attributes['mobileBorderRadius'][0] ) ) {
						$css->add_property( 'border-top-left-radius', $attributes['mobileBorderRadius'][0] . 'px' );
					}
					if ( isset( $attributes['mobileBorderRadius'][1] ) && is_numeric( $attributes['mobileBorderRadius'][1] ) ) {
						$css->add_property( 'border-top-right-radius', $attributes['mobileBorderRadius'][1] . 'px' );
					}
					if ( isset( $attributes['mobileBorderRadius'][2] ) && is_numeric( $attributes['mobileBorderRadius'][2] ) ) {
						$css->add_property( 'border-bottom-right-radius', $attributes['mobileBorderRadius'][2] . 'px' );
					}
					if ( isset( $attributes['mobileBorderRadius'][3] ) && is_numeric( $attributes['mobileBorderRadius'][3] ) ) {
						$css->add_property( 'border-bottom-left-radius', $attributes['mobileBorderRadius'][3] . 'px' );
					}
				}
			}
			if ( isset( $mobile_background['enable'] ) && $mobile_background['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id );
				if ( isset( $mobile_background['bgColor'] ) && ! empty( $mobile_background['bgColor'] ) ) {
					$css->add_property( 'background-color', $css->render_color( $mobile_background['bgColor'] ) );
				}
				if ( isset( $mobile_background['bgImg'] ) && ! empty( $mobile_background['bgImg'] ) ) {
					if ( ! empty( $mobile_background['bgImgAttachment'] ) ) {
						if ( 'parallax' === $mobile_background['bgImgAttachment'] ) {
							$bg_attach = 'fixed';
						} else {
							$bg_attach = $mobile_background['bgImgAttachment'];
						}
					} else {
						$bg_attach = 'scroll';
					}
					$is_important = ( isset( $attributes['bgImg'] ) && ! empty( $attributes['bgImg'] ) && isset( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ? '!important' : '' );
					if ( isset( $attributes['backgroundInline'] ) && true === $attributes['backgroundInline'] ) {
						$is_important = '!important';
					}
					$css->add_property( 'background-image', sprintf( "url('%s')", $mobile_background['bgImg'] ) . $is_important );
					$css->add_property( 'background-size', ( ! empty( $mobile_background['bgImgSize'] ) ? $mobile_background['bgImgSize'] : 'cover' ) );
					$css->add_property( 'background-position', ( ! empty( $mobile_background['bgImgPosition'] ) ? $mobile_background['bgImgPosition'] : 'center center' ) );
					$css->add_property( 'background-attachment', $bg_attach );
					$css->add_property( 'background-repeat', ( ! empty( $mobile_background['bgImgRepeat'] ) ? $mobile_background['bgImgRepeat'] : 'no-repeat' ) );
				} else if ( isset( $mobile_background['forceOverDesk'] ) && $mobile_background['forceOverDesk'] ) {
					$css->add_property( 'background-image', 'none !important' );
					$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
					$css->add_property( 'display', 'none !important' );
				}
				if ( isset( $attributes['bgImg'] ) && ! empty( $attributes['bgImg'] ) && isset( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] && isset( $mobile_background['bgImg'] ) && ! empty( $mobile_background['bgImg'] ) && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' [id*="jarallax-container-"]' );
					$css->add_property( 'display', 'none !important' );
				}
				if ( isset( $attributes['backgroundSettingTab'] ) && ! empty( $attributes['backgroundSettingTab'] ) && 'normal' !== $attributes['backgroundSettingTab'] ) {
					$css->set_selector( '#kt-layout-id' . $unique_id . ' .kb-blocks-bg-video-container, #kt-layout-id' . $unique_id . ' .kb-blocks-bg-slider' );
					$css->add_property( 'display', 'none' );
				}
			}
			if ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) {
				$css->set_selector( '#kt-layout-id' . $unique_id . ' > .kt-row-layout-overlay' );
				if ( isset( $mobile_overlay['overlayOpacity'] ) && is_numeric( $mobile_overlay['overlayOpacity'] ) ) {
					if ( $mobile_overlay['overlayOpacity'] < 10 ) {
						$css->add_property( 'opacity', '0.0' . $mobile_overlay['overlayOpacity'] );
					} else if ( $mobile_overlay['overlayOpacity'] >= 100 ) {
						$css->add_property( 'opacity', '1' );
					} else {
						$css->add_property( 'opacity', '0.' . $mobile_overlay['overlayOpacity'] );
					}
				}
				if ( ! empty( $mobile_overlay['currentOverlayTab'] ) && 'grad' == $mobile_overlay['currentOverlayTab'] ) {
					$type = ( ! empty( $mobile_overlay['overlayGradType'] ) ? $mobile_overlay['overlayGradType'] : 'linear' );
					if ( 'radial' === $type ) {
						$angle = ( ! empty( $mobile_overlay['overlayBgImgPosition'] ) ? 'at ' . $mobile_overlay['overlayBgImgPosition'] : 'at center center' );
					} else {
						$angle = ( ! empty( $mobile_overlay['overlayGradAngle'] ) ? $mobile_overlay['overlayGradAngle'] . 'deg' : '180deg' );
					}
					$loc         = ( ! empty( $mobile_overlay['overlayGradLoc'] ) ? $mobile_overlay['overlayGradLoc'] : '0' );
					$color       = ( ! empty( $mobile_overlay['overlay'] ) ? $css->render_color( $mobile_overlay['overlay'] ) : 'transparent' );
					$locsecond   = ( ! empty( $mobile_overlay['overlayGradLocSecond'] ) ? $mobile_overlay['overlayGradLocSecond'] : '100' );
					$colorsecond = ( ! empty( $mobile_overlay['overlaySecond'] ) ? $css->render_color( $mobile_overlay['overlaySecond'] ) : '#00B5E2' );
					$css->add_property( 'background-image', $type . '-gradient(' . $angle . ', ' . $color . ' ' . $loc . '%, ' . $colorsecond . ' ' . $locsecond . '%)' );
				} else {
					if ( ! empty( $mobile_overlay['overlay'] ) ) {
						$css->add_property( 'background-color', $css->render_color( $mobile_overlay['overlay'] ) );
					}
					if ( ! empty( $mobile_overlay['overlayBgImg'] ) ) {
						if ( ! empty( $mobile_overlay['overlayBgImgAttachment'] ) ) {
							if ( 'parallax' === $mobile_overlay['overlayBgImgAttachment'] ) {
								$overbg_attach = 'fixed';
							} else {
								$overbg_attach = $mobile_overlay['overlayBgImgAttachment'];
							}
						} else {
							$overbg_attach = 'scroll';
						}
						$css->add_property( 'background-image', sprintf( "url('%s')", $mobile_overlay['overlayBgImg'] ) );
						$css->add_property( 'background-size', ( ! empty( $mobile_overlay['overlayBgImgSize'] ) ? $mobile_overlay['overlayBgImgSize'] : 'cover' ) );
						$css->add_property( 'background-position', ( ! empty( $mobile_overlay['overlayBgImgPosition'] ) ? $mobile_overlay['overlayBgImgPosition'] : 'center center' ) );
						$css->add_property( 'background-attachment', $overbg_attach );
						$css->add_property( 'background-repeat', ( ! empty( $mobile_overlay['overlayBgImgRepeat'] ) ? $mobile_overlay['overlayBgImgRepeat'] : 'no-repeat' ) );
					}
				}
				if ( ! empty( $mobile_overlay['overlayBlendMode'] ) ) {
					$css->add_property( 'mix-blend-mode', $mobile_overlay['overlayBlendMode'] );
				}
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['kadenceBlockCSS'] ) && ! empty( $attributes['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', '#kt-layout-id' . $unique_id, $attributes['kadenceBlockCSS'] ) );
		}
		// Filter with cdn support.
		$css_output = apply_filters( 'as3cf_filter_post_local_to_provider', $css->css_output() );
		return $css_output;
	}
		/**
	 * Adds Scripts for row block.
	 *
	 * @param array $attr the blocks attr.
	 */
	public function render_row_layout_scripts( $attr ) {
		if ( ( isset( $attr['bgImg'] ) && ! empty( $attr['bgImg'] ) && isset( $attr['bgImgAttachment'] ) && 'parallax' === $attr['bgImgAttachment'] ) || ( isset( $attr['overlayBgImg'] ) && ! empty( $attr['overlayBgImg'] ) && isset( $attr['overlayBgImgAttachment'] ) && 'parallax' === $attr['overlayBgImgAttachment'] ) ) {
			$this->enqueue_script( 'kadence-blocks-parallax-js' );
		}
		if ( isset( $attr['backgroundSettingTab'] ) && 'slider' === $attr['backgroundSettingTab'] ) {
			$this->enqueue_style( 'kadence-blocks-pro-slick' );
			$this->enqueue_script( 'kadence-blocks-slick-init' );
			// $this->enqueue_style( 'kadence-blocks-tiny-slider' );
			// $this->enqueue_script( 'kadence-blocks-tiny-slider-init' );
		}
		if ( isset( $attr['backgroundSettingTab'] ) && 'video' === $attr['backgroundSettingTab'] && isset( $attr['backgroundVideo'] ) && isset( $attr['backgroundVideo'][0] ) && isset( $attr['backgroundVideo'][0]['btns'] ) && true === $attr['backgroundVideo'][0]['btns'] ) {
			$this->enqueue_script( 'kadence-blocks-video-bg' );
		}
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
		// const { attributes: { columns, blockAlignment, inheritMaxWidth, align, mobileLayout, currentOverlayTab, overlayBgImg, overlay, colLayout, tabletLayout, collapseOrder, uniqueID, columnGutter, collapseGutter, bgColor, bgImg, verticalAlignment, htmlTag, bottomSep, bottomSepColor, topSep, topSepColor, firstColumnWidth, secondColumnWidth, overlayBgImgAttachment, bgImgAttachment, columnsInnerHeight, backgroundInline, backgroundSettingTab, backgroundSliderCount, backgroundSliderSettings, backgroundSlider, bgImgSize, bgImgPosition, bgImgRepeat, backgroundVideoType, backgroundVideo, bgColorClass, vsdesk, vstablet, vsmobile, tabletOverlay, mobileOverlay } } = this.props;
		// let bottomSVGDivider;
		// if ( 'ct' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'cti' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
		// } else if ( 'ctd' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
		// } else if ( 'ctdi' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
		// } else if ( 'sltl' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
		// } else if ( 'sltli' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
		// } else if ( 'sltr' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
		// } else if ( 'sltri' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
		// } else if ( 'crv' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
		// } else if ( 'crvi' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'crvl' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
		// } else if ( 'crvli' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'crvr' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
		// } else if ( 'crvri' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'wave' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
		// } else if ( 'wavei' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
		// } else if ( 'waves' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		// } else if ( 'wavesi' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		// } else if ( 'mtns' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
		// } else if ( 'littri' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M500,2l25,98l-50,0l25,-98Z" />;
		// } else if ( 'littrii' === bottomSep ) {
		// 	bottomSVGDivider = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
		// } else if ( 'threelevels' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></Fragment>;
		// } else if ( 'threelevelsi' === bottomSep ) {
		// 	bottomSVGDivider = <Fragment><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></Fragment>;
		// }
		// let topSVGDivider;
		// if ( 'ct' === topSep ) {
		// 	topSVGDivider = <path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'cti' === topSep ) {
		// 	topSVGDivider = <path d="M500,2l500,98l-1000,0l500,-98Z" />;
		// } else if ( 'ctd' === topSep ) {
		// 	topSVGDivider = <Fragment><path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style={ { opacity: 0.4 } } /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" /></Fragment>;
		// } else if ( 'ctdi' === topSep ) {
		// 	topSVGDivider = <Fragment><path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style={ { opacity: 0.4 } } /><path d="M500,2l500,98l-1000,0l500,-98Z" /></Fragment>;
		// } else if ( 'sltl' === topSep ) {
		// 	topSVGDivider = <path d="M1000,0l-1000,100l1000,0l0,-100Z" />;
		// } else if ( 'sltli' === topSep ) {
		// 	topSVGDivider = <path d="M0,100l1000,-100l-1000,0l0,100Z" />;
		// } else if ( 'sltr' === topSep ) {
		// 	topSVGDivider = <path d="M0,0l1000,100l-1000,0l0,-100Z" />;
		// } else if ( 'sltri' === topSep ) {
		// 	topSVGDivider = <path d="M1000,100l-1000,-100l1000,0l0,100Z" />;
		// } else if ( 'crv' === topSep ) {
		// 	topSVGDivider = <path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />;
		// } else if ( 'crvi' === topSep ) {
		// 	topSVGDivider = <path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'crvl' === topSep ) {
		// 	topSVGDivider = <path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />;
		// } else if ( 'crvli' === topSep ) {
		// 	topSVGDivider = <path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'crvr' === topSep ) {
		// 	topSVGDivider = <path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />;
		// } else if ( 'crvri' === topSep ) {
		// 	topSVGDivider = <path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />;
		// } else if ( 'wave' === topSep ) {
		// 	topSVGDivider = <path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />;
		// } else if ( 'wavei' === topSep ) {
		// 	topSVGDivider = <path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />;
		// } else if ( 'waves' === topSep ) {
		// 	topSVGDivider = <Fragment><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		// } else if ( 'wavesi' === topSep ) {
		// 	topSVGDivider = <Fragment><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style={ { opacity: 0.4 } } /></Fragment>;
		// } else if ( 'mtns' === topSep ) {
		// 	topSVGDivider = <Fragment><path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style={ { opacity: 0.4 } } /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" /></Fragment>;
		// } else if ( 'littri' === topSep ) {
		// 	topSVGDivider = <path d="M500,2l25,98l-50,0l25,-98Z" />;
		// } else if ( 'littrii' === topSep ) {
		// 	topSVGDivider = <path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />;
		// } else if ( 'threelevels' === topSep ) {
		// 	topSVGDivider = <Fragment><path style={ { opacity: 0.33 } } d="M0 95L1000 0v100H0v-5z"></path><path style={ { opacity: 0.66 } } d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path></Fragment>;
		// } else if ( 'threelevelsi' === topSep ) {
		// 	topSVGDivider = <Fragment><path style={ { opacity: 0.33 } } d="M1000 95L0 0v100h1000v-5z"></path><path style={ { opacity: 0.66 } } d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path></Fragment>;
		// }
		// const firstColumnClass = ( firstColumnWidth && ( 2 === columns || 3 === columns ) ? ' kt-custom-first-width-' + firstColumnWidth : '' );
		// const secondColumnClass = ( secondColumnWidth && ( 2 === columns || 3 === columns ) ? ' kt-custom-second-width-' + secondColumnWidth : '' );
		// const thirdColumnClass = ( secondColumnWidth && firstColumnWidth && 3 === columns ? ' kt-custom-third-width-' + ( Math.round( ( 100 - ( parseFloat( firstColumnWidth ) + parseFloat( secondColumnWidth ) ) ) * 10 ) / 10 ) : '' );
		// const layoutClass = ( ! colLayout ? 'equal' : colLayout );
		// const tabLayoutClass = ( ! tabletLayout ? 'inherit' : tabletLayout );
		// const HtmlTagOut = ( ! htmlTag ? 'div' : htmlTag );
		// const mobileLayoutClass = ( ! mobileLayout ? 'inherit' : mobileLayout );
		// const classId = ( ! uniqueID ? 'notset' : uniqueID );
		// const overlayType = ( ! currentOverlayTab || 'grad' !== currentOverlayTab ? 'normal' : 'gradient' );
		// //const classes = classnames( `align${ ( align ? align : 'none' ) }` );
		// const classes = classnames( {
		// 	[ `align${ ( align ? align : 'none' ) }` ]: true,
		// 	'kvs-lg-false': vsdesk !== 'undefined' && vsdesk,
		// 	'kvs-md-false': vstablet !== 'undefined' && vstablet,
		// 	'kvs-sm-false': vsmobile !== 'undefined' && vsmobile,
		// } );
		// const backgroundColorClass = getColorClassName( 'background-color', bgColorClass );
		// const innerClasses = classnames( 'kt-row-layout-inner', {
		// 	'kt-row-has-bg': bgColor || bgImg || overlay || overlayBgImg,
		// 	[ 'kt-layout-id' + classId ]: classId,
		// 	'kt-jarallax': bgImg && bgImgAttachment === 'parallax',
		// 	[ backgroundColorClass ]: backgroundColorClass,
		// } );
		// //const innerColumnClasses = classnames( `kt-row-column-wrap kt-has-${ columns }-columns kt-gutter-${ columnGutter } kt-v-gutter-${ ( collapseGutter ? collapseGutter : 'default' ) } kt-row-valign-${ verticalAlignment } kt-row-layout-${ layoutClass } kt-tab-layout-${ tabLayoutClass } kt-m-colapse-${ collapseOrder } kt-mobile-layout-${ mobileLayoutClass }${ firstColumnClass }${ secondColumnClass }${ thirdColumnClass }${ ( undefined !== columnsInnerHeight && true === columnsInnerHeight ? ' kt-inner-column-height-full' : '' ) }` );
		// const innerColumnClasses = classnames( {
		// 	'kt-row-column-wrap': true,
		// 	[ `kt-has-${ columns }-columns` ]: columns,
		// 	[ `kt-gutter-${ columnGutter }`]: columnGutter,
		// 	[ `kt-v-gutter-${ ( collapseGutter ? collapseGutter : 'default' ) }`]: true,
		// 	[ `kt-row-valign-${ verticalAlignment }`]: verticalAlignment,
		// 	[ `kt-row-layout-${ layoutClass }` ]: layoutClass,
		// 	[ `kt-tab-layout-${ tabLayoutClass }` ]: tabLayoutClass,
		// 	[ `kt-m-colapse-${ collapseOrder }` ]: collapseOrder,
		// 	[ `kt-mobile-layout-${ mobileLayoutClass }` ]: mobileLayoutClass,
		// 	[ firstColumnClass ]: firstColumnClass,
		// 	[ secondColumnClass ]: secondColumnClass,
		// 	[ thirdColumnClass ]: thirdColumnClass,
		// 	'kt-inner-column-height-full': ( undefined !== columnsInnerHeight && true === columnsInnerHeight ),
		// 	'kb-theme-content-width': inheritMaxWidth,
		// } );
		// let hasOverlay = ( overlay || overlayBgImg ? true : false );
		// if ( ! hasOverlay ) {
		// 	hasOverlay = ( tabletOverlay && tabletOverlay[0] && tabletOverlay[0].enable ? true : false );
		// }
		// if ( ! hasOverlay ) {
		// 	hasOverlay = ( mobileOverlay && mobileOverlay[0] && mobileOverlay[0].enable ? true : false );
		// }
		// const renderSliderImages = ( index ) => {
		// 	let bgSlider;
		// 	if ( undefined === backgroundSlider || ( undefined !== backgroundSlider && undefined === backgroundSlider[ 0 ] ) ) {
		// 		bgSlider = [ {
		// 			bgColor: '',
		// 			bgImg: '',
		// 			bgImgID: '',
		// 		} ];
		// 	} else {
		// 		bgSlider = backgroundSlider;
		// 	}
		// 	return (
		// 		<div className="kb-bg-slide-contain">
		// 			<div className={ `kb-bg-slide kb-bg-slide-${ index }` } style={ {
		// 				backgroundColor: ( bgSlider[ index ] && '' !== bgSlider[ index ].bgColor ? KadenceColorOutput( bgSlider[ index ].bgColor ) : undefined ),
		// 				backgroundImage: ( bgSlider[ index ] && '' !== bgSlider[ index ].bgImg ? 'url(' + bgSlider[ index ].bgImg + ')' : undefined ),
		// 				backgroundSize: bgImgSize ? bgImgSize : undefined,
		// 				backgroundPosition: bgImgPosition ? bgImgPosition : undefined,
		// 				backgroundRepeat: bgImgRepeat ? bgImgRepeat : undefined,
		// 			} }></div>
		// 		</div>
		// 	);
		// };
		// const renderSlider = () => {
		// 	let bgSliderSettings;
		// 	if ( undefined === backgroundSliderSettings || ( undefined !== backgroundSliderSettings && undefined === backgroundSliderSettings[ 0 ] ) ) {
		// 		bgSliderSettings = [ {
		// 			arrowStyle: 'none',
		// 			dotStyle: 'dark',
		// 			autoPlay: true,
		// 			speed: 7000,
		// 			fade: true,
		// 			tranSpeed: 400,
		// 		} ];
		// 	} else {
		// 		bgSliderSettings = backgroundSliderSettings;
		// 	}
		// 	return (
		// 		<div className={ `kt-blocks-carousel kb-blocks-bg-slider kt-carousel-container-dotstyle-${ bgSliderSettings[ 0 ].dotStyle }` }>
		// 			<div className={ `kt-blocks-carousel-init kb-blocks-bg-slider-init kt-carousel-arrowstyle-${ bgSliderSettings[ 0 ].arrowStyle } kt-carousel-dotstyle-${ bgSliderSettings[ 0 ].dotStyle }` } data-slider-anim-speed={ bgSliderSettings[ 0 ].tranSpeed } data-slider-type="slider" data-slider-scroll="1" data-slider-arrows={ ( 'none' === bgSliderSettings[ 0 ].arrowStyle ? false : true ) } data-slider-fade={ bgSliderSettings[ 0 ].fade } data-slider-dots={ ( 'none' === bgSliderSettings[ 0 ].dotStyle ? false : true ) } data-slider-hover-pause="false" data-slider-auto={ bgSliderSettings[ 0 ].autoPlay } data-slider-speed={ bgSliderSettings[ 0 ].speed }>
		// 				{ times( ( undefined !== backgroundSliderCount ? backgroundSliderCount : 1 ), n => renderSliderImages( n ) ) }
		// 			</div>
		// 		</div>
		// 	);
		// };
		// const renderVideo = () => {
		// 	const bgVideo = ( undefined !== backgroundVideo && undefined !== backgroundVideo[ 0 ] && undefined !== backgroundVideo[ 0 ].local ? backgroundVideo : [ {
		// 		youTube: '',
		// 		local: '',
		// 		localID: '',
		// 		vimeo: '',
		// 		ratio: '16/9',
		// 		btns: false,
		// 		loop: true,
		// 		mute: true,
		// 	} ] );
		// 	return (
		// 		<Fragment>
		// 			<video className="kb-blocks-bg-video" poster={ ( undefined !== bgImg && '' !== bgImg ? bgImg : undefined ) } playsinline="" autoplay="" muted={ ( false === bgVideo[ 0 ].mute ? false : '' ) } loop={ ( false === bgVideo[ 0 ].loop ? false : '' ) } src={ bgVideo[ 0 ].local }></video>
		// 			{ true === bgVideo[ 0 ].btns && (
		// 				<div className="kb-background-video-buttons-wrapper kb-background-video-buttons-html5">
		// 					<button className="kb-background-video-play kb-toggle-video-btn" aria-label={ __( 'Play', 'kadence-blocks' ) } aria-hidden="true" style="display: none;"><svg viewBox="0 0 448 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></button>
		// 					<button className="kb-background-video-pause kb-toggle-video-btn" aria-label={ __( 'Pause', 'kadence-blocks' ) } aria-hidden="false"><svg viewBox="0 0 448 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg></button>
		// 					{ false === bgVideo[ 0 ].mute && (
		// 						<Fragment>
		// 							<button className="kb-background-video-unmute kb-toggle-video-btn" aria-label={ __( 'Unmute', 'kadence-blocks' ) } aria-hidden="true" style="display: none;"><svg viewBox="0 0 256 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971z"></path></svg></button>
		// 							<button className="kb-background-video-mute kb-toggle-video-btn" aria-label={ __( 'Mute', 'kadence-blocks' ) } aria-hidden="false"><svg viewBox="0 0 576 512" height="16" width="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971zm182.056-77.876C422.982.92 403.283 5.668 394.061 20.745c-9.221 15.077-4.473 34.774 10.604 43.995C468.967 104.063 512 174.983 512 256c0 73.431-36.077 142.292-96.507 184.206-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.126 44.531 8.057C529.633 438.927 576 350.406 576 256c0-103.244-54.579-194.877-137.944-245.859zM480 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.774 10.607 43.994C393.067 170.188 416 211.048 416 256c0 41.964-20.62 81.319-55.158 105.276-14.521 10.073-18.128 30.01-8.056 44.532 6.216 8.96 16.185 13.765 26.322 13.765a31.862 31.862 0 0 0 18.21-5.709C449.091 377.953 480 318.938 480 256zm-96 0c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z"></path></svg></button>
		// 						</Fragment>
		// 					) }
		// 				</div>
		// 			) }
		// 		</Fragment>
		// 	);
		// };
		// return (
		// 	<HtmlTagOut className={ classes }>
		// 		<div id={ `kt-layout-id${ uniqueID }` } className={ innerClasses } style={ {
		// 			backgroundImage: ( 'slider' !== backgroundSettingTab && 'video' !== backgroundSettingTab && backgroundInline && undefined !== bgImg && '' !== bgImg ? 'url(' + bgImg + ')' : undefined ),
		// 		} }>
		// 			{ ( 'slider' === backgroundSettingTab ) && (
		// 				renderSlider()
		// 			) }
		// 			{ ( 'video' === backgroundSettingTab ) && (
		// 				<div className={ 'kb-blocks-bg-video-container' }>
		// 					{ ( undefined === backgroundVideoType || '' === backgroundVideoType || 'local' === backgroundVideoType ) && (
		// 						renderVideo()
		// 					) }
		// 				</div>
		// 			) }
		// 			{ hasOverlay && (
		// 				<div className={ `kt-row-layout-overlay kt-row-overlay-${ overlayType }${ overlayBgImg && 'gradient' !== overlayType && overlayBgImgAttachment === 'parallax' ? ' kt-jarallax' : '' }` }></div>
		// 			) }
		// 			{ topSep && 'none' !== topSep && '' !== topSep && (
		// 				<div className={ `kt-row-layout-top-sep kt-row-sep-type-${ topSep }` }>
		// 					<svg style={ { fill: KadenceColorOutput( topSepColor ) } } viewBox="0 0 1000 100" preserveAspectRatio="none">
		// 						{ topSVGDivider }
		// 					</svg>
		// 				</div>
		// 			) }
		// 			<div className={ innerColumnClasses }>
		// 				<InnerBlocks.Content />
		// 			</div>
		// 			{ bottomSep && 'none' !== bottomSep && '' !== bottomSep && (
		// 				<div className={ `kt-row-layout-bottom-sep kt-row-sep-type-${ bottomSep }` }>
		// 					<svg style={ { fill: KadenceColorOutput( bottomSepColor ) } } viewBox="0 0 1000 100" preserveAspectRatio="none">
		// 						{ bottomSVGDivider }
		// 					</svg>
		// 				</div>
		// 			) }
		// 		</div>
		// 	</HtmlTagOut>
		// );
		if ( ! empty( $attributes['backgroundSettingTab'] ) && 'video' === $attributes['backgroundSettingTab'] && ( ( ! empty( $attributes['tabletBackground'][0]['enable'] ) && true == $attributes['tabletBackground'][0]['enable'] ) || ( ! empty( $attributes['mobileBackground'][0]['enable'] ) && true == $attributes['mobileBackground'][0]['enable'] ) ) && apply_filters( 'kadence_blocks_rowlayout_prevent_preload_for_mobile', true ) ) {
			if ( ! empty( $attributes['tabletBackground'][0]['enable'] ) && 'true' == $attributes['tabletBackground'][0]['enable'] ) {
				$size = 1024;
			} else {
				$size = 767;
			}
			if ( ! empty( $attributes['bgImg'] ) ) {
				$content = str_replace( 'kt-layout-id' . $attributes['uniqueID'] . '"><div class="kb-blocks-bg-video-container"><video class="kb-blocks-bg-video" poster="' . $attributes['bgImg'] . '" playsinline autoplay', 'kt-layout-id' . $attributes['uniqueID'] . '"><div class="kb-blocks-bg-video-container"><video id="bg-row-video-' . $attributes['uniqueID'] . '" class="kb-blocks-bg-video" poster=" ' . $attributes['bgImg'] . '" playsinline preload="none"', $content );
			} else {
				$content = str_replace( 'kt-layout-id' . $attributes['uniqueID'] . '"><div class="kb-blocks-bg-video-container"><video class="kb-blocks-bg-video" playsinline autoplay', 'kt-layout-id' . $attributes['uniqueID'] . '"><div class="kb-blocks-bg-video-container"><video id="bg-row-video-' . $attributes['uniqueID'] . '" class="kb-blocks-bg-video" playsinline preload="none"', $content );
			}
			$content = $content . '<script>if( window.innerWidth > ' . $size . ' ){document.getElementById("bg-row-video-' . $attributes['uniqueID'] . '").removeAttribute("preload");document.getElementById("bg-row-video-' . $attributes['uniqueID'] . '").setAttribute("autoplay","");}</script>';
		}
		return $content;
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
		wp_register_script( 'jarallax', KADENCE_BLOCKS_URL . 'includes/assets/js/jarallax.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-parallax-js', KADENCE_BLOCKS_URL . 'includes/assets/js/kt-init-parallax.min.js', array( 'jarallax' ), KADENCE_BLOCKS_VERSION, true );
		wp_localize_script(
			'kadence-blocks-parallax-js',
			'kadence_blocks_parallax',
			array(
				'speed' => apply_filters( 'kadence_blocks_parallax_speed', -0.1 ),
			)
		);
		wp_register_style( 'kadence-blocks-pro-slick', KADENCE_BLOCKS_URL . 'dist/assets/css/kt-blocks-slick.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-slick', KADENCE_BLOCKS_URL . 'includes/assets/js/slick.min.js', array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-slick-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kt-slick-init.min.js', array( 'jquery', 'kadence-slick' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-video-bg', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-html-bg-video.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_RowLayout_Block::get_instance();
