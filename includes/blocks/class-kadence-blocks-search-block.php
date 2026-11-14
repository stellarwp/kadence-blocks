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
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Search_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
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
                <form class="kb-search-form" role="search" method="get" action="%3$s">%4$s</form>
            </div>
        </div>',
			esc_attr__( 'Close search', 'kadence-blocks' ),
			$close_icon,
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
		$aria_label = !empty($attributes['label']) ? sprintf( 'aria-label="%s"', esc_attr( $attributes['label'] ) ) : 'aria-label="' . esc_html__( 'Search', 'kadence-blocks' ) . '"';

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

			// If not showing a submit button, make the icon a submit button.
			if ( empty( $attributes['showButton'] ) || ( !empty( $attributes['displayStyle'] ) && 'modal' === $attributes['displayStyle'] ) ) {
				$input .= sprintf(
					'<button type="submit" class="kb-search-icon-submit" aria-label="%1$s"><span class="kb-search-icon">%2$s</span></button>',
					esc_attr__( 'Search', 'kadence-blocks' ),
					$input_icon
				);
			} else {
				$input .= sprintf(
					'<span class="kb-search-icon">%s</span>',
					$input_icon
				);
			}
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
