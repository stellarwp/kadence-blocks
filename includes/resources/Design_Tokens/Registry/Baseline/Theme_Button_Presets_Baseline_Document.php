<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Theme_Button_Styles_Overlay;

/**
 * The baseline with the active theme's button styles written onto it as Button presets.
 *
 * Decorates the baseline (already re-valued by the theme Style Guide): document() is the inner document
 * with one `theme-*` preset node per discovered style under the Button's presets, after the shipped ones,
 * so the picker, the Style Library and the projector see them as ordinary presets. Each node carries the
 * classes the theme paints the button with, the values the theme renders for display, and the tokens a
 * value preset declares (empty for a class-painted one). Stored overrides still merge on top
 * (Effective_Presets), so a library's override of a theme preset wins over the theme's display value.
 *
 * has() delegates unchanged: no token id is ever added, so the fail-closed guard sees exactly the
 * shipped ids.
 *
 * @since TBD
 */
final class Theme_Button_Presets_Baseline_Document implements Baseline_Document {

	/**
	 * The block whose presets the theme's button styles join.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BUTTON_BLOCK = 'kadence/singlebtn';

	/**
	 * The baseline being decorated.
	 *
	 * @since TBD
	 *
	 * @var Baseline_Document
	 */
	private Baseline_Document $inner;

	/**
	 * The theme's button styles for this request.
	 *
	 * @since TBD
	 *
	 * @var Theme_Button_Styles_Overlay
	 */
	private Theme_Button_Styles_Overlay $overlay;

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document           $inner   The baseline to decorate.
	 * @param Theme_Button_Styles_Overlay $overlay The theme button styles overlay.
	 */
	public function __construct( Baseline_Document $inner, Theme_Button_Styles_Overlay $overlay ) {
		$this->inner   = $inner;
		$this->overlay = $overlay;
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return bool
	 */
	public function has( string $id ): bool {
		return $this->inner->has( $id );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * Not memoized: the inner document memoizes its own (expensive) build and changes independently of the
	 * button styles, so a memo keyed on the button signature alone would serve a stale inner document after a
	 * Style Guide change. Adding a few nodes to a copy-on-write array is cheap enough to do on every read.
	 */
	public function document(): array {
		$document = $this->inner->document();

		// An empty inner document means the shipped file is missing or unreadable; the guard fails closed on
		// it, and a Button preset node with no `$default` would hand the resolver a broken block.
		if ( $document === [] ) {
			return $document;
		}

		$styles = $this->overlay->styles();

		if ( $styles === [] ) {
			return $document;
		}

		$path = array_merge( Extensions::get_presets_path(), [ self::BUTTON_BLOCK ] );
		$node = $this->section_at( $document, $path );

		if ( $node === null ) {
			return $document;
		}

		foreach ( $styles as $slug => $style ) {
			$node[ $slug ] = [
				Extensions::get_label_key()        => $style['label'],
				Extensions::get_theme_class_key()  => $style['class'],
				Extensions::get_theme_values_key() => $style['values'],
				Extensions::get_tokens_key()       => $style['tokens'],
			];
		}

		return $this->set_section_at( $document, $path, $node );
	}

	/**
	 * The array at a key path, or null when any step is missing. Key paths (not dot-paths) because the
	 * extensions namespace key contains dots.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The document.
	 * @param string[]             $path     The key path.
	 *
	 * @return array<string, mixed>|null
	 */
	private function section_at( array $document, array $path ): ?array {
		$node = $document;

		foreach ( $path as $key ) {
			if ( ! isset( $node[ $key ] ) || ! is_array( $node[ $key ] ) ) {
				return null;
			}

			$node = $node[ $key ];
		}

		return $node;
	}

	/**
	 * Replace the array at a key path. The caller has proved the path exists.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The document.
	 * @param string[]             $path     The key path.
	 * @param array<string, mixed> $section  The replacement.
	 *
	 * @return array<string, mixed>
	 */
	private function set_section_at( array $document, array $path, array $section ): array {
		$cursor = &$document;

		foreach ( $path as $key ) {
			if ( ! isset( $cursor[ $key ] ) || ! is_array( $cursor[ $key ] ) ) {
				$cursor[ $key ] = [];
			}

			$cursor = &$cursor[ $key ];
		}

		$cursor = $section;
		unset( $cursor );

		return $document;
	}
}
