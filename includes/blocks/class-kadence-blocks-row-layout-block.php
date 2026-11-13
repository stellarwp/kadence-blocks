<?php
/**
 * Class to Build the RowLayout Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore alignnone arrowstyle blackonlight colorsecond colum crvi crvl crvli crvr crvri ctdi disablekb dotstyle generatepress littri littrii locsecond modestbranding mtns outlineblack outlinewhite overbg sltl sltli sltr sltri threelevels threelevelsi wavei wavesi .

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Legacy_Group_Attributes;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * Class to Build the RowLayout Block.
 *
 * @category class
 */
class Kadence_Blocks_Rowlayout_Block extends Kadence_Blocks_Abstract_Block implements Supports_Site_Styles, Legacy_Group_Attributes {
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
	 * Return a grid template columns string for custom column widths.
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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css object for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 *
	 * @since 3.9.0 Starts the breakout media query at the Global Styles content size in the Kadence theme's Full Site Editing mode, when it is a plain length.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-rowlayout-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Rowlayout_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
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

			// Vimeo and youtube share a bunch of params, that's convenient.
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
			$output = sprintf( '<div class="kb-blocks-bg-video-container embedded"><div class="kb-bg-video-iframe kb-bg-video-ratio-%1$s"><iframe frameborder="0" %2$s></iframe></div></div>', esc_attr( $ratio ), implode( ' ', $video_html_attributes ) );
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

	/**
	 * The editor paints every Row Layout value itself, inline or in its own
	 * style tag, the column gutters feed the custom column widths, and the
	 * background color adds a class, so every site value goes through the
	 * overlay.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_overlay_attributes(): array {
		return array_merge( array_merge( ...$this->site_styles_attribute_groups() ), [ 'bgColor', 'textColor', 'linkColor', 'linkHoverColor' ] );
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attributes_map(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_supports(): array {
		return [];
	}

	/**
	 * @inheritDoc
	 *
	 * @since 3.9.0
	 */
	public function site_styles_selectors(): array {
		return [];
	}

	/**
	 * Each spacing, gutter and max width takes its unit and its tablet and
	 * mobile values with it, the radius takes its overflow, and the shadow its
	 * toggle.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_attribute_groups(): array {
		return [
			[ 'padding', 'tabletPadding', 'mobilePadding', 'paddingUnit' ],
			[ 'margin', 'tabletMargin', 'mobileMargin', 'marginUnit' ],
			[ 'columnGutter', 'tabletGutter', 'mobileGutter', 'customGutter', 'gutterType' ],
			[ 'collapseGutter', 'tabletRowGutter', 'mobileRowGutter', 'customRowGutter', 'rowGutterType' ],
			[ 'maxWidth', 'responsiveMaxWidth', 'maxWidthUnit' ],
			[ 'borderStyle', 'tabletBorderStyle', 'mobileBorderStyle' ],
			[ 'borderRadius', 'tabletBorderRadius', 'mobileBorderRadius', 'borderRadiusUnit', 'borderRadiusOverflow' ],
			[ 'displayBoxShadow', 'boxShadow' ],
		];
	}

	/**
	 * Rows saved before the padding, margin and border arrays carry separate
	 * side numbers and the old border colors and widths, which build_css()
	 * renders instead of the padding, margin and border.
	 *
	 * @since 3.9.0
	 */
	public function site_styles_legacy_group_attributes(): array {
		return [
			'padding'     => [ 'topPadding', 'rightPadding', 'bottomPadding', 'leftPadding', 'topPaddingM', 'rightPaddingM', 'bottomPaddingM', 'leftPaddingM' ],
			'margin'      => [ 'topMargin', 'bottomMargin', 'topMarginT', 'bottomMarginT', 'topMarginM', 'bottomMarginM' ],
			'borderStyle' => [ 'border', 'tabletBorder', 'mobileBorder', 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ],
		];
	}

	/**
	 * The Global Styles content size, when it is a plain length a media query can use.
	 *
	 * Media queries can't use CSS variables, so values with `var()`, `calc()` or `clamp()`,
	 * such as the Kadence theme's default, give an empty string. So do `em` values: in a
	 * media query `em` uses the browser's default font size, while the content width uses
	 * the font size the content inherits.
	 *
	 * @since 3.9.0
	 *
	 * @return string The length, for example `650px` or `42rem`, or an empty string.
	 */
	private function get_global_styles_content_size_length(): string {
		$content_size = wp_get_global_settings( [ 'layout', 'contentSize' ] );

		if ( is_string( $content_size ) && preg_match( '/^\d+(\.\d+)?(px|rem)$/', trim( $content_size ) ) ) {
			return trim( $content_size );
		}

		return '';
	}
}

Kadence_Blocks_Rowlayout_Block::get_instance();
