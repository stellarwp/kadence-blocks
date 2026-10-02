<?php
/**
 * Entry Template for Posts Block.
 *
 * This template can be overridden by copying it to yourtheme/kadence-blocks/entry-loop-title.php.
 *
 * @package Kadence Blocks
 */

/*
 * cspell:ignore yourtheme
 */

defined( 'ABSPATH' ) || exit;

$level    = isset( $attributes['titleFont'][0]['level'] ) ? absint( $attributes['titleFont'][0]['level'] ) : 0;
$html_tag = 'h' . ( $level >= 1 && $level <= 6 ? $level : 2 );


the_title( '<' . esc_attr( $html_tag ) . ' class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></' . esc_attr( $html_tag ) . '>' );
