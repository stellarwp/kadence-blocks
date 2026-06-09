<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Pure builder for the two palette options the Kadence_Option projector writes.
 *
 * Produces a slot => resolved-hex map from every token that declares a palette kadence_slot, then
 * MERGES that map onto a decoded existing option payload — overwriting only the color of token-claimed
 * slots, keyed by slug, and preserving every other entry, key and flag (e.g. kadence_blocks_colors'
 * "override"). No WordPress calls, no globals, no I/O: the projector owns get_option/update_option and
 * hands decoded arrays in and takes decoded arrays out.
 *
 * @since TBD
 */
final class Palette_Builder {

	/**
	 * The token registry.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @param Token_Registry $registry
	 */
	public function __construct( Token_Registry $registry ) {
		$this->registry = $registry;
	}

	/**
	 * Whether any token claims a palette slot — the early-bail gate.
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_palette_tokens(): bool {
		return $this->slugged( $this->registry ) !== [];
	}

	/**
	 * slug => [ 'color' => hex, 'name' => label ] for every token that claims a palette slot AND
	 * resolves to a non-empty value. Returns [] when nothing applies, so the caller skips both writes.
	 *
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return array<string, array{color: string, name: string}>
	 */
	public function entries( Resolved_Tokens $resolved ): array {
		$entries = [];

		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $id => $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );
			if ( $slot === null ) {
				continue;
			}

			$value = $resolved->value( $id );
			if ( $value === null || $value === '' ) {
				continue;
			}

			$entries[ $slot->slug ] = [
				'color' => $value,
				'name'  => $token->label,
			];
		}

		return $entries;
	}

	/**
	 * Merge token entries into a decoded kadence_blocks_colors payload.
	 *
	 * Overwrites the color of any palette entry whose slug a token claims (and refreshes its name);
	 * appends an entry for a claimed slug not yet present; preserves all other entries and the
	 * "override" flag. Entry shape is { color, name, slug } — exactly what KB's consumers read.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                              $existing Decoded option, or [] when absent.
	 * @param array<string, array{color: string, name: string}> $entries  slug => {color,name} from entries().
	 *
	 * @return array<string, mixed> The merged payload (re-encode and store).
	 */
	public function merge_kb_colors( array $existing, array $entries ): array {
		$palette = isset( $existing['palette'] ) && is_array( $existing['palette'] ) ? $existing['palette'] : [];

		$palette = $this->apply( $palette, $entries, true /* append unclaimed */ );

		$existing['palette'] = array_values( $palette );

		// Preserve override when present; default it false on a fresh write so KB merges rather than
		// replaces the theme palette.
		if ( ! array_key_exists( 'override', $existing ) ) {
			$existing['override'] = false;
		}

		return $existing;
	}

	/**
	 * Merge token entries into a decoded kadence_global_palette payload.
	 *
	 * Overwrites ONLY the color of palette entries whose slug a token claims; never appends and never
	 * touches names (the theme owns slot labels/structure). Preserves every other entry and top-level
	 * key untouched.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                              $existing Decoded option (guaranteed to exist by the caller).
	 * @param array<string, array{color: string, name: string}> $entries  slug => {color,name} from entries().
	 *
	 * @return array<string, mixed> The merged payload (re-encode and store).
	 */
	public function merge_theme_palette( array $existing, array $entries ): array {
		if ( ! isset( $existing['palette'] ) || ! is_array( $existing['palette'] ) ) {
			return $existing; // Unexpected shape — leave the theme's option exactly as found.
		}

		$existing['palette'] = array_values( $this->apply( $existing['palette'], $entries, false /* color-only */ ) );

		return $existing;
	}

	/**
	 * Overwrite the color (and, when $append, the name) of entries whose slug is claimed; optionally
	 * append an entry for a claimed slug not present.
	 *
	 * @since TBD
	 *
	 * @param array<int, mixed>                                 $palette List of {color,slug,name,…} entries.
	 * @param array<string, array{color: string, name: string}> $entries slug => {color,name}.
	 * @param bool                                               $append  Append claimed slugs not present.
	 *
	 * @return array<int, mixed>
	 */
	private function apply( array $palette, array $entries, bool $append ): array {
		$seen = [];

		foreach ( $palette as $i => $entry ) {
			if ( ! is_array( $entry ) || ! isset( $entry['slug'] ) ) {
				continue;
			}
			$slug = (string) $entry['slug'];
			if ( ! isset( $entries[ $slug ] ) ) {
				continue;
			}

			$palette[ $i ]['color'] = $entries[ $slug ]['color'];
			if ( $append ) {
				$palette[ $i ]['name'] = $entries[ $slug ]['name'];
			}
			$seen[ $slug ] = true;
		}

		if ( $append ) {
			foreach ( $entries as $slug => $data ) {
				if ( isset( $seen[ $slug ] ) ) {
					continue;
				}
				$palette[] = [
					'color' => $data['color'],
					'name'  => $data['name'],
					'slug'  => $slug,
				];
			}
		}

		return $palette;
	}

	/**
	 * Internal: are there any palette-slot tokens at all (value-independent), for has_palette_tokens().
	 *
	 * @since TBD
	 *
	 * @param Token_Registry $registry
	 *
	 * @return array<string, mixed>
	 */
	private function slugged( Token_Registry $registry ): array {
		return array_filter(
			$registry->by_projection( Kadence_Palette_Slot::get_projection_key() ),
			static function ( $token ): bool {
				return Kadence_Palette_Slot::from_token( $token ) !== null;
			}
		);
	}
}
