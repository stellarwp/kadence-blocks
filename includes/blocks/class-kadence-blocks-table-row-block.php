<?php
/**
 * Class to Build the Table Row Block.
 *
 * @package Kadence Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to Build the Table Row Block.
 *
 * @category class
 */
class Kadence_Blocks_Table_Row_Block extends Kadence_Blocks_Abstract_Block {

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
	protected $block_name = 'row';

	/**
	 * Block determines in scripts need to be loaded for block.
	 *
	 * @var string
	 */
	protected $has_script = false;

	protected $has_style = false;


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
	 * On init startup register the block.
	 */
	public function on_init() {
		register_block_type(
			KADENCE_BLOCKS_PATH . 'dist/blocks/table/children/' . $this->block_name . '/block.json',
			array(
				'render_callback' => array( $this, 'render_css' ),
			)
		);
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

		$css->set_selector( '.kb-table-container .kb-table tr.kb-table-row' . $unique_id );
		$css->add_property( 'background-color', $css->render_color( $attributes['backgroundColor'] ) );
		$css->render_responsive_size( $attributes, [ 'minHeight', 'tabletMinHeight', 'mobileMinHeight' ], 'height' );

		$css->set_selector( '.kb-table-container  .kb-table tr.kb-table-row' . $unique_id . ':hover' );
		$css->add_property( 'background-color', $css->render_color( $attributes['backgroundHoverColor'] ) );


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
		return sprintf(
			'<tr class="kb-table-row kb-table-row%1$s">%2$s</tr>',
			esc_attr( $unique_id ),
			$content
		);
	}

}

Kadence_Blocks_Table_Row_Block::get_instance();
