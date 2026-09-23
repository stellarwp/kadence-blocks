<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;

/**
 * Stores a Kadence Blocks color palette for a test and, after that test,
 * restores the theme support the palette callbacks register, since the test
 * framework does not reset it.
 */
final class Palette extends Module {

	/**
	 * Whether the current test stored a palette.
	 */
	private bool $stored = false;

	/**
	 * The `editor-color-palette` theme support before the palette was stored,
	 * null when the theme registered none.
	 */
	private ?array $editor_color_palette_support = null;

	public function _after( TestInterface $test ): void {
		if ( ! $this->stored ) {
			return;
		}

		remove_theme_support( 'editor-color-palette' );

		if ( null !== $this->editor_color_palette_support ) {
			add_theme_support( 'editor-color-palette', ...$this->editor_color_palette_support );
		}

		wp_clean_theme_json_cache();

		$this->stored                       = false;
		$this->editor_color_palette_support = null;
	}

	/**
	 * Saves a palette the way the plugin's color settings screen does.
	 *
	 * @param bool $override Whether the stored palette replaces the theme palette.
	 *
	 * @return array<int, array{color: string, name: string, slug: string}> The stored palette entries.
	 */
	public function store_palette( bool $override = false ): array {
		if ( ! $this->stored ) {
			$support                            = get_theme_support( 'editor-color-palette' );
			$this->editor_color_palette_support = is_array( $support ) ? $support : null;
			$this->stored                       = true;
		}

		$palette = [
			[
				'color' => '#1d4f91',
				'name'  => 'Brand Blue',
				'slug'  => 'kb-palette-brand-blue',
			],
			[
				'color' => '#f2a900',
				'name'  => 'Brand Gold',
				'slug'  => 'kb-palette-brand-gold',
			],
		];

		update_option(
			'kadence_blocks_colors',
			wp_json_encode(
				[
					'palette'  => $palette,
					'override' => $override,
				]
			)
		);

		return $palette;
	}

	/**
	 * The palette CSS the plugin prints for the given entries.
	 *
	 * @param array<int, array{color: string, name: string, slug: string}> $palette Palette entries.
	 *
	 * @return string
	 */
	public function palette_css( array $palette ): string {
		$css = '';
		foreach ( $palette as $entry ) {
			$css .= ':root .has-' . $entry['slug'] . '-color{color:' . $entry['color'] . '}';
			$css .= ':root .has-' . $entry['slug'] . '-background-color{background-color:' . $entry['color'] . '}';
		}

		return $css;
	}
}
