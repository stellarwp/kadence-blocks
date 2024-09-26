<?php
/**
 * Class to Build the Identity Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Identity Block.
 *
 * @category class
 */
class Kadence_Blocks_Identity_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'identity';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

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
	 * @param string $unique_style_id the blocks alternate ID for queries.¸
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.kb-identity' . $unique_id );


		$css->render_measure_output( $attributes, 'padding', 'padding' );
		$css->render_measure_output( $attributes, 'margin', 'margin' );

		$css->set_selector( '.kb-identity' . $unique_id  .' a');
		$css->add_property('text-decoration', 'inherit');
		$css->add_property('color', 'inherit');

		$css->set_selector( '.kb-identity' . $unique_id . ' .wp-block-site-title' );
		$css->render_typography( $attributes, 'titleTypography' );

		$css->set_selector( '.kb-identity' . $unique_id . ' .wp-block-site-tagline' );
		$css->render_typography( $attributes, 'taglineTypography' );

		$css->set_selector( '.kb-identity' . $unique_id . ' .kb-identity-layout-container' );
		if( $attributes['layout'] === 'logo-left' || $attributes['layout'] === 'logo-right' || $attributes['layout'] === 'logo-right-stacked' || $attributes['layout'] === 'logo-left-stacked' ) {
			$css->add_property( 'align-items', $attributes['textVerticalAlign'] );
		}

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
		$layout = isset( $attributes['layout'] ) ? $attributes['layout'] : 'logo-title';
		$layout_class = 'kb-identity-layout-container kb-identity-layout-' . $layout;
		$content = $this->strip_anchor_tags( $content );

		if (!empty($attributes['urlTransparent'])) {
			// Use regex to find the existing img tag
			$pattern = '/<img[^>]+>/i';
			if (preg_match($pattern, $content, $matches)) {
				$existing_img = $matches[0];

				// Create the transparent image by cloning and modifying the existing img tag
				$transparent_img = $existing_img;
				$transparent_img = preg_replace('/\bsrc=["\'][^"\']+["\']/', 'src="' . esc_url($attributes['urlTransparent']) . '"', $transparent_img);
				$transparent_img = preg_replace('/\bclass=["\']([^"\']*)["\']/', 'class="kb-img kb-img-transparent"', $transparent_img);
				$transparent_img = preg_replace('/\bsrcset=["\'][^"\']+["\']/', '', $transparent_img);
				$transparent_img = preg_replace('/\bsizes=["\'][^"\']+["\']/', '', $transparent_img);

				// Insert the transparent image after the existing image
				$content = preg_replace($pattern, '$0' . $transparent_img, $content, 1);
			}
		}

		if (!empty($attributes['urlSticky'])) {
			$this->enqueue_script('kadence-blocks-header-sticky-image');

			// Use regex to find the existing img tag
			$pattern = '/<img[^>]+>/i';
			if (preg_match($pattern, $content, $matches)) {
				$existing_img = $matches[0];

				// Create the transparent image by cloning and modifying the existing img tag
				$sticky_img = $existing_img;
				$sticky_img = preg_replace('/\bsrc=["\'][^"\']+["\']/', 'src="' . esc_url($attributes['urlSticky']) . '"', $sticky_img);
				$sticky_img = preg_replace('/\bclass=["\']([^"\']*)["\']/', 'class="kb-img kb-img-sticky"', $sticky_img);
				$sticky_img = preg_replace('/\bsrcset=["\'][^"\']+["\']/', '', $sticky_img);
				$sticky_img = preg_replace('/\bsizes=["\'][^"\']+["\']/', '', $sticky_img);

				// Insert the transparent image after the existing image
				$content = preg_replace($pattern, '$0' . $sticky_img, $content, 1);
			}
		}

		$outer_classes = array( 'kb-identity', 'kb-identity' . $unique_id );
		$outer_classes[] = ! empty( $attributes['align'] ) ? 'align' . $attributes['align'] : 'alignnone';

		if (!empty($attributes['urlTransparent'])) {
			$outer_classes[] = 'has-transparent-img';
		}

		$wrapper_attributes = get_block_wrapper_attributes( array( 'class' => implode( ' ', $outer_classes ) ) );

		if( !empty( $attributes['linkToHomepage']) || !empty( $attributes['link']) ) {
			$url = !empty( $attributes['link']) ? esc_url( $attributes['link'] ) : esc_url( home_url( '/' ) );
			$content = sprintf( '<a href="%1$s" class="%2$s">%3$s</a>', $url, $layout_class, $content );
		} else {
			$content = sprintf( '<div class="%1$s">%2$s</div>', $layout_class, $content );
		}

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $content );
	}

	 public function strip_anchor_tags($html) {
		$pattern = '/<a\s[^>]*href=[\'"](.+?)[\'"][^>]*>(.+?)<\/a>/i';
		$replacement = '$2';
		$stripped_html = preg_replace($pattern, $replacement, $html);

		return preg_replace('/<\/?a[^>]*>/i', '', $stripped_html);
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

		wp_register_script( 'kadence-blocks-header-sticky-image', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-header-sticky-image.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Identity_Block::get_instance();
