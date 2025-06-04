<?php
/**
 * Class to Build the Advanced Form Captcha Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Kadence_Blocks_Captcha_Block extends Kadence_Blocks_Advanced_Form_Input_Block {

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
	protected $block_name = 'captcha';


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
	 * @param array  $attributes      the blocks attributes.
	 * @param string $css             the css class for blocks.
	 * @param string $unique_id       the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		$class_id = $this->class_id( $attributes );
		$css->set_style_id( 'kb-' . $this->block_name . $unique_style_id );
		$css->set_selector( '.wp-block-kadence-advanced-form .kb-field' . $class_id );

		$css->render_responsive_range( $attributes, 'maxWidth', 'max-width', 'maxWidthUnit' );
		$css->render_responsive_range( $attributes, 'minWidth', 'min-width', 'minWidthUnit' );

		if ( ! empty( $attributes['hideRecaptcha'] ) ) {
			$css->set_selector( '.grecaptcha-badge' );
			$css->add_property( 'visibility', 'hidden' );
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

		$captcha_settings = new Kadence_Blocks_Form_Captcha_Settings( $attributes );
		$this->register_scripts_with_attrs( $attributes, $captcha_settings );

		/* We can't tell captcha type, or key isn't set */
		if ( ! $captcha_settings->is_valid ) {
			return '';
		}
		$class_id           = $this->class_id( $attributes );
		$outer_classes      = [ 'kb-adv-form-field', 'kb-field' . $class_id ];
		$wrapper_args       = [
			'class' => implode( ' ', $outer_classes ),
		];
		$wrapper_attributes = get_block_wrapper_attributes( $wrapper_args );
		$inner_content      = '';

		switch ( $captcha_settings->service ) {
			case 'googlev2':
				$inner_content .= $this->render_google_v2( $captcha_settings );
				break;
			case 'googlev3':
				return $this->render_google_v3( $captcha_settings, $unique_id );
				break;
			case 'turnstile':
				$inner_content .= $this->render_turnstile( $captcha_settings );
				break;
			case 'hcaptcha':
				$inner_content .= $this->render_hcaptcha( $captcha_settings );
				break;
		}

		return sprintf( '<div %1$s>%2$s</div>', $wrapper_attributes, $inner_content );
	}

	private function render_google_v2( $captcha_settings ) {

		$recaptcha_v2_script = "var kbOnloadV2Callback = function(){jQuery( '.wp-block-kadence-form' ).find( '.kadence-blocks-g-recaptcha-v2' ).each( function() {grecaptcha.render( jQuery( this ).attr( 'id' ), {'sitekey' : '" . esc_attr( $captcha_settings->public_key ) . "'});});}";
		wp_add_inline_script( 'kadence-blocks-recaptcha', $recaptcha_v2_script, 'before' );
		$this->enqueue_script( 'kadence-blocks-recaptcha' );

		return '<div class="g-recaptcha" data-language="' . esc_attr( $captcha_settings->language ) . '" data-size="' . esc_attr( $captcha_settings->size ) . '" data-theme="' . esc_attr( $captcha_settings->theme ) . '" data-sitekey="' . esc_attr( $captcha_settings->public_key ) . '"></div>';
	}

	private function render_google_v3( $captcha_settings, $unique_id ) {

		$recaptcha_v3_script = "grecaptcha.ready(function () {
					var kb_recaptcha_inputs = document.getElementsByClassName('kb_recaptcha_response');

					if ( ! kb_recaptcha_inputs.length ) {
						return;
					}

					for (var i = 0; i < kb_recaptcha_inputs.length; i++) {
						const e = i; grecaptcha.execute('" . esc_attr( $captcha_settings->public_key ) . "', { action: 'kb_form' }).then(
						function (token) {
							kb_recaptcha_inputs[e].setAttribute('value', token);
						});
					}
			});";
		wp_add_inline_script( 'kadence-blocks-recaptcha', $recaptcha_v3_script, 'after' );
		$this->enqueue_script( 'kadence-blocks-recaptcha' );

		$output = '<input type="hidden" name="recaptcha_response" class="kb_recaptcha_response kb_recaptcha_' . esc_attr( $unique_id ) . '" />';

		// Handle Kadence Captcha plugin settings
		$recaptcha_notice_html = '<span style="max-width: 100%%; font-size: 11px; color: #555; line-height: 1.2; display: block; margin-bottom: 16px; padding: 10px; background: #f2f2f2;" class="kt-recaptcha-branding-string">%s</span>';
		if ( $captcha_settings->using_kadence_captcha ) {
			$hide_v3    = $captcha_settings->get_kadence_captcha_stored_value( 'hide_v3_badge', false );
			$add_notice = $captcha_settings->get_kadence_captcha_stored_value( 'show_v3_notice', false );
			if ( $hide_v3 && $add_notice ) {
				$default       = __( 'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply', 'kadence-blocks' );
				$custom_notice = $captcha_settings->get_kadence_captcha_stored_value( 'v3_notice', $default );

				$output .= sprintf( $recaptcha_notice_html, $custom_notice );
			}
		} elseif ( isset( $captcha_settings->hideRecaptcha ) && $captcha_settings->hideRecaptcha && 
				isset( $captcha_settings->showRecaptchaNotice ) && $captcha_settings->showRecaptchaNotice ) {
				
				$default       = __( 'This site is protected by reCAPTCHA and the Google Privacy Policy and Terms of Service apply', 'kadence-blocks' );
				$custom_notice = isset( $captcha_settings->recaptchaNotice ) && ! empty( $captcha_settings->recaptchaNotice ) ? $captcha_settings->recaptchaNotice : $default;
				
				$output .= sprintf( $recaptcha_notice_html, $custom_notice );
			
		}

		return $output;
	}

	private function render_turnstile( $captcha_settings ) {
		$this->enqueue_script( 'kadence-blocks-turnstile' );

		return '<div class="cf-turnstile" data-language="' . esc_attr( $captcha_settings->language ) . '" data-size="' . esc_attr( $captcha_settings->size ) . '" data-theme="' . esc_attr( $captcha_settings->theme ) . '" data-sitekey="' . esc_attr( $captcha_settings->public_key ) . '"></div>';
	}

	private function render_hcaptcha( $captcha_settings ) {
		$this->enqueue_script( 'kadence-blocks-hcaptcha' );

		return '<div class="h-captcha" data-language="' . esc_attr( $captcha_settings->language ) . '" data-size="' . esc_attr( $captcha_settings->size ) . '" data-theme="' . esc_attr( $captcha_settings->theme ) . '" data-sitekey="' . esc_attr( $captcha_settings->public_key ) . '"></div>';
	}

	/**
	 * Registers scripts and styles.
	 */
	public function register_scripts_with_attrs( $attributes, $captcha_settings ) {
		// If in the backend, bail out.
		if ( is_admin() ) {
			return;
		}
		if ( apply_filters( 'kadence_blocks_check_if_rest', false ) && kadence_blocks_is_rest() ) {
			return;
		}

		wp_register_script( 'kadence-blocks-turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js', [], null, true );
		wp_register_script( 'kadence-blocks-hcaptcha', 'https://js.hcaptcha.com/1/api.js', [], null, true );

		$recaptcha_url     = 'https://www.google.com/recaptcha/api.js';
		$recaptcha_net_url = 'https://www.recaptcha.net/recaptcha/api.js';

		if ( $captcha_settings->using_kadence_captcha && $captcha_settings->get_kadence_captcha_stored_value( 'recaptcha_url' ) === 'recaptcha' ) {
			$recaptcha_url = $recaptcha_net_url;
		}

		if ( $captcha_settings->language !== false ) {
			$recaptcha_url = add_query_arg( [ 'hl' => $captcha_settings->language ], $recaptcha_url );
		}

		if ( $captcha_settings->service === 'googlev3' ) {
			$recaptcha_url = add_query_arg( [ 'render' => $captcha_settings->public_key ], $recaptcha_url );
		}

		wp_register_script( 'kadence-blocks-recaptcha', $recaptcha_url, [], null, true );
	}
}

Kadence_Blocks_Captcha_Block::get_instance();
