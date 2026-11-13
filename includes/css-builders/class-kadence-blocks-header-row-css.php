<?php
/**
 * Builds the CSS for the header row block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-block-context.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once __DIR__ . '/header-row/loader.php';

/**
 * Builds the CSS for the header row block by running one section after another.
 *
 * @since TBD
 */
final class Kadence_Blocks_Header_Row_Css {

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
			$this->context
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
			[ new Kadence_Blocks_Css_Sized_Dynamic_Section() ],
			$this->size_sections(),
			$this->background_sections(),
			[ $this->border_section() ],
			$this->spacing_sections(),
			[
				new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-row{id} .wp-block-kadence-header-column, .wp-block-kadence-header-row{id} .wp-block-kadence-header-section' ),
				new Kadence_Blocks_Css_Gap_Section( 'itemGap', 'gap', 'itemGapUnit', $this->arguments( 'itemGap' ) ),
				new Kadence_Blocks_Css_Custom_Section( '.wp-block-kadence-header-row{id}', 'kadenceBlockCSS' ),
			]
		);
	}

	/**
	 * The sections of the minimum height and the maximum width of the row.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function size_sections(): array {
		return array_merge(
			[ new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-row.wp-block-kadence-header-row{id} .kadence-header-row-inner' ) ],
			$this->dimension_sections( 'min-height', 'minHeight', 'minHeightUnit' ),
			$this->dimension_sections( 'max-width', 'maxWidth', 'maxWidthUnit' )
		);
	}

	/**
	 * The sections of a size on desktop, which is written when it is not empty, and on tablet and mobile, which are written when they are numbers.
	 *
	 * @since TBD
	 *
	 * @param string $property       The CSS property.
	 * @param string $name           The attribute of the size on desktop.
	 * @param string $unit_attribute The attribute that stores the unit.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function dimension_sections( string $property, string $name, string $unit_attribute ): array {
		return [
			new Kadence_Blocks_Css_Enabled_Section( $name, [ new Kadence_Blocks_Header_Row_Dimension_Css( $property, $name, $unit_attribute ) ] ),
			$this->numeric_dimension_section( 'tablet', $property, $name . 'Tablet', $unit_attribute ),
			$this->numeric_dimension_section( 'mobile', $property, $name . 'Mobile', $unit_attribute ),
		];
	}

	/**
	 * The section of a size of a device, which is written when it is a number.
	 *
	 * @since TBD
	 *
	 * @param string $device         The device.
	 * @param string $property       The CSS property.
	 * @param string $attribute      The attribute of the size on the device.
	 * @param string $unit_attribute The attribute that stores the unit.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function numeric_dimension_section( string $device, string $property, string $attribute, string $unit_attribute ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Numeric_Attribute_Condition( $attribute ),
			[ new Kadence_Blocks_Css_Device_Section( $device, [ new Kadence_Blocks_Header_Row_Dimension_Css( $property, $attribute, $unit_attribute ) ] ) ],
			[]
		);
	}

	/**
	 * The sections of the background variables of the row.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function background_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-row{id}' ),
			new Kadence_Blocks_Header_Row_Background_Css( 'background', '--kb-header-row-bg' ),
			new Kadence_Blocks_Header_Row_Background_Css( 'background', '--kb-stuck-header-bg' ),
			new Kadence_Blocks_Header_Row_Background_Css( 'backgroundTransparent', '--kb-transparent-header-row-bg' ),
		];
	}

	/**
	 * The section of the radius and the border: of the inner part of a contained row, of the row and its stuck state otherwise.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function border_section(): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Choice_Section(
			new Kadence_Blocks_Css_Strict_Condition( 'layout', 'contained' ),
			array_merge(
				[ new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-row{id} .kadence-header-row-inner' ) ],
				$this->border_sections()
			),
			array_merge(
				[ new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-row{id}, .wp-block-kadence-header-row{id}.item-is-stuck.item-is-stuck' ) ],
				$this->border_sections()
			)
		);
	}

	/**
	 * The sections of the radius and the border.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function border_sections(): array {
		return [
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', $this->arguments( 'borderRadius' ) ),
			new Kadence_Blocks_Css_Border_Styles_Section( 'border', false, $this->arguments( 'border' ) ),
		];
	}

	/**
	 * The sections of the padding and the margin of the inner part of the row.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function spacing_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-header-row{id} .kadence-header-row-inner' ),
			new Kadence_Blocks_Css_Measure_Section( 'padding', 'padding', $this->arguments( 'padding', 'paddingUnit' ) ),
			new Kadence_Blocks_Css_Measure_Section( 'margin', 'margin', $this->arguments( 'margin', 'marginUnit' ) ),
		];
	}

	/**
	 * The attributes of a measure on each device.
	 *
	 * @since TBD
	 *
	 * @param string      $name The attribute of the measure on desktop.
	 * @param string|null $unit The attribute that stores the unit, if there is one.
	 *
	 * @return array<string, string>
	 */
	private function arguments( string $name, ?string $unit = null ): array {
		$arguments = [
			'desktop_key' => $name,
			'tablet_key'  => $name . 'Tablet',
			'mobile_key'  => $name . 'Mobile',
		];

		if ( null !== $unit ) {
			$arguments['unit_key'] = $unit;
		}

		return $arguments;
	}
}
