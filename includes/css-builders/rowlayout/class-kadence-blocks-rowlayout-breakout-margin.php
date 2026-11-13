<?php
/**
 * Writes the margin that moves a column of a full width row out of the content.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selector.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-environment.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-breakout-values.php';

/**
 * Writes the margin that moves a column of a full width row out of the content.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Breakout_Margin_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The sides: the attribute that asks for the breakout, the position of the column, the property and
	 * how the fallback is written.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const SIDES = [
		'left'  => [ 'breakoutLeft', 1, 'margin-inline-start', 'var(--breakout-negative-margin-left, calc( {padding} *-1 ) )' ],
		'right' => [ 'breakoutRight', 2, 'margin-inline-end', 'var(--breakout-negative-margin-right, calc( {padding} *-1 ))' ],
	];

	/**
	 * The ways to write the margin: what goes after the grid selector and after the column selector, and
	 * the kind of value.
	 *
	 * @since TBD
	 *
	 * @var array
	 */
	private const VARIANTS = [
		'desktop'   => [ '', '', 'calc' ],
		'wide'      => [ '', ':not(.specificity)', 'variable' ],
		'wide_only' => [ '', '', 'variable' ],
		'fallback'  => [ '', ':not(.specificity)', 'fallback' ],
		'tablet'    => [ ':not(.kt-tab-layout-row)', '', 'calc' ],
	];

	/**
	 * The way to write the margin.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $variant;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $variant The way to write the margin: `desktop`, `wide`, `wide_only`, `fallback` or `tablet`.
	 */
	public function __construct( $variant ) {
		$this->variant = $variant;
	}

	/**
	 * Write the margins.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		foreach ( self::SIDES as $side => $settings ) {
			if ( true === $input->attribute( $settings[0] ) ) {
				$this->write_side( $input, $side, $settings );
			}
		}
	}

	/**
	 * Write the margin of one side.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input    What the section needs to write its CSS.
	 * @param string                         $side     `left` or `right`.
	 * @param array                          $settings The settings of the side.
	 *
	 * @return void
	 */
	private function write_side( Kadence_Blocks_Css_Build_Input $input, $side, array $settings ): void {
		$variant = self::VARIANTS[ $this->variant ];
		$padding = $input->derived( 'breakout' )->padding( $side );
		$values  = [
			'calc'     => 'calc( ' . $padding . ' *-1 )',
			'variable' => 'var(--breakout-negative-margin-' . $side . ')',
			'fallback' => str_replace( '{padding}', $padding, $settings[3] ),
		];

		Kadence_Blocks_Rowlayout_Selector::set( $input, '{inner}' . $variant[0] . ' > .wp-block-kadence-column:nth-child(' . $settings[1] . ' of *:not(style))' . $variant[1] );
		$input->css()->add_property( $settings[2], $values[ $variant[2] ] );
	}
}
