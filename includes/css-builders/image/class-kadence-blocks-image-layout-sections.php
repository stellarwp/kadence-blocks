<?php
/**
 * The sections of the margin, the maximum width and the padding of the image.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-section.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-css-build-input.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/sections/loader.php';
require_once KADENCE_BLOCKS_PATH . 'includes/css-writers/loader.php';

/**
 * The sections of the margin, the maximum width and the padding of the image.
 *
 * @since TBD
 */
final class Kadence_Blocks_Image_Layout_Sections {

	/**
	 * The selector of the image.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ROOT = '.wp-block-kadence-image.kb-image{id}';

	/**
	 * The selector of an image with a ratio.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const RATIO = '.kb-image{id}.kb-image-is-ratio-size, .kb-image{id} .kb-image-is-ratio-size';

	/**
	 * The sections in the order they are written.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function sections(): array {
		return array_merge( self::margin_sections(), self::desktop_width_sections(), self::device_width_sections(), self::padding_sections() );
	}

	/**
	 * The sections of the margin.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function margin_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::ROOT . ':not(.kb-specificity-added):not(.kb-extra-specificity-added)' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Align_Condition( [ 'left', 'right' ], true ),
				[ new Kadence_Blocks_Css_Selector_Section( self::ROOT . ':not(.kb-specificity-added):not(.kb-extra-specificity-added) > figure' ) ],
				[]
			),
			new Kadence_Blocks_Css_Measure_Section(
				'margin',
				'marginDesktop',
				[
					'tablet_key' => 'marginTablet',
					'mobile_key' => 'marginMobile',
					'unit_key'   => 'marginUnit',
				]
			),
		];
	}

	/**
	 * The sections of the layer and the maximum width of desktop.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function desktop_width_sections(): array {
		return array_merge(
			[
				new Kadence_Blocks_Css_Selector_Section( self::ROOT ),
				new Kadence_Blocks_Css_Enabled_Section( 'zIndex', [ new Kadence_Blocks_Css_Static_Section( 'position', 'relative' ), new Kadence_Blocks_Css_Value_Section( 'z-index', 'zIndex' ) ] ),
			],
			self::ratio_sections(),
			self::alignment_sections()
		);
	}

	/**
	 * The sections of the maximum width of an image with a ratio.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function ratio_sections(): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_All_Condition( [ self::not_full_width(), new Kadence_Blocks_Image_Numeric_Condition( 'imgMaxWidth' ) ] ),
				[
					new Kadence_Blocks_Css_Selector_Section( self::RATIO ),
					new Kadence_Blocks_Image_Px_Section( 'max-width', 'imgMaxWidth' ),
					new Kadence_Blocks_Css_Static_Section( 'width', '100%' ),
					new Kadence_Blocks_Css_Selector_Section( '.wp-block-kadence-column > .kt-inside-inner-col > .kb-image{id}.kb-image-is-ratio-size, .wp-block-kadence-column > .kt-inside-inner-col > .kb-image{id} .kb-image-is-ratio-size' ),
					new Kadence_Blocks_Css_Static_Section( 'align-self', 'unset' ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the maximum width of an aligned image, and of one that is not.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function alignment_sections(): array {
		$is_number = new Kadence_Blocks_Image_Numeric_Condition( 'imgMaxWidth' );

		return [
			new Kadence_Blocks_Css_Choice_Section(
				self::aligned(),
				[
					new Kadence_Blocks_Css_Selector_Section( '.kb-image{id} figure' ),
					new Kadence_Blocks_Css_Choice_Section(
						$is_number,
						[
							new Kadence_Blocks_Image_Px_Section( 'max-width', 'imgMaxWidth' ),
							new Kadence_Blocks_Css_Selector_Section( '.kb-image{id} .image-is-svg, .kb-image{id} .image-is-svg img' ),
							new Kadence_Blocks_Css_Static_Section( 'width', '100%' ),
						],
						[]
					),
				],
				[ new Kadence_Blocks_Css_Choice_Section( self::not_full_width(), self::plain_sections( $is_number ), [] ) ]
			),
		];
	}

	/**
	 * The sections of the maximum width of an image that is not aligned.
	 *
	 * @since TBD
	 *
	 * @param Kadence_Blocks_Image_Numeric_Condition $is_number The condition that the maximum width is a number.
	 *
	 * @return array
	 */
	public static function plain_sections( Kadence_Blocks_Image_Numeric_Condition $is_number ): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-image{id}' ),
			new Kadence_Blocks_Css_Choice_Section(
				$is_number,
				[
					new Kadence_Blocks_Image_Px_Section( 'max-width', 'imgMaxWidth' ),
					new Kadence_Blocks_Css_Selector_Section( '.image-is-svg.kb-image{id}' ),
					new Kadence_Blocks_Css_Static_Section( 'flex', '0 1 100%' ),
					new Kadence_Blocks_Css_Selector_Section( '.image-is-svg.kb-image{id} img' ),
					new Kadence_Blocks_Css_Static_Section( 'width', '100%' ),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the maximum width of tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function device_width_sections(): array {
		return [
			new Kadence_Blocks_Css_Device_Section( 'tablet', self::device_sections( 'imgMaxWidthTablet' ) ),
			new Kadence_Blocks_Css_Device_Section( 'mobile', self::device_sections( 'imgMaxWidthMobile' ) ),
		];
	}

	/**
	 * The sections of the maximum width of one device.
	 *
	 * @since TBD
	 *
	 * @param string $attribute The attribute that stores the width.
	 *
	 * @return array
	 */
	public static function device_sections( string $attribute ): array {
		return [
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Image_Numeric_Condition( $attribute ),
				[
					new Kadence_Blocks_Css_Choice_Section(
						self::not_full_width(),
						[ new Kadence_Blocks_Css_Selector_Section( self::RATIO ), new Kadence_Blocks_Image_Px_Section( 'max-width', $attribute ), new Kadence_Blocks_Css_Static_Section( 'width', '100%' ) ],
						[]
					),
					new Kadence_Blocks_Css_Choice_Section(
						self::aligned(),
						[ new Kadence_Blocks_Css_Selector_Section( '.kb-image{id} figure' ), new Kadence_Blocks_Image_Px_Section( 'max-width', $attribute ) ],
						[
							new Kadence_Blocks_Css_Choice_Section(
								self::not_full_width(),
								[ new Kadence_Blocks_Css_Selector_Section( '.kb-image{id}' ), new Kadence_Blocks_Image_Px_Section( 'max-width', $attribute ) ],
								[]
							),
						]
					),
				],
				[]
			),
		];
	}

	/**
	 * The sections of the padding.
	 *
	 * @since TBD
	 *
	 * @return array
	 */
	public static function padding_sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( '.kb-image{id}:not(.kb-image-is-ratio-size) .kb-img, .kb-image{id}.kb-image-is-ratio-size' ),
			new Kadence_Blocks_Css_Measure_Section(
				'padding',
				'paddingDesktop',
				[
					'tablet_key' => 'paddingTablet',
					'mobile_key' => 'paddingMobile',
					'unit_key'   => 'paddingUnit',
				]
			),
		];
	}

	/**
	 * The condition that the image is neither wide nor full.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Image_Align_Condition
	 */
	public static function not_full_width(): Kadence_Blocks_Image_Align_Condition {
		return new Kadence_Blocks_Image_Align_Condition( [ 'wide', 'full' ], false );
	}

	/**
	 * The condition that the image is aligned to the center, the right or the left.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Image_Align_Condition
	 */
	public static function aligned(): Kadence_Blocks_Image_Align_Condition {
		return new Kadence_Blocks_Image_Align_Condition( [ 'center', 'right', 'left' ], true );
	}
}
