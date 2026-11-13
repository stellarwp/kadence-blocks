<?php
/**
 * The selectors of the accordion CSS.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;


/**
 * The selectors of the accordion CSS. `{id}` stands for the block unique id.
 *
 * @since TBD
 */
final class Kadence_Blocks_Accordion_Selectors {

	/**
	 * The selectors by name.
	 *
	 * @since TBD
	 *
	 * @var array<string, string[]>
	 */
	private const SELECTORS = [
		'inner'             => [
			'.kt-accordion-id{id} .kt-accordion-inner-wrap',
		],
		'pane'              => [
			'.kt-accordion-id{id} .kt-accordion-inner-wrap .kt-accordion-pane:not(:first-child)',
		],
		'panel'             => [
			'.kt-accordion-id{id} .kt-accordion-panel-inner',
		],
		'header'            => [
			'.kt-accordion-id{id} > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header',
		],
		'icon_circle'       => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap .kt-blocks-accordion-icon-trigger:after',
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap .kt-blocks-accordion-icon-trigger:before',
		],
		'text'              => [
			'.kt-accordion-id{id} .kt-accordion-panel-inner',
			'.kt-accordion-id{id} .kt-accordion-panel-inner h1',
			'.kt-accordion-id{id} .kt-accordion-panel-inner h2',
			'.kt-accordion-id{id} .kt-accordion-panel-inner h3',
			'.kt-accordion-id{id} .kt-accordion-panel-inner h4',
			'.kt-accordion-id{id} .kt-accordion-panel-inner h5',
			'.kt-accordion-id{id} .kt-accordion-panel-inner h6',
		],
		'link'              => [
			'.kt-accordion-id{id} .kt-accordion-panel-inner a',
		],
		'link_hover'        => [
			'.kt-accordion-id{id} .kt-accordion-panel-inner a:hover',
		],
		'icon_basic'        => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger',
		],
		'hover_marks'       => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:after',
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-icon-trigger:before',
		],
		'hover_header'      => [
			'.kt-accordion-id{id} > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header:hover',
			'body:not(.hide-focus-outline) .kt-accordion-id{id} .kt-blocks-accordion-header:focus-visible',
		],
		'hover_circle'      => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-header-wrap .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after',
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-accordion-header-wrap .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before',
			'body:not(.hide-focus-outline) .kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion--visible .kt-blocks-accordion-icon-trigger:after',
			'body:not(.hide-focus-outline) .kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle ) .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:before',
		],
		'hover_basic'       => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-header-wrap .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger',
			'body:not(.hide-focus-outline) .kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-header-wrap .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger',
		],
		'hover_background'  => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-header-wrap .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:after',
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-header-wrap .kt-blocks-accordion-header:hover .kt-blocks-accordion-icon-trigger:before',
			'body:not(.hide-focus-outline) .kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-header-wrap .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:after',
			'body:not(.hide-focus-outline) .kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-accordion-header-wrap .kt-blocks-accordion-header:focus-visible .kt-blocks-accordion-icon-trigger:before',
		],
		'active_header'     => [
			'.kt-accordion-id{id} .kt-accordion-header-wrap .kt-blocks-accordion-header:focus-visible',
			'.kt-accordion-id{id} > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header.kt-accordion-panel-active',
		],
		'active_circle'     => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after',
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basiccircle ):not( .kt-accodion-icon-style-xclosecircle ):not( .kt-accodion-icon-style-arrowcircle )  > .kt-accordion-inner-wrap > .wp-block-kadence-pane > .kt-accordion-header-wrap > .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before',
		],
		'active_basic'      => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger',
		],
		'active_background' => [
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:after',
			'.kt-accordion-id{id}:not( .kt-accodion-icon-style-basic ):not( .kt-accodion-icon-style-xclose ):not( .kt-accodion-icon-style-arrow ) .kt-blocks-accordion-header.kt-accordion-panel-active .kt-blocks-accordion-icon-trigger:before',
		],
	];

	/**
	 * The selectors that share a rule.
	 *
	 * @since TBD
	 *
	 * @param string $name The name of the selectors.
	 *
	 * @return array
	 */
	public static function named( $name ): array {
		return self::SELECTORS[ $name ];
	}
}
