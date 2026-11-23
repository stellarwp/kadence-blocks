<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Store;
use WP_REST_Request;
use WP_Theme_JSON_Resolver;

/**
 * Covers keeping the Kadence site-level values out of what core renders from
 * the user Global Styles, while keeping them stored.
 */
final class SiteStylesUserDataTest extends WPTestCase {
	protected \IntegrationTester $tester;

	private const DATA = [
		'settings' => [ 'custom' => [ 'kadence' => [ 'singlebtn' => [ 'borderRadius' => [ 20, 20, 20, 20 ] ] ] ] ],
		'styles'   => [ 'blocks' => [ 'kadence/singlebtn' => [ 'color' => [ 'background' => '#cc0000' ] ] ] ],
	];

	public function testFseModePrintsNoKadenceVariablesAndTheStoreStillReadsThem(): void {
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( self::DATA );

		$this->assertStringNotContainsString( '--wp--custom--kadence', wp_get_global_stylesheet() );
		$this->assertSame( [ 20, 20, 20, 20 ], App::instance()->container()->get( Store::class )->attributes( 'kadence/singlebtn' )['borderRadius'] );
	}

	public function testClassicModePrintsNoSingleButtonRuleAndNoKadenceVariables(): void {
		$this->tester->store_user_global_styles( self::DATA );

		$css = wp_get_global_stylesheet();

		$this->assertStringNotContainsString( 'kadence-singlebtn', $css );
		$this->assertStringNotContainsString( '--wp--custom--kadence', $css );
	}

	public function testFseModePrintsCoresSingleButtonRulesWithTheirDevices(): void {
		$data = self::DATA;
		$data['styles']['blocks']['kadence/singlebtn']['@mobile'] = [ 'color' => [ 'background' => '#00aa00' ] ];
		$this->tester->enable_fse_mode();
		$this->tester->store_user_global_styles( $data );

		$css = wp_get_global_stylesheet();

		$this->assertStringContainsString( 'wp-block-kadence-singlebtn', $css );
		$this->assertMatchesRegularExpression( '/@media[^{]*767px[^{]*\{[^}]*kadence-singlebtn[^}]*\{background-color: ?#00aa00;/', $css );
	}

	public function testTheStoredPostIsUnchangedAfterAModeRoundTrip(): void {
		$this->tester->store_user_global_styles( self::DATA );
		$before = $this->stored_content();

		$this->tester->enable_fse_mode();
		wp_get_global_stylesheet();
		$this->tester->disable_fse_mode();
		wp_clean_theme_json_cache();
		wp_get_global_stylesheet();

		$this->assertSame( $before, $this->stored_content() );
	}

	public function testTheRestResponseStillContainsTheKadenceValues(): void {
		$this->tester->enable_fse_mode();
		$post_id = $this->tester->store_user_global_styles( self::DATA );
		wp_set_current_user( self::factory()->user->create( [ 'role' => 'administrator' ] ) );

		$response = rest_do_request( new WP_REST_Request( 'GET', '/wp/v2/global-styles/' . $post_id ) );

		$this->assertSame( 200, $response->get_status() );
		$this->assertSame( self::DATA['settings']['custom']['kadence'], $response->get_data()['settings']['custom']['kadence'] );
	}

	private function stored_content(): string {
		return WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() )['post_content'];
	}
}
