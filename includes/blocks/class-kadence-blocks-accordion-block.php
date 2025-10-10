<?php
/**
 * Class to Build the Accordion Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Accordion Block.
 *
 * @category class
 */
class Kadence_Blocks_Accordion_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'accordion';

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
	 * @param array $attributes the blocks attributes.
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap' );
		$css->render_gap( $attributes, 'columnGap', 'column-gap', 'columnGapUnit' );
		if ( isset( $attributes['titleStyles'][0]['marginTop'] ) ) {
			$css->render_range( $attributes['titleStyles'][0], 'marginTop', 'row-gap' );
		}
		if ( ! empty( $attributes['columnLayout'][0] ) && 'row' !== $attributes['columnLayout'][0] ) {
			switch ( $attributes['columnLayout'][0] ) {
				case 'two-column':
					$css->add_property( 'display', 'grid' );
					$css->add_property( 'grid-template-columns', 'repeat(2, minmax(0, 1fr))' );
					break;
				case 'three-column':
					$css->add_property( 'display', 'grid' );
					$css->add_property( 'grid-template-columns', 'repeat(3, minmax(0, 1fr))' );
					break;
			}
		}
		$css->set_media_state( 'tablet' );
		if ( ! empty( $attributes['columnLayout'][1] ) ) {
			switch ( $attributes['columnLayout'][1] ) {
				case 'row':
					$css->add_property( 'display', 'block' ); // removes row-gap from one column tablet layouts
					if ( isset( $attributes['titleStyles'][0]['marginTop'] ) ) { // adds margin top to panes for one column layouts
						$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap .kt-accordion-pane:not(:first-child)' );
						$css->render_range( $attributes['titleStyles'][0], 'marginTop', 'margin-top' );
						$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap' );
					}
					break;
				case 'two-column':
					$css->add_property( 'display', 'grid' );
					$css->add_property( 'grid-template-columns', 'repeat(2, minmax(0, 1fr))' );
					break;
				case 'three-column':
					$css->add_property( 'display', 'grid' );
					$css->add_property( 'grid-template-columns', 'repeat(3, minmax(0, 1fr))' );
					break;
			}
		}
		$css->set_media_state( 'mobile' );
		if ( ! empty( $attributes['columnLayout'][2] ) ) {
			switch ( $attributes['columnLayout'][2] ) {
				case 'row':
					$css->add_property( 'display', 'block' ); // removes row gap from one column mobile layouts
					if ( isset( $attributes['titleStyles'][0]['marginTop'] ) ) { // adds margin top to panes for one column layouts
						$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap .kt-accordion-pane:not(:first-child)' );
						$css->render_range( $attributes['titleStyles'][0], 'marginTop', 'margin-top' );
						$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-inner-wrap' );
					}
					break;
				case 'two-column':
					$css->add_property( 'display', 'grid' );
					$css->add_property( 'grid-template-columns', 'repeat(2, minmax(0, 1fr))' );
					break;
				case 'three-column':
					$css->add_property( 'display', 'grid' );
					$css->add_property( 'grid-template-columns', 'repeat(3, minmax(0, 1fr))' );
					break;
			}
		}
		$css->set_media_state( 'desktop' );

		$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner' );
		// Support legacy non-responsive broder widths
		if ( ! empty( $attributes['contentBorder'] ) && $attributes['contentBorder'] !== array( '', '', '', '' ) ) {
			$css->render_measure_range( $attributes, 'contentBorder', 'border-width' );
			$css->render_color_output( $attributes, 'contentBorderColor', 'border-color' );
		} else {
			$css->render_border_styles( $attributes, 'contentBorderStyle' );
		}
		$css->render_measure_output( $attributes, 'contentBorderRadius', 'border-radius', array( 'unit_key' => 'contentBorderRadiusUnit' ) );
		$css->render_color_output( $attributes, 'contentBgColor', 'background' );
		$content_padding_args = array(
			'desktop_key' => 'contentPadding',
			'tablet_key'  => 'contentTabletPadding',
			'mobile_key'  => 'contentMobilePadding',
		);
		$css->render_measure_output( $attributes, 'contentPadding', 'padding', $content_padding_args );
		// Title Styles.
		if ( isset( $attributes['titleStyles'] ) && is_array( $attributes['titleStyles'] ) && is_array( $attributes['titleStyles'][0] ) ) {
			$title_styles = $attributes['titleStyles'][0];
			$css->set_selector( '.kt-accordion-id' . $unique_id . ' > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header' );

			// Support legacy non-responsive broder widths
			if ( ! empty( $title_styles['borderWidth'] ) && $title_styles['borderWidth'] !== array( '', '', '', '' ) ) {
				$css->render_border_color( $title_styles, 'border' );
				$css->render_measure_range( $title_styles, 'borderWidth', 'border-width' );
			} else {
				$css->render_border_styles( $attributes, 'titleBorder', true );
			}
			// Support legacy non-responsive broder radius
			if ( ! empty( $title_styles['borderRadius'] ) && $title_styles['borderRadius'] !== array( '', '', '', '' ) ) {
				$css->render_border_radius( $title_styles, 'borderRadius', 'px' );
			} else {
				$css->render_measure_output( $attributes, 'titleBorderRadius', 'border-radius', array( 'unit_key' => 'titleBorderRadiusUnit' ) );
			}
			$css->render_color_output( $title_styles, 'background', 'background' );
			$css->render_typography( $title_styles, '' );
			$padding_args = array(
				'tablet_key'  => 'paddingTablet',
				'mobile_key'  => 'paddingMobile',
			);
			$css->render_measure_output( $title_styles, 'padding', 'padding', $padding_args );

			$css->set_selector( '.kt-accordion-id' . $unique_id . ' .wp-block-kadence-pane .kt-accordion-header-wrap .kt-blocks-accordion-header' );

			$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap .kt-blocks-accordion-icon-trigger:before' );
			if ( ! empty( $attributes['iconColor']['standard'] ) ) {
				$css->render_color_output( $attributes['iconColor'], 'standard', 'background' );
			} elseif ( ! empty( $title_styles['color'] ) ) {
				$css->render_color_output( $title_styles, 'color', 'background' );
			}
			// Text Colors.
			if ( isset( $attributes['textColor'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner, .kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner h1, .kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner h2, .kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner h3, .kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner h4, .kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner h5, .kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner h6' );
				$css->add_property( 'color', $css->render_color( $attributes['textColor'] ) );
			}
			if ( isset( $attributes['linkColor'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner a' );
				$css->add_property( 'color', $css->render_color( $attributes['linkColor'] ) );
			}
			if ( isset( $attributes['linkHoverColor'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-panel-inner a:hover' );
				$css->add_property( 'color', $css->render_color( $attributes['linkHoverColor'] ) );
			}

			$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger' );
			if ( ! empty( $attributes['iconColor']['standard'] ) ) {
				$css->render_color_output( $attributes['iconColor'], 'standard', 'background' );
			} elseif ( ! empty( $title_styles['color'] ) ) {
				$css->render_color_output( $title_styles, 'color', 'background' );
			}
			// Hover Styles.
			$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:before' );
			$css->render_color_output( $title_styles, 'background', 'background' );
			$css->set_selector( 
				'.kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header:hover, 
				body:not(.hide-focus-outline) .kt-accordion-id' . $unique_id . ' .kt-blocks-accordion-header:focus-visible' 
			);
			$css->render_color_output( $title_styles, 'colorHover', 'color' );
			$css->render_color_output( $title_styles, 'backgroundHover', 'background' );

			// Support legacy non-responsive broder widths
			if ( ! empty( $title_styles['borderWidth'] ) && $title_styles['borderWidth'] !== array( '', '', '', '' ) ) {
				$css->render_border_color( $title_styles, 'borderHover' );
			} else {
				$css->render_border_styles( $attributes, 'titleBorderHover', true );
			}

			if ( ! empty( $attributes['iconColor']['hover'] ) || ! empty( $title_styles['colorHover'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, body:not(.hide-focus-outline) .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion--visible .kt-blocks-accordion-icon-trigger:after, body:not(.hide-focus-outline) .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:before' );
				if ( ! empty( $attributes['iconColor']['hover'] ) ) {
					$css->render_color_output( $attributes['iconColor'], 'hover', 'background' );
				} elseif ( ! empty( $title_styles['colorHover'] ) ) {
					$css->render_color_output( $title_styles, 'colorHover', 'background' );
				}
				$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger, body:not(.hide-focus-outline) .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger' );
				if ( ! empty( $attributes['iconColor']['hover'] ) ) {
					$css->render_color_output( $attributes['iconColor'], 'hover', 'background' );
				} elseif ( ! empty( $title_styles['colorHover'] ) ) {
					$css->render_color_output( $title_styles, 'colorHover', 'background' );
				}
			}
			if ( ! empty( $title_styles['backgroundHover'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before, body:not(.hide-focus-outline) .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:after, body:not(.hide-focus-outline) .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:before' );
				$css->render_color_output( $title_styles, 'backgroundHover', 'background' );
			}
			// Active styles.
			//adding a bit of extra specificity to the active styles to override the non-active focus-visible styles
			$css->set_selector( '.kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header:focus-visible, .kt-accordion-id' . $unique_id . ' .kt-accordion-header-wrap .kt-blocks-accordion-header.kt-accordion-panel-active.kt-accordion-panel-active' );
			$css->render_color_output( $title_styles, 'colorActive', 'color' );
			$css->render_color_output( $title_styles, 'backgroundActive', 'background' );

			// Support legacy non-responsive broder widths
			if ( ! empty( $title_styles['borderWidth'] ) && $title_styles['borderWidth'] !== array( '', '', '', '' ) ) {
				$css->render_border_color( $title_styles, 'borderActive' );
			} else {
				$css->render_border_styles( $attributes, 'titleBorderActive', true );
			}
			if ( ! empty( $attributes['iconColor']['active'] ) || ! empty( $title_styles['colorActive'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before' );
				if ( ! empty( $attributes['iconColor']['active'] ) ) {
					$css->render_color_output( $attributes['iconColor'], 'active', 'background' );
				} elseif ( ! empty( $title_styles['colorActive'] ) ) {
					$css->render_color_output( $title_styles, 'colorActive', 'background' );
				}
				$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger' );
				if ( ! empty( $attributes['iconColor']['active'] ) ) {
					$css->render_color_output( $attributes['iconColor'], 'active', 'background' );
				} elseif ( ! empty( $title_styles['colorActive'] ) ) {
					$css->render_color_output( $title_styles, 'colorActive', 'background' );
				}
			}
			if ( ! empty( $title_styles['backgroundActive'] ) ) {
				$css->set_selector( '.kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after, .kt-accordion-id' . $unique_id . ':not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before' );
				$css->render_color_output( $title_styles, 'backgroundActive', 'background' );
			}
		}

		return $css->css_output();
	}

	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		return str_replace('<div class="kt-accordion-panel">', '<div class="kt-accordion-panel kt-accordion-panel-hidden">', $content );
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
		if ( $this->has_script ) {
			wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kt-accordion.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		}
	}

	/**
	 * Render Block CSS in Page Head.
	 *
	 * @param array $block the block data.
	 */
	public function output_head_data( $block ) {
		parent::output_head_data( $block );
		if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
			$attributes = $block['attrs'];
			if ( isset( $attributes['uniqueID'] ) ) {
				$unique_id = $attributes['uniqueID'];
				if ( isset( $attributes['faqSchema'] ) && $attributes['faqSchema'] ) {
					$faq_script_id  = 'kb-faq' . esc_attr( $unique_id );
					$frontend_class = Kadence_Blocks_Frontend::get_instance();
					if ( is_null( $frontend_class::$faq_schema ) ) {
						$frontend_class::$faq_schema = '<script type="application/ld+json" class="kadence-faq-schema-graph kadence-faq-schema-graph--' . $faq_script_id . '">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}</script>';
					}
				}
			}
		}
	}
}

Kadence_Blocks_Accordion_Block::get_instance();
