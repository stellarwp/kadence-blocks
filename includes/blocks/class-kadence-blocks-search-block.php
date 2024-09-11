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

		$css->set_selector( '.kb-search' . $unique_id . ' .kb-search-modal' );
		$css->add_property( '--kb-search-modal-background', $css->render_color( $attributes['modalBackgroundColor'] ) );

		return $css->css_output();
	}

	/**
	 * Return dynamically generated HTML for block
	 *
	 * @param $attributes
	 * @param $unique_id
	 * @param $content
	 * @param WP_Block $block_instance The instance of the WP_Block class that represents the block being rendered.
	 *
	 * @return mixed
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$response = '';
		$outer_classes = array( 'kb-search', 'kb-search' . $unique_id );

		if( $attributes['displayStyle'] === 'modal' ) {
			$outer_classes[] = 'kb-search-modal-container';
		}

		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		if( ! empty( $attributes['displayStyle'] ) && $attributes['displayStyle'] === 'modal' ) {
			$response .= $content;
			$response .= '<div class="kb-search-modal">
							<button
								class="kb-search-close-btn"
								aria-label="Close search"
								aria-expanded="false"
								data-set-focus=".search-toggle-open"
							>
								&times;
							</button>
							<div class="kb-search-modal-content">
								<label class="screen-reader-text" for="kb-search-input' . $unique_id . '">
									Search for:
								</label>';
			$response .= $this->build_input( $attributes, $unique_id );
			$response .= '</div></div>';

		} else {
			$response .= '<form class="kb-search-form" role="search" method="get" action="http://kbdev.local/">';
			$response .= $this->build_input( $attributes, $unique_id );
			$response .= $content;
			$response .= '</form>';
		}

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $response );
	}

	private function build_input( $attributes, $unique_id ) {
		$placeholder = ! empty( $attributes['inputPlaceholder'] ) ? $attributes['inputPlaceholder'] : '';
		return sprintf( '<input name="s" type="text" class="kb-search-input" placeholder="%s">', esc_attr( $placeholder ) );
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
