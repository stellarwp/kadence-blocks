<?php
/**
 * The sections that write the CSS of the subtitle of the tab titles.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';
require_once __DIR__ . '/class-kadence-blocks-tabs-subtitle-size.php';
require_once __DIR__ . '/class-kadence-blocks-tabs-subtitle-device-size.php';
require_once __DIR__ . '/class-kadence-blocks-tabs-subtitle-device-condition.php';
require_once __DIR__ . '/class-kadence-blocks-tabs-unit-value.php';
require_once __DIR__ . '/class-kadence-blocks-tabs-quad-pixels.php';

/**
 * The sections that write the CSS of the subtitle of the tab titles.
 *
 * @since TBD
 */
final class Kadence_Blocks_Tabs_Subtitle {

	/**
	 * The selector of the subtitles.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SELECTOR = '.kt-tabs-id{id} > .kt-tabs-title-list li .kt-title-sub-text, .kt-tabs-id{id} > .kt-tabs-content-wrap > .kt-tabs-accordion-title .kt-title-sub-text';

	/**
	 * The selector of the subtitles.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function selector() {
		return self::SELECTOR;
	}

	/**
	 * The sections of the font of the subtitle, on the settings of the subtitle font.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ),
			new Kadence_Blocks_Tabs_Subtitle_Size_Css( 'font-size', 'size', 'sizeType' ),
			new Kadence_Blocks_Tabs_Subtitle_Size_Css( 'line-height', 'lineHeight', 'lineType' ),
			new Kadence_Blocks_Tabs_Unit_Value_Css( 'letter-spacing', 'letterSpacing', 'px', null ),
			new Kadence_Blocks_Css_Value_Section( 'text-transform', 'textTransform' ),
			new Kadence_Blocks_Css_Value_Section( 'font-family', 'family' ),
			new Kadence_Blocks_Css_Value_Section( 'font-style', 'style' ),
			new Kadence_Blocks_Css_Value_Section( 'font-weight', 'weight' ),
			new Kadence_Blocks_Tabs_Quad_Pixels_Css( 'padding', 'padding' ),
			new Kadence_Blocks_Tabs_Quad_Pixels_Css( 'margin', 'margin' ),
		];
	}

	/**
	 * The sections of the sizes of the subtitle on a device, on the settings of the subtitle font.
	 *
	 * @since TBD
	 *
	 * @param int    $index  The position of the device: 1 tablet, 2 mobile.
	 * @param string $device The device.
	 *
	 * @return array
	 */
	public static function device_sections( $index, $device ): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Tabs_Subtitle_Device_Condition( $index ),
				[
					new Kadence_Blocks_Css_Device_Section(
						$device,
						[
							new Kadence_Blocks_Css_Selector_Section( self::SELECTOR ),
							new Kadence_Blocks_Tabs_Subtitle_Device_Size_Css( 'font-size', 'size', 'sizeType', $index ),
							new Kadence_Blocks_Tabs_Subtitle_Device_Size_Css( 'line-height', 'lineHeight', 'lineType', $index ),
						]
					),
				],
				[]
			),
		];
	}
}
