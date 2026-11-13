<?php
/**
 * Class to Build the Advanced Form Block.
 *
 * @package Kadence Blocks
 */

// cspell:ignore ajaxurl autoembed sizetype .

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
	 * @param array              $attributes      the blocks attributes.
	 * @param Kadence_Blocks_CSS $css             the css class for blocks.
	 * @param string             $unique_id       the blocks attr ID.
	 * @param string             $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-advanced-form-css.php';

		$bridge  = function ( $member, ...$args ) {
			return method_exists( $this, $member ) ? $this->$member( ...$args ) : $this->$member;
		};
		$builder = new Kadence_Blocks_Advanced_Form_Css( new Kadence_Blocks_Css_Block_Context( $this->block_name, $bridge ) );

		return $builder->build( $attributes, $css, $unique_id, $unique_style_id );
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
			'id' => 'kb-adv-form-' . $unique_id,
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
			$form_fields .= '<input type="hidden" name="_kb_adv_form_post_id" value="' . esc_attr( $attributes['id'] ) . '">';
		}
		$form_fields .= '<input type="hidden" name="action" value="kb_process_advanced_form_submit">';
		$form_fields .= '<input type="hidden" name="_kb_adv_form_id" value="' . esc_attr( $unique_id ) . '">';
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
