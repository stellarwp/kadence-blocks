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
		the_excerpt();
		?>
	</div><!-- .entry-summary -->
	<?php
}
