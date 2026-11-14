<?php
/**
 * Builds the CSS for the spacer block.
 *
 * @package Kadence Blocks
 */

defined( 'ABSPATH' ) || exit;

/**
 * Builds the CSS for the spacer block.
 *
 * @since TBD
 */
final class Kadence_Blocks_Spacer_Css extends Kadence_Blocks_Css_Block_Builder {

	/**
	 * The selector of the spacer.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SPACER = '.wp-block-kadence-spacer.kt-block-spacer-{id} .kt-block-spacer';

	/**
	 * The selector of the stripe divider.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const STRIPE = '.wp-block-kadence-spacer.kt-block-spacer-{id} .kt-divider-stripe';

	/**
	 * The selector of the line divider.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LINE = '.wp-block-kadence-spacer.kt-block-spacer-{id} .kt-divider';

	/**
	 * Values worked out once from the attributes, for the sections to read.
	 *
	 * @since TBD
	 *
	 * @param array  $attributes The block attributes.
	 * @param string $unique_id  The block unique id.
	 *
	 * @return array
	 */
	protected function derived( $attributes, $unique_id ): array {
		return [ 'width_units' => Kadence_Blocks_Spacer_Width_Units::resolve( $attributes ) ];
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
	protected function sections(): array {
		return [
			new Kadence_Blocks_Css_Selector_Section( self::SPACER ),
			new Kadence_Blocks_Spacer_Height_Css(),
			$this->device_height( 'tablet', 'tabletSpacerHeight' ),
			$this->device_height( 'mobile', 'mobileSpacerHeight' ),
			new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Strict_Condition( 'dividerStyle', 'stripe' ),
				$this->stripe_sections(),
				$this->line_sections()
			),
		];
	}

	/**
	 * The sections of a stripe divider.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function stripe_sections(): array {
		return array_merge(
			[
				new Kadence_Blocks_Css_Selector_Section( self::STRIPE ),
				new Kadence_Blocks_Spacer_Stripe_Height_Css(),
				new Kadence_Blocks_Spacer_Divider_Width_Css(),
			],
			$this->device_dividers( self::STRIPE, 'height', new Kadence_Blocks_Spacer_Site_Environment() )
		);
	}

	/**
	 * The sections of a line divider.
	 *
	 * @since TBD
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function line_sections(): array {
		return array_merge(
			[
				new Kadence_Blocks_Css_Selector_Section( self::LINE ),
				new Kadence_Blocks_Css_Enabled_Section(
					'dividerHeight',
					[
						new Kadence_Blocks_Spacer_Border_Width_Css(),
						new Kadence_Blocks_Spacer_Blur_Fix_Css(),
					]
				),
				new Kadence_Blocks_Spacer_Color_Css(),
				new Kadence_Blocks_Spacer_Divider_Width_Css(),
				new Kadence_Blocks_Css_Value_Section( 'border-top-style', 'dividerStyle' ),
			],
			$this->device_dividers( self::LINE, 'border-top-width', null )
		);
	}

	/**
	 * The height of the spacer on a device, when the editor saved one.
	 *
	 * @since TBD
	 *
	 * @param string $device    The device, `tablet` or `mobile`.
	 * @param string $attribute The attribute that stores the height.
	 *
	 * @return Kadence_Blocks_Css_Section
	 */
	private function device_height( string $device, string $attribute ): Kadence_Blocks_Css_Section {
		return new Kadence_Blocks_Css_Enabled_Section(
			$attribute,
			[
				new Kadence_Blocks_Css_Device_Section(
					$device,
					[
						new Kadence_Blocks_Css_Selector_Section( self::SPACER ),
						new Kadence_Blocks_Spacer_Device_Height_Css( $attribute ),
					]
				),
			]
		);
	}

	/**
	 * The height and the width of a divider on tablet and mobile.
	 *
	 * @since TBD
	 *
	 * @param string                                 $selector    The selector of the divider.
	 * @param string                                 $property    The CSS property that stores the height.
	 * @param Kadence_Blocks_Spacer_Environment|null $environment What the site offers, when the stripe falls back to the height of the spacer.
	 *
	 * @return Kadence_Blocks_Css_Section[]
	 */
	private function device_dividers( string $selector, string $property, $environment ): array {
		$sections = [];

		foreach ( [ 'tablet', 'mobile' ] as $device ) {
			$sections[] = new Kadence_Blocks_Css_Choice_Section(
				new Kadence_Blocks_Css_Legacy_Condition( [ $device . 'DividerHeight', $device . 'DividerWidth' ], [], [] ),
				[
					new Kadence_Blocks_Css_Device_Section(
						$device,
						[
							new Kadence_Blocks_Css_Selector_Section( $selector ),
							new Kadence_Blocks_Spacer_Device_Divider_Height_Css( $device, $property, $environment ),
							new Kadence_Blocks_Spacer_Device_Divider_Width_Css( $device . 'DividerWidth' ),
						]
					),
				],
				[]
			);
		}

		return $sections;
	}
}
