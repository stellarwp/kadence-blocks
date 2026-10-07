<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\User_Data_Filter;
use Tests\Support\Classes\GutenbergThemeJsonData;
use Tests\Support\Classes\TestCase;
use WP_Theme_JSON_Data;

/**
 * Covers the user Global Styles filter with core's data class and the Gutenberg plugin's.
 */
final class UserDataFilterTest extends TestCase {

	private const DATA = [
		'version'  => 3,
		'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ],
		'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
	];

	public function testCoreDataLosesTheKadenceValues(): void {
		$filtered = $this->container->get( User_Data_Filter::class )->filter( new WP_Theme_JSON_Data( self::DATA, 'custom' ) );

		$this->assertInstanceOf( WP_Theme_JSON_Data::class, $filtered );
		$this->assertArrayNotHasKey( 'kadence', $filtered->get_data()['settings']['custom'] ?? [] );
	}

	public function testGutenbergDataComesBackAsGutenbergDataWithoutTheKadenceValues(): void {
		$filtered = $this->container->get( User_Data_Filter::class )->filter( new GutenbergThemeJsonData( self::DATA, 'custom' ) );

		$this->assertInstanceOf( GutenbergThemeJsonData::class, $filtered );
		$this->assertArrayNotHasKey( 'kadence', $filtered->get_data()['settings']['custom'] ?? [] );
		$this->assertArrayNotHasKey( 'kadence/singlebtn', $filtered->get_data()['styles']['blocks'] ?? [] );
	}

	public function testUnchangedGutenbergDataIsReturnedAsIs(): void {
		$theme_json = new GutenbergThemeJsonData( [ 'version' => 3 ], 'custom' );

		$this->assertSame( $theme_json, $this->container->get( User_Data_Filter::class )->filter( $theme_json ) );
	}
}
