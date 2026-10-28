<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use WP_Theme_JSON_Resolver;

/**
 * Covers the `UserGlobalStyles` test helper the site-level styles tests rely on.
 */
final class UserGlobalStylesHelperTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testStoresTheDataInTheThemesGlobalStylesPost(): void {
		$background = '#123456';

		$post_id = $this->tester->store_user_global_styles(
			[ 'styles' => [ 'color' => [ 'background' => $background ] ] ]
		);

		$post    = WP_Theme_JSON_Resolver::get_user_data_from_wp_global_styles( wp_get_theme() );
		$content = json_decode( $post['post_content'], true );

		$this->assertSame( $post_id, $post['ID'] );
		$this->assertSame( $background, $content['styles']['color']['background'] );
		$this->assertSame( $background, wp_get_global_styles( [ 'color', 'background' ] ) );
	}
}
