<?php declare( strict_types=1 );
// cspell:ignore fontfamilies fontfamily spacingsizes .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json\Preset_Bucket;
use Tests\Support\Classes\TestCase;

final class Preset_BucketTest extends TestCase {

	/**
	 * Returns path for color category.
	 *
	 * @return void
	 */
	public function testPathForColorReturnsColorPaletteThemePath(): void {
		$path = Preset_Bucket::path_for( 'color' );

		$this->assertSame( [ 'color', 'palette', 'theme' ], $path );
	}

	/**
	 * Returns path for font-family category.
	 *
	 * @return void
	 */
	public function testPathForFontFamilyReturnsFontFamiliesThemePath(): void {
		$path = Preset_Bucket::path_for( 'font-family' );

		$this->assertSame( [ 'typography', 'fontFamilies', 'theme' ], $path );
	}

	/**
	 * Returns path for spacing category.
	 *
	 * @return void
	 */
	public function testPathForSpacingReturnsSpacingSizesPath(): void {
		$path = Preset_Bucket::path_for( 'spacing' );

		$this->assertSame( [ 'spacing', 'spacingSizes' ], $path );
	}

	/**
	 * Returns path for shadow category.
	 *
	 * @return void
	 */
	public function testPathForShadowReturnsShadowPresetsPath(): void {
		$path = Preset_Bucket::path_for( 'shadow' );

		$this->assertSame( [ 'shadow', 'presets' ], $path );
	}

	/**
	 * Returns null for unmapped category.
	 *
	 * @return void
	 */
	public function testPathForUnmappedCategoryReturnsNull(): void {
		$path = Preset_Bucket::path_for( 'radius' );

		$this->assertNull( $path );
	}

	/**
	 * Returns value_key for color category.
	 *
	 * @return void
	 */
	public function testValueKeyForColorReturnsColor(): void {
		$key = Preset_Bucket::value_key_for( 'color' );

		$this->assertSame( 'color', $key );
	}

	/**
	 * Returns value_key for font-family category.
	 *
	 * @return void
	 */
	public function testValueKeyForFontFamilyReturnsFontFamily(): void {
		$key = Preset_Bucket::value_key_for( 'font-family' );

		$this->assertSame( 'fontFamily', $key );
	}

	/**
	 * Returns value_key for spacing category.
	 *
	 * @return void
	 */
	public function testValueKeyForSpacingReturnsSize(): void {
		$key = Preset_Bucket::value_key_for( 'spacing' );

		$this->assertSame( 'size', $key );
	}

	/**
	 * Returns value_key for shadow category.
	 *
	 * @return void
	 */
	public function testValueKeyForShadowReturnsShadow(): void {
		$key = Preset_Bucket::value_key_for( 'shadow' );

		$this->assertSame( 'shadow', $key );
	}

	/**
	 * Returns null for unmapped category.
	 *
	 * @return void
	 */
	public function testValueKeyForUnmappedCategoryReturnsNull(): void {
		$key = Preset_Bucket::value_key_for( 'radius' );

		$this->assertNull( $key );
	}

	/**
	 * Returns all mapped categories.
	 *
	 * @return void
	 */
	public function testCategoriesReturnsAllMappedCategories(): void {
		$categories = Preset_Bucket::categories();

		$this->assertSame( [ 'color', 'font-family', 'spacing', 'shadow' ], $categories );
	}
}
