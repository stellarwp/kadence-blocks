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
<li class="kb-post-list-item">
	<article <?php post_class( 'entry content-bg loop-entry' . ( ! $enabled_image ? ' kb-post-no-image' : '' ) ); ?>>
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
