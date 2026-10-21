<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use Generator;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Legacy_Group_Attributes;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Prints_Site_Rules;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Supported_Blocks;
use Tests\Support\Classes\TestCase;
use WP_Block_Type_Registry;

/**
 * Covers the blocks that take site-level styles.
 */
final class SupportedBlocksTest extends TestCase {

	public function testSingleButtonDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/singlebtn' );

		$this->assertNotNull( $block );
		$this->assertSame( 'kadence/singlebtn', $block->get_name() );
		$this->assertSame( 'singlebtn', $block->get_slug() );
		$excluded = Supported_Blocks::excluded_attributes( $block );
		foreach ( [ 'text', 'link', 'target', 'download', 'noFollow', 'sponsored', 'hideLink', 'label', 'buttonRole', 'iconTitle', 'tooltip', 'tooltipPlacement', 'isSubmit' ] as $content ) {
			$this->assertContains( $content, $excluded, "kadence/singlebtn: `{$content}` describes one button; mark it as content in block.json." );
		}
		foreach ( [ 'background', 'sizePreset', 'borderRadius', 'typography', 'icon' ] as $style ) {
			$this->assertNotContains( $style, $excluded );
		}
		$this->assertSame(
			[
				'background' => 'color.background',
				'color'      => 'color.text',
			],
			$block->site_styles_attributes_map()
		);
		$this->assertTrue( $block->site_styles_supports()['color']['__experimentalSkipSerialization'] );
		$this->assertNotEmpty( $block->site_styles_selectors()['root'] );
	}

	public function testEverySupportedBlockExcludesTheIdentifiers(): void {
		foreach ( $this->container->get( Supported_Blocks::class )->all() as $name => $block ) {
			$excluded = Supported_Blocks::excluded_attributes( $block );

			foreach ( [ 'uniqueID', 'anchor', 'inQueryBlock', 'noCustomDefaults', 'metadata', 'lock', 'className', 'kadenceDynamic', 'kbPreset', 'kbPalette' ] as $identifier ) {
				$this->assertContains( $identifier, $excluded, "{$name}: `{$identifier}` must not be stored site-wide." );
			}
		}
	}

	public function testEverySupportedBlockMapsOnlyColorPaths(): void {
		$blocks = $this->container->get( Supported_Blocks::class )->all();

		$this->assertNotEmpty( $blocks );
		foreach ( $blocks as $name => $block ) {
			$this->assertSame( $name, $block->get_name() );
			foreach ( $block->site_styles_attributes_map() as $attribute => $path ) {
				// The Kadence panel converts only colors between core's and Kadence's values.
				$this->assertMatchesRegularExpression( '/^color\.[A-Za-z]+$/', $path, "{$name}: {$attribute} maps to {$path}, which isn't a color." );
			}
		}
	}

	/**
	 * Every attribute a supported block lists for the overlay exists on the block and is never excluded.
	 *
	 * @return void
	 */
	public function testEveryOverlayAttributeIsAStoredAttributeOfItsBlock(): void {
		foreach ( $this->container->get( Supported_Blocks::class )->all() as $name => $block ) {
			$attributes = WP_Block_Type_Registry::get_instance()->get_registered( $name )->attributes;
			$excluded   = Supported_Blocks::excluded_attributes( $block );

			foreach ( $block->site_styles_overlay_attributes() as $attribute ) {
				$this->assertArrayHasKey( $attribute, $attributes, "{$name}: the overlay lists {$attribute}, which the block doesn't have." );
				$this->assertNotContains( $attribute, $excluded, "{$name}: the overlay lists {$attribute}, which is never stored site-wide." );
			}
		}
	}

	public function testEveryScopedBlockExcludesItsScopeAndScopesOnlyItsAttributes(): void {
		$scoped = array_filter(
			$this->container->get( Supported_Blocks::class )->all(),
			static fn( $block ): bool => $block instanceof Scopes_Site_Styles
		);

		$this->assertArrayHasKey( 'kadence/singlebtn', $scoped );
		foreach ( $scoped as $name => $block ) {
			$attributes = WP_Block_Type_Registry::get_instance()->get_registered( $name )->attributes;

			$this->assertContains( $block->site_styles_scope_attribute(), Supported_Blocks::excluded_attributes( $block ), "{$name}: the scope attribute must not be stored site-wide." );
			foreach ( $block->site_styles_scoped_attributes() as $style => $names ) {
				foreach ( $names as $attribute ) {
					$this->assertArrayHasKey( $attribute, $attributes, "{$name}: {$style} scopes {$attribute}, which the block doesn't have." );
				}
			}
		}
	}

	public function testSingleButtonScopesSiteValuesByStyle(): void {
		$scopes = $this->container->get( Supported_Blocks::class )->get( 'kadence/singlebtn' )->site_styles_scoped_attributes();

		$this->assertArrayNotHasKey( 'fill', $scopes );
		$this->assertContains( 'typography', $scopes['outline'] );
		$this->assertNotContains( 'background', $scopes['outline'] );
		$this->assertNotContains( 'color', $scopes['outline'] );
		$this->assertSame( [], $scopes['inherit'] );
		$this->assertSame( [], $scopes['inherit-secondary'] );
	}

	public function testAnUnsupportedBlockGivesNothing(): void {
		$this->assertNull( $this->container->get( Supported_Blocks::class )->get( 'kadence/advancedheading' ) );
	}

	/**
	 * Spacer takes its heights, widths and divider color through the overlay, in four groups, scoped by its
	 * divider style, with no core surface and no site rules, so its per-instance settings are never stored.
	 *
	 * @return void
	 */
	public function testSpacerDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/spacer' );

		$this->assertInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 13, $block->site_styles_overlay_attributes() );
		$this->assertSame( $block->site_styles_overlay_attributes(), array_merge( ...$block->site_styles_attribute_groups() ) );
		foreach ( [ 'dividerStyle', 'dividerEnable', 'hAlign', 'rotate', 'strokeWidth', 'strokeGap', 'vsdesk' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
		$this->assertSame( [ 'stripe' ], array_keys( $block->site_styles_scoped_attributes() ) );
		$this->assertNotContains( 'dividerColor', $block->site_styles_scoped_attributes()['stripe'] );
		$this->assertNotContains( 'dividerHeight', $block->site_styles_scoped_attributes()['stripe'] );
	}

	/**
	 * Section takes its padding, min height, background, borders, radius, shadows and text colors through the
	 * overlay, in nine groups, with no scope, no site rules and no core surface, and keeps its layout,
	 * structure and behavior settings per block.
	 *
	 * @return void
	 */
	public function testSectionDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/column' );

		$this->assertNotNull( $block );
		$this->assertSame( 'column', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 33, $block->site_styles_overlay_attributes() );
		$this->assertCount( 9, $block->site_styles_attribute_groups() );
		$this->assertInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertSame( [ 'padding', 'borderStyle', 'borderHoverStyle' ], array_keys( $block->site_styles_legacy_group_attributes() ) );
		$this->assertSame( array_values( array_unique( $block->site_styles_overlay_attributes() ) ), $block->site_styles_overlay_attributes() );
		foreach ( [ 'margin', 'textAlign', 'maxWidth', 'direction', 'htmlTag', 'zIndex', 'sticky', 'backgroundType', 'backgroundImg', 'overlay', 'topPadding', 'borderWidth', 'kbVersion', 'templateLock' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Show More takes its collapsed height, fade, padding and margin through the overlay, in four groups,
	 * with no scope, no site rules and no core surface, and keeps its expand behavior per block.
	 *
	 * @return void
	 */
	public function testShowMoreDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/show-more' );

		$this->assertNotNull( $block );
		$this->assertSame( 'show-more', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 14, $block->site_styles_overlay_attributes() );
		$this->assertSame( $block->site_styles_overlay_attributes(), array_merge( ...$block->site_styles_attribute_groups() ) );
		foreach ( [ 'showHideMore', 'defaultExpandedDesktop', 'defaultExpandedTablet', 'defaultExpandedMobile', 'align', 'id', 'inQueryBlock' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Row Layout takes its padding, margin, gutters, max width, border, radius, shadow, background color and
	 * text colors through the overlay, in eight groups, with no scope, no site rules and no core surface, and
	 * keeps its structure, layout, media and behavior settings per block.
	 *
	 * @return void
	 */
	public function testRowLayoutDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/rowlayout' );

		$this->assertNotNull( $block );
		$this->assertSame( 'rowlayout', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 35, $block->site_styles_overlay_attributes() );
		$this->assertCount( 8, $block->site_styles_attribute_groups() );
		$this->assertInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertSame(
			[
				'padding'     => [ 'topPadding', 'rightPadding', 'bottomPadding', 'leftPadding', 'topPaddingM', 'rightPaddingM', 'bottomPaddingM', 'leftPaddingM' ],
				'margin'      => [ 'topMargin', 'bottomMargin', 'topMarginT', 'bottomMarginT', 'topMarginM', 'bottomMarginM' ],
				'borderStyle' => [ 'border', 'tabletBorder', 'mobileBorder', 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ],
			],
			$block->site_styles_legacy_group_attributes()
		);
		$this->assertSame( array_values( array_unique( $block->site_styles_overlay_attributes() ) ), $block->site_styles_overlay_attributes() );
		foreach ( [ 'kbVersion', 'columns', 'colLayout', 'firstColumnWidth', 'topPadding', 'topMarginT', 'border', 'borderWidth', 'tabletBorder', 'bgColorClass', 'backgroundSettingTab', 'bgImg', 'gradient', 'overlay', 'topSep', 'minHeight', 'verticalAlignment', 'inheritMaxWidth', 'columnsInnerHeight', 'breakoutLeft', 'zIndex', 'htmlTag', 'vsdesk', 'rcpAccess', 'templateLock' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Count Up takes its title and number fonts, colors, alignment, min height, padding and margin through
	 * the overlay, in ten groups, with no scope, no site rules and no core surface, and keeps its numbers, timing and
	 * title toggle per block.
	 *
	 * @return void
	 */
	public function testCountUpDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/countup' );

		$this->assertNotNull( $block );
		$this->assertSame( 'countup', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertNotInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 24, $block->site_styles_overlay_attributes() );
		$this->assertCount( 10, $block->site_styles_attribute_groups() );
		$this->assertSame( array_values( array_unique( $block->site_styles_overlay_attributes() ) ), $block->site_styles_overlay_attributes() );
		foreach ( [ 'title', 'displayTitle', 'start', 'end', 'prefix', 'suffix', 'duration', 'separator', 'decimal', 'decimalSpaces', 'titleHoverColor', 'numberHoverColor' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Info Box takes its container, title and text styles through the overlay, in fifteen groups, with the
	 * older border and background attributes standing in for their groups, no scope, no site rules and no
	 * core surface, and keeps its content, media, Learn More and layout settings per box.
	 *
	 * @return void
	 */
	public function testInfoBoxDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/infobox' );

		$this->assertNotNull( $block );
		$this->assertSame( 'infobox', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 48, $block->site_styles_overlay_attributes() );
		$this->assertCount( 15, $block->site_styles_attribute_groups() );
		$this->assertSame(
			[
				'containerBackground'      => [ 'containerBackgroundOpacity' ],
				'containerHoverBackground' => [ 'containerHoverBackgroundOpacity' ],
				'borderStyle'              => [ 'containerBorder', 'containerBorderWidth', 'containerBorderRadius' ],
				'borderRadius'             => [ 'containerBorder', 'containerBorderWidth', 'containerBorderRadius' ],
				'borderHoverStyle'         => [ 'containerHoverBorder', 'containerBorderWidth' ],
				'borderHoverRadius'        => [ 'containerHoverBorder', 'containerBorderRadius' ],
			],
			$block->site_styles_legacy_group_attributes()
		);
		$this->assertSame( array_values( array_unique( $block->site_styles_overlay_attributes() ) ), $block->site_styles_overlay_attributes() );
		foreach ( [ 'title', 'contentText', 'link', 'mediaType', 'mediaIcon', 'mediaStyle', 'mediaNumber', 'learnMoreStyles', 'hAlign', 'mediaAlign', 'imageRatio', 'titleTagType', 'fullHeight', 'kbVersion', 'containerBorder', 'containerBorderOpacity' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Countdown takes its container and count item styles and its number and label colors and fonts through
	 * the overlay, in nine groups, with no scope, no site rules and no core surface, and keeps its timing,
	 * content, pre and post text, layout and visibility settings per block.
	 *
	 * @return void
	 */
	public function testCountdownDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/countdown' );

		$this->assertNotNull( $block );
		$this->assertSame( 'countdown', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertNotInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 28, $block->site_styles_overlay_attributes() );
		$this->assertCount( 9, $block->site_styles_attribute_groups() );
		$this->assertSame( array_values( array_unique( $block->site_styles_overlay_attributes() ) ), $block->site_styles_overlay_attributes() );
		foreach ( [ 'countdownType', 'date', 'timestamp', 'expireAction', 'timerLayout', 'countdownDivider', 'enableTimer', 'counterAlign', 'preLabel', 'preLabelColor', 'preLabelFont', 'postLabelFont', 'daysLabel', 'vsdesk' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Table takes its fonts, alignments, row backgrounds, borders, cell padding, row height, spacing and max
	 * width through the overlay, in thirteen groups, with no scope, no site rules and no core surface, and
	 * keeps its structure, headers, caption, column settings and max height per table.
	 *
	 * @return void
	 */
	public function testTableDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/table' );

		$this->assertNotNull( $block );
		$this->assertSame( 'table', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertNotInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 40, $block->site_styles_overlay_attributes() );
		$this->assertCount( 13, $block->site_styles_attribute_groups() );
		$this->assertSame( array_values( array_unique( $block->site_styles_overlay_attributes() ) ), $block->site_styles_overlay_attributes() );
		foreach ( [ 'columns', 'isFirstRowHeader', 'isFirstColumnHeader', 'columnSettings', 'columnBackgrounds', 'columnBackgroundsHover', 'enableCaption', 'caption', 'maxHeight', 'maxHeightUnit' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Posts takes its look through the overlay, in four groups, with no scope, no site rules and no core
	 * surface, and keeps which parts show, the labels and the query per block.
	 *
	 * @return void
	 */
	public function testPostsDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/posts' );

		$this->assertNotNull( $block );
		$this->assertSame( 'posts', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertNotInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 10, $block->site_styles_overlay_attributes() );
		$this->assertCount( 4, $block->site_styles_attribute_groups() );
		foreach ( [ 'postType', 'postsToShow', 'order', 'image', 'aboveCategories', 'meta', 'author', 'authorImageSize', 'date', 'comments', 'excerpt', 'readmore', 'readmoreLabel' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Progress Bar takes its colors, thickness, radius, fonts, spacing, alignment and max width through the
	 * overlay, in ten groups, scoped so a mask bar takes no site thickness, with no site rules and no core
	 * surface, and keeps its type, content, number and animation settings per block.
	 *
	 * @return void
	 */
	public function testProgressBarDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/progress-bar' );

		$this->assertNotNull( $block );
		$this->assertSame( 'progress-bar', $block->get_slug() );
		$this->assertInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertNotInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 25, $block->site_styles_overlay_attributes() );
		$this->assertCount( 10, $block->site_styles_attribute_groups() );
		$this->assertSame( 'barType', $block->site_styles_scope_attribute() );
		$this->assertSame( [ 'line-mask' ], array_keys( $block->site_styles_scoped_attributes() ) );
		$this->assertSame(
			array_values( array_diff( $block->site_styles_overlay_attributes(), [ 'progressWidth', 'progressWidthTablet', 'progressWidthMobile' ] ) ),
			$block->site_styles_scoped_attributes()['line-mask']
		);
		foreach ( [ 'barType', 'label', 'labelPosition', 'labelLayout', 'displayLabel', 'displayPercent', 'progressAmount', 'progressMax', 'numberSuffix', 'duration', 'easing', 'delayUntilInView', 'maskSvg' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Testimonials takes its container, spacing, shadow, gap and fonts through the overlay, in fourteen groups,
	 * with older border, radius and gap stand-ins, no scope, no site rules and no core surface, and keeps every
	 * setting its testimonials read through block context per block.
	 *
	 * @return void
	 */
	public function testTestimonialsDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/testimonials' );

		$this->assertNotNull( $block );
		$this->assertSame( 'testimonials', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertNotInstanceOf( Prints_Site_Rules::class, $block );
		$this->assertInstanceOf( Legacy_Group_Attributes::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [], $block->site_styles_supports() );
		$this->assertSame( [], $block->site_styles_selectors() );
		$this->assertCount( 31, $block->site_styles_overlay_attributes() );
		$this->assertCount( 14, $block->site_styles_attribute_groups() );
		$this->assertSame(
			[
				'borderStyle'                     => [ 'containerBorderWidth', 'containerBorder' ],
				'responsiveContainerBorderRadius' => [ 'containerBorderRadius' ],
				'gap'                             => [ 'columnGap' ],
			],
			$block->site_styles_legacy_group_attributes()
		);
		$context = array_values( (array) ( \WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/testimonials' )->provides_context ?? [] ) );
		$this->assertNotEmpty( $context );
		foreach ( array_merge( $context, [ 'columns', 'hAlign', 'autoPlay', 'iconMargin', 'titlePadding', 'mediaMargin', 'ratingMargin' ] ) as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Testimonial takes its media icon size and color through the overlay, with the size kept with its tablet
	 * and mobile values, and keeps its media type, icon, line width and rating per block.
	 *
	 * @return void
	 */
	public function testTestimonialDescribesItsSiteStyles(): void {
		$block = $this->container->get( Supported_Blocks::class )->get( 'kadence/testimonial' );

		$this->assertNotNull( $block );
		$this->assertSame( 'testimonial', $block->get_slug() );
		$this->assertNotInstanceOf( Scopes_Site_Styles::class, $block );
		$this->assertInstanceOf( Groups_Site_Styles::class, $block );
		$this->assertSame( [], $block->site_styles_attributes_map() );
		$this->assertSame( [ 'isize', 'tabletIsize', 'mobileIsize', 'color' ], $block->site_styles_overlay_attributes() );
		$this->assertSame( [ [ 'isize', 'tabletIsize', 'mobileIsize' ] ], $block->site_styles_attribute_groups() );
		foreach ( [ 'media', 'icon', 'istroke', 'rating', 'ititle', 'url', 'content', 'name' ] as $attribute ) {
			$this->assertContains( $attribute, Supported_Blocks::excluded_attributes( $block ) );
		}
	}

	/**
	 * Spacer's style is its divider style, and an instance without one takes the block's default.
	 *
	 * @dataProvider spacerStyleProvider
	 *
	 * @param array<string, mixed> $attributes The instance's attributes.
	 * @param string|null          $expected   The style.
	 *
	 * @return void
	 */
	public function testSpacerScopeStyle( array $attributes, ?string $expected ): void {
		$this->assertSame( $expected, $this->container->get( Supported_Blocks::class )->get( 'kadence/spacer' )->site_styles_scope_style( $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function spacerStyleProvider(): Generator {
		yield 'stripe' => [
			'attributes' => [ 'dividerStyle' => 'stripe' ],
			'expected'   => 'stripe',
		];
		yield 'dashed' => [
			'attributes' => [ 'dividerStyle' => 'dashed' ],
			'expected'   => 'dashed',
		];
		yield 'none' => [
			'attributes' => [],
			'expected'   => null,
		];
	}

	/**
	 * A block without a scope excludes every registered attribute that isn't on its overlay list or attributes map.
	 *
	 * @dataProvider unscopedBlockProvider
	 *
	 * @param list<string>          $overlay The block's overlay attributes.
	 * @param array<string, string> $map     The block's attributes map.
	 * @param list<string>          $kept    Attributes that stay site values.
	 *
	 * @return void
	 */
	public function testAnUnscopedBlockExcludesEveryAttributeOutsideItsOverlayAndMap( array $overlay, array $map, array $kept ): void {
		$excluded   = Supported_Blocks::excluded_attributes( $this->unscoped_block( $overlay, $map ) );
		$attributes = array_keys( WP_Block_Type_Registry::get_instance()->get_registered( 'kadence/show-more' )->attributes );

		foreach ( $kept as $attribute ) {
			$this->assertNotContains( $attribute, $excluded );
		}
		foreach ( array_diff( $attributes, $kept ) as $attribute ) {
			$this->assertContains( $attribute, $excluded );
		}
		foreach ( [ 'uniqueID', 'kadenceDynamic', 'kbPreset' ] as $identifier ) {
			$this->assertContains( $identifier, $excluded );
		}
		$this->assertSame( array_values( array_unique( $excluded ) ), $excluded );
	}

	/**
	 * Every supported block without site rules, scoped or not, excludes exactly the registered attributes outside
	 * its overlay list and attributes map.
	 *
	 * @return void
	 */
	public function testEveryBlockWithoutSiteRulesExcludesEveryAttributeOutsideItsOverlayAndMap(): void {
		$checked = [];

		foreach ( $this->container->get( Supported_Blocks::class )->all() as $name => $block ) {
			if ( $block instanceof Prints_Site_Rules ) {
				continue;
			}

			$rendered = array_merge( $block->site_styles_overlay_attributes(), array_keys( $block->site_styles_attributes_map() ) );
			$excluded = Supported_Blocks::excluded_attributes( $block );

			foreach ( array_keys( WP_Block_Type_Registry::get_instance()->get_registered( $name )->attributes ) as $attribute ) {
				$this->assertSame( ! in_array( $attribute, $rendered, true ), in_array( $attribute, $excluded, true ), "{$name}: {$attribute}" );
			}
			$checked[] = $name;
		}

		$this->assertContains( 'kadence/spacer', $checked );
		$this->assertContains( 'kadence/icon', $checked );
		$this->assertContains( 'kadence/single-icon', $checked );
		$this->assertContains( 'kadence/rowlayout', $checked );
	}

	/**
	 * Only Single Button prints site rules. Every other supported block's site values render through the overlay
	 * or core's stylesheet.
	 *
	 * @return void
	 */
	public function testOnlySingleButtonPrintsSiteRules(): void {
		$printing = array_keys(
			array_filter(
				$this->container->get( Supported_Blocks::class )->all(),
				static fn( $block ): bool => $block instanceof Prints_Site_Rules
			)
		);

		$this->assertSame( [ 'kadence/singlebtn' ], $printing );
	}

	/**
	 * Every older attribute a supported block lists stands in for one of its groups, keyed by the group's first
	 * attribute, and is a registered attribute that is never a site value.
	 *
	 * @return void
	 */
	public function testEveryLegacyAttributeStandsInForAGroupAndIsExcluded(): void {
		$checked = [];

		foreach ( $this->container->get( Supported_Blocks::class )->all() as $name => $block ) {
			if ( ! $block instanceof Legacy_Group_Attributes ) {
				continue;
			}

			$leads      = array_map( static fn( array $group ): string => $group[0], $block->site_styles_attribute_groups() );
			$attributes = WP_Block_Type_Registry::get_instance()->get_registered( $name )->attributes;
			$excluded   = Supported_Blocks::excluded_attributes( $block );

			foreach ( $block->site_styles_legacy_group_attributes() as $lead => $legacy ) {
				$this->assertContains( $lead, $leads, "{$name}: {$lead} isn't the first attribute of a group." );
				foreach ( $legacy as $attribute ) {
					$this->assertArrayHasKey( $attribute, $attributes, "{$name}: the older attribute {$attribute} isn't registered." );
					$this->assertContains( $attribute, $excluded, "{$name}: the older attribute {$attribute} can be a site value." );
				}
			}
			$checked[] = $name;
		}

		$this->assertContains( 'kadence/column', $checked );
		$this->assertContains( 'kadence/rowlayout', $checked );
	}

	/**
	 * Every overlay attribute of a supported block is registered and can be a site value.
	 *
	 * @return void
	 */
	public function testEveryOverlayAttributeIsRegisteredAndNotExcluded(): void {
		foreach ( $this->container->get( Supported_Blocks::class )->all() as $name => $block ) {
			$attributes = WP_Block_Type_Registry::get_instance()->get_registered( $name )->attributes;
			$excluded   = Supported_Blocks::excluded_attributes( $block );

			foreach ( $block->site_styles_overlay_attributes() as $attribute ) {
				$this->assertArrayHasKey( $attribute, $attributes, "{$name}: the overlay attribute {$attribute} isn't registered." );
				$this->assertNotContains( $attribute, $excluded, "{$name}: the overlay attribute {$attribute} is excluded, so it can never be stored." );
			}
		}
	}

	/**
	 * Every group of a supported block holds only its overlay attributes, each in one group at most.
	 *
	 * @return void
	 */
	public function testEveryGroupHoldsOnlyOverlayAttributesOnce(): void {
		foreach ( $this->container->get( Supported_Blocks::class )->all() as $name => $block ) {
			if ( ! $block instanceof Groups_Site_Styles ) {
				continue;
			}

			$grouped = array_merge( ...$block->site_styles_attribute_groups() );

			$this->assertSame( array_values( array_unique( $grouped ) ), $grouped, "{$name}: an attribute is in more than one group." );
			foreach ( $grouped as $attribute ) {
				$this->assertContains( $attribute, $block->site_styles_overlay_attributes(), "{$name}: the grouped attribute {$attribute} isn't on the overlay list." );
			}
		}
	}

	/**
	 * @return Generator
	 */
	public function unscopedBlockProvider(): Generator {
		yield 'overlay only' => [
			'overlay' => [ 'heightDesktop', 'paddingDesktop' ],
			'map'     => [],
			'kept'    => [ 'heightDesktop', 'paddingDesktop' ],
		];
		yield 'overlay and map' => [
			'overlay' => [ 'heightDesktop' ],
			'map'     => [ 'marginUnit' => 'color.text' ],
			'kept'    => [ 'heightDesktop', 'marginUnit' ],
		];
	}

	/**
	 * A Show More stand-in without a scope, with the given overlay attributes and attributes map.
	 *
	 * @param list<string>          $overlay The overlay attributes.
	 * @param array<string, string> $map     The attributes map.
	 *
	 * @return Supports_Site_Styles The block.
	 */
	private function unscoped_block( array $overlay, array $map ): Supports_Site_Styles {
		return new class( $overlay, $map ) implements Supports_Site_Styles {

			/**
			 * @var list<string>
			 */
			private array $overlay;

			/**
			 * @var array<string, string>
			 */
			private array $map;

			/**
			 * @param list<string>          $overlay The overlay attributes.
			 * @param array<string, string> $map     The attributes map.
			 */
			public function __construct( array $overlay, array $map ) {
				$this->overlay = $overlay;
				$this->map     = $map;
			}

			public function get_name(): string {
				return 'kadence/show-more';
			}

			public function get_slug(): string {
				return 'show-more';
			}

			public function site_styles_overlay_attributes(): array {
				return $this->overlay;
			}

			public function site_styles_attributes_map(): array {
				return $this->map;
			}

			public function site_styles_supports(): array {
				return [];
			}

			public function site_styles_selectors(): array {
				return [];
			}
		};
	}
}
