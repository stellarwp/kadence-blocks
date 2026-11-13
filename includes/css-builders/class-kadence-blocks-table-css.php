<?php
/**
 * Builds the CSS for the table block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/table/loader.php';

/**
 * Builds the CSS for the table block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Table_Css {

	/**
	 * What this builder needs from the block.
	 *
	 * @since TBD
	 *
	 * @var Kadence_Blocks_Css_Block_Context
	 */
	private $context;

	/**
	 * Create the builder.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Css_Block_Context $context What this builder needs from the block.
	 */
	public function __construct( Kadence_Blocks_Css_Block_Context $context ) {
		$this->context = $context;
	}

	/**
	 * Build the block CSS.
	 *
	 * @since TBD
	 *
	 * @param array                                     $attributes      The block attributes.
	 * @param Kadence_Blocks_CSS|Kadence_Blocks_Pro_CSS $css             The CSS builder.
	 * @param string                                    $unique_id       The block unique id.
	 * @param string                                    $unique_style_id The unique id used for the style handle.
	 *
	 * @return string|null
	 */
	public function build( $attributes, $css, $unique_id, $unique_style_id ) {
		$input = new Kadence_Blocks_Css_Build_Input(
			$attributes,
			$css,
			$unique_id,
			$unique_style_id,
			$this->context,
			[ 'id' => esc_attr( $unique_id ) ]
		);

		$css->set_style_id( 'kb-' . $this->context->block_name() . $unique_style_id );

		foreach ( $this->sections() as $section ) {
			$section->write( $input );
		}

		return $css->css_output();
	}

	/**
	 * The sections of the block CSS, in the order they are written.
	 *
	 * The sections share one CSS builder, its current selector and its media state, so their order matters.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function sections(): array {
		return array_merge(
			[ new Kadence_Blocks_Table_Pro_Styles_Css( new Kadence_Blocks_Table_Site_Environment() ) ],
			$this->container_sections(),
			$this->column_sections(),
			$this->cell_sections(),
			$this->background_sections(),
			$this->border_sections()
		);
	}

	/**
	 * The sections of the typography, the spacing and the sizes of the container.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function container_sections(): array {
		return [
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container{id}' ),
			new Kadence_Blocks_Css_Typography_Section( 'dataTypography' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding' ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'maxWidth', 'max-width', 'maxWidthUnit' ),
			new Kadence_Blocks_Css_Responsive_Range_Section( 'maxHeight', 'max-height', 'maxHeighUnit' ),
			new Kadence_Blocks_Css_Item_Section( 'maxHeighUnit', 0, [ new Kadence_Blocks_Css_Static_Section( 'overflow-y', 'auto' ) ] ),
			new Kadence_Blocks_Css_Item_Section( 'maxWidthUnit', 0, [ new Kadence_Blocks_Css_Static_Section( 'overflow-x', 'auto' ) ] ),
		];
	}

	/**
	 * The sections of the widths of the columns, the height of the rows and the scrolling.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function column_sections(): array {
		return [
			new Kadence_Blocks_Table_Column_Settings_Css(),
			new Kadence_Blocks_Table_Selector_Css( '.kb-table{id} tr' ),
			new Kadence_Blocks_Css_Responsive_Size_Section( [ 'rowMinHeight', 'tabletRowMinHeight', 'mobileRowMinHeight' ], 'height', '' ),
			new Kadence_Blocks_Css_Enabled_Section( 'overflowXScroll', [ new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id}' ), new Kadence_Blocks_Css_Static_Section( 'overflow-x', 'scroll' ) ] ),
		];
	}

	/**
	 * The sections of the headers, the caption and the data cells.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function cell_sections(): array {
		return [
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} th' ),
			new Kadence_Blocks_Css_Typography_Section( 'headerTypography' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'cellPadding' ),
			new Kadence_Blocks_Css_Text_Align_Section(
				'headerAlign',
				[
					'desktop_key' => 'headerAlign',
					'tablet_key'  => 'headerAlignTablet',
					'mobile_key'  => 'headerAlignMobile',
				] 
			),
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} caption' ),
			new Kadence_Blocks_Css_Typography_Section( 'captionTypography' ),
			new Kadence_Blocks_Css_Text_Align_Section(
				'captionAlign',
				[
					'desktop_key' => 'captionAlign',
					'tablet_key'  => 'captionAlignTablet',
					'mobile_key'  => 'captionAlignMobile',
				] 
			),
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} td' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'cellPadding' ),
			new Kadence_Blocks_Css_Text_Align_Section(
				'textAlign',
				[
					'desktop_key' => 'textAlign',
					'tablet_key'  => 'textAlignTablet',
					'mobile_key'  => 'textAlignMobile',
				] 
			),
		];
	}

	/**
	 * The sections of the backgrounds of the rows and of the columns.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function background_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'evenOddBackground' ], [], [] ),
				$this->striped_sections(),
				$this->plain_sections()
			),
			new Kadence_Blocks_Table_Column_Backgrounds_Css( 'columnBackgrounds', '' ),
			new Kadence_Blocks_Table_Column_Backgrounds_Css( 'columnBackgroundsHover', ':hover' ),
		];
	}

	/**
	 * The sections of the backgrounds of the even and odd rows.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function striped_sections(): array {
		return [
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr:nth-of-type(even)' ),
			new Kadence_Blocks_Css_Fallback_Color_Section( 'background-color', 'backgroundColorEven', 'undefined' ),
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr:nth-of-type(odd)' ),
			new Kadence_Blocks_Css_Fallback_Color_Section( 'background-color', 'backgroundColorOdd', 'undefined' ),
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr:nth-of-type(odd):hover' ),
			new Kadence_Blocks_Css_Fallback_Color_Section( 'background-color', 'backgroundHoverColorOdd', 'undefined' ),
			new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr:nth-of-type(even):hover' ),
			new Kadence_Blocks_Css_Fallback_Color_Section( 'background-color', 'backgroundHoverColorEven', 'undefined' ),
		];
	}

	/**
	 * The sections of the background of every row, and of a row under the pointer.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function plain_sections(): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section( 'backgroundColorEven', [ new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr' ), new Kadence_Blocks_Css_Rendered_Color_Section( 'background-color', 'backgroundColorEven' ) ] ),
			new Kadence_Blocks_Css_Enabled_Section( 'backgroundHoverColorEven', [ new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr:hover' ), new Kadence_Blocks_Css_Rendered_Color_Section( 'background-color', 'backgroundHoverColorEven' ) ] ),
		];
	}

	/**
	 * The sections of the borders of the rows, or of the cells.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function border_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ 'borderOnRowOnly' ], [], [] ),
				[ new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} tr' ) ],
				[ new Kadence_Blocks_Table_Selector_Css( '.kb-table-container .kb-table{id} td, .kb-table{id} th' ) ]
			),
			new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle' ),
		];
	}
}
