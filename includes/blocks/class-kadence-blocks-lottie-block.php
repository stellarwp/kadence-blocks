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
	 * Block determines if style needs to be loaded for block.
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
		$css->set_selector( '.kb-lottie-container' . $unique_id );

		/*
		 * Margin
		 */
		$margin_args = array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
			'unit_key'    => 'marginUnit',
		);
		$css->render_measure_output( $attributes, 'margin', 'margin', $margin_args );

		/*
		 * Padding
		 */
		$padding_args = array(
			'desktop_key' => 'paddingDesktop',
			'tablet_key'  => 'paddingTablet',
			'mobile_key'  => 'paddingMobile',
			'unit_key'    => 'paddingUnit',
		);
		$css->render_measure_output( $attributes, 'padding', 'padding', $padding_args );

		$width = ( !isset( $attributes['width'] ) || '0' === $attributes['width'] ) ? 'auto' : $attributes['width'] . 'px';

		if ( isset( $attributes['useRatio'] ) && $attributes['useRatio'] ) {
			$css->add_property( 'max-width', $width );
			$css->add_property( 'margin', '0 auto' );
			$css->set_selector( '.kb-lottie-container' . $unique_id . ' .kb-is-ratio-animation' );
			$css->add_property( 'padding-bottom', isset( $attributes['ratio'] ) && is_numeric( $attributes['ratio'] ) ? $attributes['ratio'] . '%' : '100%' );
		}

		if ( ! isset( $attributes['useRatio'] ) || ! $attributes['useRatio'] ) {
			$css->set_selector( '.kb-lottie-container' . $unique_id . ' dotlottie-player' );
			$css->add_property( 'max-width', $width );
		}
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
		if ( ! wp_script_is( 'kadence-blocks-dotlottie-player-js', 'enqueued' ) ) {
			wp_enqueue_script( 'kadence-blocks-dotlottie-player-js' );
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

				$content .= "
				<script>
						
						var waitForLoittieInteractive" . $player_simple_style_id . " = setInterval(function () {
							let lottiePlayer" . $player_simple_style_id . " = document.getElementById( '" . $player_style_id . "');
							
							if (typeof LottieInteractivity !== 'undefined') {					
								lottiePlayer" . $player_simple_style_id . ".addEventListener('ready', () => {
								  LottieInteractivity.create({
									  player: lottiePlayer" . $player_simple_style_id . ".getLottie(),
									  mode: 'scroll',
									    actions: [
									        {
									            visibility: [0,1.0],
												type: '" . $play_type . "',
												$frames
									        }
									    ]
									});
								});
	                            clearInterval(waitForLoittieInteractive" . $player_simple_style_id . ");
							}
						}, 125);

				</script>";

			}

			$playerProps = array();

			if( $attributes['loop'] ){
				$playerProps['loop'] = 'true';

				if( !empty( $attributes['loopLimit'] ) ){
					$playerProps['count'] = ( $attributes['loopLimit'] - 1);
				}
			}

			if( $attributes['playbackSpeed'] ){
				$playerProps['speed'] = $attributes['playbackSpeed'];
			}

			if( $attributes['showControls'] ){
				$playerProps['controls'] = 'true';
			}

			if( $attributes['autoplay'] ){
				$playerProps['autoplay'] = 'true';
			}

			if( $attributes['onlyPlayOnHover'] ){
				$playerProps['hover'] = 'true';
			}

			if( $attributes['bouncePlayback']) {
				$playerProps['mode'] = 'bounce';
			} else {
				$playerProps['mode'] = 'normal';
			}

			if( $attributes['delay'] !== 0){
				$playerProps['intermission'] = 1000 * $attributes['delay'];
			}

			$classes = array(
				'kb-lottie-container',
				'kb-lottie-container' . esc_attr( $unique_id ),
			);

			if ( ! empty( $attributes['align'] ) ) {
				$classes[] = 'align' . $attributes['align'];
			}

			// Add custom CSS classes to class string.
			if ( isset( $attributes['className'] ) ) {
				$classes[] = $attributes['className'];
			}

			$content .= '<div class="' . esc_attr( implode( ' ', $classes ) ) . '">';
				if ( isset( $attributes['useRatio'] ) && $attributes['useRatio'] ) {
					$content .= '<div class="kb-is-ratio-animation">';
				}
				$content .= '<dotlottie-player ';

					foreach( $playerProps as $key => $value ){
						$content .= $key . '="' . $value . '" ';
					}

				$content .= 'src="' . $this->getAnimationUrl( $attributes ) . '"
							id="kb-lottie-player' . esc_attr( $unique_id ) .'"
						></dotlottie-player>';
				if ( isset( $attributes['useRatio'] ) && $attributes['useRatio'] ) {
					$content .= '</div>';
				}
			$content .= '</div>';
		}

		return $content;
	}

	public function getAnimationUrl( $attributes ) {
		$url      = '';
		$rest_url = get_rest_url();

		if ( $attributes['fileSrc'] === 'url' ) {
			$url = esc_attr( $attributes['fileUrl'] );
		} else {
			$url = $rest_url . 'kb-lottieanimation/v1/animations/' . esc_attr( $attributes['localFile'][0]['value'] ) . '.json';
		}

		if ( $url === '' || $url === $rest_url . 'kb-lottieanimation/v1/animations/' ) {
			$url = 'https://assets10.lottiefiles.com/packages/lf20_rqcjx8hr.json';
		}

		return $url;
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
		wp_register_script( 'kadence-blocks-dotlottie-player-js', KADENCE_BLOCKS_URL . 'includes/assets/js/lottie-dotlottie.min.js', array(), KADENCE_BLOCKS_VERSION, true );
	}
}

Kadence_Blocks_Lottie_Block::get_instance();
