<?php
/**
 * Class to Build the Search Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Search Block.
 *
 * @category class
 */
class Kadence_Blocks_Search_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'search';

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
	protected $has_style = true;

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
		$css->set_selector( '.kb-search' . $unique_id );

		/*
		 * Margin
		 */
		$css->render_measure_output( $attributes, 'margin', 'margin' );

		/*
		 * Padding
		 */
		$css->render_measure_output( $attributes, 'padding', 'padding' );


		// Modal Background
		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-modal' );
		if( $attributes['modalBackgroundType'] === 'gradient') {
			$css->add_property( '--kb-search-modal-background', $attributes['modalGradientActive'] );
		} else {
			$css->add_property( '--kb-search-modal-background', $css->render_color( $attributes['modalBackgroundColor'] ) );
		}

		// Input Styles.
		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-input[type="text"]' );
		$css->render_typography( $attributes, 'inputTypography' );
		$css->render_measure_range( $attributes, 'inputBorderRadius', 'border-radius', $attributes['inputBorderRadiusUnit'] );
		$css->render_measure_output( $attributes, 'inputPadding', 'padding' );
		$css->render_border_styles( $attributes, 'inputBorderStyles' );
		$css->add_property('color', $css->render_color( $attributes['inputColor'] ) );

		if ( $attributes['inputBackgroundType'] === 'gradient' ) {
			$css->add_property( 'background', $attributes['inputGradient'] );
		} else {
			$css->add_property( 'background', $css->render_color( $attributes['inputBackgroundColor'] ) );
		}

		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-input[type="text"]::placeholder' );
		$css->add_property('color', $css->render_color( $attributes['inputPlaceholderColor'] ) );

		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-input-wrapper' );
		$css->render_measure_output( $attributes, 'inputMargin', 'margin' );

		// SVG colors.
		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-icon svg' );
		$css->add_property( 'stroke', $css->render_color( $attributes['inputIconColor'] ) );

		if( !empty($attributes['displayStyle'] ) && $attributes['displayStyle'] === 'modal' ) {
			$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-input-wrapper:hover .kb-search-icon svg' );
		} else {
			$css->set_selector( '.kb-search' . $unique_id . ':hover .kb-search-icon svg' );
		}
		$css->add_property( 'stroke', $css->render_color( $attributes['inputIconHoverColor'] ) );

		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-close-btn svg' );
		$css->add_property( 'stroke', $css->render_color( $attributes['closeIconColor'] ) );

		// The closeIconSize is a range control, so we need to render it as a range.
		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-close-btn' );
		if( !empty( $attributes['closeIconSize'][0] )) {
			$css->add_property( 'font-size', $attributes['closeIconSize'][0]. 'px' );
		}
		if( !empty( $attributes['closeIconSize'][1] )) {
			$css->set_media_state('tablet');
			$css->add_property( 'font-size', $attributes['closeIconSize'][1]. 'px' );
			$css->set_media_state('desktop');
		}
		if( !empty( $attributes['closeIconSize'][2] )) {
			$css->set_media_state('mobile');
			$css->add_property( 'font-size', $attributes['closeIconSize'][2]. 'px' );
			$css->set_media_state('desktop');
		}

		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-close-btn:hover svg' );
		$css->add_property( 'stroke', $css->render_color( $attributes['closeIconHoverColor'] ) );

		$css->set_selector( '.kb-search.kb-search' . $unique_id . ' form, .kb-search.kb-search' . $unique_id . ' .kb-search-modal-content form form' );
		$css->render_responsive_range( $attributes, 'inputMaxWidth', 'max-width', 'inputMaxWidthType' );
		$css->render_responsive_range( $attributes, 'inputMinWidth', 'min-width', 'inputMinWidthType' );

		return $css->css_output();
	}

	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param array    $attributes    The block attributes.
	 * @param string   $unique_id     The unique ID for the block.
	 * @param string   $content       The block inner content.
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return string
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$outer_classes = array( 'kb-search', 'kb-search' . $unique_id );

		if ( 'modal' === $attributes['displayStyle'] ) {
			$outer_classes[] = 'kb-search-modal-container';
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $outer_classes ) ) );

		$search_form = $this->build_search_form( $attributes, $unique_id, $content );

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $search_form );
	}

	/**
	 * Build the search form HTML.
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id  The unique ID for the block.
	 * @param string $content    The block inner content.
	 *
	 * @return string
	 */
	private function build_search_form( $attributes, $unique_id, $content ) {
		$is_modal = 'modal' === $attributes['displayStyle'];
		$form_action = esc_url( home_url( '/' ) );

		$search_form = $is_modal ? $content : '';

		if ( $is_modal ) {
			$search_form .= $this->build_modal_content( $attributes, $unique_id );
		} else {
			if( empty( $attributes['showButton'] ) ) {
				$content = '';
			}
			$search_form .= sprintf(
				'<form class="kb-search-form" role="search" method="get" action="%s">%s%s</form>',
				$form_action,
				$this->build_input( $attributes ),
				$content
			);
		}

		return $search_form;
	}

	/**
	 * Build the modal content HTML.
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id  The unique ID for the block.
	 *
	 * @return string
	 */
	private function build_modal_content( $attributes, $unique_id ) {
		$form_action = esc_url( home_url( '/' ) );
		$close_icon = '';

		if( !empty( $attributes['closeIcon'] ) ) {
			$icon         = $attributes['closeIcon'];
			$type         = substr( $icon, 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;
			if ( $line_icon ) {
				$stroke_width = ( ! empty( $attributes['closeIconLineWidth'] ) ? $attributes['closeIconLineWidth'] : 2 );
			}
			$close_icon = Kadence_Blocks_Svg_Render::render( $icon, $fill, $stroke_width, '', false );
		}

		$modal_content = sprintf(
			'<div class="kb-search-modal">
            <button class="kb-search-close-btn" aria-label="%1$s" aria-expanded="false" data-set-focus=".search-toggle-open">
                %2$s
            </button>
            <div class="kb-search-modal-content">
                <label class="screen-reader-text" for="kb-search-input%3$s">%4$s</label>
                <form class="kb-search-form" role="search" method="get" action="%5$s">%6$s</form>
            </div>
        </div>',
			esc_attr__( 'Close search', 'text-domain' ),
			$close_icon,
			esc_attr( $unique_id ),
			esc_html__( 'Search for:', 'text-domain' ),
			$form_action,
			$this->build_input( $attributes )
		);

		return $modal_content;
	}

	/**
	 * Build the search input HTML.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string
	 */
	private function build_input( $attributes ) {
		$input = '<div class="kb-search-input-wrapper">';
		$placeholder = ! empty( $attributes['inputPlaceholder'] ) ? $attributes['inputPlaceholder'] : '';
		$aria_label = !empty($attributes['label']) ? sprintf( 'aria-label="%s"', esc_attr( $attributes['label'] ) ) : '';

		$input .= sprintf(
			'<input name="s" type="text" class="kb-search-input" placeholder="%s" %s>',
			esc_attr( $placeholder ),
			$aria_label
		);

		if( !empty( $attributes['inputIcon'] ) ) {
			$icon         = $attributes['inputIcon'];
			$type         = substr( $icon, 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;
			if ( $line_icon ) {
				$stroke_width = ( ! empty( $attributes['inputIconLineWidth'] ) ? $attributes['inputIconLineWidth'] : 2 );
			}
			$input_icon = Kadence_Blocks_Svg_Render::render( $icon, $fill, $stroke_width, '', false );

			$input .= sprintf(
				'<span class="kb-search-icon">%s</span>',
				$input_icon
			);
		}

		if ( ! empty( $attributes['searchProductsOnly'] ) ) {
			$input .= '<input type="hidden" name="post_type" value="product">';
		}

		$input .= '</div>';

		return $input;
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

		wp_register_script( 'kadence-blocks-search', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-search.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}

}

Kadence_Blocks_Search_Block::get_instance();
