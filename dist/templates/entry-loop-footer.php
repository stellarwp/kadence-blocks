<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-loop-footer.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

?>
<footer class="entry-footer">
	<?php
	$enabled = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['readmore'] ) && ! $attributes['readmore'] ? false : true );
	$label = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['readmoreLabel'] ) && ! empty( $attributes['readmoreLabel'] ) ? $attributes['readmoreLabel'] : esc_html__( 'Read More', 'kadence-blocks' ) );
	if ( $enabled ) {
		?>
		<div class="entry-actions">
			<p class="more-link-wrap">
				<a href="<?php the_permalink(); ?>" class="post-more-link">
					<?php
						echo esc_html( $label );
						echo wp_kses(
							'<span class="screen-reader-text"> ' . get_the_title() . '</span>',
							array(
								'span' => array(
									'class' => array(),
								),
							)
						);
						kadence_blocks_print_icon( 'arrow-right-alt' );
					?>
				</a>
			</p>
		</div><!-- .entry-actions -->
		<?php
	}
	?>
</footer><!-- .entry-footer -->