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
		$output = $this->print_link( [ Kadence_Blocks_Frontend::get_instance(), 'print_gfonts' ], [ 'X" onerror="alert(1)' => [ '700', 'latin' ] ] );

		$this->assertMatchesRegularExpression( self::LINK_PATTERN, $output );
	}

	public function test_google_fonts_link_keeps_font_family_inside_href(): void {
		$output = $this->print_link( [ Kadence_Blocks_Google_Fonts::get_instance(), 'print_gfonts' ], [ 'X" onerror="alert(1)' => [ '700', 'latin' ] ] );

		$this->assertMatchesRegularExpression( self::LINK_PATTERN, $output );
	}

	public function test_frontend_link_loads_font_family(): void {
		$fonts    = [
			'Open Sans'    => [ '700', 'latin' ],
			'Roboto'       => [ '400italic', 'latin-ext' ],
			'Lato'         => [ '300', 'latin' ],
			'Noto Sans JP' => [ '400', 'japanese' ],
		];
		$expected = '<link href="https://fonts.googleapis.com/css?family=Open%20Sans:700%7CRoboto:400italic%7CLato:300%7CNoto%20Sans%20JP:400&#038;subset=latin,latin-ext,japanese&#038;display=swap" rel="stylesheet">';

		$this->assertSame( $expected, $this->print_link( [ Kadence_Blocks_Frontend::get_instance(), 'print_gfonts' ], $fonts ) );

		delete_option( 'kadence_blocks_font_settings' );

		$this->assertSame( $expected, $this->print_link( [ Kadence_Blocks_Frontend::get_instance(), 'print_gfonts' ], $fonts ) );
	}

	/**
	 * @param callable                             $printer The print_gfonts() callable.
	 * @param array<string, array{string, string}> $fonts   Font family => [ variant, subset ].
	 */
	private function print_link( callable $printer, array $fonts ): string {
		$gfonts = [];
		foreach ( $fonts as $family => [ $variant, $subset ] ) {
			$gfonts[ $family ] = [
				'fontfamily'   => $family,
				'fontvariants' => [ $variant ],
				'fontsubsets'  => [ $subset ],
			];
		}

		// Writing to the missing fonts folder raises a warning before the remote URL is used.
		set_error_handler( static fn() => true, E_WARNING ); // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_set_error_handler
		ob_start();

		try {
			$printer( $gfonts );
		} finally {
			restore_error_handler();
		}

		return ob_get_clean();
	}
}
