<?php
/**
 * Class to Build the Advanced Form Block.
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
class Kadence_Blocks_Advanced_Form_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'advanced-form';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = true;

	protected $form_attributes = array();

	protected $form_fields = array();

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

		if ( ! isset( $attributes['id'] ) ) {
			return;
		}

		$form_fields     = $this->get_form_fields( $attributes['id'] );
		$form_attributes = $this->get_form_attributes( $attributes['id'] );

		$form_attributes = json_decode( json_encode( $form_attributes ), true );

		$field_style  = isset( $form_attributes['style'] ) ? $form_attributes['style'] : array(
			'lineHeight' => '',
			'fontSize'   => ''
		);
		$label_style  = isset( $form_attributes['labelFont'] ) ? $form_attributes['labelFont'] : array(
			'lineHeight' => '',
			'size'       => ''
		);
		$help_style   = isset( $form_attributes['helpFont'] ) ? $form_attributes['helpFont'] : array(
			'lineHeight' => '',
			'size'       => ''
		);
		$submit_style = isset( $form_attributes['submit'] ) ? $form_attributes['submit'] : array();
		$submit_font  = isset( $form_attributes['submitFont'] ) ? $form_attributes['submitFont'] : array(
			'lineHeight' => '',
			'size'       => ''
		);

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		// Container
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id );
		$css->render_measure_output( $form_attributes, 'padding', 'padding', [ 'desktop_key' => 'paddingDesktop', 'tablet_key' => 'paddingTablet', 'mobile_key' => 'paddingMobile' ] );
		$css->render_measure_output( $form_attributes, 'margin', 'margin', [ 'desktop_key' => 'marginDesktop', 'tablet_key' => 'marginTablet', 'mobile_key' => 'marginMobile' ] );

		// Input Styles
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form-field' );
		$css->render_responsive_size( $field_style, array(
			'rowGap',
			'tabletRowGap',
			'mobileRowGap'
		), 'margin-bottom', 'rowGapType' );

		/*
		 *
		 * Field Inputs
		 *
		 */
		$css->set_selector(
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=text],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=tel],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=number],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=date],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=time],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=email],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' select,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' textarea'
		);
		$css->render_responsive_size( $field_style['lineHeight'], array( 0, 1, 2 ), 'line-height', 'lineType' );
		$css->render_responsive_size( $field_style['fontSize'], array( 0, 1, 2 ), 'font-size', 'fontSizeType' );
		$css->render_color_output( $field_style, 'border', 'border-color' );
		$css->render_measure_range( $field_style, 'borderWidth', 'border-width' );
		$css->render_range( $field_style, 'borderRadius', 'border-radius' );
		$css->render_color_output( $field_style, 'color', 'color' );

		if ( isset( $field_style['backgroundType'] ) && $field_style['backgroundType'] === 'gradient' ) {
			$bg1 = ( ! isset( $field_style['background'] ) || 'transparent' === $field_style['background'] ? 'rgba(255,255,255,0)' : $css->render_color( $field_style['background'], ( isset( $field_style['backgroundOpacity'] ) && is_numeric( $field_style['backgroundOpacity'] ) ? $field_style['backgroundOpacity'] : 1 ) ) );
			$bg2 = ( isset( $field_style['gradient'][0] ) && ! empty( $field_style['gradient'][0] ) ? $css->render_color( $field_style['gradient'][0], ( isset( $field_style['gradient'][1] ) && is_numeric( $field_style['gradient'][1] ) ? $field_style['gradient'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $field_style['gradient'][1] ) && is_numeric( $field_style['gradient'][1] ) ? $field_style['gradient'][1] : 1 ) ) );

			if ( isset( $field_style['gradient'][4] ) && 'radial' === $field_style['gradient'][4] ) {
				$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $field_style['gradient'][6] ) && ! empty( $field_style['gradient'][6] ) ? $field_style['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $field_style['gradient'][2] ) && is_numeric( $field_style['gradient'][2] ) ? $field_style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $field_style['gradient'][3] ) && is_numeric( $field_style['gradient'][3] ) ? $field_style['gradient'][3] : '100' ) . '%)' );
			} elseif ( ! isset( $field_style['gradient'][4] ) || 'radial' !== $field_style['gradient'][4] ) {
				$css->add_property( 'background', 'linear-gradient(' . ( isset( $field_style['gradient'][5] ) && ! empty( $field_style['gradient'][5] ) ? $field_style['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $field_style['gradient'][2] ) && is_numeric( $field_style['gradient'][2] ) ? $field_style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $field_style['gradient'][3] ) && is_numeric( $field_style['gradient'][3] ) ? $field_style['gradient'][3] : '100' ) . '%)' );
			}
		} else {
			$css->render_color_output( $field_style, 'background', 'background', 'backgroundOpacity' );
		}

		if ( ! empty( $field_style['boxShadow'][0] ) && $field_style['boxShadow'][0] === true ) {
			$css->add_property( 'box-shadow', ( isset( $field_style['boxShadow'][7] ) && true === $field_style['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $field_style['boxShadow'][3] ) && is_numeric( $field_style['boxShadow'][3] ) ? $field_style['boxShadow'][3] : '2' ) . 'px ' . ( isset( $field_style['boxShadow'][4] ) && is_numeric( $field_style['boxShadow'][4] ) ? $field_style['boxShadow'][4] : '2' ) . 'px ' . ( isset( $field_style['boxShadow'][5] ) && is_numeric( $field_style['boxShadow'][5] ) ? $field_style['boxShadow'][5] : '3' ) . 'px ' . ( isset( $field_style['boxShadow'][6] ) && is_numeric( $field_style['boxShadow'][6] ) ? $field_style['boxShadow'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $field_style['boxShadow'][1] ) && ! empty( $field_style['boxShadow'][1] ) ? $field_style['boxShadow'][1] : '#000000' ), ( isset( $field_style['boxShadow'][2] ) && is_numeric( $field_style['boxShadow'][2] ) ? $field_style['boxShadow'][2] : 0.4 ) ) );
		}

		$css->render_measure_output( $field_style, 'padding', 'padding', [ 'desktop_key' => 'deskPadding' ] );

		/*
		 * Field Placeholder text
		 */
		$css->set_selector(
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=text]::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=tel]::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=number]::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=date]::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=time]::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=email]::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' select::placeholder,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' textarea::placeholder'
		);
		$css->render_color_output( $field_style, 'placeholderColor', 'color' );

		/*
		 *
		 * Field Inputs on Focus
		 *
		 */
		$css->set_selector(
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=text]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=email]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=tel]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=date]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=number]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=time]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' select:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' textarea:focus'
		);
		$css->render_color_output( $field_style, 'colorActive', 'color' );
		if ( isset( $field_style['backgroundActiveType'] ) && $field_style['backgroundActiveType'] === 'gradient' ) {
			$bg1 = ( ! isset( $field_style['backgroundActive'] ) || 'transparent' === $field_style['backgroundActive'] ? 'rgba(255,255,255,0)' : $css->render_color( $field_style['backgroundActive'], ( isset( $field_style['backgroundOpacity'] ) && is_numeric( $field_style['backgroundOpacity'] ) ? $field_style['backgroundOpacity'] : 1 ) ) );
			$bg2 = ( isset( $field_style['gradientActive'][0] ) && ! empty( $field_style['gradientActive'][0] ) ? $css->render_color( $field_style['gradientActive'][0], ( isset( $field_style['gradientActive'][1] ) && is_numeric( $field_style['gradientActive'][1] ) ? $field_style['gradientActive'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $field_style['gradientActive'][1] ) && is_numeric( $field_style['gradientActive'][1] ) ? $field_style['gradientActive'][1] : 1 ) ) );

			if ( isset( $field_style['gradientActive'][4] ) && 'radial' === $field_style['gradientActive'][4] ) {
				$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $field_style['gradientActive'][6] ) && ! empty( $field_style['gradientActive'][6] ) ? $field_style['gradientActive'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $field_style['gradientActive'][2] ) && is_numeric( $field_style['gradientActive'][2] ) ? $field_style['gradientActive'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $field_style['gradientActive'][3] ) && is_numeric( $field_style['gradientActive'][3] ) ? $field_style['gradientActive'][3] : '100' ) . '%)' );
			} elseif ( ! isset( $field_style['gradientActive'][4] ) || 'radial' !== $field_style['gradientActive'][4] ) {
				$css->add_property( 'background', 'linear-gradient(' . ( isset( $field_style['gradientActive'][5] ) && ! empty( $field_style['gradientActive'][5] ) ? $field_style['gradientActive'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $field_style['gradientActive'][2] ) && is_numeric( $field_style['gradientActive'][2] ) ? $field_style['gradientActive'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $field_style['gradientActive'][3] ) && is_numeric( $field_style['gradientActive'][3] ) ? $field_style['gradientActive'][3] : '100' ) . '%)' );
			}
		} else {
			$css->render_color_output( $field_style, 'backgroundActive', 'background', 'backgroundActiveOpacity' );
		}


		/*
		 *
		 * Labels
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form-label' );

		$css->render_color_output( $label_style, 'color', 'color' );
		$css->render_responsive_size( $label_style['lineHeight'], array( 0, 1, 2 ), 'line-height', 'lineType' );
		$css->render_responsive_size( $label_style['size'], array( 0, 1, 2 ), 'font-size', 'sizeType' );
		$css->render_range( $label_style, 'letterSpacing', 'letter-spacing' );
		$css->render_measure_output( $label_style, 'padding', 'padding' );
		$css->render_measure_output( $label_style, 'margin', 'margin' );

		if ( isset( $label_style['textTransform'] ) && ! empty( $label_style['textTransform'] ) ) {
			$css->add_property( 'text-transform', $label_style['textTransform'] );
		}

		if ( isset( $label_style['family'] ) && ! empty( $label_style['family'] ) ) {
			$google = isset( $label_style['google'] ) && $label_style['google'] ? true : false;
			$google = $google && ( isset( $label_style['loadGoogle'] ) && $label_style['loadGoogle'] || ! isset( $label_style['loadGoogle'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $label_style['family'], $google, ( isset( $label_style['variant'] ) ? $label_style['variant'] : '' ), ( isset( $label_style['subset'] ) ? $label_style['subset'] : '' ) ) );
		}
		if ( isset( $label_style['style'] ) && ! empty( $label_style['style'] ) ) {
			$css->add_property( 'font-style', $label_style['style'] );
		}
		if ( isset( $label_style['weight'] ) && ! empty( $label_style['weight'] ) && 'regular' !== $label_style['weight'] ) {
			$css->add_property( 'font-weight', $label_style['weight'] );
		}

		/*
		 *
		 * Label Required
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form-label .kb-advanced-form-required' );
		$css->render_color_output( $field_style, 'requiredColor', 'color' );


		/*
		 *
		 * Help Text
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-form-field-help' );
		$css->render_responsive_size( $help_style['lineHeight'], array( 0, 1, 2 ), 'line-height', 'lineType' );
		$css->render_responsive_size( $help_style['size'], array( 0, 1, 2 ), 'font-size', 'sizeType' );
		$css->render_color_output( $help_style, 'color', 'color' );
		$css->render_measure_output( $help_style, 'padding', 'padding' );
		$css->render_measure_output( $help_style, 'margin', 'margin' );
		if ( isset( $help_style['textTransform'] ) && ! empty( $help_style['textTransform'] ) ) {
			$css->add_property( 'text-transform', $help_style['textTransform'] );
		}

		if ( isset( $help_style['family'] ) && ! empty( $help_style['family'] ) ) {
			$google = isset( $help_style['google'] ) && $help_style['google'] ? true : false;
			$google = $google && ( isset( $help_style['loadGoogle'] ) && $help_style['loadGoogle'] || ! isset( $help_style['loadGoogle'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $help_style['family'], $google, ( isset( $help_style['variant'] ) ? $help_style['variant'] : '' ), ( isset( $help_style['subset'] ) ? $help_style['subset'] : '' ) ) );
		}
		if ( isset( $help_style['style'] ) && ! empty( $help_style['style'] ) ) {
			$css->add_property( 'font-style', $help_style['style'] );
		}
		if ( isset( $help_style['weight'] ) && ! empty( $help_style['weight'] ) && 'regular' !== $help_style['weight'] ) {
			$css->add_property( 'font-weight', $help_style['weight'] );
		}

		/*
		 *
		 * Submit button
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form-submit .kb-advanced-form-submit-button' );
		$css->render_color_output( $submit_style, 'color', 'color' );
		$css->render_measure_output( $submit_style, 'padding', 'padding' );
		$css->render_measure_output( $submit_style, 'margin', 'margin' );

		if ( isset( $submit_style['backgroundType'] ) && $submit_style['backgroundType'] === 'gradient' ) {
			$bg1 = ( ! isset( $submit_style['background'] ) || 'transparent' === $submit_style['background'] ? 'rgba(255,255,255,0)' : $css->render_color( $submit_style['background'], ( isset( $submit_style['backgroundOpacity'] ) && is_numeric( $submit_style['backgroundOpacity'] ) ? $submit_style['backgroundOpacity'] : 1 ) ) );
			$bg2 = ( isset( $submit_style['gradient'][0] ) && ! empty( $submit_style['gradient'][0] ) ? $css->render_color( $submit_style['gradient'][0], ( isset( $submit_style['gradient'][1] ) && is_numeric( $submit_style['gradient'][1] ) ? $submit_style['gradient'][1] : 1 ) ) : $css->render_color( '#999999', ( isset( $submit_style['gradient'][1] ) && is_numeric( $submit_style['gradient'][1] ) ? $submit_style['gradient'][1] : 1 ) ) );

			if ( isset( $submit_style['gradient'][4] ) && 'radial' === $submit_style['gradient'][4] ) {
				$css->add_property( 'background', 'radial-gradient(at ' . ( isset( $submit_style['gradient'][6] ) && ! empty( $submit_style['gradient'][6] ) ? $submit_style['gradient'][6] : 'center center' ) . ', ' . $bg1 . ' ' . ( isset( $submit_style['gradient'][2] ) && is_numeric( $submit_style['gradient'][2] ) ? $submit_style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit_style['gradient'][3] ) && is_numeric( $submit_style['gradient'][3] ) ? $submit_style['gradient'][3] : '100' ) . '%)' );
			} elseif ( ! isset( $submit_style['gradient'][4] ) || 'radial' !== $submit_style['gradient'][4] ) {
				$css->add_property( 'background', 'linear-gradient(' . ( isset( $submit_style['gradient'][5] ) && ! empty( $submit_style['gradient'][5] ) ? $submit_style['gradient'][5] : '180' ) . 'deg, ' . $bg1 . ' ' . ( isset( $submit_style['gradient'][2] ) && is_numeric( $submit_style['gradient'][2] ) ? $submit_style['gradient'][2] : '0' ) . '%, ' . $bg2 . ' ' . ( isset( $submit_style['gradient'][3] ) && is_numeric( $submit_style['gradient'][3] ) ? $submit_style['gradient'][3] : '100' ) . '%)' );
			}
		} else {
			$css->render_color_output( $submit_style, 'background', 'background', 'backgroundOpacity' );
		}

		if ( ! empty( $submit_style['boxShadow'][0] ) && $submit_style['boxShadow'][0] === true ) {
			$css->add_property( 'box-shadow', ( isset( $submit_style['boxShadow'][7] ) && true === $submit_style['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $submit_style['boxShadow'][3] ) && is_numeric( $submit_style['boxShadow'][3] ) ? $submit_style['boxShadow'][3] : '2' ) . 'px ' . ( isset( $submit_style['boxShadow'][4] ) && is_numeric( $submit_style['boxShadow'][4] ) ? $submit_style['boxShadow'][4] : '2' ) . 'px ' . ( isset( $submit_style['boxShadow'][5] ) && is_numeric( $submit_style['boxShadow'][5] ) ? $submit_style['boxShadow'][5] : '3' ) . 'px ' . ( isset( $submit_style['boxShadow'][6] ) && is_numeric( $submit_style['boxShadow'][6] ) ? $submit_style['boxShadow'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $submit_style['boxShadow'][1] ) && ! empty( $submit_style['boxShadow'][1] ) ? $submit_style['boxShadow'][1] : '#000000' ), ( isset( $submit_style['boxShadow'][2] ) && is_numeric( $submit_style['boxShadow'][2] ) ? $submit_style['boxShadow'][2] : 0.4 ) ) );
		}

		$css->render_responsive_size( $submit_font['lineHeight'], array( 0, 1, 2 ), 'line-height', 'lineType' );
		$css->render_range( $submit_font, 'letterSpacing', 'letter-spacing' );
		$css->render_responsive_size( $submit_font['size'], array( 0, 1, 2 ), 'font-size', 'sizeType' );
		if ( isset( $submit_font['textTransform'] ) && ! empty( $submit_font['textTransform'] ) ) {
			$css->add_property( 'text-transform', $submit_font['textTransform'] );
		}
		if ( isset( $submit_font['family'] ) && ! empty( $submit_font['family'] ) ) {
			$google = isset( $submit_font['google'] ) && $submit_font['google'] ? true : false;
			$google = $google && ( isset( $submit_font['loadGoogle'] ) && $submit_font['loadGoogle'] || ! isset( $submit_font['loadGoogle'] ) ) ? true : false;
			$css->add_property( 'font-family', $css->render_font_family( $submit_font['family'], $google, ( isset( $submit_font['variant'] ) ? $submit_font['variant'] : '' ), ( isset( $submit_font['subset'] ) ? $submit_font['subset'] : '' ) ) );
		}
		if ( isset( $submit_font['style'] ) && ! empty( $submit_font['style'] ) ) {
			$css->add_property( 'font-style', $submit_font['style'] );
		}
		if ( isset( $submit_font['weight'] ) && ! empty( $submit_font['weight'] ) && 'regular' !== $submit_font['weight'] ) {
			$css->add_property( 'font-weight', $submit_font['weight'] );
		}

		if ( isset( $submit_style['widthType'] ) && 'fixed' === $submit_style['widthType'] && isset( $submit_style['fixedWidth'] ) && is_array( $submit_style['fixedWidth'] ) && isset( $submit_style['fixedWidth'][0] ) && ! empty( $submit_style['fixedWidth'][0] ) ) {
			$css->render_responsive_size( $submit_style['fixedWidth'], array( 0, 1, 2 ), 'width', 'px' );
		} else if ( isset( $submit_style['widthType'] ) && 'full' === $submit_style['widthType'] ) {
			$css->add_property( 'width', '100%' );
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

		$form_fields = $this->get_form_fields( $attributes['id'] );

		$form_attributes = json_decode( json_encode( $this->get_form_attributes( $attributes['id'] ) ), true );

		$formFrontend = new AdvancedFormFrontend( $form_fields, $form_attributes, $unique_id, $attributes['id'] );

		return $formFrontend->render();
	}

	private function get_form_fields( $post_id ) {

		if ( ! empty( $this->form_fields ) ) {
			return $this->form_fields;
		}

		$post_content = get_post( $post_id );

		if ( $post_content instanceof WP_Post ) {
			$parsed_block = parse_blocks( $post_content->post_content );
		} else {
			$parsed_block = array();
		}

		if ( ! empty( $parsed_block[0]['innerBlocks'] ) ) {
			$this->form_fields = $parsed_block[0]['innerBlocks'];
		}

		return $this->form_fields;
	}

	private function get_form_attributes( $post_id ) {

		if ( ! empty( $this->form_attributes ) ) {
			return $this->form_attributes;
		}

		$post_meta = get_post_meta( $post_id );
		$form_meta = array();
		if ( is_array( $post_meta ) ) {
			foreach ( $post_meta as $meta_key => $meta_value ) {
				if ( strpos( $meta_key, '_kad_form_' ) === 0 && isset( $meta_value[0] ) ) {
					$form_meta[ str_replace( '_kad_form_', '', $meta_key ) ] = maybe_unserialize( $meta_value[0] );
				}
			}
		}

		if ( $this->form_attributes = $form_meta ) {
			return $this->form_attributes;
		}

		return array();
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
			wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-advanced-form-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		}
	}
}

Kadence_Blocks_Advanced_Form_Block::get_instance();
