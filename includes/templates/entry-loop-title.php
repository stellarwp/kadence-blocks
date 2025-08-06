<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-loop-title.php.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

$html_tag          = ( isset( $attributes ) && is_array( $attributes ) && isset( $attributes['titleFont'] ) && is_array( $attributes['titleFont'] ) && isset( $attributes['titleFont'][0] ) && isset( $attributes['titleFont'][0]['level'] ) && ! empty( $attributes['titleFont'][0]['level'] ) ? 'h' . $attributes['titleFont'][0]['level'] : 'h2' );
$enabled_read_more = ( isset( $attributes['readmore'] ) && ! $attributes['readmore'] ? false : true );
$link_role         = $enabled_read_more ? ' aria-hidden="true" tabindex="-1" role="presentation"' : '';

the_title( '<' . esc_attr( $html_tag ) . ' class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark"' . $link_role . '>', '</a></' . esc_attr( $html_tag ) . '>' );
