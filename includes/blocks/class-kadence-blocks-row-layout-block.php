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
class Kadence_Blocks_Rowlayout_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'rowlayout';

	/**
	 * Allowed HTML tags for front end output
	 *
	 * @var string[]
	 */
	protected $allowed_html_tags = array( 'div', 'header', 'section', 'article', 'main', 'aside', 'footer' );


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
			$this->enqueue_style( 'kadence-blocks-splide' );
			if ( $inline ) {
				$this->should_render_inline_stylesheet( 'kadence-blocks-splide' );
			}
			$this->enqueue_script( 'kadence-blocks-splide-init' );
		}

		$is_background_video = isset( $attributes['backgroundSettingTab'] ) && 'video' === $attributes['backgroundSettingTab'];
		$has_background_video_content = $is_background_video && isset( $attributes['backgroundVideo'] ) && isset( $attributes['backgroundVideo'][0] );
		$show_play_pause = $has_background_video_content && isset( $attributes['backgroundVideo'][0]['btns'] ) && true === $attributes['backgroundVideo'][0]['btns'];
		$show_audio_is_default = ( $has_background_video_content && ( ! isset( $attributes['backgroundVideo'][0]['btnsMute'] ) ) );
		$show_audio = $has_background_video_content && ( ( $show_audio_is_default && $show_play_pause && isset( $attributes['backgroundVideo'][0]['mute'] ) && false === $attributes['backgroundVideo'][0]['mute'] ) || ( isset( $attributes['backgroundVideo'][0]['btnsMute'] ) && $attributes['backgroundVideo'][0]['btnsMute'] ) );
		if ( $show_play_pause || $show_audio ) {
			$this->enqueue_script( 'kadence-blocks-video-bg' );
		}
	}

	/**
	 * Return a grid tempate coulmns string for custom column widths.
	 *
	 * @param object $css the css object.
	 * @param int    $columns the amount of columns.
	 * @param string $gap the gap.
	 * @param int    $column1 the first column width.
	 * @param int    $column2 the second column width.
	 * @param int    $column3 the third column width.
	 * @param int    $column4 the fourth column width.
	 * @param int    $column5 the fifth column width.
	 * @param int    $column6 the sixth column width.
	 */
	public function get_custom_layout( $css, $columns, $gap = '', $column1 = null, $column2 = null, $column3 = null, $column4 = null, $column5 = null, $column6 = null ) {
		$grid_layout_string = '';
		if ( $columns > 1 ) {
			$gap_string = ! empty( $gap ) ? $gap : 'var(--kb-default-row-gutter, var(--global-row-gutter-md, 2rem))';
			$column_widths = array( $column1, $column2, $column3, $column4, $column5, $column6 );
			$column_width_sum = 0;

			foreach ( range( 0, $columns - 1 ) as $column ) {
				$column_width = $column_widths[ $column ];
				if ( $column == $columns - 1 ) {
					//assume the last column width to make 100
					$column_width = abs( $column_width_sum - 100 );
				}
				$grid_layout_string .= 'minmax(0, calc(' . $column_width . '% - ((' . $gap_string . ' * ' . ($columns - 1) . ' )/' . $columns . ')))';
				$column_width_sum += $column_width;
			}
		}
		return $grid_layout_string;
	}

	/**
	 * Render for block scripts block.
	 *
	 * @param object $css the css object.
	 * @param int    $columns the amount of columns.
	 * @param string $layout the layout of the row.
	 * @param string $inner_selector the inner selector.
	 * @param string $gap the gap.
	 * @param int    $column1 the first column width.
	 * @param int    $column2 the second column width.
	 * @param int    $column3 the third column width.
	 * @param int    $column4 the fourth column width.
	 * @param int    $column5 the fifth column width.
	 * @param int    $column6 the sixth column width.
	 */
	public function get_template_columns( $css, $columns, $layout, $inner_selector, $gap = '', $column1 = null, $column2 = null, $column3 = null, $column4 = null, $column5 = null, $column6 = null ) {
		$grid_layout = 'minmax(0, 1fr)';
		switch ( $columns ) {
			case 1:
				switch ( $layout ) {
					case 'grid-layout':
						$grid_layout = 'repeat(12, minmax(0, 1fr))';
						break;
				}
				break;
			case 2:
				if ( ! empty( $column1 ) ) {
					$grid_layout = $this->get_custom_layout( $css, $columns, $gap, $column1, $column2, $column3, $column4, $column5, $column6 );
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
					if ( abs( $column1 ) === 50 && abs( $column2 ) === 25 ) {
						$grid_layout = 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)';
					} else if ( abs( $column1 ) === 25 && abs( $column2 ) === 50 ) {
						$grid_layout = 'minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)';
					} else if ( abs( $column1 ) === 25 && abs( $column2 ) === 25 ) {
						$grid_layout = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)';
					} else {
						$grid_layout = $this->get_custom_layout( $css, $columns, $gap, $column1, $column2, $column3, $column4, $column5, $column6 );
					}
				} else {
					switch ( $layout ) {
						case 'left-half':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr)';
							break;
						case 'right-half':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)';
							break;
						case 'center-half':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr) minmax(0, 2fr) minmax(0, 1fr)';
							break;
						case 'center-wide':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr) minmax(0, 3fr) minmax(0, 1fr)';
							break;
						case 'center-exwide':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr) minmax(0, 6fr) minmax(0, 1fr)';
							break;
						case 'first-row':
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							$css->set_selector( $inner_selector . ' > *:nth-child(3n+1 of *:not(style))' );
							$css->add_property( 'grid-column', '1 / -1' );
							$css->set_selector( $inner_selector );
							break;
						case 'last-row':
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							$css->set_selector( $inner_selector . ' > *:nth-child(3n of *:not(style))' );
							$css->add_property( 'grid-column', '1 / -1' );
							$css->set_selector( $inner_selector );
							break;
						case 'two-grid':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							break;
						case 'row':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr)';
							break;
						default:
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(3, minmax(0, 1fr))';
							break;
					}
				}
				break;
			case 4:
				if ( ! empty( $column1 ) && ! empty( $column2 ) && ! empty( $column3 ) ) {
					$grid_layout = $this->get_custom_layout( $css, $columns, $gap, $column1, $column2, $column3, $column4, $column5, $column6 );
				} else {
					switch ( $layout ) {
						case 'left-forty':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 2fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)';
							break;
						case 'right-forty':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) minmax(0, 2fr)';
							break;
						case 'two-grid':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							break;
						case 'row':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr)';
							break;
						default:
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(4, minmax(0, 1fr))';
							break;
					}
				}
				break;
			case 5:
				if ( ! empty( $column1 ) && ! empty( $column2 ) && ! empty( $column3 ) && ! empty( $column4 ) ) {
					$grid_layout = $this->get_custom_layout( $css, $columns, $gap, $column1, $column2, $column3, $column4, $column5, $column6 );
				} else {
					switch ( $layout ) {
						case 'first-row':
							$grid_layout = 'repeat(4, minmax(0, 1fr))';
							$css->set_selector( $inner_selector . ' > *:nth-child(5n+1 of *:not(style))' );
							$css->add_property( 'grid-column', '1 / -1' );
							$css->set_selector( $inner_selector );
							break;
						case 'last-row':
							$grid_layout = 'repeat(4, minmax(0, 1fr))';
							$css->set_selector( $inner_selector . ' > *:nth-child(5n of *:not(style))' );
							$css->add_property( 'grid-column', '1 / -1' );
							$css->set_selector( $inner_selector );
							break;
						case 'two-grid':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(2, minmax(0, 1fr))';
							break;
						case 'three-grid':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(3, minmax(0, 1fr))';
							break;
						case 'row':
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'minmax(0, 1fr)';
							break;
						default:
							$this->reset_grid_colum_for_template_columns( $css, $inner_selector );
							$grid_layout = 'repeat(5, minmax(0, 1fr))';
							break;
					}
				}
				break;
			case 6:
				if ( ! empty( $column1 ) && ! empty( $column2 ) && ! empty( $column3 ) && ! empty( $column4 ) && ! empty( $column5 ) ) {
					$grid_layout = $this->get_custom_layout( $css, $columns, $gap, $column1, $column2, $column3, $column4, $column5, $column6 );
				} else {
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
				}
				break;
		}
		return $grid_layout;
	}

	/**
	 * A reset helper for the template columns
	 */
	public function reset_grid_colum_for_template_columns( $css, $inner_selector ) {
		$css->set_selector( $inner_selector . ' > div:not(.added-for-specificity)' );
		$css->add_property( 'grid-column', 'initial' );
		$css->set_selector( $inner_selector );
	}

	/**
	 * Builds CSS for block.
	 *
	 * @param array  $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$updated_version = ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ? true : false;
		if ( ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ) {
			$margin_selector = '.kb-row-layout-wrap.wp-block-kadence-rowlayout.kb-row-layout-id' . $unique_id;
			$base_selector = '.kb-row-layout-id' . $unique_id;
			$inner_selector = '.kb-row-layout-id' . $unique_id . ' > .kt-row-column-wrap';
		} else {
			$margin_selector = '#kt-layout-id' . $unique_id;
			$base_selector = '#kt-layout-id' . $unique_id;
			$inner_selector = '#kt-layout-id' . $unique_id . ' > .kt-row-column-wrap';
		}
		// Margin, check for old attributes and use if present.
		$css->set_selector( $margin_selector );
		// Fix to prevent generatepress from breaking things with their css.
		if ( class_exists( 'GeneratePress_CSS' ) ) {
			$css->add_property( 'margin-bottom', '0px' );
		}
		if ( $css->is_number( $attributes['topMargin'] ) || $css->is_number( $attributes['bottomMargin'] ) || $css->is_number( $attributes['topMarginT'] ) || $css->is_number( $attributes['bottomMarginT'] ) || $css->is_number( $attributes['topMarginM'] ) || $css->is_number( $attributes['bottomMarginM'] ) ) {
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
			$args = array(
				'unit_key' => 'marginUnit',
			);
			$css->render_measure_output( $attributes, 'margin', 'margin', $args );
		}
		// Vertical Alignment.
		$css->set_selector( $inner_selector );
		if ( ! $updated_version && ( ( ! empty( $attributes['topSep'] ) && 'none' !== $attributes['topSep'] ) || ( ! empty( $attributes['bottomSep'] ) && 'none' !== $attributes['bottomSep'] ) ) ) {
			$css->add_property( 'z-index', '10' );
			$css->add_property( 'position', 'relative' );
		}
		if ( ! empty( $attributes['verticalAlignment'] ) ) {
			switch ( $attributes['verticalAlignment'] ) {
				case 'middle':
					$css->add_property( 'align-content', 'center' );
					$css->set_selector( ':where(' . $inner_selector . ') > .wp-block-kadence-column' );
					$css->add_property( 'justify-content', 'center' );
					$css->set_selector( $inner_selector );
					break;
				case 'bottom':
					$css->add_property( 'align-content', 'end' );
					$css->set_selector( ':where(' . $inner_selector . ') > .wp-block-kadence-column' );
					$css->add_property( 'justify-content', 'end' );
					$css->set_selector( $inner_selector );
					break;
				case 'top':
					$css->add_property( 'align-content', 'start' );
					$css->set_selector( ':where(' . $inner_selector . ') > .wp-block-kadence-column' );
					$css->add_property( 'justify-content', 'start' );
					$css->set_selector( $inner_selector );
					break;
			}
		}
		// Gutter.
		$css->render_row_gap( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'column-gap', 'customGutter', 'gutterType' );
		$css->render_row_gap( $attributes, array( 'collapseGutter', 'tabletRowGutter', 'mobileRowGutter' ), 'row-gap', 'customRowGutter', 'rowGutterType' );
		// Max Width.
		if ( isset( $attributes['inheritMaxWidth'] ) && true === $attributes['inheritMaxWidth'] ) {
			global $content_width;
			if ( isset( $content_width ) ) {
				if ( class_exists( 'Kadence\Theme' ) ) {
					$css->add_property( 'max-width', 'var( --global-content-width, ' . absint( $content_width ) . 'px )' );
					$css->add_property( 'padding-left', 'var(--global-content-edge-padding)' );
					$css->add_property( 'padding-right', 'var(--global-content-edge-padding)' );
				} else {
					$css->add_property( 'max-width', absint( $content_width ) . 'px' );
				}
			} else {
				$css->add_property( 'max-width', 'var(--wp--style--global--content-size)' );
			}
		} else {
			if ( $css->is_number( $attributes['maxWidth'] ) ) {
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
		// Padding, check for old attributes and use if present.
		if ( empty( $attributes['kbVersion'] ) ) {
			// Add old defaults back in.
			$css->add_property( 'padding-top', 'var( --global-kb-row-default-top, 25px )' );
			$css->add_property( 'padding-bottom', 'var( --global-kb-row-default-bottom, 25px )' );
		}
		if ( $css->is_number( $attributes['topPadding'] ) || $css->is_number( $attributes['bottomPadding'] ) || $css->is_number( $attributes['leftPadding'] ) || $css->is_number( $attributes['rightPadding'] ) || $css->is_number( $attributes['topPaddingM'] ) || $css->is_number( $attributes['bottomPaddingM'] ) || $css->is_number( $attributes['leftPaddingM'] ) || $css->is_number( $attributes['rightPaddingM'] ) ) {
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
			$args = array(
				'unit_key' => 'paddingUnit',
			);
			// If no padding is set, use the default.
			if ( ! isset( $attributes['padding'] ) ) {
				// $attributes['padding'] = [
				// 	'sm', '', 'sm', ''
				// ];
				$css->add_property( 'padding-top', 'var( --global-kb-row-default-top, var(--global-kb-spacing-sm, 1.5rem) )' );
				$css->add_property( 'padding-bottom', 'var( --global-kb-row-default-bottom, var(--global-kb-spacing-sm, 1.5rem) )' );
			}
			$css->render_measure_output( $attributes, 'padding', 'padding', $args );
		}
		// Min Height.
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

		// Layout.
		$columns = ( ! empty( $attributes['columns'] ) ? $attributes['columns'] : 2 );
		$layout  = ( ! empty( $attributes['colLayout'] ) ? $attributes['colLayout'] : 'equal' );
		$column1  = ( ! empty( $attributes['firstColumnWidth'] ) ? $attributes['firstColumnWidth'] : '' );
		$column2  = ( ! empty( $attributes['secondColumnWidth'] ) ? $attributes['secondColumnWidth'] : '' );
		$column3  = ( ! empty( $attributes['thirdColumnWidth'] ) ? $attributes['thirdColumnWidth'] : '' );
		$column4  = ( ! empty( $attributes['fourthColumnWidth'] ) ? $attributes['fourthColumnWidth'] : '' );
		$column5  = ( ! empty( $attributes['fifthColumnWidth'] ) ? $attributes['fifthColumnWidth'] : '' );
		$column6  = ( ! empty( $attributes['sixthColumnWidth'] ) ? $attributes['sixthColumnWidth'] : '' );
		$column1_tablet  = ( ! empty( $attributes['firstColumnWidthTablet'] ) ? $attributes['firstColumnWidthTablet'] : '' );
		$column2_tablet  = ( ! empty( $attributes['secondColumnWidthTablet'] ) ? $attributes['secondColumnWidthTablet'] : '' );
		$column3_tablet  = ( ! empty( $attributes['thirdColumnWidthTablet'] ) ? $attributes['thirdColumnWidthTablet'] : '' );
		$column4_tablet  = ( ! empty( $attributes['fourthColumnWidthTablet'] ) ? $attributes['fourthColumnWidthTablet'] : '' );
		$column5_tablet  = ( ! empty( $attributes['fifthColumnWidthTablet'] ) ? $attributes['fifthColumnWidthTablet'] : '' );
		$column6_tablet  = ( ! empty( $attributes['sixthColumnWidthTablet'] ) ? $attributes['sixthColumnWidthTablet'] : '' );
		$column1_mobile  = ( ! empty( $attributes['firstColumnWidthMobile'] ) ? $attributes['firstColumnWidthMobile'] : '' );
		$column2_mobile  = ( ! empty( $attributes['secondColumnWidthMobile'] ) ? $attributes['secondColumnWidthMobile'] : '' );
		$column3_mobile  = ( ! empty( $attributes['thirdColumnWidthMobile'] ) ? $attributes['thirdColumnWidthMobile'] : '' );
		$column4_mobile  = ( ! empty( $attributes['fourthColumnWidthMobile'] ) ? $attributes['fourthColumnWidthMobile'] : '' );
		$column5_mobile  = ( ! empty( $attributes['fifthColumnWidthMobile'] ) ? $attributes['fifthColumnWidthMobile'] : '' );
		$column6_mobile  = ( ! empty( $attributes['sixthColumnWidthMobile'] ) ? $attributes['sixthColumnWidthMobile'] : '' );
		$collapse_layouts = array( 'row', 'two-grid', 'three-grid', 'last-row', 'first-row' );
		$has_custom_widths = $this->has_custom_widths( $columns, $column1, $column2, $column3, $column4, $column5, $column6 );
		$has_custom_widths_tablet = $this->has_custom_widths( $columns, $column1_tablet, $column2_tablet, $column3_tablet, $column4_tablet, $column5_tablet, $column6_tablet );
		$has_custom_widths_mobile = $this->has_custom_widths( $columns, $column1_mobile, $column2_mobile, $column3_mobile, $column4_mobile, $column5_mobile, $column6_mobile );

		//base desktop layout.
		$grid_layout = $this->get_template_columns( $css, $columns, $layout, $inner_selector, $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'desktop', 'customGutter', 'gutterType' ), $column1, $column2, $column3, $column4, $column5, $column6 );
		$css->add_property( 'grid-template-columns', $grid_layout );

		//Desktop ordering
		if ( ! empty( $attributes['collapseOrder'] ) && 'left-to-right' !== $attributes['collapseOrder'] && in_array( $layout, $collapse_layouts ) ) {
			$css->set_media_state( 'tablet' );
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . $item_count . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 1 ) );
			}
			// Row Two.
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns ) . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 11 ) );
			}
			// Row Three.
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns ) . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 21 ) );
			}
			// Row Four.
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns + $columns ) . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 31 ) );
			}
			$css->set_media_state( 'desktop' );
		}

		//Tablet layout
		if ( empty( $attributes['tabletLayout'] ) && ! empty( $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'tablet', 'customGutter', 'gutterType' ) ) ) {
			//no tablet layout, but we have a tablet guttter width, so render the inherited column layout from desktop, potentially with custom widths.
			$css->set_media_state( 'tablet' );
			$css->set_selector( $inner_selector );

			//if no custom widths, need to use desktop widths
			if ( $has_custom_widths_tablet ) {
				$grid_layout = $this->get_template_columns( $css, $columns, $layout, $inner_selector, $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'tablet', 'customGutter', 'gutterType' ), $column1_tablet, $column2_tablet, $column3_tablet, $column4_tablet, $column5_tablet, $column6_tablet );
			} else {
				$grid_layout = $this->get_template_columns( $css, $columns, $layout, $inner_selector, $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'tablet', 'customGutter', 'gutterType' ), $column1, $column2, $column3, $column4, $column5, $column6 );
			}
			$css->add_property( 'grid-template-columns', $grid_layout );
		}
		if ( ! empty( $attributes['tabletLayout'] ) || $column1_tablet ) {
			//use tablet layout. Potentially with custom widths
			$layout  = ( ! empty( $attributes['colLayout'] ) ? $attributes['colLayout'] : 'equal' );
			$tabletLayout  = ( ! empty( $attributes['tabletLayout'] ) && $attributes['tabletLayout'] !== 'inherit' ? $attributes['tabletLayout'] : $layout );
			$css->set_media_state( 'tablet' );
			$css->set_selector( $inner_selector );
			$grid_layout = $this->get_template_columns( $css, $columns, $tabletLayout, $inner_selector, $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'tablet', 'customGutter', 'gutterType' ), $column1_tablet, $column2_tablet, $column3_tablet, $column4_tablet, $column5_tablet, $column6_tablet );
			$css->add_property( 'grid-template-columns', $grid_layout );
			//tablet ordering
			if ( ! empty( $attributes['collapseOrder'] ) && 'left-to-right' !== $attributes['collapseOrder'] && in_array( $tabletLayout, $collapse_layouts ) ) {
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . $item_count . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 1 ) );
				}
				// Row Two.
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns ) . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 11 ) );
				}
				// Row Three.
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns ) . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 21 ) );
				}
				// Row Four.
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns + $columns ) . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 31 ) );
				}
			}
			$css->set_media_state( 'desktop' );
		} elseif ( $columns > 4 ) {
			//If no tablet layout and more than 4 columns use mobile layout. (this does not match editor behavior)
			$collapse_tab_layout  = ( ! empty( $attributes['mobileLayout'] ) ? $attributes['mobileLayout'] : 'row' );
			$css->set_media_state( 'tablet' );
			$css->set_selector( $inner_selector );
			$grid_layout = $this->get_template_columns( $css, $columns, $collapse_tab_layout, $inner_selector, $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'tablet', 'customGutter', 'gutterType' ), $column1_mobile, $column2_mobile, $column3_mobile, $column4_mobile, $column5_mobile, $column6_mobile );
			$css->add_property( 'grid-template-columns', $grid_layout );
			//tablet collapse ordering
			if ( ! empty( $attributes['collapseOrder'] ) && 'left-to-right' !== $attributes['collapseOrder'] && in_array( $collapse_tab_layout, $collapse_layouts ) ) {
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . $item_count . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 1 ) );
				}
				// Row Two.
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns ) . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 11 ) );
				}
				// Row Three.
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns ) . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 21 ) );
				}
				// Row Four.
				foreach ( range( 1, $columns ) as $item_count ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns + $columns ) . ' of *:not(style))' );
					$css->add_property( 'order', ( $columns - $item_count + 31 ) );
				}
			}
			$css->set_media_state( 'desktop' );
		}

		//mobile layout
		$mobile_layout  = ( ! empty( $attributes['mobileLayout'] ) ? $attributes['mobileLayout'] : 'row' );
		$css->set_media_state( 'mobile' );
		$css->set_selector( $inner_selector );
		$grid_layout = $this->get_template_columns( $css, $columns, $mobile_layout, $inner_selector, $css->render_row_gap_property( $attributes, array( 'columnGutter', 'tabletGutter', 'mobileGutter' ), 'mobile', 'customGutter', 'gutterType' ), $column1_mobile, $column2_mobile, $column3_mobile, $column4_mobile, $column5_mobile, $column6_mobile );
		$css->add_property( 'grid-template-columns', $grid_layout );
		//mobile ordering
		if ( ! empty( $attributes['collapseOrder'] ) && 'left-to-right' !== $attributes['collapseOrder'] && in_array( $mobile_layout, $collapse_layouts ) ) {
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . $item_count . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 1 ) );
			}
			// Row Two.
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns ) . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 11 ) );
			}
			// Row Three.
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns ) . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 21 ) );
			}
			// Row Four.
			foreach ( range( 1, $columns ) as $item_count ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(' . ( $item_count + $columns + $columns + $columns ) . ' of *:not(style))' );
				$css->add_property( 'order', ( $columns - $item_count + 31 ) );
			}
		}

		$css->set_media_state( 'desktop' );
		if ( isset( $attributes['inheritMaxWidth'] ) && true === $attributes['inheritMaxWidth'] && ! empty( $attributes['align'] ) && 'full' === $attributes['align'] && 2 === $columns && 'row' !== $layout && ( ( isset( $attributes['breakoutLeft'] ) && true === $attributes['breakoutLeft'] ) || ( isset( $attributes['breakoutRight'] ) && true === $attributes['breakoutRight'] ) ) ) {
			global $content_width;
			if ( isset( $content_width ) ) {
				if ( class_exists( 'Kadence\Theme' ) ) {
					$inherit_content_width = 'var( --global-content-width, ' . absint( $content_width ) . 'px )';
				} else {
					$inherit_content_width = absint( $content_width ) . 'px';
				}
			} else {
				$inherit_content_width = 'var(--wp--style--global--content-size)';
			}
			$padding_left = '0px';
			$padding_right = '0px';
			if ( class_exists( 'Kadence\Theme' ) ) {
				$padding_left = 'var(--global-content-edge-padding)';
				$padding_right = 'var(--global-content-edge-padding)';
			}
			if ( isset( $attributes['padding'][1] ) && $css->is_number( $attributes['padding'][1] ) ) {
				$padding_right = $attributes['padding'][1] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' );
			} else if ( isset( $attributes['padding'][1] ) && $css->is_variable_value( $attributes['padding'][1] ) ) {
				$padding_right = $css->get_variable_value( $attributes['padding'][1] );
			}
			if ( isset( $attributes['padding'][3] ) && $css->is_number( $attributes['padding'][3] ) ) {
				$padding_left = $attributes['padding'][3] . ( ! empty( $attributes['paddingUnit'] ) ? $attributes['paddingUnit'] : 'px' );
			} else if ( isset( $attributes['padding'][3] ) && $css->is_variable_value( $attributes['padding'][3] ) ) {
				$padding_left = $css->get_variable_value( $attributes['padding'][3] );
			}
			$css->set_selector( $base_selector );
			$css->add_property( '--breakout-negative-margin-right', 'calc( ( ( ( var(--global-vw, 100vw) - ( ' . $inherit_content_width . ' - ( ' . $padding_right . '*2 ) ) ) / 2 ) *-1) + -1px)' );
			$css->add_property( '--breakout-negative-margin-left', 'calc( ( ( ( var(--global-vw, 100vw) - ( ' . $inherit_content_width . ' - ( ' . $padding_left . '*2 ) ) ) / 2 ) *-1) + -1px)' );
			if ( apply_filters( 'kadence_blocks_css_output_media_queries', true ) ) {
				$css->set_media_state( 'desktopOnly' );
			}
			if ( ( isset( $attributes['breakoutLeft'] ) && true === $attributes['breakoutLeft'] ) ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(1 of *:not(style))' );
				$css->add_property( 'margin-inline-start', 'calc( ' . $padding_left . ' *-1 )' );
			}
			if ( ( isset( $attributes['breakoutRight'] ) && true === $attributes['breakoutRight'] ) ) {
				$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(2 of *:not(style))' );
				$css->add_property( 'margin-inline-end', 'calc( ' . $padding_right . ' *-1 )' );
			}
			$css->set_media_state( 'desktop' );
			if ( apply_filters( 'kadence_blocks_css_output_media_queries', true ) ) {
				if ( isset( $content_width ) && ! empty( $content_width ) ) {
					$css->start_media_query( '(min-width:' . absint( $content_width ) . 'px)' );
					if ( ( isset( $attributes['breakoutLeft'] ) && true === $attributes['breakoutLeft'] ) ) {
						$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(1 of *:not(style)):not(.specificity)' );
						$css->add_property( 'margin-inline-start', 'var(--breakout-negative-margin-left)' );
					}
					if ( ( isset( $attributes['breakoutRight'] ) && true === $attributes['breakoutRight'] ) ) {
						$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(2 of *:not(style)):not(.specificity)' );
						$css->add_property( 'margin-inline-end', 'var(--breakout-negative-margin-right)' );
					}
					$css->stop_media_query();
				} else {
					$css->set_media_state( 'desktopOnly' );
					if ( ( isset( $attributes['breakoutLeft'] ) && true === $attributes['breakoutLeft'] ) ) {
						$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(1 of *:not(style))' );
						$css->add_property( 'margin-inline-start', 'var(--breakout-negative-margin-left)' );
					}
					if ( ( isset( $attributes['breakoutRight'] ) && true === $attributes['breakoutRight'] ) ) {
						$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(2 of *:not(style))' );
						$css->add_property( 'margin-inline-end', 'var(--breakout-negative-margin-right)' );
					}
					$css->set_media_state( 'desktop' );
				}
			} else {
				if ( ( isset( $attributes['breakoutLeft'] ) && true === $attributes['breakoutLeft'] ) ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(1 of *:not(style)):not(.specificity)' );
					$css->add_property( 'margin-inline-start', 'var(--breakout-negative-margin-left, calc( ' . $padding_left . ' *-1 ) )' );
				}
				if ( ( isset( $attributes['breakoutRight'] ) && true === $attributes['breakoutRight'] ) ) {
					$css->set_selector( $inner_selector . ' > .wp-block-kadence-column:nth-child(2 of *:not(style)):not(.specificity)' );
					$css->add_property( 'margin-inline-end', 'var(--breakout-negative-margin-right, calc( ' . $padding_right . ' *-1 ))' );
				}
			}
			$css->set_media_state( 'tabletOnly' );
			if ( ( isset( $attributes['breakoutLeft'] ) && true === $attributes['breakoutLeft'] ) ) {
				$css->set_selector( $inner_selector . ':not(.kt-tab-layout-row) > .wp-block-kadence-column:nth-child(1 of *:not(style))' );
				$css->add_property( 'margin-inline-start', 'calc( ' . $padding_left . ' *-1 )' );
			}
			if ( ( isset( $attributes['breakoutRight'] ) && true === $attributes['breakoutRight'] ) ) {
				$css->set_selector( $inner_selector . ':not(.kt-tab-layout-row) > .wp-block-kadence-column:nth-child(2 of *:not(style))' );
				$css->add_property( 'margin-inline-end', 'calc( ' . $padding_right . ' *-1 )' );
			}
			$css->set_media_state( 'desktop' );
		}

		// Border radius.
		$css->set_selector( $base_selector );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array( 'unit_key' => 'borderRadiusUnit' ) );
		$has_radius = false;
		if ( isset( $attributes['borderRadius'][0] ) && $css->is_number( $attributes['borderRadius'][0] ) && 0 !== $attributes['borderRadius'][0] ) {
			$has_radius = true;
		}
		if ( isset( $attributes['borderRadius'][1] ) && $css->is_number( $attributes['borderRadius'][1] ) && 0 !== $attributes['borderRadius'][1] ) {
			$has_radius = true;
		}
		if ( isset( $attributes['borderRadius'][2] ) && $css->is_number( $attributes['borderRadius'][2] ) && 0 !== $attributes['borderRadius'][2] ) {
			$has_radius = true;
		}
		if ( isset( $attributes['borderRadius'][3] ) && $css->is_number( $attributes['borderRadius'][3] ) && 0 !== $attributes['borderRadius'][3] ) {
			$has_radius = true;
		}
		if ( $has_radius ) {
			if ( ! isset( $attributes['borderRadiusOverflow'] ) || ( isset( $attributes['borderRadiusOverflow'] ) && false !== $attributes['borderRadiusOverflow'] ) ) {
				$css->add_property( 'overflow', 'clip' );
			}
			$css->add_property( 'isolation', 'isolate' );
			$css->set_selector( $base_selector . ' > .kt-row-layout-overlay' );
			$css->render_measure_output( $attributes, 'borderRadius', 'border-radius', array( 'unit_key' => 'borderRadiusUnit' ) );
		}
		$css->set_selector( $base_selector );
		// Box shadow
		if ( isset( $attributes['displayBoxShadow'] ) && true == $attributes['displayBoxShadow'] ) {
			if ( isset( $attributes['boxShadow'] ) && is_array( $attributes['boxShadow'] ) && isset( $attributes['boxShadow'][0] ) && is_array( $attributes['boxShadow'][0] ) ) {
				$css->add_property( 'box-shadow', ( isset( $attributes['boxShadow'][0]['inset'] ) && true === $attributes['boxShadow'][0]['inset'] ? 'inset ' : '' ) . ( isset( $attributes['boxShadow'][0]['hOffset'] ) && is_numeric( $attributes['boxShadow'][0]['hOffset'] ) ? $attributes['boxShadow'][0]['hOffset'] : '0' ) . 'px ' . ( isset( $attributes['boxShadow'][0]['vOffset'] ) && is_numeric( $attributes['boxShadow'][0]['vOffset'] ) ? $attributes['boxShadow'][0]['vOffset'] : '0' ) . 'px ' . ( isset( $attributes['boxShadow'][0]['blur'] ) && is_numeric( $attributes['boxShadow'][0]['blur'] ) ? $attributes['boxShadow'][0]['blur'] : '14' ) . 'px ' . ( isset( $attributes['boxShadow'][0]['spread'] ) && is_numeric( $attributes['boxShadow'][0]['spread'] ) ? $attributes['boxShadow'][0]['spread'] : '0' ) . 'px ' . $css->render_color( ( isset( $attributes['boxShadow'][0]['color'] ) && ! empty( $attributes['boxShadow'][0]['color'] ) ? $attributes['boxShadow'][0]['color'] : '#000000' ), ( isset( $attributes['boxShadow'][0]['opacity'] ) && is_numeric( $attributes['boxShadow'][0]['opacity'] ) ? $attributes['boxShadow'][0]['opacity'] : 0.2 ) ) );
			} else {
				$css->add_property( 'box-shadow', 'rgba(0, 0, 0, 0.2) 0px 0px 14px 0px' );
			}
		}
		// Border, have to check for old styles first.
		if ( ! empty( $attributes['border'] ) || ! empty( $attributes['tabletBorder'] ) || ! empty( $attributes['mobileBorder'] ) || $css->is_number( $attributes['borderWidth'][0] ) || $css->is_number( $attributes['borderWidth'][1] ) || $css->is_number( $attributes['borderWidth'][2] ) || $css->is_number( $attributes['borderWidth'][3] ) || $css->is_number( $attributes['tabletBorderWidth'][0] ) || $css->is_number( $attributes['tabletBorderWidth'][1] ) || $css->is_number( $attributes['tabletBorderWidth'][2] ) || $css->is_number( $attributes['tabletBorderWidth'][3] ) || $css->is_number( $attributes['mobileBorderWidth'][0] ) || $css->is_number( $attributes['mobileBorderWidth'][1] ) || $css->is_number( $attributes['mobileBorderWidth'][2] ) || $css->is_number( $attributes['mobileBorderWidth'][3] ) ) {
			if ( ! empty( $attributes['border'] ) ) {
				$css->add_property( 'border-color', $css->render_color( $attributes['border'] ) );
			}
			$css->render_measure_output( $attributes, 'borderWidth', 'border-width' );
			if ( ! empty( $attributes['tabletBorder'] ) ) {
				$css->set_media_state( 'tablet' );
				$css->add_property( 'border-color', $css->render_color( $attributes['tabletBorder'] ) );
				$css->set_media_state( 'desktop' );
			}
			if ( ! empty( $attributes['mobileBorder'] ) ) {
				$css->set_media_state( 'mobile' );
				$css->add_property( 'border-color', $css->render_color( $attributes['mobileBorder'] ) );
				$css->set_media_state( 'desktop' );
			}
		} else {
			$css->render_border_styles( $attributes, 'borderStyle' );
		}
		// Background.
		$background_type = ! empty( $attributes['backgroundSettingTab'] ) ? $attributes['backgroundSettingTab'] : 'normal';
		$css->set_selector( $base_selector );
		switch ( $background_type ) {
			case 'normal':
				if ( ! empty( $attributes['bgColor'] ) ) {
					if ( class_exists( 'Kadence\Theme' ) ) {
						if ( empty( $attributes['bgColorClass'] ) ) {
							$css->render_color_output( $attributes, 'bgColor', 'background-color' );
						}
					} else if ( strpos( $attributes['bgColor'], 'palette' ) === 0 ) {
						$css->render_color_output( $attributes, 'bgColor', 'background-color' );
					} else if ( empty( $attributes['bgColorClass'] ) ) {
						$css->render_color_output( $attributes, 'bgColor', 'background-color' );
					}
				}
				if ( ! empty( $attributes['bgImg'] ) ) {
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
					if ( 'fixed' === $bg_attach && ! apply_filters( 'kadence_blocks_attachment_fixed_on_mobile', false ) ) {
						$css->set_media_state( 'tabletPro' );
						$css->add_property( 'background-attachment', 'scroll' );
						$css->set_media_state( 'desktop' );
					}
				}
				break;
			case 'gradient':
				if ( ! empty( $attributes['gradient'] ) ) {
					$css->add_property( 'background-image', $css->render_gradient( $attributes['gradient'] ) );
				}
				break;
		}
		// Tablet Background.
		$tablet_background = ( isset( $attributes['tabletBackground'][0] ) && is_array( $attributes['tabletBackground'][0] ) ? $attributes['tabletBackground'][0] : array() );
		if ( isset( $tablet_background['enable'] ) && $tablet_background['enable'] ) {
			$css->set_media_state( 'tabletPro' );
			$css->set_selector( $margin_selector );
			$tablet_background_type = ! empty( $tablet_background['type'] ) ? $tablet_background['type'] : 'normal';
			switch ( $tablet_background_type ) {
				case 'normal':
					if ( ! empty( $tablet_background['bgImg'] ) ) {
						$bg_selector = 'background-color';
					} else {
						$bg_selector = 'background';
					}
					if ( ! empty( $tablet_background['bgColor'] ) ) {
						$css->render_color_output( $tablet_background, 'bgColor', $bg_selector );
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
						$is_important = ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && isset( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ? '!important' : '' );
						if ( isset( $attributes['backgroundInline'] ) && true === $attributes['backgroundInline'] ) {
							$is_important = '!important';
						}
						$css->add_property( 'background-image', sprintf( "url('%s')", $tablet_background['bgImg'] ) . $is_important );
						$css->add_property( 'background-size', ( ! empty( $tablet_background['bgImgSize'] ) ? $tablet_background['bgImgSize'] : 'cover' ) );
						$css->add_property( 'background-position', ( ! empty( $tablet_background['bgImgPosition'] ) ? $tablet_background['bgImgPosition'] : 'center center' ) );
						$css->add_property( 'background-attachment', $bg_attach );
						$css->add_property( 'background-repeat', ( ! empty( $tablet_background['bgImgRepeat'] ) ? $tablet_background['bgImgRepeat'] : 'no-repeat' ) );
					} else if ( isset( $tablet_background['forceOverDesk'] ) && $tablet_background['forceOverDesk'] ) {
						// Force No image for tablet.
						//$css->set_media_state( 'tabletOnly' );
						$css->set_selector( $base_selector );
						$css->add_property( 'background-image', 'none !important' );
						$css->set_selector( $base_selector  . ' [id*="jarallax-container-"]' );
						$css->add_property( 'display', 'none !important' );
						//$css->set_media_state( 'tablet' );
					}
					if ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] && ! empty( $tablet_background['bgImg'] ) && ! empty( $tablet_background['bgImgAttachment'] ) && 'parallax' !== $tablet_background['bgImgAttachment'] ) {
						$css->set_selector( $base_selector . ' [id*="jarallax-container-"]' );
						$css->add_property( 'display', 'none !important' );
					}
					break;
				case 'gradient':
					if ( ! empty( $tablet_background['gradient'] ) ) {
						$is_important = ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ? '!important' : '' );
						if ( isset( $attributes['backgroundInline'] ) && true === $attributes['backgroundInline'] ) {
							$is_important = '!important';
						}
						$css->add_property( 'background-image', $css->render_gradient( $tablet_background['gradient'] ) . $is_important );
						if ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ) {
							$css->set_selector( $base_selector . ' [id*="jarallax-container-"]' );
							$css->add_property( 'display', 'none !important' );
						}
					}
					break;
			}
			if ( 'normal' !== $background_type ) {
				$css->set_selector( $base_selector . ' .kb-blocks-bg-video-container,' . $base_selector . ' .kb-blocks-bg-slider' );
				$css->add_property( 'display', 'none' );
			}
			$css->set_media_state( 'desktop' );
		}
		// Mobile Background.
		$mobile_background = ( isset( $attributes['mobileBackground'][0] ) && is_array( $attributes['mobileBackground'][0] ) ? $attributes['mobileBackground'][0] : array() );
		if ( isset( $mobile_background['enable'] ) && $mobile_background['enable'] ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( $margin_selector );
			$mobile_background_type = ! empty( $mobile_background['type'] ) ? $mobile_background['type'] : 'normal';
			switch ( $mobile_background_type ) {
				case 'normal':
					if ( ! empty( $mobile_background['bgImg'] ) ) {
						$bg_selector = 'background-color';
					} else {
						$bg_selector = 'background';
					}
					if ( ! empty( $mobile_background['bgColor'] ) ) {
						$css->render_color_output( $mobile_background, 'bgColor', $bg_selector );
					}
					if ( ! empty( $mobile_background['bgImg'] ) ) {
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
						if ( 'normal' === $mobile_background_type && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' === $tablet_background['bgImgAttachment'] && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ) {
							$is_important = '!important';
						}
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
						$css->set_selector( $base_selector . ' [id*="jarallax-container-"]' );
						$css->add_property( 'display', 'none !important' );
					}
					if ( ( ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ) || ( 'normal' === $mobile_background_type && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' === $tablet_background['bgImgAttachment'] ) ) && isset( $mobile_background['bgImg'] ) && ! empty( $mobile_background['bgImg'] ) && isset( $mobile_background['bgImgAttachment'] ) && 'parallax' !== $mobile_background['bgImgAttachment'] ) {
						$css->set_selector( $base_selector . ' [id*="jarallax-container-"]' );
						$css->add_property( 'display', 'none !important' );
					}
					break;
				case 'gradient':
					if ( ! empty( $mobile_background['gradient'] ) ) {
						$is_important = ( ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ? '!important' : '' );
						if ( 'normal' === $mobile_background_type && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' === $tablet_background['bgImgAttachment'] ) {
							$is_important = '!important';
						}
						if ( isset( $attributes['backgroundInline'] ) && true === $attributes['backgroundInline'] ) {
							$is_important = '!important';
						}
						$css->add_property( 'background-image', $css->render_gradient( $mobile_background['gradient'] ) . $is_important );
						if ( ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ) || ( 'normal' === $mobile_background_type && ! empty( $tablet_background['bgImg'] ) && isset( $tablet_background['bgImgAttachment'] ) && 'parallax' === $tablet_background['bgImgAttachment'] ) ) {
							$css->set_selector( $base_selector . ' [id*="jarallax-container-"]' );
							$css->add_property( 'display', 'none !important' );
						}
					}
					break;
			}
			if ( 'normal' !== $background_type ) {
				$css->set_selector( $base_selector . ' .kb-blocks-bg-video-container,' . $base_selector . ' .kb-blocks-bg-slider' );
				$css->add_property( 'display', 'none' );
			}
			$css->set_media_state( 'desktop' );
		}
		// Overlay.
		if ( ! empty( $attributes['overlay'] ) || ! empty( $attributes['overlayBgImg'] ) || ! empty( $attributes['overlaySecond'] ) || ! empty( $attributes['overlayGradient'] ) ) {
			$css->set_selector( $base_selector . ' > .kt-row-layout-overlay' );
			$css->render_opacity_from_100( $attributes, 'overlayOpacity' );
			$overlay_type = ! empty( $attributes['currentOverlayTab'] ) ? $attributes['currentOverlayTab'] : 'normal';
			switch ( $overlay_type ) {
				case 'normal':
					if ( isset( $attributes['overlay'] ) ) {
						$css->add_property( 'background-color', $css->render_color( $attributes['overlay'], ( isset( $attributes['overlayFirstOpacity'] ) && is_numeric( $attributes['overlayFirstOpacity'] ) ? $attributes['overlayFirstOpacity'] : 1 ) ) );
					}
					if ( ! empty( $attributes['overlayBgImg'] ) ) {
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
						if ( 'fixed' === $overbg_attach && ! apply_filters( 'kadence_blocks_attachment_fixed_on_mobile', false ) ) {
							$css->set_media_state( 'tabletPro' );
							$css->add_property( 'background-attachment', 'scroll' );
							$css->set_media_state( 'desktop' );
						}
					}
					break;
				case 'gradient':
					if ( ! empty( $attributes['overlayGradient'] ) ) {
						$css->add_property( 'background', $css->render_gradient( $attributes['overlayGradient'] ) );
					}

					break;
				case 'grad':
					// Old Gradient Support.
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
					break;
			}
			if ( ! empty( $attributes['overlayBlendMode'] ) && 'none' !== $attributes['overlayBlendMode'] ) {
				$css->add_property( 'mix-blend-mode', $attributes['overlayBlendMode'] );
			}
		}
		$tablet_overlay    = ( isset( $attributes['tabletOverlay'] ) && is_array( $attributes['tabletOverlay'] ) && isset( $attributes['tabletOverlay'][0] ) && is_array( $attributes['tabletOverlay'][0] ) ? $attributes['tabletOverlay'][0] : array() );
		if ( isset( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) {
			$css->set_media_state( 'tablet' );
			$css->set_selector( $base_selector . ' > .kt-row-layout-overlay' );
			$css->render_opacity_from_100( $tablet_overlay, 'overlayOpacity' );
			$overlay_type = ! empty( $tablet_overlay['currentOverlayTab'] ) ? $tablet_overlay['currentOverlayTab'] : 'normal';
			switch ( $overlay_type ) {
				case 'normal':
					if ( ! empty( $tablet_overlay['overlayBgImg'] ) ) {
						$bg_selector = 'background-color';
					} else {
						$bg_selector = 'background';
					}
					if ( ! empty( $tablet_overlay['overlay'] ) ) {
						$css->render_color_output( $tablet_overlay, 'overlay', $bg_selector );
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
					break;
				case 'gradient':
					$css->add_property( 'background', $css->render_gradient( $tablet_overlay['gradient'] ) );
					break;
				case 'grad':
					// Old Gradient Support.
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
					break;
			}
			if ( ! empty( $tablet_overlay['overlayBlendMode'] ) ) {
				$css->add_property( 'mix-blend-mode', $tablet_overlay['overlayBlendMode'] );
			}
			$css->set_media_state( 'desktop' );
		}
		$mobile_overlay    = ( isset( $attributes['mobileOverlay'] ) && is_array( $attributes['mobileOverlay'] ) && isset( $attributes['mobileOverlay'][0] ) && is_array( $attributes['mobileOverlay'][0] ) ? $attributes['mobileOverlay'][0] : array() );
		if ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( $base_selector . ' > .kt-row-layout-overlay' );
			$css->render_opacity_from_100( $mobile_overlay, 'overlayOpacity' );
			$overlay_type = ! empty( $mobile_overlay['currentOverlayTab'] ) ? $mobile_overlay['currentOverlayTab'] : 'normal';
			switch ( $overlay_type ) {
				case 'normal':
					if ( ! empty( $mobile_overlay['overlayBgImg'] ) ) {
						$bg_selector = 'background-color';
					} else {
						$bg_selector = 'background';
					}
					if ( ! empty( $mobile_overlay['overlay'] ) ) {
						$css->render_color_output( $mobile_overlay, 'overlay', $bg_selector );
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
					break;
				case 'gradient':
					$css->add_property( 'background', $css->render_gradient( $mobile_overlay['gradient'] ) );
					break;
				case 'grad':
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
					break;
			}
			if ( ! empty( $mobile_overlay['overlayBlendMode'] ) ) {
				$css->add_property( 'mix-blend-mode', $mobile_overlay['overlayBlendMode'] );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( $css->is_number( $attributes['zIndex'] ) ) {
			if ( ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ) {
				$css->set_selector( $base_selector );
			} else {
				$css->set_selector( $inner_selector );
			}
			$css->add_property( 'z-index', $attributes['zIndex'] );
			$css->add_property( 'position', 'relative' );
		}
		// Text Color.
		if ( ! empty( $attributes['textColor'] ) ) {
			$css->set_selector( $base_selector . ' ,' . $base_selector . ' h1,' . $base_selector . ' h2,' . $base_selector . ' h3,' . $base_selector . ' h4,' . $base_selector . ' h5,' . $base_selector . ' h6' );
			$css->render_color_output( $attributes, 'textColor', 'color' );
		}
		if ( ! empty( $attributes['linkColor'] ) ) {
			$css->set_selector( $base_selector . ' a' );
			$css->render_color_output( $attributes, 'linkColor', 'color' );
		}
		if ( ! empty( $attributes['linkHoverColor'] ) ) {
			$css->set_selector( $base_selector . ' a:hover' );
			$css->render_color_output( $attributes, 'linkHoverColor', 'color' );
		}
		// Bottom Sep.
		if ( isset( $attributes['bottomSep'] ) && 'none' != $attributes['bottomSep'] ) {
			$bottomSepUnit   = ! empty( $attributes['bottomSepHeightUnit'] ) ? $attributes['bottomSepHeightUnit'] : 'px';
			$bottomSepHeight = ! empty( $attributes['bottomSepHeight'] ) ? $attributes['bottomSepHeight'] : '100';

			$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep' );
			$css->add_property( 'height', $bottomSepHeight . $bottomSepUnit );

				if ( isset( $attributes['bottomSepWidth'] ) ) {
					$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attributes['bottomSepWidth'] . '%' );
				}
			if ( ! empty( $attributes['bottomSepColor'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep svg' );
				$css->add_property( 'fill', $css->render_color( $attributes['bottomSepColor'] ) . '!important' );
			}
			if ( isset( $attributes['bottomSepHeightTab'] ) || isset( $attributes['bottomSepWidthTab'] ) ) {
				$css->set_media_state( 'tablet' );
				if ( isset( $attributes['bottomSepHeightTab'] ) ) {
					$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attributes['bottomSepHeightTab'] . $bottomSepUnit );
				}
				if ( isset( $attributes['bottomSepWidthTab'] ) ) {
					$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attributes['bottomSepWidthTab'] . '%' );
				}
				$css->set_media_state( 'desktop' );
			}
			if ( isset( $attributes['bottomSepHeightMobile'] ) || isset( $attributes['bottomSepWidthMobile'] ) ) {
				$css->set_media_state( 'mobile' );
				if ( isset( $attributes['bottomSepHeightMobile'] ) ) {
					$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep' );
					$css->add_property( 'height', $attributes['bottomSepHeightMobile'] . $bottomSepUnit );
				}
				if ( isset( $attributes['bottomSepWidthMobile'] ) ) {
					$css->set_selector( $base_selector . ' .kt-row-layout-bottom-sep svg' );
					$css->add_property( 'width', $attributes['bottomSepWidthMobile'] . '%' );
				}
				$css->set_media_state( 'desktop' );
			}
		}
		// Top Sep.
		if ( isset( $attributes['topSep'] ) && 'none' != $attributes['topSep'] ) {
			$topSepUnit = !empty( $attributes['topSepHeightUnit']) ? $attributes['topSepHeightUnit'] : 'px';
			$topSepHeight = !empty ($attributes['topSepHeight']) ? $attributes['topSepHeight'] : '100';
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep' );
				$css->add_property( 'height', $topSepHeight . $topSepUnit );
			if ( $css->is_number( $attributes['topSepWidth'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep svg' );
				$css->add_property( 'width', $attributes['topSepWidth'] . '%' );
			}
			if ( ! empty( $attributes['topSepColor'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep svg'  );
				$css->add_property( 'fill', $css->render_color( $attributes['topSepColor'] ) . '!important' );
			}
			$css->set_media_state( 'tablet' );
			if ( $css->is_number( $attributes['topSepHeightTab'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep' );
				$css->add_property( 'height', $attributes['topSepHeightTab'] . $topSepUnit );
			}
			if ( $css->is_number( $attributes['topSepWidthTab'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep svg' );
				$css->add_property( 'width', $attributes['topSepWidthTab'] . '%' );
			}
			$css->set_media_state( 'mobile' );
			if ( $css->is_number( $attributes['topSepHeightMobile'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep' );
				$css->add_property( 'height', $attributes['topSepHeightMobile'] . $topSepUnit );
			}
			if ( $css->is_number( $attributes['topSepWidthMobile'] ) ) {
				$css->set_selector( $base_selector . ' .kt-row-layout-top-sep svg' );
				$css->add_property( 'width', $attributes['topSepWidthMobile'] . '%' );
			}
			$css->set_media_state( 'desktop' );
		}
		if ( isset( $attributes['vsdesk'] ) && $attributes['vsdesk'] ) {
			$css->set_media_state( 'desktopOnly' );
			$css->set_selector( $base_selector );
			$css->add_property( 'display', 'none !important' );
		}
		if ( isset( $attributes['vstablet'] ) && $attributes['vstablet'] ) {
			$css->set_media_state( 'tabletOnly' );
			$css->set_selector( $base_selector );
			$css->add_property( 'display', 'none !important' );
		}
		if ( isset( $attributes['vsmobile'] ) && $attributes['vsmobile'] ) {
			$css->set_media_state( 'mobile' );
			$css->set_selector( $base_selector );
			$css->add_property( 'display', 'none !important' );
		}
		$css->set_media_state( 'desktop' );

		// Background Slider Pause Button Styles.
		if ( isset( $attributes['backgroundSettingTab'] ) && 'slider' === $attributes['backgroundSettingTab'] ) {
			$arrow_style = ! empty( $attributes['backgroundSliderSettings'][0]['arrowStyle'] ) ? $attributes['backgroundSliderSettings'][0]['arrowStyle'] : 'none';
			$show_pause_button = isset( $attributes['backgroundSliderSettings'][0]['showPauseButton'] ) ? $attributes['backgroundSliderSettings'][0]['showPauseButton'] : false;

			if ( $show_pause_button ) {
				$css->set_selector( $base_selector . ' .kb-blocks-bg-slider .kb-gallery-pause-button' );

				// Set styles based on arrow style.
				switch ( $arrow_style ) {
					case 'blackonlight':
						$css->add_property( 'background-color', 'rgba(255, 255, 255, 0.8)' );
						$css->add_property( 'color', '#000' );
						$css->add_property( 'border', 'none' );
						break;
					case 'outlineblack':
						$css->add_property( 'background-color', 'transparent' );
						$css->add_property( 'color', '#000' );
						$css->add_property( 'border', '2px solid #000' );
						break;
					case 'outlinewhite':
						$css->add_property( 'background-color', 'transparent' );
						$css->add_property( 'color', '#fff' );
						$css->add_property( 'border', '2px solid #fff' );
						break;
					case 'none':
					default:
						$css->add_property( 'background-color', 'rgba(0, 0, 0, 0.8)' );
						$css->add_property( 'color', '#fff' );
						$css->add_property( 'border', 'none' );
						break;
				}
			}
		}

		if ( isset( $attributes['kadenceBlockCSS'] ) && ! empty( $attributes['kadenceBlockCSS'] ) ) {
			$css->add_css_string( str_replace( 'selector', $base_selector, $attributes['kadenceBlockCSS'] ) );
		}
		return $css->css_output();
	}
	/**
	 * Render svg divider.
	 *
	 * @param string $divider the divider slug.
	 * @param string $location - top or bottom.
	 */
	public function get_divider_render( $divider, $location ) {
		$paths = array();
		$paths['ct'] = '<path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" />';
		$paths['cti'] = '<path d="M500,2l500,98l-1000,0l500,-98Z" />';
		$paths['ctd'] = '<path d="M1000,0l-500,98l-500,-98l0,100l1000,0l0,-100Z" style="opacity: 0.4" /><path d="M1000,20l-500,78l-500,-78l0,80l1000,0l0,-80Z" />';
		$paths['ctdi'] = '<path d="M500,2l500,78l0,20l-1000,0l0,-20l500,-78Z" style="opacity: 0.4" /><path d="M500,2l500,98l-1000,0l500,-98Z" />';
		$paths['sltl'] = '<path d="M1000,0l-1000,100l1000,0l0,-100Z" />';
		$paths['sltli'] = '<path d="M0,100l1000,-100l-1000,0l0,100Z" />';
		$paths['sltr'] = '<path d="M0,0l1000,100l-1000,0l0,-100Z" />';
		$paths['sltri'] = '<path d="M1000,100l-1000,-100l1000,0l0,100Z" />';
		$paths['crv'] = '<path d="M1000,100c0,0 -270.987,-98 -500,-98c-229.013,0 -500,98 -500,98l1000,0Z" />';
		$paths['crvi'] = '<path d="M1000,0c0,0 -270.987,98 -500,98c-229.013,0 -500,-98 -500,-98l0,100l1000,0l0,-100Z" />';
		$paths['crvl'] = '<path d="M1000,100c0,0 -420.987,-98 -650,-98c-229.013,0 -350,98 -350,98l1000,0Z" />';
		$paths['crvli'] = '<path d="M1000,0c0,0 -420.987,98 -650,98c-229.013,0 -350,-98 -350,-98l0,100l1000,0l0,-100Z" />';
		$paths['crvr'] = '<path d="M1000,100c0,0 -120.987,-98 -350,-98c-229.013,0 -650,98 -650,98l1000,0Z" />';
		$paths['crvri'] = '<path d="M1000,0c0,0 -120.987,98 -350,98c-229.013,0 -650,-98 -650,-98l0,100l1000,0l0,-100Z" />';
		$paths['wave'] = '<path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" />';
		$paths['wavei'] = '<path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" />';
		$paths['waves'] = '<path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,78 -500,78c-154.895,0 -250,-30 -250,-30l0,50l1000,0l0,-60Z" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,73 -500,73c-154.895,0 -250,-45 -250,-45l0,70l1000,0l0,-60Z" style="opacity: 0.4" /><path d="M1000,40c0,0 -120.077,-38.076 -250,-38c-129.923,0.076 -345.105,68 -500,68c-154.895,0 -250,-65 -250,-65l0,95l1000,0l0,-60Z" style="opacity: 0.4" />';
		$paths['wavesi'] = '<path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,78 500,78c154.895,0 250,-30 250,-30l0,50l-1000,0l0,-60Z" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,73 500,73c154.895,0 250,-45 250,-45l0,70l-1000,0l0,-60Z" style="opacity: 0.4" /><path d="M0,40c0,0 120.077,-38.076 250,-38c129.923,0.076 345.105,68 500,68c154.895,0 250,-65 250,-65l0,95l-1000,0l0,-60Z" style="opacity: 0.4" />';
		$paths['mtns'] = '<path d="M1000,50l-182.69,-45.286l-292.031,61.197l-190.875,-41.075l-143.748,28.794l-190.656,-23.63l0,70l1000,0l0,-50Z" style="opacity: 0.4" /><path d="M1000,57l-152.781,-22.589l-214.383,19.81l-159.318,-21.471l-177.44,25.875l-192.722,5.627l-103.356,-27.275l0,63.023l1000,0l0,-43Z" />';
		$paths['littri'] = '<path d="M500,2l25,98l-50,0l25,-98Z" />';
		$paths['littrii'] = '<path d="M1000,100l-1000,0l0,-100l475,0l25,98l25,-98l475,0l0,100Z" />';
		$paths['threelevels'] = '<path style="opacity: 0.33" d="M0 95L1000 0v100H0v-5z"></path><path style="opacity: 0.66" d="M0 95l1000-67.944V100H0v-5z"></path><path d="M0 95l1000-40.887V100H0v-5z"></path>';
		$paths['threelevelsi'] = '<path style="opacity: 0.33" d="M1000 95L0 0v100h1000v-5z"></path><path style="opacity: 0.66" d="M1000 95L0 27.056V100h1000v-5z"></path><path d="M1000 95L0 54.113V100h1000v-5z"></path>';
		$paths = apply_filters( 'kadence_blocks_row_divider_paths', $paths, $location );
		$output = '';
		if ( isset( $paths[ $divider ] ) ) {
			$output .= '<div class="kt-row-layout-' . esc_attr( $location ) . '-sep kt-row-sep-type-' . esc_attr( $divider ) . '">';
			$output .= '<svg viewBox="0 0 1000 100" preserveAspectRatio="none">';
			$output .= $paths[ $divider ];
			$output .= '</svg>';
			$output .= '</div>';
		}
		return $output;
	}
	/**
	 * Checks to see if we should render an overlay.
	 *
	 * @param array $attributes for the block.
	 */
	public function has_overlay( $attributes ) {
		$has_overlay = false;
		$overlay_type = ( ! empty( $attributes['currentOverlayTab'] ) ? $attributes['currentOverlayTab'] : 'normal' );
		switch ( $overlay_type ) {
			case 'normal':
				$has_overlay = ( ! empty( $attributes['overlay'] ) || ! empty( $attributes['overlayBgImg'] ) ? true : false );
				break;
			case 'gradient':
				$has_overlay = ( ! empty( $attributes['overlayGradient'] ) ? true : false );
				break;
			case 'grad':
				$has_overlay = ( ! empty( $attributes['overlay'] ) ? true : false );
				break;
		}
		if ( ! $has_overlay ) {
			$tablet_overlay    = ( isset( $attributes['tabletOverlay'] ) && is_array( $attributes['tabletOverlay'] ) && isset( $attributes['tabletOverlay'][0] ) && is_array( $attributes['tabletOverlay'][0] ) ? $attributes['tabletOverlay'][0] : array() );
			if ( isset( $tablet_overlay['enable'] ) && $tablet_overlay['enable'] ) {
				$tablet_overlay_type = ( ! empty( $tablet_overlay['currentOverlayTab'] ) ? $tablet_overlay['currentOverlayTab'] : 'normal' );
				switch ( $tablet_overlay_type ) {
					case 'normal':
						$has_overlay = ( ! empty( $tablet_overlay['overlay'] ) || ! empty( $tablet_overlay['overlayBgImg'] ) ? true : false );
						break;
					case 'gradient':
						$has_overlay = ( ! empty( $tablet_overlay['gradient'] ) ? true : false );
						break;
					case 'grad':
						$has_overlay = ( ! empty( $tablet_overlay['overlay'] ) ? true : false );
						break;
				}
			}
		}
		if ( ! $has_overlay ) {
			$mobile_overlay    = ( isset( $attributes['mobileOverlay'] ) && is_array( $attributes['mobileOverlay'] ) && isset( $attributes['mobileOverlay'][0] ) && is_array( $attributes['mobileOverlay'][0] ) ? $attributes['mobileOverlay'][0] : array() );
			if ( isset( $mobile_overlay['enable'] ) && $mobile_overlay['enable'] ) {
				$mobile_overlay_type = ( ! empty( $mobile_overlay['currentOverlayTab'] ) ? $mobile_overlay['currentOverlayTab'] : 'normal' );
				switch ( $mobile_overlay_type ) {
					case 'normal':
						$has_overlay = ( ! empty( $mobile_overlay['overlay'] ) || ! empty( $mobile_overlay['overlayBgImg'] ) ? true : false );
						break;
					case 'gradient':
						$has_overlay = ( ! empty( $mobile_overlay['gradient'] ) ? true : false );
						break;
					case 'grad':
						$has_overlay = ( ! empty( $mobile_overlay['overlay'] ) ? true : false );
						break;
				}
			}
		}
		return $has_overlay;
	}
	/**
	 * Generates the color output.
	 *
	 * @param string $color any color attribute.
	 * @return string
	 */
	public function output_color( $color, $opacity = null ) {
		if ( empty( $color ) ) {
			return false;
		}
		if ( ! is_array( $color ) && strpos( $color, 'palette' ) === 0 ) {
			switch ( $color ) {
				case 'palette2':
					$fallback = '#2B6CB0';
					break;
				case 'palette3':
					$fallback = '#1A202C';
					break;
				case 'palette4':
					$fallback = '#2D3748';
					break;
				case 'palette5':
					$fallback = '#4A5568';
					break;
				case 'palette6':
					$fallback = '#718096';
					break;
				case 'palette7':
					$fallback = '#EDF2F7';
					break;
				case 'palette8':
					$fallback = '#F7FAFC';
					break;
				case 'palette9':
					$fallback = '#ffffff';
					break;
				default:
					$fallback = '#3182CE';
					break;
			}
			$color = 'var(--global-' . $color . ', ' . $fallback . ')';
		} elseif ( isset( $opacity ) && is_numeric( $opacity ) && 1 !== (int) $opacity ) {
			$color = kadence_blocks_hex2rgba( $color, $opacity );
		}
		return $color;
	}
	/**
	 * Renders out the background slider.
	 *
	 * @param array $attributes for the block.
	 */
	public function get_slider_render( $attributes ) {
		if ( empty( $attributes['backgroundSliderCount'] ) || empty( $attributes['backgroundSlider'] ) ) {
			return '';
		}
		$output = '';
		$dot_style = ! empty( $attributes['backgroundSliderSettings'][0]['dotStyle'] ) ? $attributes['backgroundSliderSettings'][0]['dotStyle'] : 'dark';
		$arrow_style = ! empty( $attributes['backgroundSliderSettings'][0]['arrowStyle'] ) ? $attributes['backgroundSliderSettings'][0]['arrowStyle'] : 'none';
		$tran_speed = ! empty( $attributes['backgroundSliderSettings'][0]['tranSpeed'] ) ? $attributes['backgroundSliderSettings'][0]['tranSpeed'] : 400;
		$speed = ! empty( $attributes['backgroundSliderSettings'][0]['speed'] ) ? $attributes['backgroundSliderSettings'][0]['speed'] : 7000;
		$fade = isset( $attributes['backgroundSliderSettings'][0]['fade'] ) ? $attributes['backgroundSliderSettings'][0]['fade'] : true;
		$auto = isset( $attributes['backgroundSliderSettings'][0]['autoPlay'] ) ? $attributes['backgroundSliderSettings'][0]['autoPlay'] : true;
		$show_pause_button = isset( $attributes['backgroundSliderSettings'][0]['showPauseButton'] ) ? $attributes['backgroundSliderSettings'][0]['showPauseButton'] : false;
		$output .= '<div class="kt-blocks-carousel kb-blocks-bg-slider kt-carousel-container-dotstyle-' . esc_attr( $dot_style ) . '">';
		// Output proper Splide.js structure: splide > splide__track > splide__list > splide__slide
		$output .= '<div class="kt-blocks-carousel-init splide kb-blocks-bg-slider-init kt-carousel-arrowstyle-' . esc_attr( $arrow_style ) . ' kt-carousel-dotstyle-' . esc_attr( $dot_style ) . '" data-slider-anim-speed="' . esc_attr( $tran_speed ) . '" data-slider-type="slider" data-slider-scroll="1" data-slider-arrows="' . ( 'none' === $arrow_style ? 'false' : 'true' ) . '" data-slider-fade="' . ( $fade ? 'true' : 'false' ) . '" data-slider-dots="' . ( 'none' === $dot_style ? 'false' : 'true' ) . '" data-slider-hover-pause="false" data-slider-auto="' . ( $auto ? 'true' : 'false' ) . '" data-slider-speed="' . esc_attr( $speed ) . '" data-show-pause-button="' . esc_attr( $show_pause_button ? 'true' : 'false' ) . '">';
		$output .= '<div class="splide__track">';
		$output .= '<ul class="splide__list">';
		$item = 1;
		foreach ( $attributes['backgroundSlider'] as $key => $slide ) {
			$style_args = array();
			if ( ! empty( $slide['bgColor'] ) ) {
				$style_args['background-color'] = $this->output_color( $slide['bgColor'] );
			}
			if ( ! empty( $slide['bgImg'] ) ) {
				$style_args['background-image'] = 'url(' . $slide['bgImg'] . ')';
				if ( ! empty( $attributes['bgImgSize'] ) ) {
					$style_args['background-size'] = $attributes['bgImgSize'];
				}
				if ( ! empty( $attributes['bgImgPosition'] ) ) {
					$style_args['background-position'] = $attributes['bgImgPosition'];
				}
				if ( ! empty( $attributes['bgImgRepeat'] ) ) {
					$style_args['background-repeat'] = $attributes['bgImgRepeat'];
				}
			}

			$style_output = [];

			foreach ( $style_args as $sub_key => $value ) {
				$style_output[] = $sub_key . ':' . esc_attr( $value ) . ';';
			}

			$attrs = [
				'class' => 'kb-bg-slide kb-bg-slide-' . $key,
				'style' => implode( ' ', $style_output ),
			];

			/**
			 * DO NOT REMOVE: The optimizer uses this.
			 *
			 * @param array<string, mixed> $attrs The HTML attributes.
			 * @param array<string, mixed> $attributes The row block attributes.
			 */
			$attrs = apply_filters( 'kadence_blocks_row_slider_attrs', $attrs, $attributes );

			$output .= sprintf(
				'<li class="splide__slide kb-bg-slide-contain"><div %s></div></li>',
				$this->build_escaped_html_attributes( $attrs )
			);

			if ( $attributes['backgroundSliderCount'] == $item ) {
				break;
			}
			$item ++;
		}
		$output .= '</ul>';
		$output .= '</div>';
		if ( $auto && $show_pause_button ) {
			$output .= '<button class="kb-gallery-pause-button splide__toggle" type="button" aria-label="' . esc_attr( __( 'Toggle autoplay', 'kadence-blocks' ) ) . '">';
			$output .= '<span class="kb-gallery-pause-icon splide__toggle__pause"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="6" y="4" width="4" height="16" fill="currentColor"/><rect x="14" y="4" width="4" height="16" fill="currentColor"/></svg></span>';
			$output .= '<span class="kb-gallery-play-icon splide__toggle__play"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 5v14l11-7z" fill="currentColor"/></svg></span>';
			$output .= '</button>';
		}
		$output .= '</div>';
		$output .= '</div>';
		return $output;
	}
	/**
	 * Renders out the background video.
	 *
	 * @param array $attributes for the block.
	 */
	public function prevent_preload_when_hidden( $attributes ) {
		if ( ( ( ! empty( $attributes['tabletBackground'][0]['enable'] ) && true == $attributes['tabletBackground'][0]['enable'] ) || ( ! empty( $attributes['mobileBackground'][0]['enable'] ) && true == $attributes['mobileBackground'][0]['enable'] ) ) && apply_filters( 'kadence_blocks_rowlayout_prevent_preload_for_mobile', true ) ) {
			return true;
		}
		return false;
	}
	/**
	 * Renders out the background video.
	 *
	 * @param array $attributes for the block.
	 */
	public function get_video_render( $attributes ) {
		if ( empty( $attributes['backgroundVideo'][0]['local'] ) && empty( $attributes['backgroundVideo'][0]['vimeo'] ) && empty( $attributes['backgroundVideo'][0]['youTube'] ) ) {
			return '';
		}
		$output = '';
		$video_attributes = $attributes['backgroundVideo'][0];
		$background_video_type = isset( $attributes['backgroundVideoType'] ) && $attributes['backgroundVideoType'] ? $attributes['backgroundVideoType'] : 'local';
		$prevent_preload = $this->prevent_preload_when_hidden( $attributes );

		if ( 'local' == $background_video_type ) {
			$video_args = array(
				'class' => 'kb-blocks-bg-video',
				'id' => 'bg-row-video-' . esc_attr( $attributes['uniqueID'] ),
				'playsinline' => '',
				'muted' => ( isset( $video_attributes['mute'] ) && false === $video_attributes['mute'] ? 'false' : '' ),
				'loop' => ( isset( $video_attributes['loop'] ) && false === $video_attributes['loop'] ? 'false' : '' ),
				'src' => $video_attributes['local'],
			);
		} else {
			$src_base = 'youtube' == $background_video_type ? 'https://www.youtube.com/embed/' : 'https://player.vimeo.com/video/';
			$video_id = 'youtube' == $background_video_type ? $video_attributes['youTube'] : $video_attributes['vimeo'];

			// Vimeo and youtube share a bunch of params, that's convienent.
			$src_query_string = '?' . http_build_query(
				array(
					'autoplay' => 1,
					'controls' => 0,
					'mute' => ( isset( $video_attributes['mute'] ) && false === $video_attributes['mute'] ? 0 : 1 ),
					'muted' => ( isset( $video_attributes['mute'] ) && false === $video_attributes['mute'] ? 0 : 1 ),
					'loop' => ( isset( $video_attributes['loop'] ) && false === $video_attributes['loop'] ? 0 : 1 ),
					'playlist' => $video_id,
					'disablekb' => 1,
					'modestbranding' => 1,
					'playsinline' => 1,
					'rel' => 0,
					'background' => 1,
				)
			);

			$video_args = array(
				'class' => 'kb-blocks-bg-video ' . $background_video_type,
				'id' => 'bg-row-video-' . esc_attr( $attributes['uniqueID'] ),
				'src' => $src_base . $video_id . $src_query_string,
			);
		}
		if ( ! empty( $attributes['bgImg'] ) && 'local' === $background_video_type ) {
			$video_args['poster'] = $attributes['bgImg'];
		}
		if ( $prevent_preload ) {
			$video_args['preload'] = 'none';
		}
		if ( ! $prevent_preload ) {
			$video_args['autoplay'] = '';
		}
		if ( isset( $video_args['loop'] ) && $video_args['loop'] == 'false' ) {
			unset( $video_args['loop'] );
		}
		if ( isset( $video_args['muted'] ) && $video_args['muted'] == 'false' ) {
			unset( $video_args['muted'] );
		}

		/**
		 * DO NOT REMOVE: The optimizer uses this.
		 *
		 * @param array<string, mixed> $video_args The HTML attributes.
		 * @param array<string, mixed> $attributes The row block attributes.
		 */
		$video_args = apply_filters( 'kadence_blocks_row_video_attrs', $video_args, $attributes );

		$video_html_attributes = array();
		foreach ( $video_args as $key => $value ) {
			if ( empty( $value ) ) {
				$video_html_attributes[] = $key;
			} else {
				$video_html_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
		}
		$ratio = '16-9';
		if ( ! empty( $video_attributes['ratio'] ) ) {
			$ratio = str_replace( '/', '-', $video_attributes['ratio'] );
		}

		$btns_output = '';
		$show_play_pause = ( isset( $video_attributes['btns'] ) && $video_attributes['btns'] );
		$show_audio_is_default = ( ! isset( $video_attributes['btnsMute'] ) );
		$is_unmuted = ( isset( $video_attributes['mute'] ) && false === $video_attributes['mute'] );
		$show_audio = ( $show_audio_is_default && $show_play_pause && $is_unmuted ) || ( isset( $video_attributes['btnsMute'] ) && $video_attributes['btnsMute'] );
		if ( $show_play_pause || $show_audio ) {
			$btns_output .= '<div class="kb-background-video-buttons-wrapper kb-background-video-buttons-html5">';
			if ( $show_play_pause ) {
				$btns_output .= '<button class="kb-background-video-play kb-toggle-video-btn" aria-label="' . __( 'Play', 'kadence-blocks' ) . '" aria-hidden="true" style="display: none;"><svg viewBox="0 0 448 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg></button>';
				$btns_output .= '<button class="kb-background-video-pause kb-toggle-video-btn" aria-label="' . __( 'Pause', 'kadence-blocks' ) . '" aria-hidden="false"><svg viewBox="0 0 448 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path></svg></button>';
			}
			if ( $show_audio ) {
				$hidden_attrs = 'aria-hidden="true" style="display: none;"';
				$unhidden_attrs = 'aria-hidden="false"';
				$btns_output .= '<button class="kb-background-video-unmute kb-toggle-video-btn" aria-label="' . __( 'Unmute', 'kadence-blocks' ) . '" ' . ( $is_unmuted ? $hidden_attrs : $unhidden_attrs ) . '><svg viewBox="0 0 256 512" height="16" width="16" fill="currentColor" xmlns="https://www.w3.org/2000/svg"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971z"></path></svg></button>';
				$btns_output .= '<button class="kb-background-video-mute kb-toggle-video-btn" aria-label="' . __( 'Mute', 'kadence-blocks' ) . '" ' . ( $is_unmuted ? $unhidden_attrs : $hidden_attrs ) . '><svg viewBox="0 0 576 512" height="16" width="16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M256 88.017v335.964c0 21.438-25.943 31.998-40.971 16.971L126.059 352H24c-13.255 0-24-10.745-24-24V184c0-13.255 10.745-24 24-24h102.059l88.971-88.954c15.01-15.01 40.97-4.49 40.97 16.971zm182.056-77.876C422.982.92 403.283 5.668 394.061 20.745c-9.221 15.077-4.473 34.774 10.604 43.995C468.967 104.063 512 174.983 512 256c0 73.431-36.077 142.292-96.507 184.206-14.522 10.072-18.129 30.01-8.057 44.532 10.076 14.528 30.016 18.126 44.531 8.057C529.633 438.927 576 350.406 576 256c0-103.244-54.579-194.877-137.944-245.859zM480 256c0-68.547-36.15-129.777-91.957-163.901-15.076-9.22-34.774-4.471-43.994 10.607-9.22 15.078-4.471 34.774 10.607 43.994C393.067 170.188 416 211.048 416 256c0 41.964-20.62 81.319-55.158 105.276-14.521 10.073-18.128 30.01-8.056 44.532 6.216 8.96 16.185 13.765 26.322 13.765a31.862 31.862 0 0 0 18.21-5.709C449.091 377.953 480 318.938 480 256zm-96 0c0-33.717-17.186-64.35-45.972-81.944-15.079-9.214-34.775-4.463-43.992 10.616s-4.464 34.775 10.615 43.992C314.263 234.538 320 244.757 320 256a32.056 32.056 0 0 1-13.802 26.332c-14.524 10.069-18.136 30.006-8.067 44.53 10.07 14.525 30.008 18.136 44.53 8.067C368.546 316.983 384 287.478 384 256z"></path></svg></button>';
			}
			$btns_output .= '</div>';
		}

		// if ( 'local' == $attributes['backgroundVideoType'] ) {
		if ( 'local' == $background_video_type ) {
			$output = sprintf( '<div class="kb-blocks-bg-video-container"><video %1$s></video>%2$s</div>', implode( ' ', $video_html_attributes ), $btns_output );
		} else {
			$output = sprintf( '<div class="kb-blocks-bg-video-container embedded"><div class="kb-bg-video-iframe kb-bg-video-ratio-%1$s"><iframe frameborder="0" %2$s></iframe></div></div>', $ratio, implode( ' ', $video_html_attributes ) );
		}
		return $output;
	}

	/**
	 * Do we have any custom column width for the amount of rows in this block.
	 *
	 * @param mixed $columns The number of columns.
	 * @param mixed $column1 The first column width.
	 * @param mixed $column2 The second column width.
	 * @param mixed $column3 The third column width.
	 * @param mixed $column4 The fourth column width.
	 * @param mixed $column5 The fifth column width.
	 * @param mixed $column6 The sixth column width.
	 */
	public function has_custom_widths( $columns, $column1, $column2, $column3, $column4, $column5, $column6 ) {
		switch( $columns ) {
			case 1:
				return !empty($column1);
			case 2:
				return !empty($column1) || !empty($column2);
			case 3:
				return !empty($column1) || !empty($column2) || !empty($column3);
			case 4:
				return !empty($column1) || !empty($column2) || !empty($column3) || !empty($column4);
			case 5:
				return !empty($column1) || !empty($column2) || !empty($column3) || !empty($column4) || !empty($column5);
			case 6:
				return !empty($column1) || !empty($column2) || !empty($column3) || !empty($column4) || !empty($column5) || !empty($column6);
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
		if ( ! empty( $attributes['kbVersion'] ) && $attributes['kbVersion'] > 1 ) {
			$html_tag = $this->get_html_tag( $attributes, 'htmlTag', 'div', $this->allowed_html_tags );
			$outer_classes = array( 'kb-row-layout-wrap', 'kb-row-layout-id' . $unique_id );
			$outer_classes[] = ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : 'alignnone';
			if ( isset( $attributes['vsdesk'] ) && $attributes['vsdesk'] ) {
				$outer_classes[] = 'kb-v-lg-hidden';
			}
			if ( isset( $attributes['vstablet'] ) && $attributes['vstablet'] ) {
				$outer_classes[] = 'kb-v-md-hidden';
			}
			if ( isset( $attributes['vsmobile'] ) && $attributes['vsmobile'] ) {
				$outer_classes[] = 'kb-v-sm-hidden';
			}
			if ( ! empty( $attributes['bgColorClass'] ) ) {
				$outer_classes[] = 'has-' . $attributes['bgColorClass'] . '-background-color';
			}
			if ( ! empty( $attributes['bgImg'] ) || ! empty( $attributes['bgColor'] ) || ! empty( $attributes['gradient'] ) || ! empty( $attributes['overlay'] ) || ! empty( $attributes['overlayBgImg'] ) || ! empty( $attributes['overlayGradient'] ) ) {
				$outer_classes[] = 'kt-row-has-bg';
			}
			if ( ! empty( $attributes['bgImg'] ) && ! empty( $attributes['bgImgAttachment'] ) && 'parallax' === $attributes['bgImgAttachment'] ) {
				$outer_classes[] = 'kt-jarallax';
			}
			$inner_classes = array( 'kt-row-column-wrap' );
			$inner_classes[] = ! empty( $attributes['columns'] ) ? 'kt-has-' . $attributes['columns'] . '-columns' : 'kt-has-2-columns';
			$inner_classes[] = ! empty( $attributes['colLayout'] ) ? 'kt-row-layout-' . $attributes['colLayout'] : 'kt-row-layout-equal';
			$inner_classes[] = ! empty( $attributes['tabletLayout'] ) ? 'kt-tab-layout-' . $attributes['tabletLayout'] : 'kt-tab-layout-inherit';
			$inner_classes[] = ! empty( $attributes['mobileLayout'] ) ? 'kt-mobile-layout-' . $attributes['mobileLayout'] : 'kt-mobile-layout-inherit';

			if ( ! empty( $attributes['verticalAlignment'] ) ) {
				$inner_classes[] = 'kt-row-valign-' . $attributes['verticalAlignment'];
			}
			if ( isset( $attributes['columnsInnerHeight'] ) && $attributes['columnsInnerHeight'] ) {
				$inner_classes[] = 'kt-inner-column-height-full';
			}
			if ( isset( $attributes['inheritMaxWidth'] ) && $attributes['inheritMaxWidth'] ) {
				$inner_classes[] = 'kb-theme-content-width';
			}
			$wrapper_args = array(
				'class' => implode( ' ', $outer_classes ),
			);
			$background_type = ! empty( $attributes['backgroundSettingTab'] ) ? $attributes['backgroundSettingTab'] : 'normal';
			if ( 'normal' === $background_type && ! empty( $attributes['bgImg'] ) && isset( $attributes['backgroundInline'] ) && $attributes['backgroundInline'] ) {
				$wrapper_args['style'] = 'background-image: url(' . $attributes['bgImg'] . ');';
			}
			if ( ! empty( $attributes['anchor'] ) ) {
				$wrapper_args['id'] = $attributes['anchor'];
			}
			$inner_args = array(
				'class' => implode( ' ', $inner_classes ),
			);
			$inner_wrap_attributes = array();
			foreach ( $inner_args as $key => $value ) {
				$inner_wrap_attributes[] = $key . '="' . esc_attr( $value ) . '"';
			}
			$extra_content = '';
			if ( 'slider' === $background_type ) {
				$extra_content .= $this->get_slider_render( $attributes );
			}
			if ( 'video' === $background_type ) {
				$extra_content .= $this->get_video_render( $attributes );
			}
			if ( $this->has_overlay( $attributes ) ) {
				$overlay_type = ( ! empty( $attributes['currentOverlayTab'] ) ? $attributes['currentOverlayTab'] : 'normal' );
				$extra_content .= '<div class="kt-row-layout-overlay kt-row-overlay-' . esc_attr( $overlay_type ) . '' . ( 'normal' === $overlay_type && ! empty( $attributes['overlayBgImg'] ) && ! empty( $attributes['overlayBgImgAttachment'] ) && 'parallax' === $attributes['overlayBgImgAttachment'] ? ' kt-jarallax' : '' ) . '"></div>';
			}
			if ( ! empty( $attributes['topSep'] ) && 'none' !== $attributes['topSep'] ) {
				$extra_content .= $this->get_divider_render( $attributes['topSep'], 'top' );
			}
			if ( ! empty( $attributes['bottomSep'] ) && 'none' !== $attributes['bottomSep'] ) {
				$extra_content .= $this->get_divider_render( $attributes['bottomSep'], 'bottom' );
			}
			if ( ! empty( $attributes['bgImg'] ) && !empty($attributes['bgImgAttachment']) && $attributes['bgImgAttachment'] == 'parallax' ) {
				if ( ! empty( $attributes['bgImgPosition'] ) ) {
					$wrapper_args['data-img-position'] = $attributes['bgImgPosition'];
				}
				if ( ! empty( $attributes['bgImgSize'] ) ) {
					$wrapper_args['data-img-size'] = $attributes['bgImgSize'];
					if ( $attributes['bgImgSize'] !== 'cover' && ! empty( $attributes['bgImgRepeat'] ) ) {
						$wrapper_args['data-img-repeat'] = $attributes['bgImgRepeat'];
					}
				}
			}

			/**
			 * DO NOT REMOVE: The Optimizer uses this.
			 *
			 * @param array<string, mixed> $wrapper_args The wrapper div HTML attributes.
			 * @param array<string, mixed> $attributes The current block attributes.
			 */
			$wrapper_args       = apply_filters( 'kadence_blocks_row_wrapper_args', $wrapper_args, $attributes );
			$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
			$inner_wrapper_attributes = implode( ' ', $inner_wrap_attributes );
			$content = sprintf( '<%1$s %2$s>%3$s<div %4$s>%5$s</div></%1$s>', $html_tag, $wrapper_attributes, $extra_content, $inner_wrapper_attributes, $content );
			// Disable preloading if no video on mobile or tablet.
			if ( ! empty( $attributes['backgroundSettingTab'] ) && 'video' === $attributes['backgroundSettingTab'] && ! empty( $attributes['backgroundVideo'][0]['local'] ) && $this->prevent_preload_when_hidden( $attributes ) ) {
				if ( ! empty( $attributes['tabletBackground'][0]['enable'] ) && 'true' == $attributes['tabletBackground'][0]['enable'] ) {
					$size = 1024;
				} else {
					$size = 767;
				}
				$content = $content . '<script>if( window.innerWidth > ' . $size . ' ){document.getElementById("bg-row-video-' . esc_attr( $attributes['uniqueID'] ) . '").removeAttribute("preload");document.getElementById("bg-row-video-' . esc_attr( $attributes['uniqueID'] ) . '").setAttribute("autoplay","");}</script>';
			}
		} else {
			if ( ! empty( $attributes['backgroundSettingTab'] ) && 'video' === $attributes['backgroundSettingTab'] && ! empty( $attributes['backgroundVideo'][0]['local'] ) && ( ( ! empty( $attributes['tabletBackground'][0]['enable'] ) && true == $attributes['tabletBackground'][0]['enable'] ) || ( ! empty( $attributes['mobileBackground'][0]['enable'] ) && true == $attributes['mobileBackground'][0]['enable'] ) ) && apply_filters( 'kadence_blocks_rowlayout_prevent_preload_for_mobile', true ) ) {
				if ( ! empty( $attributes['tabletBackground'][0]['enable'] ) && 'true' == $attributes['tabletBackground'][0]['enable'] ) {
					$size = 1024;
				} else {
					$size = 767;
				}
				if ( ! empty( $attributes['bgImg'] ) ) {
					$content = str_replace( 'kt-layout-id' . esc_attr( $attributes['uniqueID'] ). '"><div class="kb-blocks-bg-video-container"><video class="kb-blocks-bg-video" poster="' . $attributes['bgImg'] . '" playsinline autoplay', 'kt-layout-id' . esc_attr( $attributes['uniqueID'] ) . '"><div class="kb-blocks-bg-video-container"><video id="bg-row-video-' . esc_attr( $attributes['uniqueID'] ) . '" class="kb-blocks-bg-video" poster=" ' . $attributes['bgImg'] . '" playsinline preload="none"', $content );
				} else {
					$content = str_replace( 'kt-layout-id' . esc_attr( $attributes['uniqueID'] ) . '"><div class="kb-blocks-bg-video-container"><video class="kb-blocks-bg-video" playsinline autoplay', 'kt-layout-id' . esc_attr( $attributes['uniqueID'] ) . '"><div class="kb-blocks-bg-video-container"><video id="bg-row-video-' . esc_attr( $attributes['uniqueID'] ) . '" class="kb-blocks-bg-video" playsinline preload="none"', $content );
				}
				$content = $content . '<script>if( window.innerWidth > ' . $size . ' ){document.getElementById("bg-row-video-' . esc_attr( $attributes['uniqueID'] ) . '").removeAttribute("preload");document.getElementById("bg-row-video-' . esc_attr( $attributes['uniqueID'] ). '").setAttribute("autoplay","");}</script>';
			}
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
		wp_register_style( 'kadence-kb-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kadence-splide.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_style( 'kadence-blocks-splide', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-blocks-splide.min.css', array( 'kadence-kb-splide' ), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kad-splide', KADENCE_BLOCKS_URL . 'includes/assets/js/splide.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-splide-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-splide-init.min.js', array( 'kad-splide' ), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-video-bg', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-init-html-bg-video.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_localize_script(
			'kadence-blocks-splide-init',
			'kb_splide',
			array(
				'i18n' => array(
					'prev' => __( 'Previous slide', 'kadence-blocks' ),
					'next' => __( 'Next slide', 'kadence-blocks' ),
					'first' => __( 'Go to first slide', 'kadence-blocks' ),
					'last' => __( 'Go to last slide', 'kadence-blocks' ),
					'slideX' => __( 'Go to slide %s', 'kadence-blocks' ),
					'pageX' => __( 'Go to page %s', 'kadence-blocks' ),
					'play' => __( 'Start autoplay', 'kadence-blocks' ),
					'pause' => __( 'Pause autoplay', 'kadence-blocks' ),
					'carousel' => __( 'carousel', 'kadence-blocks' ),
					'slide' => __( 'slide', 'kadence-blocks' ),
					'select' => __( 'Select a slide to show', 'kadence-blocks' ),
					'slideLabel' => __( '%s of %s', 'kadence-blocks' ),
				),
			)
		);
	}
}

Kadence_Blocks_Rowlayout_Block::get_instance();
