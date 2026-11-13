<?php
/**
 * What the site offers the table.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once __DIR__ . '/class-kadence-blocks-table-environment.php';

/**
 * What the site offers the table.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Site_Environment implements Kadence_Blocks_Table_Environment {

	/**
	 * The class that tells Kadence Blocks Pro is active.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $plugin_class;

	/**
	 * The class of the Pro table block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $block_class;

	/**
	 * Create the environment.
	 *
	 * @since TBD
	 *
	 * @param string $plugin_class The class that tells Kadence Blocks Pro is active.
	 * @param string $block_class  The class of the Pro table block.
	 */
	public function __construct( $plugin_class = 'Kadence_Blocks_Pro', $block_class = 'Kadence_Blocks_Pro_Table_Block' ) {
		$this->plugin_class = $plugin_class;
		$this->block_class  = $block_class;
	}

	/**
	 * Write the CSS of the Pro table, when Kadence Blocks Pro offers one.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return void
	 */
	public function write_pro_styles( $attributes, $css, $unique_id, $unique_style_id ): void {
		if ( ! class_exists( $this->plugin_class ) || ! class_exists( $this->block_class ) ) {
			return;
		}

		$block = new $this->block_class();
		$block->build_css( $attributes, $css, $unique_id, $unique_style_id );
	}
}
