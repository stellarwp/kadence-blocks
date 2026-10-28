<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use Kadence_Blocks_CSS;
use WP_Theme_JSON_Data;
use WP_Theme_JSON_Data_Gutenberg;

/**
 * Keeps the Kadence site-level values out of what core renders from the user
 * Global Styles:
 * - `settings.custom.kadence` always, since core would turn every leaf into a
 *   `:root` custom property (the overlay reads the stored post instead);
 * - the supported blocks' `styles.blocks` entries when FSE mode is off, since
 *   the theme's `theme.json` makes core print them in classic mode too.
 *
 * In FSE mode a design token in a supported block's `styles.blocks` entry is
 * rendered as its CSS variable, whether it is stored as a `{token}` reference,
 * which core would print as is, or as the variable the site styles window
 * stores. A token the active library doesn't define is left out, as it is for a
 * block instance, so the block falls back to its other styles.
 *
 * The stored post is never changed, so switching FSE mode back on restores
 * everything. The REST endpoint the Site Editor loads reads the post directly
 * and still returns the values.
 *
 * @since TBD
 */
final class User_Data_Filter {

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Supported_Blocks $blocks ) {
		$this->blocks = $blocks;
	}

	/**
	 * The parameter is untyped, and the result is built from the same class it was given,
	 * since the Gutenberg plugin passes its own WP_Theme_JSON_Data_Gutenberg, which doesn't
	 * extend core's class.
	 *
	 * @since TBD
	 *
	 * @param WP_Theme_JSON_Data|WP_Theme_JSON_Data_Gutenberg $theme_json The user-origin Global Styles.
	 *
	 * @return WP_Theme_JSON_Data|WP_Theme_JSON_Data_Gutenberg The Global Styles without the Kadence values.
	 */
	public function filter( $theme_json ): object {
		$data    = $theme_json->get_data();
		$changed = false;

		if ( isset( $data['settings']['custom']['kadence'] ) ) {
			unset( $data['settings']['custom']['kadence'] );
			$changed = true;
		}

		$fse_mode = kadence_blocks_is_fse_mode();

		foreach ( array_keys( $this->blocks->all() ) as $block_name ) {
			if ( ! isset( $data['styles']['blocks'][ $block_name ] ) ) {
				continue;
			}

			if ( ! $fse_mode ) {
				unset( $data['styles']['blocks'][ $block_name ] );
				$changed = true;
				continue;
			}

			$style = $data['styles']['blocks'][ $block_name ];

			if ( is_array( $style ) ) {
				$resolved = self::resolve_tokens( $style );

				if ( $resolved !== $style ) {
					$data['styles']['blocks'][ $block_name ] = $resolved;
					$changed                                 = true;
				}
			}
		}

		if ( ! $changed ) {
			return $theme_json;
		}

		$class = get_class( $theme_json );

		return new $class( $data, 'custom' );
	}

	/**
	 * @param array<array-key, mixed> $style A block's style, or part of it.
	 *
	 * @return array<array-key, mixed> The style, with each design token as its CSS variable and each undefined one removed.
	 */
	private static function resolve_tokens( array $style ): array {
		foreach ( $style as $key => $value ) {
			if ( is_array( $value ) ) {
				$style[ $key ] = self::resolve_tokens( $value );
				continue;
			}

			$alias = self::token_alias( $value );

			if ( null === $alias ) {
				continue;
			}

			if ( Kadence_Blocks_CSS::get_instance()->is_token_reference_backed( $alias ) ) {
				$style[ $key ] = 'var(' . Css_Var::from_id( Alias::path_of( $alias ) ) . ')';
			} else {
				unset( $style[ $key ] );
			}
		}

		return $style;
	}

	/**
	 * @param mixed $value A style value.
	 *
	 * @return string|null The `{token}` reference the value names, null when it names no design token.
	 */
	private static function token_alias( $value ): ?string {
		if ( ! is_string( $value ) ) {
			return null;
		}

		if ( Alias::is_alias( $value ) ) {
			return $value;
		}

		if ( 1 === preg_match( '/^var\(' . preg_quote( Css_Var::get_prefix(), '/' ) . '([a-z0-9-]+)\)$/', $value, $matches ) ) {
			return Alias::wrap( str_replace( '--', '.', $matches[1] ) );
		}

		return null;
	}
}
