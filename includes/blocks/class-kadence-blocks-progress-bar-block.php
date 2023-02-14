<?php
/**
 * Class to Build the Progress Bar Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Progress Bar Block.
 *
 * @category class
 */
class Kadence_Blocks_Progress_Bar_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'progress-bar';

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

		wp_enqueue_script( 'kadence-blocks-' . $this->block_name );

		$css->set_style_id( 'kb-' . $this->block_name . $unique_id );

		$css->set_selector( '.kb-progress-bar-container' . $unique_id );
		$css->render_responsive_size( $attributes, array( 'containerMaxWidth', 'tabletContainerMaxWidth', 'mobileContainerMaxWidth' ), 'max-width', 'containerMaxWidthUnits' );

		$margin_args = array(
			'desktop_key' => 'marginDesktop',
			'tablet_key'  => 'marginTablet',
			'mobile_key'  => 'marginMobile',
		);
		$css->render_measure_output( $attributes, 'marginDestop', 'margin', $margin_args );

		// echo '<pre>';
		// print_r($attributes['labelFont']['textTransform']);
		// die();

		$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' .kt-blocks-progress-label ' );
		$css->render_typography($attributes , 'labelFont');

		if ( ! empty( $attributes['labelAlign'] ) ) {
			$css->add_property( 'text-align', $attributes['labelAlign'][0] );

			if ( ! empty( $attributes['labelAlign'][1] ) ) {
				$css->set_media_state( 'tablet' );
				$css->add_property( 'text-align', $attributes['labelAlign'][1] );
				$css->set_media_state( 'desktop' );
			}

			if ( ! empty( $attributes['labelAlign'][2] ) ) {
				$css->set_media_state( 'mobile' );
				$css->add_property( 'text-align', $attributes['labelAlign'][2] );
				$css->set_media_state( 'desktop' );
			}
		}

		$css->set_selector( '.kb-progress-bar-container' . $unique_id . ' .kt-blocks-progress-label mark' );
		$css->render_typography($attributes , 'labelHighlightFont');

		return $css->css_output();
	}

	public function build_html( $attributes, $unique_id, $content, $block_instance ) {

		$css = new Kadence_Blocks_CSS();

		$simple_id = str_replace( '-', '', esc_attr( $unique_id ) );

		$bar_types = array(
			'line'       => 'Line',
			'circle'     => 'Circle',
			'semicircle' => 'SemiCircle'
		);


		$content = '<div class="kb-progress-bar-container kb-progress-bar-container' . $unique_id . '">';

		if ( $attributes['labelPosition'] === 'above' ) {
			$content .= $this->render_label( $attributes );
		}

		$content .= '<div id="kb-progress-bar' . $unique_id . '"></div>';

		if ( $attributes['labelPosition'] === 'below' ) {
			$content .= $this->render_label( $attributes );
		}

		$content .= '</div>';


		$progress_color = $css->sanitize_color( $attributes['progressColor'], $attributes['progressOpacity'] );
		$bar_background = $css->sanitize_color( $attributes['barBackground'], $attributes['barBackgroundOpacity'] );


		$content .= '<script>

			var waitForProgressBar' . $simple_id . ' = setInterval(function () {

				if (typeof ProgressBar !== "undefined") {
					clearInterval(waitForProgressBar' . $simple_id . ');

					var progressBar' . $simple_id . ' = new ProgressBar.' . $bar_types[ $attributes['barType'] ] . '("#kb-progress-bar' . $unique_id . '", {
						color: "' . $progress_color . '",
						trailColor: "' . $bar_background . '",
						duration: "' . ( $attributes['duration'] * 1000 ) . '",
						easing: "' . $attributes['easing'] . '",
						strokeWidth:  "' . $attributes['progressWidth'] . '",
					});

					progressBar' . $simple_id . '.animate(
													' . $attributes['progressAmount'] / 100 . ' ,
										 			{
														 duration: ' . ( $attributes['duration'] * 1000 ) . ',
										 			} ,
										 			function(){ console.log("Progress animation complete")}
										 		);
				}
			}, 125);


		</script>';

		return $content;

	}

	private function render_label( $attributes ) {

		if ( isset( $attributes['displayLabel'] ) && $attributes['displayLabel'] !== true ) {
			return '';
		}

		$tag = 'h3';
		if ( !empty( $attributes['labelFont']['level'] ) ) {
			$tag = 'h' . $attributes['labelFont']['level'];
		}

		return '<' . $tag . ' class="kt-blocks-progress-label">' . $attributes['label'] . '</' . $tag . '>';

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

		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/progressBar.min.js', array(), KADENCE_BLOCKS_VERSION, false );

	}
}

Kadence_Blocks_Progress_Bar_Block::get_instance();
