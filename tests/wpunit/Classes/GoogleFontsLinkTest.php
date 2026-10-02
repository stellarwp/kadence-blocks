<?php
/**
 * cSpell:ignore wptt fontvariants fontsubsets
 */

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Frontend;
use Kadence_Blocks_Google_Fonts;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_Error;

/**
 * Tests the Google Fonts stylesheet link output.
 */
class GoogleFontsLinkTest extends KadenceBlocksTestCase {

	private const LINK_PATTERN = '/^<link href="([^"]*)" rel="stylesheet">$/';

	protected function setUp(): void {
		parent::setUp();

		update_option( 'kadence_blocks_font_settings', [ 'load_fonts_local' => 'true' ] );

		// A file as the base path keeps the fonts folder from being created, so the remote URL is used.
		add_filter( 'wptt_get_local_fonts_base_path', static fn() => __FILE__ );
		add_filter( 'pre_http_request', static fn() => new WP_Error( 'http_request_blocked' ) );
	}

	public function test_frontend_link_keeps_font_family_inside_href(): void {
		$output = $this->print_link( [ Kadence_Blocks_Frontend::get_instance(), 'print_gfonts' ], 'X" onerror="alert(1)' );

		$this->assertMatchesRegularExpression( self::LINK_PATTERN, $output );
	}

	public function test_google_fonts_link_keeps_font_family_inside_href(): void {
		$output = $this->print_link( [ Kadence_Blocks_Google_Fonts::get_instance(), 'print_gfonts' ], 'X" onerror="alert(1)' );

		$this->assertMatchesRegularExpression( self::LINK_PATTERN, $output );
	}

	public function test_frontend_link_loads_font_family(): void {
		$expected = '<link href="https://fonts.googleapis.com/css?family=Open%20Sans:700&#038;subset=latin&#038;display=swap" rel="stylesheet">';

		$this->assertSame( $expected, $this->print_link( [ Kadence_Blocks_Frontend::get_instance(), 'print_gfonts' ], 'Open Sans' ) );

		delete_option( 'kadence_blocks_font_settings' );

		$this->assertSame( $expected, $this->print_link( [ Kadence_Blocks_Frontend::get_instance(), 'print_gfonts' ], 'Open Sans' ) );
	}

	private function print_link( callable $printer, string $family ): string {
		// Writing to the missing fonts folder raises a warning before the remote URL is used.
		set_error_handler( static fn() => true, E_WARNING ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler
		ob_start();

		try {
			$printer(
				[
					$family => [
						'fontfamily'   => $family,
						'fontvariants' => [ '700' ],
						'fontsubsets'  => [ 'latin' ],
					],
				]
			);
		} finally {
			restore_error_handler();
		}

		return ob_get_clean();
	}
}
