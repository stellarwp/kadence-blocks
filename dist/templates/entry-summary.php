<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-summary.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

$enabled = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['excerpt'] ) && ! $attributes['excerpt'] ? false : true );
if ( $enabled ) {
	?>
	<div class="entry-summary">
		<?php
		if ( isset( $attributes['excerptCustomLength'] ) && true === $attributes['excerptCustomLength'] ) {
			global $kadence_blocks_post_block_get_excerpt_length;
			$kadence_blocks_post_block_get_excerpt_length = ( ! empty( $attributes['excerptLength'] ) ? $attributes['excerptLength'] : 40 );
			add_filter( 'excerpt_length', 'kadence_blocks_post_block_get_excerpt_length', 20 );
			the_excerpt();
			remove_filter( 'excerpt_length', 'kadence_blocks_post_block_get_excerpt_length', 20 );
		} else {
			the_excerpt();
		}
		?>
	</div><!-- .entry-summary -->
	<?php
}
