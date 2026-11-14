<?php
/**
 * Class to Build the Accordion Block.
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
class Kadence_Blocks_Accordion_Block extends Kadence_Blocks_Abstract_Block {
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
	protected $block_name = 'accordion';

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
	 * @param string $css the css class for blocks.
	 * @param string $unique_id the blocks attr ID.
	 * @param string $unique_style_id the blocks alternate ID for queries.
	 */
	public function build_css( $attributes, $css, $unique_id, $unique_style_id ) {
		return Kadence_Blocks_Css_Builders::build( 'Kadence_Blocks_Accordion_Css', $this, $this->block_name, $attributes, $css, $unique_id, $unique_style_id );
	}

	public function build_html( $attributes, $unique_id, $content, $block_instance ) {
		return str_replace('<div class="kt-accordion-panel">', '<div class="kt-accordion-panel kt-accordion-panel-hidden">', $content );
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
			wp_register_script( 'kadence-blocks-' . $this->block_name, KADENCE_BLOCKS_URL . 'includes/assets/js/kt-accordion.min.js', array(), KADENCE_BLOCKS_VERSION, true );
		}
	}

	/**
	 * Render Block CSS in Page Head.
	 *
	 * @param array $block the block data.
	 */
	public function output_head_data( $block ) {
		parent::output_head_data( $block );
		if ( isset( $block['attrs'] ) && is_array( $block['attrs'] ) ) {
			$attributes = $block['attrs'];
			if ( isset( $attributes['uniqueID'] ) ) {
				$unique_id = $attributes['uniqueID'];
				if ( isset( $attributes['faqSchema'] ) && $attributes['faqSchema'] ) {
					$faq_script_id  = 'kb-faq' . esc_attr( $unique_id );
					$frontend_class = Kadence_Blocks_Frontend::get_instance();
					if ( is_null( $frontend_class::$faq_schema ) ) {
						$frontend_class::$faq_schema = '<script type="application/ld+json" class="kadence-faq-schema-graph kadence-faq-schema-graph--' . $faq_script_id . '">{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[]}</script>';
					}
				}
			}
		}
	}
}

Kadence_Blocks_Accordion_Block::get_instance();
