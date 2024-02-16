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
	 * Block determines if style needs to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_style = true;

	/**
	 * Instance of this class
	 *
	 * @var null
	 */
	private static $seen_refs = array();
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

		// $form_fields     = $this->get_form_fields( $attributes['id'] );
		$form_attributes = $this->get_form_attributes( $attributes['id'] );

		$form_attributes = json_decode( json_encode( $form_attributes ), true );
		//print_r( $form_attributes );
		$field_style  = isset( $form_attributes['style'] ) ? $form_attributes['style'] : array();
		$background_style  = isset( $form_attributes['background'] ) ? $form_attributes['background'] : array();
		$label_style  = isset( $form_attributes['labelFont'] ) ? $form_attributes['labelFont'] : array();
		$radio_label_font  = isset( $form_attributes['radioLabelFont'] ) ? $form_attributes['radioLabelFont'] : array();
		$input_font  = isset( $form_attributes['inputFont'] ) ? $form_attributes['inputFont'] : array();
		$help_style   = isset( $form_attributes['helpFont'] ) ? $form_attributes['helpFont'] : array();
		$submit_style = isset( $form_attributes['submit'] ) ? $form_attributes['submit'] : array();
		$submit_font  = isset( $form_attributes['submitFont'] ) ? $form_attributes['submitFont'] : array();
		$message_font  = isset( $form_attributes['messageFont'] ) ? $form_attributes['messageFont'] : array();

		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );

		// Container.
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ', .wp-block-kadence-advanced-form' . $unique_id . '.kb-form-has-background' );
		$css->render_measure_output( $form_attributes, 'padding', 'padding', array( 'desktop_key' => 'padding', 'tablet_key' => 'tabletPadding', 'mobile_key' => 'mobilePadding' ) );
		$css->render_measure_output( $form_attributes, 'margin', 'margin', array( 'desktop_key' => 'margin', 'tablet_key' => 'tabletMargin', 'mobile_key' => 'mobileMargin' ) );

		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id );
		if ( isset( $background_style['backgroundType'] ) && $background_style['backgroundType'] === 'gradient' ) {
			$css->add_property( 'background', $background_style['gradient'] );
		} else {
			$css->render_color_output( $background_style, 'background', 'background' );
		}
		$css->render_responsive_range( $form_attributes, 'maxWidth', 'max-width', 'maxWidthUnit' );

		// Input Styles.
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form' );
		$css->render_gap( $field_style );

		/*
		 *
		 * Field Inputs
		 *
		 */
		$css->set_selector(
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=text],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=tel],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=number],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=date],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=time],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=email],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form input[type=file],' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form select,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' .kb-advanced-form textarea'
		);

		$css->render_typography( $form_attributes, 'inputFont' );

		$border_style = array(
			'fieldBorderStyle' => array( ! empty( $form_attributes['fieldBorderStyle'] ) ? $form_attributes['fieldBorderStyle'] : array() ),
			'tabletFieldBorderStyle' => array( ! empty( $form_attributes['tabletFieldBorderStyle'] ) ? $form_attributes['tabletFieldBorderStyle'] : array() ),
			'mobileFieldBorderStyle' => array( ! empty( $form_attributes['mobileFieldBorderStyle'] ) ? $form_attributes['mobileFieldBorderStyle'] : array() ),
		);
		$css->render_border_styles( $border_style, 'fieldBorderStyle' );
		$css->render_measure_output( $form_attributes, 'fieldBorderRadius', 'border-radius' );

		if ( ! empty( $field_style['boxShadow'][0] ) && $field_style['boxShadow'][0] === true ) {
			$css->add_property( 'box-shadow', ( isset( $field_style['boxShadow'][7] ) && true === $field_style['boxShadow'][7] ? 'inset ' : '' ) . ( isset( $field_style['boxShadow'][3] ) && is_numeric( $field_style['boxShadow'][3] ) ? $field_style['boxShadow'][3] : '2' ) . 'px ' . ( isset( $field_style['boxShadow'][4] ) && is_numeric( $field_style['boxShadow'][4] ) ? $field_style['boxShadow'][4] : '2' ) . 'px ' . ( isset( $field_style['boxShadow'][5] ) && is_numeric( $field_style['boxShadow'][5] ) ? $field_style['boxShadow'][5] : '3' ) . 'px ' . ( isset( $field_style['boxShadow'][6] ) && is_numeric( $field_style['boxShadow'][6] ) ? $field_style['boxShadow'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $field_style['boxShadow'][1] ) && ! empty( $field_style['boxShadow'][1] ) ? $field_style['boxShadow'][1] : '#000000' ), ( isset( $field_style['boxShadow'][2] ) && is_numeric( $field_style['boxShadow'][2] ) ? $field_style['boxShadow'][2] : 0.4 ) ) );
		}

		$css->render_measure_output( $field_style, 'padding', 'padding' );

		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id );
		if ( isset( $field_style['isDark'] ) && $field_style['isDark'] === true ) {
			$css->add_property( 'color-scheme', 'dark' );
		}
		if ( ! empty( $form_attributes['inputFont']['color'] ) ) {
			$css->render_color_output( $form_attributes['inputFont'], 'color', '--kb-form-text-color' );
		}
		$css->render_color_output( $field_style, 'color', '--kb-form-text-focus-color' );
		if ( isset( $field_style['backgroundType'] ) && $field_style['backgroundType'] === 'gradient' ) {
			$css->add_property( '--kb-form-background-color', $field_style['gradient'] );
		} else {
			$css->render_color_output( $field_style, 'background', '--kb-form-background-color' );
		}
		$border_args = array(
			'desktop_key' => 'fieldBorderStyle',
			'tablet_key'  => 'tabletFieldBorderStyle',
			'mobile_key'  => 'mobileFieldBorderStyle',
			'unit_key'    => 'unit',
			'first_prop'  => 'border-top',
			'second_prop' => 'border-right',
			'third_prop'  => 'border-bottom',
			'fourth_prop' => 'border-left',
		);
		$desktop_border_width = $css->get_border_value( $border_style, $border_args, 'top', 'desktop', 'width', true );
		if ( ! empty( $desktop_border_width ) ) {
			$css->add_property( '--kb-form-border-width', $desktop_border_width );
		}
		$desktop_border_color = $css->get_border_value( $border_style, $border_args, 'top', 'desktop', 'color', true );
		if ( ! empty( $desktop_border_color ) ) {
			$css->add_property( '--kb-form-border-color', $desktop_border_color );
		}

		/*
		 * Field Placeholder text
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id );
		$css->render_color_output( $field_style, 'placeholderColor', '--kb-form-placeholder-color' );

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
			'.wp-block-kadence-advanced-form' . $unique_id . ' input[type=file]:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' select:focus,' .
			'.wp-block-kadence-advanced-form' . $unique_id . ' textarea:focus'
		);

		$css->render_color_output( $input_font, 'colorActive', 'color' );

		if ( ! empty( $field_style['borderActive'] ) ) {
			$css->add_property( 'border-color',  $css->sanitize_color( $field_style['borderActive'] ) );
		}

		if ( ! empty( $field_style['boxShadowActive'][0] ) && $field_style['boxShadowActive'][0] === true ) {
			$css->add_property( 'box-shadow', ( isset( $field_style['boxShadowActive'][7] ) && true === $field_style['boxShadowActive'][7] ? 'inset ' : '' ) . ( isset( $field_style['boxShadowActive'][3] ) && is_numeric( $field_style['boxShadowActive'][3] ) ? $field_style['boxShadowActive'][3] : '2' ) . 'px ' . ( isset( $field_style['boxShadowActive'][4] ) && is_numeric( $field_style['boxShadowActive'][4] ) ? $field_style['boxShadowActive'][4] : '2' ) . 'px ' . ( isset( $field_style['boxShadowActive'][5] ) && is_numeric( $field_style['boxShadowActive'][5] ) ? $field_style['boxShadowActive'][5] : '3' ) . 'px ' . ( isset( $field_style['boxShadowActive'][6] ) && is_numeric( $field_style['boxShadowActive'][6] ) ? $field_style['boxShadowActive'][6] : '0' ) . 'px ' . $css->render_color( ( isset( $field_style['boxShadowActive'][1] ) && ! empty( $field_style['boxShadowActive'][1] ) ? $field_style['boxShadowActive'][1] : '#000000' ), ( isset( $field_style['boxShadowActive'][2] ) && is_numeric( $field_style['boxShadowActive'][2] ) ? $field_style['boxShadowActive'][2] : 0.4 ) ) );
		}


		if ( isset( $field_style['backgroundActiveType'] ) && $field_style['backgroundActiveType'] === 'gradient' ) {
			$css->add_property( 'background', $field_style['gradientActive'] );
		} else {
			$css->render_color_output( $field_style, 'backgroundActive', 'background' );
		}

		/*
		 *
		 * Labels
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-adv-form-field .kb-adv-form-label' );

		$css->render_measure_output( $label_style, 'padding', 'padding' );
		$css->render_measure_output( $label_style, 'margin', 'margin' );

		$tmp_label_style = array( 'typography' => $label_style );
		$css->render_typography( $tmp_label_style, 'typography' );

		/*
		 *
		 * Label Required
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-adv-form-label .kb-adv-form-required' );
		$css->render_color_output( $field_style, 'requiredColor', 'color' );

		/*
		 *
		 * Radio Labels
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-radio-check-item label' );
		$css->render_color_output( $radio_label_font, 'color', 'color' );
		$tmp_radio_label_style = array( 'typography' => $radio_label_font );
		$css->render_typography( $tmp_radio_label_style, 'typography' );
		/*
		 *
		 * Help Text
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-adv-form-help' );
		$tmp_help_font = array( 'typography' => $help_style );
		$css->render_typography( $tmp_help_font, 'typography' );
		$css->render_measure_output( $help_style, 'padding', 'padding' );
		$css->render_measure_output( $help_style, 'margin', 'margin' );

		/*
		 *
		 * Message Styles
		 *
		 */
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-adv-form-message' );
		$css->render_measure_output( $form_attributes, 'messagePadding', 'padding' );
		$css->render_measure_output( $form_attributes, 'messageMargin', 'margin' );
		$tmp_message_font = array( 'typography' => $message_font );
		$css->render_typography( $tmp_message_font, 'typography' );
		$css->render_measure_output( $form_attributes, 'messageBorderRadius', 'border-radius' );
		// Success.
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-adv-form-success' );
		$border_style = array(
			'messageBorderSuccess' => array( ! empty( $form_attributes['messageBorderSuccess'] ) ? $form_attributes['messageBorderSuccess'] : array() ),
			'tabletMessageBorderSuccess' => array( ! empty( $form_attributes['tabletMessageBorderSuccess'] ) ? $form_attributes['tabletMessageBorderSuccess'] : array() ),
			'mobileMessageBorderSuccess' => array( ! empty( $form_attributes['mobileMessageBorderSuccess'] ) ? $form_attributes['mobileMessageBorderSuccess'] : array() ),
		);
		$css->render_border_styles( $border_style, 'messageBorderSuccess' );
		$css->render_color_output( $form_attributes, 'messageColor', 'color' );
		$css->render_color_output( $form_attributes, 'messageBackground', 'background' );
		// Error.
		$css->set_selector( '.wp-block-kadence-advanced-form' . $unique_id . ' .kb-adv-form-warning' );
		$border_style = array(
			'messageBorderError' => array( ! empty( $form_attributes['messageBorderError'] ) ? $form_attributes['messageBorderError'] : array() ),
			'tabletMessageBorderError' => array( ! empty( $form_attributes['tabletMessageBorderError'] ) ? $form_attributes['tabletMessageBorderError'] : array() ),
			'mobileMessageBorderError' => array( ! empty( $form_attributes['mobileMessageBorderError'] ) ? $form_attributes['mobileMessageBorderError'] : array() ),
		);
		$css->render_border_styles( $border_style, 'messageBorderError' );
		$css->render_color_output( $form_attributes, 'messageColorError', 'color' );
		$css->render_color_output( $form_attributes, 'messageBackgroundError', 'background' );

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
		if ( empty( $attributes['id'] ) ) {
			return '';
		}

		$form_block = get_post( $attributes['id'] );
		if ( ! $form_block || 'kadence_form' !== $form_block->post_type ) {
			return '';
		}

		if ( 'publish' !== $form_block->post_status || ! empty( $form_block->post_password ) ) {
			return '';
		}
		// Prevent a form block from being rendered inside itself.
		if ( isset( self::$seen_refs[ $attributes['id'] ] ) ) {
			// WP_DEBUG_DISPLAY must only be honored when WP_DEBUG. This precedent
			// is set in `wp_debug_mode()`.
			$is_debug = WP_DEBUG && WP_DEBUG_DISPLAY;

			return $is_debug ?
				// translators: Visible only in the front end, this warning takes the place of a faulty block.
				__( '[block rendering halted]', 'kadence-blocks' ) :
				'';
		}
		self::$seen_refs[ $attributes['id'] ] = true;
		// Remove the advanced form block so it doesn't try and render.
		$content = preg_replace( '/<!-- wp:kadence\/advanced-form {.*?} -->/', '', $form_block->post_content );
		$content = str_replace( '<!-- wp:kadence/advanced-form  -->', '', $content );
		$content = str_replace( '<!-- wp:kadence/advanced-form -->', '', $content );
		$content = str_replace( '<!-- /wp:kadence/advanced-form -->', '', $content );

		// Handle embeds for form block.
		global $wp_embed;
		$content = $wp_embed->run_shortcode( $content );
		$content = $wp_embed->autoembed( $content );
		$content = do_blocks( $content );

		unset( self::$seen_refs[ $attributes['id'] ] );
		$form_attributes = $this->get_form_attributes( $attributes['id'] );
		$form_attributes = json_decode( json_encode( $form_attributes ), true );
		$field_style = isset( $form_attributes['style'] ) ? $form_attributes['style'] : array();
		$background_style = isset( $form_attributes['background'] ) ? $form_attributes['background'] : array();
		$outer_classes = array( 'wp-block-kadence-advanced-form', 'wp-block-kadence-advanced-form' . $unique_id );
		if ( ! empty( $field_style['labelStyle'] ) ) {
			$outer_classes[] = 'kb-adv-form-label-style-' . $field_style['labelStyle'];
		}
		if ( ! empty( $field_style['size'] ) ) {
			$outer_classes[] = 'kb-adv-form-input-size-' . $field_style['size'];
		}
		if ( ! isset( $field_style['basicStyles'] ) || ( isset( $field_style['basicStyles'] ) && $field_style['basicStyles'] ) ) {
			$outer_classes[] = 'kb-form-basic-style';
		}
		if ( ( isset( $field_style['showRequired'] ) && false === $field_style['showRequired'] ) ) {
			$outer_classes[] = 'kb-form-hide-required-asterisk';
		}
		if ( isset( $field_style['isDark'] ) && $field_style['isDark'] ) {
			$outer_classes[] = 'kb-form-is-dark';
		}
		if( ! empty( $form_attributes['className'] ) ) {
			$outer_classes[] = $form_attributes['className'];
		}
		$background_type = ( ! empty( $background_style['backgroundType'] ) ? $background_style['backgroundType'] : 'normal' );
		$has_background = false;
		if ( 'normal' === $background_type && ! empty( $background_style['background'] ) ) {
			$has_background = true;
		} else if ( 'gradient' === $background_type && ! empty( $background_style['gradient'] ) ) {
			$has_background = true;
		}
		if ( $has_background ) {
			$outer_classes[] = 'kb-form-has-background';
		}
		$inner_classes = array( 'kb-advanced-form' );
		$wrapper_args = array(
			'class' => implode( ' ', $outer_classes ),
		);
		if ( ! empty( $form_attributes['anchor'] ) ) {
			$wrapper_args['id'] = $form_attributes['anchor'];
		}
		$inner_args = array(
			'class' => implode( ' ', $inner_classes ),
			'method' => 'post',
		);
		if ( isset( $form_attributes['messages']['preError'] ) && ! empty( $form_attributes['messages']['preError'] ) ) {
			$inner_args['data-error-message'] = $form_attributes['messages']['preError'];
		}
		if ( isset( $form_attributes['enableAnalytics'] ) && $form_attributes['enableAnalytics'] && class_exists( 'Kadence_Blocks_Pro' ) ) {
			$inner_args['data-kb-events'] = 'yes';
		}
		if ( isset( $form_attributes['browserValidation'] ) && ! $form_attributes['browserValidation'] ) {
			$inner_args['novalidate'] = 'true';
		}
		$inner_wrap_attributes = array();
		foreach ( $inner_args as $key => $value ) {
			$inner_wrap_attributes[] = $key . '="' . esc_attr( $value ) . '"';
		}
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$inner_wrapper_attributes = implode( ' ', $inner_wrap_attributes );
		$form_fields = '';
		if ( ! empty( $attributes['id'] ) ) {
			$form_fields .= '<input type="hidden" name="_kb_adv_form_post_id" value="' . $attributes['id'] . '">';
		}
		$form_fields .= '<input type="hidden" name="action" value="kb_process_advanced_form_submit">';
		$form_fields .= '<input type="hidden" name="_kb_adv_form_id" value="' . $unique_id . '">';
		$content = sprintf( '<div %1$s><form %2$s>%3$s%4$s</form></div>', $wrapper_attributes, $inner_wrapper_attributes, $content, $form_fields );

		return $content;
	}

	/**
	 * Get form fields.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
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
	/**
	 * Get form attributes.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	private function get_form_attributes( $post_id ) {

		if ( ! empty( $this->form_attributes[ $post_id ] ) ) {
			return $this->form_attributes[ $post_id ];
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

		if ( $this->form_attributes[ $post_id ] = $form_meta ) {
			return $this->form_attributes[ $post_id ];
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
		wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kb-advanced-form-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		wp_localize_script(
			'kadence-blocks-' . $this->block_name,
			'kb_adv_form_params',
			array(
				'ajaxurl'       => admin_url( 'admin-ajax.php' ),
				'error_message' => __( 'Please fix the errors to proceed', 'kadence-blocks' ),
				'nonce'         => wp_create_nonce( 'kb_form_nonce' ),
				'required'      => __( 'is required', 'kadence-blocks' ),
				'mismatch'      => __( 'does not match', 'kadence-blocks' ),
				'validation'    => __( 'is not valid', 'kadence-blocks' ),
				'duplicate'     => __( 'requires a unique entry and this value has already been used', 'kadence-blocks' ),
				'item'          => __( 'Item', 'kadence-blocks' ),
			)
		);
	}
}

Kadence_Blocks_Advanced_Form_Block::get_instance();
