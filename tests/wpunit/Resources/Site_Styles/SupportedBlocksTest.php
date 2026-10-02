<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Store;
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

			foreach ( [ 'uniqueID', 'anchor', 'inQueryBlock', 'noCustomDefaults', 'metadata', 'lock', 'className', 'kadenceDynamic' ] as $identifier ) {
				$this->assertContains( $identifier, $excluded, "{$name}: `{$identifier}` must not be stored site-wide." );
			}
		}
	}

	public function testEverySupportedBlockMapsOnlyConvertiblePaths(): void {
		$blocks = $this->container->get( Supported_Blocks::class )->all();

		$this->assertNotEmpty( $blocks );
		foreach ( $blocks as $name => $block ) {
			$this->assertSame( $name, $block->get_name() );
			foreach ( $block->site_styles_attributes_map() as $attribute => $path ) {
				$this->assertTrue( Store::can_convert( $path ), "{$name}: {$attribute} maps to {$path}, which the store can't convert." );
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
}
