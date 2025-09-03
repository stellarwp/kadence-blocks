<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;
$enabled_image = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['image'] ) && ! $attributes['image'] ? false : true );
?>
<li <?php post_class( 'kb-post-list-item' . ( ! $enabled_image ? ' kb-post-no-image' : '' ) ); ?>>
	<article class="entry content-bg loop-entry">
		<?php
			kadence_blocks_get_template( 'entry-loop-thumbnail.php', [ 'attributes' => $attributes ] );
		?>
		<div class="entry-content-wrap">
			<?php
			kadence_blocks_get_template( 'entry-loop-header.php', [ 'attributes' => $attributes ] );

			kadence_blocks_get_template( 'entry-summary.php', [ 'attributes' => $attributes ] );

			kadence_blocks_get_template( 'entry-loop-footer.php', [ 'attributes' => $attributes ] );
			?>
		</div>
	</article>
</li>
