<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Supported_Blocks;
use Tests\Support\Classes\TestCase;
use WP_Block_Type_Registry;

/**
 * Covers that every Single Button attribute is classified as either a
 * site-level style setting or a setting no site value may set.
 */
final class SingleButtonAttributesTest extends TestCase {

	/**
	 * Single Button's site-level style settings.
	 */
	private const STYLE_ATTRIBUTES = [
		'style',
		'sizePreset',
		'gap',
		'width',
		'widthUnit',
		'widthType',
		'padding',
		'tabletPadding',
		'mobilePadding',
		'paddingUnit',
		'margin',
		'tabletMargin',
		'mobileMargin',
		'marginUnit',
		'color',
		'background',
		'gradient',
		'backgroundType',
		'textGradient',
		'textBackgroundType',
		'textGradientHover',
		'textBackgroundHoverType',
		'colorHover',
		'backgroundHover',
		'backgroundHoverType',
		'gradientHover',
		'borderStyle',
		'tabletBorderStyle',
		'mobileBorderStyle',
		'borderHoverStyle',
		'tabletBorderHoverStyle',
		'mobileBorderHoverStyle',
		'borderRadius',
		'tabletBorderRadius',
		'mobileBorderRadius',
		'borderRadiusUnit',
		'borderHoverRadius',
		'tabletBorderHoverRadius',
		'mobileBorderHoverRadius',
		'borderHoverRadiusUnit',
		'icon',
		'iconColor',
		'iconColorHover',
		'iconSide',
		'iconHover',
		'iconPadding',
		'iconPaddingUnit',
		'tabletIconPadding',
		'mobileIconPadding',
		'iconSize',
		'iconSizeUnit',
		'onlyIcon',
		'onlyText',
		'typography',
		'displayShadow',
		'displayHoverShadow',
		'shadow',
		'shadowHover',
		'textUnderline',
		'colorTransparent',
		'backgroundTransparent',
		'gradientTransparent',
		'backgroundTransparentType',
		'colorTransparentHover',
		'backgroundTransparentHover',
		'backgroundTransparentHoverType',
		'gradientTransparentHover',
		'borderTransparentStyle',
		'tabletBorderTransparentStyle',
		'mobileBorderTransparentStyle',
		'borderTransparentHoverStyle',
		'tabletBorderTransparentHoverStyle',
		'mobileBorderTransparentHoverStyle',
		'borderTransparentRadius',
		'tabletBorderTransparentRadius',
		'mobileBorderTransparentRadius',
		'borderTransparentRadiusUnit',
		'borderTransparentHoverRadius',
		'tabletBorderTransparentHoverRadius',
		'mobileBorderTransparentHoverRadius',
		'borderTransparentHoverRadiusUnit',
		'displayShadowTransparent',
		'displayHoverShadowTransparent',
		'shadowTransparent',
		'shadowTransparentHover',
		'colorSticky',
		'backgroundSticky',
		'gradientSticky',
		'backgroundStickyType',
		'colorStickyHover',
		'backgroundStickyHover',
		'backgroundStickyHoverType',
		'gradientStickyHover',
		'borderStickyStyle',
		'tabletBorderStickyStyle',
		'mobileBorderStickyStyle',
		'borderStickyHoverStyle',
		'tabletBorderStickyHoverStyle',
		'mobileBorderStickyHoverStyle',
		'borderStickyRadius',
		'tabletBorderStickyRadius',
		'mobileBorderStickyRadius',
		'borderStickyRadiusUnit',
		'borderStickyHoverRadius',
		'tabletBorderStickyHoverRadius',
		'mobileBorderStickyHoverRadius',
		'borderStickyHoverRadiusUnit',
		'displayShadowSticky',
		'displayHoverShadowSticky',
		'shadowSticky',
		'shadowStickyHover',
		'iconReveal',
	];

	public function testEveryAttributeIsAStyleOrAnExcludedAttribute(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/singlebtn' );
		$this->assertNotNull( $block );

		$registered = array_keys( WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/singlebtn' )->attributes );
		$excluded   = Supported_Blocks::excluded_attributes( $block );

		foreach ( $registered as $attribute ) {
			$this->assertTrue(
				in_array( $attribute, self::STYLE_ATTRIBUTES, true ) xor in_array( $attribute, $excluded, true ),
				"Classify kadence/singlebtn's `{$attribute}`: add it to the style attributes here, or to `site_styles_excluded_attributes()` and hide its control in the Kadence panel."
			);
		}
		$this->assertSame( [], array_values( array_diff( self::STYLE_ATTRIBUTES, $registered ) ), 'Style attributes the block no longer has.' );
	}
}
