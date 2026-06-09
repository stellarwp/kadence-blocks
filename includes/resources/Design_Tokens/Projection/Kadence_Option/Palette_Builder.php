<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;

/**
 * Pure builder for the two palette options the Kadence_Option projector writes.
 *
 * Produces a slug => { color, name } map from every token that claims a palette kadence_slot and
 * resolves to a value, then merges that map onto a decoded existing option. No WordPress calls, no
 * globals, no I/O: the projector owns get_option/update_option and hands decoded arrays in and out, so
 * every merge rule here is unit-testable without the database.
 *
 * The two options have deliberately different merge rules:
 *
 *   - kadence_blocks_colors (KB's own) — overwrite color AND name of a claimed slug, append a claimed
 *     slug not yet present, and preserve every other entry plus the "override" flag.
 *   - kadence_global_palette (the theme's) — overwrite ONLY color of a claimed slug; never append and
 *     never touch names, since the theme owns the slot labels and structure.
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
	 * Whether any token claims a palette slot — the value-independent, in-memory gate the projector
	 * checks before resolving (resolution is the expensive step).
	 *
	 * @since TBD
	 *
	 * @return bool
	 */
	public function has_palette_tokens(): bool {
		foreach ( $this->registry->by_projection( Kadence_Palette_Slot::get_projection_key() ) as $token ) {
			if ( Kadence_Palette_Slot::from_token( $token ) !== null ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Slug => [ 'color' => hex, 'name' => label ] for every token that claims a palette slot AND
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
	 * Merge token entries into a decoded kadence_blocks_colors payload (KB's own option).
	 *
	 * Overwrites the color and name of any entry whose slug a token claims, appends an entry for a
	 * claimed slug not yet present, and preserves all other entries plus the "override" flag (defaulting
	 * it to false on a fresh write so KB merges rather than replaces the theme palette). Entry shape is
	 * { color, name, slug } — exactly what KB's consumers read.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                              $existing Decoded option, or [] when absent.
	 * @param array<string, array{color: string, name: string}> $entries  slug => {color,name} from entries().
	 *
	 * @return array<string, mixed> The merged payload (re-encode and store).
	 */
	public function merge_kb_colors( array $existing, array $entries ): array {
		$palette = $this->palette_list( $existing );
		$claimed = [];

		foreach ( $palette as $index => $entry ) {
			if ( ! is_array( $entry ) ) {
				continue;
			}

			$slug = $this->entry_slug( $entry );
			if ( $slug === null || ! isset( $entries[ $slug ] ) ) {
				continue;
			}

			$entry['color']    = $entries[ $slug ]['color'];
			$entry['name']     = $entries[ $slug ]['name'];
			$palette[ $index ] = $entry;
			$claimed[ $slug ]  = true;
		}

		foreach ( $entries as $slug => $data ) {
			if ( isset( $claimed[ $slug ] ) ) {
				continue;
			}

			$palette[] = [
				'color' => $data['color'],
				'name'  => $data['name'],
				'slug'  => $slug,
			];
		}

		$existing['palette'] = array_values( $palette );

		if ( ! array_key_exists( 'override', $existing ) ) {
			$existing['override'] = false;
		}

		return $existing;
	}

	/**
	 * Merge token entries into a decoded kadence_global_palette payload (the Kadence theme's option).
	 *
	 * Overwrites ONLY the color of entries whose slug a token claims; never appends and never rewrites a
	 * name (the theme owns slot labels and structure). An unexpected shape (no list under "palette") is
	 * returned untouched, so the theme's option is left exactly as found.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed>                              $existing Decoded option (caller guarantees it exists).
	 * @param array<string, array{color: string, name: string}> $entries  slug => {color,name} from entries().
	 *
	 * @return array<string, mixed> The merged payload (re-encode and store).
	 */
	public function merge_theme_palette( array $existing, array $entries ): array {
		if ( ! isset( $existing['palette'] ) || ! is_array( $existing['palette'] ) ) {
			return $existing; // Unexpected shape — leave the theme's option exactly as found.
		}

		$palette = $existing['palette'];

		foreach ( $palette as $index => $entry ) {
			if ( ! is_array( $entry ) ) {
				continue;
			}

			$slug = $this->entry_slug( $entry );
			if ( $slug === null || ! isset( $entries[ $slug ] ) ) {
				continue;
			}

			$entry['color']    = $entries[ $slug ]['color'];
			$palette[ $index ] = $entry;
		}

		$existing['palette'] = array_values( $palette );

		return $existing;
	}

	/**
	 * The "palette" list from a decoded option, or [] when missing or malformed.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $existing Decoded option.
	 *
	 * @return array<int, mixed>
	 */
	private function palette_list( array $existing ): array {
		return isset( $existing['palette'] ) && is_array( $existing['palette'] ) ? $existing['palette'] : [];
	}

	/**
	 * A palette entry's slug as a string, or null when it has no usable string "slug".
	 *
	 * @since TBD
	 *
	 * @param array<array-key, mixed> $entry A single (already array-typed) palette entry.
	 *
	 * @return string|null
	 */
	private function entry_slug( array $entry ): ?string {
		if ( ! isset( $entry['slug'] ) || ! is_string( $entry['slug'] ) ) {
			return null;
		}

		return $entry['slug'];
	}
}
