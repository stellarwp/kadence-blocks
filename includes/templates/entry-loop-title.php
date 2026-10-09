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

$level    = filter_var(
	$attributes['titleFont'][0]['level'] ?? null,
	FILTER_VALIDATE_INT,
	[
		'options' => [
			'min_range' => 1,
			'max_range' => 6,
		],
	]
);
$html_tag = 'h' . ( false !== $level ? $level : 2 );


the_title( '<' . esc_attr( $html_tag ) . ' class="entry-title"><a href="' . esc_url( get_permalink() ) . '" rel="bookmark">', '</a></' . esc_attr( $html_tag ) . '>' );
