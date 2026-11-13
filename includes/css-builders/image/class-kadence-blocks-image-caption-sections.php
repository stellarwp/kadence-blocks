<?php
/**
 * The sections of the caption.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The sections of the caption.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Caption_Sections {

	/**
	 * The sections in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Caption_Condition(),
				array_merge(
					[ new Kadence_Blocks_Css_Selector_Section( '.kb-image{id} figcaption' ), new Kadence_Blocks_Css_Scoped_Section( 'captionStyles', self::font_sections() ) ],
					self::device_sections( 1 ),
					self::device_sections( 2 )
				),
				[]
			),
		];
	}

	/**
	 * The sections of the font of the caption.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function font_sections(): array {
		return [
			new Kadence_Blocks_Css_Color_Section( 'color', 'color' ),
			new Kadence_Blocks_Css_Color_Section( 'background', 'background' ),
			new Kadence_Blocks_Image_Caption_Font_Size_Section(),
			new Kadence_Blocks_Image_Caption_Line_Height_Section(),
			new Kadence_Blocks_Image_Caption_Letter_Spacing_Section(),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' ),
			new Kadence_Blocks_Image_Caption_Font_Family_Section(),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'style' ),
			new Kadence_Blocks_Css_Value_Section( 'font-weight', 'weight' ),
		];
	}

	/**
	 * The section of the size and the line height on tablet, written when the device has some.
	 *
	 * @since TBD
	 *
	 * @param int $index The position of the device.
	 *
	 * @return array
	 */
	public static function device_sections( int $index ): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Caption_Device_Condition( $index ),
				[ new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Image_Caption_Device_Section( $index ) ] ) ],
				[]
			),
		];
	}
}
