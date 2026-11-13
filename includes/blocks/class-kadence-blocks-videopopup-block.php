<?php
/**
 * Class to Build the Video Popup Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Video Popup Block.
 *
 * @category class
 */
class Kadence_Blocks_Videopopup_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'videopopup';

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
	 * @param Kadence_Blocks_CSS $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-videopopup-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Videopopup_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
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

		if( !empty( $attributes['url'] ) && !empty( $attributes['type'] ) && $attributes['type'] === 'iframe' ) {
			$shorts_prefix_www = 'https://www.youtube.com/shorts/';
			$shorts_prefix = 'https://youtube.com/shorts/';

			if( substr($attributes['url'], 0, strlen($shorts_prefix_www)) === $shorts_prefix_www || substr($attributes['url'], 0, strlen($shorts_prefix)) === $shorts_prefix ) {
				$content = str_replace( $shorts_prefix, 'https://www.youtube.com/watch?v=', $content );
			}
		}

		return $content;
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts() {

		// Skip calling parent because this block does not have a dedicated CSS file.
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
		wp_register_script( 'kadence-blocks-pro-glight-video-init', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-glight-video-pop-init.min.js', array( 'kadence-glightbox' ), KADENCE_BLOCKS_VERSION, true );

		$pop_video_array = array(
			'plyr_js'          => KADENCE_BLOCKS_URL . 'includes/assets/js/plyr.min.js',
			'plyr_css'         => KADENCE_BLOCKS_URL . 'includes/assets/css/plyr.min.css',
		);
		wp_localize_script( 'kadence-blocks-pro-glight-video-init', 'kadence_pro_video_pop', $pop_video_array );
	}

	/**
	 * Returns if this block should register or not.
	 */
	public function should_register() {
		//this block was moved to here from pro after this version
		if ( $this->get_pro_version() === null || ( version_compare( $this->get_pro_version(), '2.6.0', '>' ) ) ) {
			return true;
		}
		return false;
	}
}

Kadence_Blocks_Videopopup_Block::get_instance();
