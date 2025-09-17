<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-loop-taxonomies.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;
global $post;

$enabled = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['aboveCategories'] ) && ! $attributes['aboveCategories'] ? false : true );
$divider = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['categoriesDivider'] ) && $attributes['categoriesDivider'] ? $attributes['categoriesDivider'] : 'vline' );
$style   = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['categoriesStyle'] ) && $attributes['categoriesStyle'] ? $attributes['categoriesStyle'] : 'normal' );
if ( $enabled ) {
	switch ( $divider ) {
		case 'dot':
			$separator = ' &middot; ';
			break;
		case 'slash':
			/* translators: separator between taxonomy terms */
			$separator = _x( ' / ', 'list item separator', 'kadence-blocks' );
			break;
		case 'dash':
			/* translators: separator between taxonomy terms */
			$separator = _x( ' - ', 'list item separator', 'kadence-blocks' );
			break;
		default:
			/* translators: separator between taxonomy terms */
			$separator = _x( ' | ', 'list item separator', 'kadence-blocks' );
			break;
	}
	if ( 'pill' === $style ) {
		$separator = ' ';
	}
	?>
	<div class="entry-taxonomies">
		<span class="category-links term-links category-style-<?php echo esc_attr( $style ); ?>">
			<?php
				if (class_exists( 'Kadence\Theme' ) && $attributes['customKadenceArchiveColors']) {
					$post_id = get_the_ID();
					$categories = apply_filters( 'the_category_list', get_the_category(), $post_id );

					if( ! empty( $categories ) ) {
						foreach ( $categories as $key => $category ) {
							$color = get_term_meta( $category->term_id, 'archive_category_color', true );
							$hover_color = get_term_meta( $category->term_id, 'archive_category_hover_color', true );

							if ($color !== '' || $hover_color !== '') {
								echo '<style>';
								if ( $color !== '') {
									echo
										'.loop-entry.type-post .entry-taxonomies a.category-link-' . esc_attr( $category->slug ) . ' {
										' . ( $style === 'pill' ? 'background-color' : 'color') . ': ' . esc_attr( $color ) . ';
									}'
									;
								}
								if ( $hover_color !== '') {
									echo
										'.loop-entry.type-post .entry-taxonomies a.category-link-' . esc_attr( $category->slug )  . ':hover {
										' . ( $style === 'pill' ? 'background-color' : 'color') . ': ' . esc_attr( $hover_color ) . ';
									}'
									;
								}
								echo '</style>';
							}
							echo '<a href="' . esc_url( get_term_link( $category->term_id ) ) . '" class="category-link-' . esc_attr( $category->slug ) . '" rel="tag">' . esc_attr( $category->name) . '</a>';
							if ( $key < count($categories) - 1 ) {
								echo esc_html( $separator );
							}
						}
					}

				} else echo get_the_category_list( esc_html( $separator ), '', $post->ID ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
			?>
		</span>
	</div><!-- .entry-taxonomies -->
	<?php
}
