<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-loop-taxonomies.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

$enabled                      = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['meta'] ) && ! $attributes['meta'] ? false : true );
$meta_divider                 = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['metaDivider'] ) && ! empty( $attributes['metaDivider'] ) ? $attributes['metaDivider'] : 'dot' );
$author                       = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['author'] ) && ! $attributes['author'] ? false : true );
$author_link                  = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['authorLink'] ) && $attributes['authorLink'] ? true : false );
$author_image                 = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['authorImage'] ) && $attributes['authorImage'] ? true : false );
$author_image_size            = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['authorImageSize'] ) && ! empty( $attributes['authorImageSize'] ) ? $attributes['authorImageSize'] : '25' );
$author_enable_label          = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['authorEnabledLabel'] ) && ! $attributes['authorEnabledLabel'] ? false : true );
$author_label                 = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['authorLabel'] ) && ! empty( $attributes['authorLabel'] ) ? $attributes['authorLabel'] : __( 'By', 'kadence-blocks' ) );
$date                         = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['date'] ) && ! $attributes['date'] ? false : true );
$date_enable_label            = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['dateEnabledLabel'] ) && $attributes['dateEnabledLabel'] ? true : false );
$date_label                   = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['dateLabel'] ) && ! empty( $attributes['dateLabel'] ) ? $attributes['dateLabel'] : __( 'Posted on', 'kadence-blocks' ) );
$date_updated                 = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['dateUpdated'] ) && $attributes['dateUpdated'] ? true : false );
$date_updated_enable_label    = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['dateUpdatedEnabledLabel'] ) && $attributes['dateUpdatedEnabledLabel'] ? true : false );
$date_updated_label           = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['dateUpdatedLabel'] ) && ! empty( $attributes['dateUpdatedLabel'] ) ? $attributes['dateUpdatedLabel'] : __( 'Updated on', 'kadence-blocks' ) );
$meta_categories              = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['metaCategories'] ) && $attributes['metaCategories'] ? true : false );
$meta_categories_enable_label = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['categoriesEnabledLabel'] ) && $attributes['categoriesEnabledLabel'] ? true : false );
$meta_categories_label        = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['metaCategoriesLabel'] ) && ! empty( $attributes['metaCategoriesLabel'] ) ? $attributes['metaCategoriesLabel'] : __( 'Posted in', 'kadence-blocks' ) );
$meta_comments                = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['comments'] ) && $attributes['comments'] ? true : false );

if ( $enabled ) {
	$post_type_obj = get_post_type_object( get_post_type() );
	?>
	<div class="entry-meta entry-meta-divider-<?php echo esc_attr( $meta_divider ); ?>">
	<?php
	do_action( 'kadence_before_loop_entry_meta' );
	if ( $author ) {
		$author_string = '';
		// Show author only if the post type supports it.
		if ( post_type_supports( $post_type_obj->name, 'author' ) ) {
			$author_id = get_post_field( 'post_author', get_the_ID() );
			if ( $author_link ) {
				$author_string = sprintf(
					'<span class="author vcard"><a class="url fn n" href="%1$s">%2$s</a></span>',
					esc_url( get_author_posts_url( $author_id ) ),
					esc_html( get_the_author_meta( 'display_name', $author_id ) )
				);
			} else {
				$author_string = sprintf(
					'<span class="author vcard"><span class="fn n">%1$s</span></span>',
					esc_html( get_the_author_meta( 'display_name', $author_id ) )
				);
			}
		}
		if ( ! empty( $author_string ) ) {
			$author_output = '<span class="posted-by">';
			if ( $author_image ) {
				$author_output .= '<span class="author-avatar"' . ( $author_image_size && 25 !== $author_image_size ? ' style="width:' . esc_attr( $author_image_size ) . 'px; height:' . esc_attr( $author_image_size ) . 'px;"' : '' ) .'>';
				if ( $author_link ) {
					$author_output .= sprintf(
						'<a class="author-image" href="%1$s">%2$s</a>',
						esc_url( get_author_posts_url( $author_id ) ),
						get_avatar( $author_id, ( 2 * $author_image_size ) )
					);
				} else {
					$author_output .= sprintf(
						'<span class="author-image">%1$s</span>',
						get_avatar( $author_id, ( 2 * $author_image_size ) )
					);
				}
				$author_output .= '<span class="image-size-ratio"></span>';
				$author_output .= '</span>';
			}
			if ( $author_enable_label ) {
				$author_output .= '<span class="meta-label">' . esc_html( $author_label ) . '</span>';
			}
			$author_output .= $author_string;
			$author_output .= '</span>';
			echo apply_filters( 'kadence_author_meta_output', $author_output ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		}
	}
	if ( $date ) {
		$time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
		if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
			$time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
		}

		$time_string = sprintf(
			$time_string,
			esc_attr( get_the_date( 'c' ) ),
			esc_html( get_the_date() ),
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);
		if ( ! empty( $time_string ) ) {
			?>
			<span class="posted-on">
				<?php
				if ( $date_enable_label ) {
					echo '<span class="meta-label">' . esc_html( $date_label ) . '</span>';
				}
				echo $time_string; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</span>
			<?php
		}
	}
	if ( $date_updated ) {
		$time_string = sprintf(
			'<time class="entry-date published updated" datetime="%1$s">%2$s</time>',
			esc_attr( get_the_modified_date( 'c' ) ),
			esc_html( get_the_modified_date() )
		);
		if ( ! empty( $time_string ) ) {
			?>
			<span class="updated-on">
				<?php
				if ( $date_updated_enable_label ) {
					echo '<span class="meta-label">' . esc_html( $date_updated_label ) . '</span>';
				}
				echo $time_string; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</span>
			<?php
		}
	}
	if ( $meta_categories ) {
		if ( 'post' === get_post_type() ) {
			/* translators: separator between taxonomy terms */
			$separator = _x( ', ', 'list item separator', 'kadence-blocks' );
			?>
			<span class="category-links">
				<?php
				if ( $meta_categories_enable_label ) {
					echo '<span class="meta-label">' . esc_html( $meta_categories_label ) . '</span>';
				}
				echo '<span class="category-link-items">' . get_the_category_list( esc_html( $separator ), '', get_the_ID() ) . '</span>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				?>
			</span>
			<?php
		}
	}
	if ( $meta_comments ) {
		echo '<div class="meta-comments">';
		echo '<a class="meta-comments-link anchor-scroll" href="' . esc_url( get_the_permalink() ) . '#comments">';
		if ( '1' === get_comments_number() ) {
			echo esc_html( get_comments_number() ) . ' ' . esc_html__( 'Comment', 'kadence-blocks' );
		} else {
			echo esc_html( get_comments_number() ) . ' ' . esc_html__( 'Comments', 'kadence-blocks' );
		}
		echo '</a>';
		echo '</div>';
	}
	do_action( 'kadence_after_loop_entry_meta' );
	?>
	</div><!-- .entry-meta -->
	<?php
}
