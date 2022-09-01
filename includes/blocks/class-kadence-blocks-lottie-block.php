<?php
/**
 * Class to Build the Lottie Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Lottie Block.
 *
 * @category class
 */
class Kadence_Blocks_Lottie_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'lottie';

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
	 * @param array              $attributes the blocks attributes.
	 * @param Kadence_Blocks_CSS $css        the css class for blocks.
	 * @param string             $unique_id  the blocks attr ID.
	 */
	public function build_css( $attributes, $css, $unique_id ) {

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );
		$css->set_selector( '.kb-lottie-container' . $unique_id );

		/*
		 * Margin
		 */
		$margin_args = array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
		);
		$css->render_measure_output( $attributes, 'margin', 'margin', $margin_args );

		/*
		 * Padding
		 */
		$padding_args = array(
			'desktop_key' => 'paddingDesktop',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
		);
		$css->render_measure_output( $attributes, 'padding', 'padding', $padding_args );

		return $css->css_output();
	}

	public function build_html( $attributes, $unique_id, $content ) {
		if ( ! wp_script_is( 'kadence-blocks-lottieplayer-js', 'enqueued' ) ) {
			wp_enqueue_script( 'kadence-blocks-lottieplayer-js' );
		}
		if ( isset( $attributes['uniqueID'] ) ) {
			$unique_id              = $attributes['uniqueID'];
			$player_style_id        = 'kb-lottie-player' . esc_attr( $unique_id );
			$player_simple_style_id = str_replace( array( '-' ), '', $player_style_id );
			$style_id               = 'kb-lottie' . esc_attr( $unique_id );

			if ( ! wp_style_is( $style_id, 'enqueued' ) && apply_filters( 'kadence_blocks_render_inline_css', true, 'lottie', $unique_id ) ) {
				// If filter didn't run in header (which would have enqueued the specific css id ) then filter attributes for easier dynamic css.
				$attributes = apply_filters( 'kadence_blocks_lottie_render_block_attributes', $attributes );
			}
			// Include lottie interactive if using scroll animation.
			if ( isset( $attributes['onlyPlayOnScroll'] ) && $attributes['onlyPlayOnScroll'] === true || isset( $attributes['waitUntilInView'] ) && $attributes['waitUntilInView'] === true ) {
				if ( ! wp_script_is( 'kadence-blocks-lottieinteractivity-js', 'enqueued' ) ) {
					wp_enqueue_script( 'kadence-blocks-lottieinteractivity-js' );
				}

				if ( isset( $attributes['onlyPlayOnScroll'] ) && $attributes['onlyPlayOnScroll'] === true ) {
					$play_type = 'seek';
					$frames    = "frames: [" . ( ! empty( $attributes['startFrame'] ) ? $attributes['startFrame'] : '0' ) . ", " . ( ! empty( $attributes['endFrame'] ) ? $attributes['endFrame'] : '100' ) . "]";
				} else {
					$play_type = 'play';
					$frames    = '';
				}

				$content = $content . "
				<script>
					var waitForLoittieInteractive" . $player_simple_style_id . " = setInterval(function () {
						if (typeof LottieInteractivity !== 'undefined') {
							LottieInteractivity.create({
								mode: 'scroll',
								player: '#" . $player_style_id . "',
								actions: [
									{
									visibility: [0,1.0],
									type: '" . $play_type . "',
									$frames
									},
								],
							});
							clearInterval(waitForLoittieInteractive" . $player_simple_style_id . ");
						}
					}, 125);
				</script>";
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

		wp_register_script( 'kadence-blocks-lottieinteractivity-js', KADENCE_BLOCKS_URL . 'includes/assets/js/lottie-interactivity.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		wp_register_script( 'kadence-blocks-lottieplayer-js', KADENCE_BLOCKS_URL . 'includes/assets/js/lottie-player.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}


}

Kadence_Blocks_Lottie_Block::get_instance();
