<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-loop-thumbnail.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

if ( post_password_required() || ! post_type_supports( get_post_type(), 'thumbnail' ) || ! has_post_thumbnail() ) {
	return;
}

$enabled  = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['image'] ) && ! $attributes['image'] ? false : true );
$img_link = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['imageLink'] ) && ! $attributes['imageLink'] ? false : true );
$ratio    = apply_filters( 'kadence_blocks_posts_image_ratio', ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['imageRatio'] ) && $attributes['imageRatio'] ? $attributes['imageRatio'] : '2-3' ), $attributes );
$size     = apply_filters( 'kadence_blocks_posts_image_size', ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['imageSize'] ) && $attributes['imageSize'] ? $attributes['imageSize'] : 'medium_large' ), $attributes );

if ( $enabled ) {
	$alt = get_post_meta( get_post_thumbnail_id(), '_wp_attachment_image_alt', true );
	if ( $img_link ) {
		?>
		<a aria-hidden="true" tabindex="-1" role="presentation" class="post-thumbnail kadence-thumbnail-ratio-<?php echo esc_attr( $ratio ); ?>" href="<?php the_permalink(); ?>" aria-label="<?php the_title_attribute(); ?>">
			<div class="post-thumbnail-inner">
				<?php
				the_post_thumbnail(
					$size,
					[
						'alt' => $alt ? $alt : the_title_attribute(
							[
								'echo' => false,
							]
						),
					]
				);
				?>
			</div>
		</a><!-- .post-thumbnail -->
		<?php
	} else {
		?>
		<div class="post-thumbnail kadence-thumbnail-ratio-<?php echo esc_attr( $ratio ); ?>">
			<div class="post-thumbnail-inner">
				<?php
				the_post_thumbnail(
					$size,
					[
						'alt' => $alt ? $alt : the_title_attribute(
							[
								'echo' => false,
							]
						),
					]
				);
				?>
			</div>
		</div><!-- .post-thumbnail -->
		<?php
	}
}
