<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use Generator;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Groups_Site_Styles;
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

		$this->assertContains( 'kadence/icon', $checked );
		$this->assertContains( 'kadence/single-icon', $checked );
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
