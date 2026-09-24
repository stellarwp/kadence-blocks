<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;
use WP_Theme_JSON_Data;

/**
 * Sets the Global Styles content and wide sizes for a test.
 */
final class GlobalStylesLayout extends Module {

	/**
	 * The filter that sets the sizes, null when the test set none.
	 *
	 * @var callable|null
	 */
	private $filter;

	public function _after( TestInterface $test ): void {
		if ( null === $this->filter ) {
			return;
		}

		remove_filter( 'wp_theme_json_data_theme', $this->filter );
		wp_clean_theme_json_cache();

		$this->filter = null;
	}

	/**
	 * @param string $content_size The `layout.contentSize` value, for example `650px`.
	 * @param string $wide_size    The `layout.wideSize` value.
	 */
	public function set_global_styles_layout( string $content_size, string $wide_size ): void {
		if ( null !== $this->filter ) {
			remove_filter( 'wp_theme_json_data_theme', $this->filter );
		}

		$this->filter = static function ( WP_Theme_JSON_Data $theme_json ) use ( $content_size, $wide_size ): WP_Theme_JSON_Data {
			return $theme_json->update_with(
				[
					'version'  => 2,
					'settings' => [
						'layout' => [
							'contentSize' => $content_size,
							'wideSize'    => $wide_size,
						],
					],
				]
			);
		};

		add_filter( 'wp_theme_json_data_theme', $this->filter, 1000 );
		wp_clean_theme_json_cache();
	}
}
