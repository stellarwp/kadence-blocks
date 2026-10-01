<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Path;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;

/**
 * The shipped baseline with the active theme's Style Guide written onto it.
 *
 * Decorates the real baseline (Json_Baseline_Document): document() is the inner document with every
 * theme-derived value set on the leaf it names, so the effective document — and therefore every
 * resolved token — starts from the site's existing look instead of the plugin's shipped values.
 * Stored overrides still merge on top (Effective_Document), so tokens always win.
 *
 * has() delegates unchanged. That is the rule "the theme may only re-value tokens that already have a
 * baseline entry", enforced structurally: a theme value whose dot-path has no $value leaf in the inner
 * document is skipped, no id is ever added, and the fail-closed guard sees exactly the shipped ids.
 *
 * The $default color palette's swatches are re-valued alongside the tokens they point at, so the Style
 * Library shows the theme's colors and "reset swatch" restores them rather than the shipped hex.
 *
 * @since TBD
 */
final class Theme_Style_Guide_Baseline_Document implements Baseline_Document {

	/**
	 * The shipped baseline being decorated.
	 *
	 * @since TBD
	 *
	 * @var Baseline_Document
	 */
	private Baseline_Document $inner;

	/**
	 * The theme-derived token values for this request.
	 *
	 * @since TBD
	 *
	 * @var Style_Guide_Overlay
	 */
	private Style_Guide_Overlay $overlay;

	/**
	 * The pure structural setter used to write a re-valued leaf back into the document.
	 *
	 * @since TBD
	 *
	 * @var Mutator
	 */
	private Mutator $mutator;

	/**
	 * Memoized merged document for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $document = null;

	/**
	 * The overlay signature the memoized document was built from, so a signature change within a request
	 * (the overlay finishing its own memo, a test swapping the source) rebuilds it.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private string $signature = '';

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document   $inner   The shipped baseline.
	 * @param Style_Guide_Overlay $overlay The theme Style Guide overlay.
	 * @param Mutator             $mutator The pure structural setter.
	 */
	public function __construct( Baseline_Document $inner, Style_Guide_Overlay $overlay, Mutator $mutator ) {
		$this->inner   = $inner;
		$this->overlay = $overlay;
		$this->mutator = $mutator;
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
	 */
	public function document(): array {
		$signature = $this->overlay->signature();

		if ( $this->document !== null && $this->signature === $signature ) {
			return $this->document;
		}

		$document = $this->inner->document();

		// An empty inner document means the shipped file is missing or unreadable; the guard fails closed
		// on it, and writing theme values onto nothing would hand the resolver a partial baseline.
		if ( $document === [] || $signature === '' ) {
			return $this->remember( $document, $signature );
		}

		$values = $this->overlay->values();

		// Only the ids actually written: a value whose id has no $value leaf is skipped, and its swatch
		// must be skipped with it or the Style Library would show a color the token does not carry.
		$applied = [];

		foreach ( $values as $id => $value ) {
			$leaf = Document_Path::node_at( $document, $id );

			if ( $leaf === null || ! array_key_exists( Sentinels::get_value_key(), $leaf ) ) {
				continue;
			}

			$leaf[ Sentinels::get_value_key() ] = $value;
			$document                           = $this->mutator->set( $document, $id, $leaf );
			$applied[ $id ]                     = $value;
		}

		return $this->remember( $this->revalue_default_swatches( $document, $applied ), $signature );
	}

	/**
	 * Write the theme value into every swatch of the $default color palette whose token was re-valued.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>  $document The document with re-valued token leaves.
	 * @param array<string, string> $values   Token id => value that was applied.
	 *
	 * @return array<string, mixed>
	 */
	private function revalue_default_swatches( array $document, array $values ): array {
		$section = $this->section_at( $document, Extensions::get_color_palettes_path() );

		if ( $section === null ) {
			return $document;
		}

		$default = $section[ Extensions::get_default_key() ] ?? null;

		if ( ! is_string( $default ) || ! isset( $section[ $default ] ) || ! is_array( $section[ $default ] ) ) {
			return $document;
		}

		$groups_key   = Extensions::get_groups_key();
		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();
		$value_key    = Sentinels::get_value_key();
		$groups       = $section[ $default ][ $groups_key ] ?? null;

		if ( ! is_array( $groups ) ) {
			return $document;
		}

		foreach ( $groups as $group_index => $group ) {
			if ( ! is_array( $group ) || ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] ) ) {
				continue;
			}

			foreach ( $group[ $swatches_key ] as $swatch_index => $swatch ) {
				if ( ! is_array( $swatch ) || ! isset( $swatch[ $token_key ] ) || ! is_string( $swatch[ $token_key ] ) ) {
					continue;
				}

				if ( ! isset( $values[ $swatch[ $token_key ] ] ) ) {
					continue;
				}

				$groups[ $group_index ][ $swatches_key ][ $swatch_index ][ $value_key ] = $values[ $swatch[ $token_key ] ];
			}
		}

		$section[ $default ][ $groups_key ] = $groups;

		return $this->set_section_at( $document, Extensions::get_color_palettes_path(), $section );
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

	/**
	 * Memoize the merged document with the signature it was built from.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document  The merged document.
	 * @param string               $signature The overlay signature it reflects.
	 *
	 * @return array<string, mixed>
	 */
	private function remember( array $document, string $signature ): array {
		$this->document  = $document;
		$this->signature = $signature;

		return $document;
	}
}
