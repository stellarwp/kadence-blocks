<?php
/**
 * The sections of the overlay, the border, the mask, the shadows and the position of the image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The sections of the overlay, the border, the mask, the shadows and the position of the image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Style_Sections {

	/**
	 * The sections in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function sections(): array {
		return array_merge( self::overlay_sections(), self::border_sections(), self::mask_sections(), self::effect_sections() );
	}

	/**
	 * The sections of the overlay and the radius.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function overlay_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-image{id} .kb-image-has-overlay:after' ),
			new Kadence_Blocks_Image_Overlay_Opacity_Section(),
			new Kadence_Blocks_Css_Value_Section( 'mix-blend-mode', 'overlayBlendMode' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Overlay_Type_Condition( 'normal' ),
				[ new Kadence_Blocks_Css_Color_Section( 'background-color', 'overlay' ) ],
				[
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Image_Overlay_Type_Condition( 'gradient' ),
						[ new Kadence_Blocks_Css_Value_Section( 'background-image', 'overlayGradient' ) ],
						[]
					),
				]
			),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
		];
	}

	/**
	 * The sections of the border, the background color and the radius of the picture.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function border_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section( 'desktop', [] ),
			new Kadence_Blocks_Css_Selector_Section( '.kb-image{id} img.kb-img, .kb-image{id} .kb-img img' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Filled_Condition( 'borderColor' ),
				array_merge(
					[ new Kadence_Blocks_Css_Static_Section( 'border-style', 'solid' ), new Kadence_Blocks_Image_Border_Color_Section() ],
					self::border_width_sections()
				),
				[ new Kadence_Blocks_Css_Border_Styles_Section( 'borderStyle', true ) ]
			),
			new Kadence_Blocks_Css_Color_Section( 'background-color', 'backgroundColor' ),
			new Kadence_Blocks_Css_Measure_Section( 'border-radius', 'borderRadius', [ 'unit_key' => 'borderRadiusUnit' ] ),
		];
	}

	/**
	 * The sections of the border widths of every device.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function border_width_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section( 'desktop', [ new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthDesktop' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'tablet', [ new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthTablet' ) ] ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', [ new Kadence_Blocks_Image_Border_Width_Section( 'borderWidthMobile' ) ] ),
		];
	}

	/**
	 * The sections of the mask.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function mask_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Mask_Enabled_Condition(),
				[
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Image_Mask_Custom_Condition(),
						[ new Kadence_Blocks_Image_Mask_Custom_Section() ],
						[ new Kadence_Blocks_Image_Mask_Preset_Section() ]
					),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the shadows and the object position.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function effect_sections(): array {
		return [
			new Kadence_Blocks_Image_Box_Shadow_Section(),
			new Kadence_Blocks_Css_Enabled_Section(
				'displayDropShadow',
				[
					new Kadence_Blocks_Css_Choice_Section(
						new Kadence_Blocks_Image_Drop_Shadow_Condition(),
						[ new Kadence_Blocks_Image_Drop_Shadow_Section() ],
						[ new Kadence_Blocks_Css_Static_Section( 'filter', 'drop-shadow(0px 0px 14px rgba(0, 0, 0, 0.2) )' ) ]
					),
				]
			),
			new Kadence_Blocks_Css_Value_Section( 'object-position', 'imagePosition' ),
		];
	}
}
