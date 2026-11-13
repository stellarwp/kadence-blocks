<?php
/**
 * What the table needs to know about the site.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * What the table needs to know about the site.
 *
 * @since TBD
 */
interface Kadence_Blocks_Table_Environment {

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
	public function write_pro_styles( $attributes, $css, $unique_id, $unique_style_id ): void;
}
