<?php
/**
 * Infobox title tag.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * Works out the HTML tag of the title of the info box.
 *
 * @since TBD
 */
final class Kadence_Blocks_Infobox_Title_Tag {

	/**
	 * The tag of the title.
	 *
	 * @since TBD
	 *
	 * @param array                            $attributes The block attributes.
	 * @param Kadence_Blocks_Css_Block_Context $context    What the builder needs from the block.
	 *
	 * @return string
	 */
	public function resolve( array $attributes, $context ) {
		$attributes['titleTagLevel'] = ! empty( $attributes['titleFont'][0]['level'] ) ? $attributes['titleFont'][0]['level'] : 2;
		$attributes['titleTagType']  = ! empty( $attributes['titleTagType'] ) ? $attributes['titleTagType'] : 'heading';

		return $context->call( 'get_html_tag', $attributes, 'titleTagType', 'h2', $context->call( 'allowed_html_tags' ), 'titleTagLevel' );
	}
}
