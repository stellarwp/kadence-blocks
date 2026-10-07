<?php declare( strict_types=1 );

namespace Tests\Support\Classes;

use WP_Theme_JSON;

/**
 * Stands in for the Gutenberg plugin's WP_Theme_JSON_Data_Gutenberg, which has core's methods
 * but doesn't extend WP_Theme_JSON_Data.
 */
final class GutenbergThemeJsonData {

	private WP_Theme_JSON $theme_json;

	private string $origin;

	/**
	 * @param array  $data   theme.json data.
	 * @param string $origin Origin of the data.
	 */
	public function __construct( array $data, string $origin = 'theme' ) {
		$this->origin     = $origin;
		$this->theme_json = new WP_Theme_JSON( $data, $origin );
	}

	/**
	 * @param array $new_data theme.json data.
	 *
	 * @return self
	 */
	public function update_with( $new_data ) {
		$this->theme_json->merge( new WP_Theme_JSON( $new_data, $this->origin ) );

		return $this;
	}

	/**
	 * @return array
	 */
	public function get_data() {
		return $this->theme_json->get_raw_data();
	}

	/**
	 * @return WP_Theme_JSON
	 */
	public function get_theme_json() {
		return $this->theme_json;
	}
}
