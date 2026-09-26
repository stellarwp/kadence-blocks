<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Style;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits\Sanitizes_Css_Identifier;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Contracts\Button_Style_Source;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * The button styles the active theme offers, as the preset nodes the baseline decorator adds: the adapter
 * that fits the theme is asked first, the classic fallback answers when it has nothing, a filter lets a
 * theme or a compatibility plugin shape the list, and every slug is prefixed so it can never collide with
 * a user preset.
 *
 * @since TBD
 */
final class Discovery {

	use Sanitizes_Css_Identifier;

	/**
	 * The adapters in the order they are asked. The first one that answers wins.
	 *
	 * @since TBD
	 *
	 * @var Button_Style_Source[]
	 */
	private array $sources;

	/**
	 * @since TBD
	 *
	 * @param Button_Style_Source ...$sources The adapters, most specific first, the classic fallback last.
	 */
	public function __construct( Button_Style_Source ...$sources ) {
		$this->sources = $sources;
	}

	/**
	 * The discovered styles keyed by prefixed slug: label, the classes the theme paints, the display values,
	 * and the tokens a value preset declares (empty for a class-painted one).
	 *
	 * @since TBD
	 *
	 * @return array<string, array{label: string, class: string, values: array<string, mixed>, tokens: array<string, mixed>}>
	 */
	public function styles(): array {
		$styles = [];

		foreach ( $this->sources as $source ) {
			$styles = $source->styles();

			if ( $styles !== [] ) {
				break;
			}
		}

		/**
		 * Filters the button styles the active theme offers, as Button preset seeds.
		 *
		 * Keyed by preset slug without the "theme-" prefix (the plugin adds it). Each entry carries the
		 * classes the theme paints the button with, a label, and optional display values keyed by the
		 * Button's preset properties (button-bg, button-text, button-radius…).
		 *
		 * @since TBD
		 *
		 * @param array<string, array{label: string, class: string, values: array<string, mixed>}> $styles The discovered styles.
		 * @param string                                                                            $theme  The active theme's stylesheet slug.
		 *
		 * @return array<string, array{label: string, class: string, values: array<string, mixed>}> The button styles to offer.
		 */
		$styles = apply_filters( 'kadence_blocks_theme_button_styles', $styles, get_stylesheet() );

		return $this->offered( $styles );
	}

	/**
	 * The filtered list reduced to the entries that can be offered: each slug prefixed and sanitized, each
	 * label filled in, and anything a filter handed back that is not a usable entry dropped.
	 *
	 * @since TBD
	 *
	 * @param mixed $styles The filtered styles, keyed by unprefixed slug.
	 *
	 * @return array<string, array{label: string, class: string, values: array<string, mixed>, tokens: array<string, mixed>}>
	 */
	private function offered( $styles ): array {
		if ( ! is_array( $styles ) ) {
			return [];
		}

		$out = [];

		foreach ( $styles as $raw_slug => $style ) {
			if ( ! is_array( $style ) ) {
				continue;
			}

			$slug  = self::sanitize_identifier( strtolower( str_replace( [ ' ', '_' ], '-', Cast::to_string( $raw_slug ) ) ) );
			$class = trim( Cast::to_string( $style['class'] ?? '' ) );

			// A class-painted preset with no classes would paint nothing: the value preset kind (a theme.json
			// variation) declares its tokens instead, so it is the only entry allowed without a class.
			if ( $slug === '' || ( $class === '' && ! isset( $style['tokens'] ) ) ) {
				continue;
			}

			$label = trim( Cast::to_string( $style['label'] ?? '' ) );

			$out[ Style::get_theme_prefix() . $slug ] = [
				'label'  => $label === '' ? ucwords( str_replace( '-', ' ', $slug ) ) : $label,
				'class'  => $class,
				'values' => is_array( $style['values'] ?? null ) ? $style['values'] : [],
				'tokens' => is_array( $style['tokens'] ?? null ) ? $style['tokens'] : [],
			];
		}

		return $out;
	}
}
