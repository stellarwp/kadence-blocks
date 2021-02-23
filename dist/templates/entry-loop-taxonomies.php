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
			$separator = _x( ' / ', 'list item separator', 'kadence' );
			break;
		case 'dash':
			/* translators: separator between taxonomy terms */
			$separator = _x( ' - ', 'list item separator', 'kadence' );
			break;
		default:
			/* translators: separator between taxonomy terms */
			$separator = _x( ' | ', 'list item separator', 'kadence' );
			break;
	}
	if ( 'pill' === $style ) {
		$separator = ' ';
	}
	?>
	<div class="entry-taxonomies">
		<span class="category-links term-links category-style-<?php echo esc_attr( $style ); ?>">
			<?php echo get_the_category_list( esc_html( $separator ), '', $post->ID ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</span>
	</div><!-- .entry-taxonomies -->
	<?php
}
