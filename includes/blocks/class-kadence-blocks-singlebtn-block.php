<?php
/**
 * Class to Build the Single Button Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Single Button.
 *
 * @category class
 */
class Kadence_Blocks_Singlebtn_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'singlebtn';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = false;

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
	 * Render for block scripts block.
	 *
	 * @param array   $attributes the blocks attributes.
	 * @param boolean $inline true or false based on when called.
	 */
	public function render_scripts( $attributes, $inline = false ) {
		if ( ! empty( $attributes['target'] ) && 'video' === $attributes['target'] ) {
			$this->enqueue_style( 'kadence-glightbox' );
			$this->enqueue_script( 'kadence-blocks-glight-video-init' );
		}
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

		if ( ! empty( $attributes['target'] ) && 'video' === $attributes['target'] ) {
			$this->enqueue_style( 'kadence-glightbox' );
			$this->enqueue_script( 'kadence-blocks-glight-video-init' );
		}
		$css->set_selector( '.kb-btn' . $unique_id . '.kb-button' );
		$css->render_typography( $attributes, 'typography' );
		$css->render_measure_output( $attributes, 'borderRadius', 'border-radius' );
		$css->render_border_styles( $attributes, 'borderStyle' );
		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_measure_output( $attributes, 'margin', 'margin' );
		// Icon.
		$css->set_selector( '.kb-btn' . $unique_id . '.kb-button .kb-svg-icon-wrap' );
		$css->render_measure_output( $attributes, 'iconPadding', 'padding' );

		return $css->css_output();
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
		$classes = array( 'kb-button', 'button', 'kb-btn' . $unique_id );
		$classes[] = ! empty( $attributes['sizePreset'] ) ? 'kt-btn-size-' . $attributes['sizePreset'] : 'kt-btn-size-standard';
		$classes[] = ! empty( $attributes['inheritStyles'] ) ? 'kb-btn-global-' . $attributes['inheritStyles'] : 'kb-btn-global-fill';
		$classes[] = ! empty( $attributes['text'] ) ? 'kt-btn-has-text-true' : 'kt-btn-has-text-false';
		$classes[] = ! empty( $attributes['icon'] ) ? 'kt-btn-has-svg-true' : 'kt-btn-has-svg-false';
		if ( ! empty( $attributes['target'] ) && 'video' === $attributes['target'] ) {
			$classes[] = 'ktblocksvideopop';
		}
		if ( ! empty( $attributes['inheritStyles'] ) && 'inherit' === $attributes['inheritStyles'] ) {
			$classes[] = 'wp-block-button__link';
		}
		$wrapper_args = array(
			'class' => implode( ' ', $classes ),
		);
		if ( ! empty( $attributes['anchor'] ) ) {
			$wrapper_args['id'] = $attributes['anchor'];
		}
		if ( ! empty( $attributes['label'] ) ) {
			$wrapper_args['aria-label'] = $attributes['label'];
		}
		if ( ! empty( $attributes['link'] ) ) {
			$wrapper_args['href'] = $attributes['link'];
			$rel_add = '';
			if ( isset( $attributes['download'] ) && $attributes['download'] ) {
				$wrapper_args['download'] = '';
			}
			if ( ! empty( $attributes['target'] ) && '_blank' === $attributes['target'] ) {
				$wrapper_args['target'] = '_blank';
				$rel_add = 'noreferrer noopener';
			}
			if ( isset( $attributes['noFollow'] ) && $attributes['noFollow'] ) {
				$rel_add .= ' nofollow';
			}
			if ( isset( $attributes['sponsored'] ) && $attributes['sponsored'] ) {
				$rel_add .= ' sponsored';
			}
			if ( ! empty( $rel_add ) ) {
				$wrapper_args['rel'] = $rel_add;
			}
		}
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );

		$text       = ! empty( $attributes['text'] ) ? '<span class="kt-btn-inner-text">' . $attributes['text'] . '</span>' : '';
		$svg_icon   = '';
		if ( ! empty( $attributes['icon'] ) ) {
			$type         = substr( $attributes['icon'], 0, 2 );
			$line_icon    = ( ! empty( $type ) && 'fe' == $type ? true : false );
			$fill         = ( $line_icon ? 'none' : 'currentColor' );
			$stroke_width = false;

			if ( $line_icon ) {
				$stroke_width = 2;
			}
			$svg_icon = Kadence_Blocks_Svg_Render::render( $attributes['icon'], $fill, $stroke_width );
		}
		$icon_left  = ! empty( $svg_icon ) && ! empty( $attributes['iconSide'] ) && 'left' === $attributes['iconSide'] ? '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kt-btn-icon-side-left">' . $svg_icon . '</span>' : '';
		$icon_right = ! empty( $svg_icon ) && ! empty( $attributes['iconSide'] ) && 'right' === $attributes['iconSide'] ? '<span class="kb-svg-icon-wrap kb-svg-icon-' . esc_attr( $attributes['icon'] ) . ' kt-btn-icon-side-right">' . $svg_icon . '</span>' : '';
		$html_tag   = ! empty( $attributes['link'] ) ? 'a' : 'span';
		$content    = sprintf( '<%1$s %2$s>%3$s %4$s %5$s</%1$s>', $html_tag, $wrapper_attributes, $icon_left, $text, $icon_right );
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
		wp_register_style( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/css/kb-glightbox.min.css', array(), KADENCE_BLOCKS_VERSION );
		wp_register_script( 'kadence-glightbox', KADENCE_BLOCKS_URL . 'includes/assets/js/glightbox.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-glight-video-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-glight-video-init.min.js', array( 'kadence-glightbox' ), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Singlebtn_Block::get_instance();
