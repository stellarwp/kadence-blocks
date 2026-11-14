<?php
/**
 * Class to Build the Form Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore ajaxurl bgtype lpignore missingkey .

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Form Block.
 *
 * @category class
 */
class Kadence_Blocks_Form_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'form';

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Form_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}
	/**
	 * Add a noscript to the content.
	 *
	 * @param array $attributes The block attributes.
	 *
	 * @return string Returns the block output.
	 */
	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		$content .= '<noscript><div class="kadence-blocks-form-message kadence-blocks-form-warning">' . __( 'Please enable JavaScript in your browser to submit the form', 'kadence-blocks' ) . '</div><style>.kadence-form-' . $unique_id . ' .kadence-blocks-form-field.kb-submit-field { display: none; }</style></noscript>';

		// Update honeypot autocomplete value.
		if( ( !isset( $attributes['honeyPot']) || isset( $attributes['honeyPot'] ) && $attributes['honeyPot'] ) ) {
			$default = '<input class="kadence-blocks-field verify" type="text" name="_kb_verify_email" autocomplete="off" aria-hidden="true" placeholder="Email" tabindex="-1"/>';
			$new     = '<label class="kadence-verify-label">Email<input class="kadence-blocks-field verify" type="text" name="_kb_verify_email" autocomplete="new-password" aria-hidden="true" placeholder="Email" tabindex="-1" data-1p-ignore="true" data-lpignore="true" /></label>';
			$content = str_replace( $default, $new, $content );
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

		wp_register_script( 'kadence-blocks-form', KADENCE_BLOCKS_URL . 'includes/assets/js/kb-form-block.min.js', array(), KADENCE_BLOCKS_VERSION, true );

		$recaptcha_site_key = get_option( 'kadence_blocks_recaptcha_site_key' );
		if ( ! $recaptcha_site_key ) {
			$recaptcha_site_key = 'missingkey';
		}

		$recaptcha_lang = ! empty( get_option('kadence_blocks_recaptcha_language') ) ? '&hl=' . get_option('kadence_blocks_recaptcha_language') : '';

		wp_register_script( 'kadence-blocks-google-recaptcha-v3', 'https://www.google.com/recaptcha/api.js?render=' . esc_attr( $recaptcha_site_key ) . $recaptcha_lang, array(), KADENCE_BLOCKS_VERSION, true );
		$recaptcha_script = "grecaptcha.ready(function () { var recaptchaResponse = document.getElementById('kb_recaptcha_response'); if ( recaptchaResponse ) { grecaptcha.execute('" . esc_attr( $recaptcha_site_key ) . "', { action: 'kb_form' }).then(function (token) { recaptchaResponse.value = token; }); } var kb_recaptcha_inputs = document.getElementsByClassName('kb_recaptcha_response'); if ( ! kb_recaptcha_inputs.length ) { return; } for (var i = 0; i < kb_recaptcha_inputs.length; i++) { const e = i; grecaptcha.execute('" . esc_attr( $recaptcha_site_key ) . "', { action: 'kb_form' }).then(function (token) { kb_recaptcha_inputs[e].setAttribute('value', token); }); } });";
		wp_add_inline_script( 'kadence-blocks-google-recaptcha-v3', $recaptcha_script, 'after' );
		wp_register_script( 'kadence-blocks-google-recaptcha-v2', 'https://www.google.com/recaptcha/api.js?render=explicit&onload=kbOnloadV2Callback' . $recaptcha_lang, array( 'jquery' ), KADENCE_BLOCKS_VERSION, true );
		$recaptcha_v2_script = "var kbOnloadV2Callback = function(){jQuery( '.wp-block-kadence-form' ).find( '.kadence-blocks-g-recaptcha-v2' ).each( function() {grecaptcha.render( jQuery( this ).attr( 'id' ), {'sitekey' : '" . esc_attr( $recaptcha_site_key ) . "'});});}";
		wp_add_inline_script( 'kadence-blocks-google-recaptcha-v2', $recaptcha_v2_script, 'before' );

		wp_localize_script(
			'kadence-blocks-form',
			'kadence_blocks_form_params',
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

Kadence_Blocks_Form_Block::get_instance();
