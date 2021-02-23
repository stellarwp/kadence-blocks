<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;
?>
<article <?php post_class( 'entry content-bg loop-entry' ); ?>>
	<?php
		kadence_blocks_get_template( 'entry-loop-thumbnail.php', array( 'attributes' => $attributes ) );
	?>
	<div class="entry-content-wrap">
		<?php
		kadence_blocks_get_template( 'entry-loop-header.php', array( 'attributes' => $attributes ) );

		kadence_blocks_get_template( 'entry-summary.php', array( 'attributes' => $attributes ) );

		kadence_blocks_get_template( 'entry-loop-footer.php', array( 'attributes' => $attributes ) );
		?>
	</div>
</article>
