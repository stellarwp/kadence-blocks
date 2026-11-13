<?php
/**
 * Writes the template of the grid of columns.
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
require_once __DIR__ . '/class-kadence-blocks-rowlayout-selectors.php';
require_once __DIR__ . '/class-kadence-blocks-rowlayout-columns.php';

/**
 * Writes the template of the grid of columns.
 *
 * @since TBD
 */
final class Kadence_Blocks_Rowlayout_Grid_Css implements Kadence_Blocks_Css_Section {

	/**
	 * The device whose layout the grid uses.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $layout;

	/**
	 * Where the widths come from.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $widths;

	/**
	 * The device whose gap the grid uses.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private $gap;

	/**
	 * Create the section.
	 *
	 * @since TBD
	 *
	 * @param string $layout The device whose layout the grid uses.
	 * @param string $widths Where the widths come from: `desktop`, `tablet`, `mobile` or `tablet_inherit`.
	 * @param string $gap    The device whose gap the grid uses.
	 */
	public function __construct( $layout, $widths, $gap ) {
		$this->layout = $layout;
		$this->widths = $widths;
		$this->gap    = $gap;
	}

	/**
	 * Write the template.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Build_Input $input What the section needs to write its CSS.
	 *
	 * @return void
	 */
	public function write( Kadence_Blocks_Css_Build_Input $input ): void {
		$columns = $input->derived( 'columns' );
		$css     = $input->css();
		$gap     = $css->render_row_gap_property( $input->attributes(), [ 'columnGutter', 'tabletGutter', 'mobileGutter' ], $this->gap, 'customGutter', 'gutterType' );
		$grid    = $input->context()->call(
			'get_template_columns',
			$css,
			$columns->count(),
			$columns->layout_for( $this->layout ),
			$input->derived( 'selectors' )->inner(),
			$gap,
			...$columns->widths_for( $input, $this->widths )
		);

		$css->add_property( 'grid-template-columns', $grid );
	}
}
