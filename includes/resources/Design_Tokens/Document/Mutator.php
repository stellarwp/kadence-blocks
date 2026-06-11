<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

/**
 * Pure structural transforms on a stored overrides-only DTCG document: deep-merge a partial document,
 * set a single leaf by dot-path, and remove a leaf by dot-path. No dependencies, no persistence, no
 * baseline — the REST write handlers use it to assemble the candidate document they then validate,
 * dry-run and save.
 *
 * This deliberately does NOT reuse Effective_Document::merge_node(): that merges overrides onto the
 * baseline and strips the "$extensions" layer, whereas these transforms operate on the stored overrides
 * themselves and MUST preserve "$extensions" (foundation presets, block presets, variants) untouched.
 *
 * Sentinels are stored verbatim here, never applied: a "$value": null reset or a "$disabled": true
 * leaf replaces wholesale, exactly like a concrete leaf, so the Resolver can interpret them at read
 * time. Callers that want to DROP an override (rather than store a sentinel) use remove().
 *
 * @since TBD
 */
final class Mutator {

	/**
	 * Deep-merge a partial overrides document onto a stored one, preserving every untouched path.
	 *
	 * Walks all top-level keys — including "$extensions" — so any branch the partial does not mention
	 * survives. A leaf or sentinel in the partial replaces the corresponding node wholesale (a token
	 * value is never field-merged); two groups descend; otherwise the partial wins.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $current The stored overrides document (decoded).
	 * @param array<string, mixed> $partial The partial overrides document to merge in (decoded).
	 *
	 * @return array<string, mixed> The merged document.
	 */
	public function merge( array $current, array $partial ): array {
		foreach ( $partial as $key => $value ) {
			// Scalars and lists replace wholesale.
			if ( ! is_array( $value ) ) {
				$current[ $key ] = $value;
				continue;
			}

			// A leaf or sentinel replaces wholesale — never field-merge a token value.
			if ( $this->is_leaf( $value ) ) {
				$current[ $key ] = $value;
				continue;
			}

			// Two groups: descend. When the stored side holds a leaf where the partial holds a group, the
			// group replaces it wholesale rather than merging the group's children alongside the leaf's
			// $type/$value and leaving a corrupt hybrid node.
			if (
				isset( $current[ $key ] )
				&& is_array( $current[ $key ] )
				&& ! $this->is_leaf( $current[ $key ] )
			) {
				$current[ $key ] = $this->merge( $current[ $key ], $value );
				continue;
			}

			$current[ $key ] = $value;
		}

		return $current;
	}

	/**
	 * Set a single token leaf at a dot-path, creating intermediate groups as needed.
	 *
	 * The leaf is assigned wholesale at the terminal segment; an existing leaf or scalar in the way of an
	 * intermediate segment is replaced by a fresh group so the path can be built.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The stored overrides document (decoded).
	 * @param string               $path     The dot-path, e.g. "primitive.color.brand".
	 * @param array<string, mixed> $leaf     The DTCG leaf (or sentinel) to store at the path.
	 *
	 * @return array<string, mixed> The document with the leaf set.
	 */
	public function set( array $document, string $path, array $leaf ): array {
		$segments = explode( '.', $path );
		$last     = (string) array_pop( $segments );

		$cursor = &$document;

		foreach ( $segments as $segment ) {
			if ( ! isset( $cursor[ $segment ] ) || ! is_array( $cursor[ $segment ] ) || $this->is_leaf( $cursor[ $segment ] ) ) {
				$cursor[ $segment ] = [];
			}

			$cursor = &$cursor[ $segment ];
		}

		$cursor[ $last ] = $leaf;
		unset( $cursor );

		return $document;
	}

	/**
	 * Remove the node at a dot-path and prune any now-empty ancestor groups.
	 *
	 * A no-op when the path is absent, so a delete of an unset override leaves the document unchanged.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The stored overrides document (decoded).
	 * @param string               $path     The dot-path to remove.
	 *
	 * @return array<string, mixed> The document with the path removed and empty ancestors pruned.
	 */
	public function remove( array $document, string $path ): array {
		return $this->remove_by_keys( $document, explode( '.', $path ) );
	}

	/**
	 * Recursively remove the node addressed by a literal key chain, pruning emptied groups on the way out.
	 *
	 * Addresses the document by discrete array keys rather than a dot-path, so a caller whose keys themselves
	 * carry dots ("com.kadence.designTokens") or slashes ("kadence/advancedbtn") can remove a node the
	 * dot-path form could not express.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The current node.
	 * @param string[]             $keys The remaining literal keys to the node to remove.
	 *
	 * @return array<string, mixed> The node with the key chain removed.
	 */
	public function remove_by_keys( array $node, array $keys ): array {
		$head = (string) array_shift( $keys );

		if ( ! array_key_exists( $head, $node ) ) {
			return $node;
		}

		if ( $keys === [] ) {
			unset( $node[ $head ] );

			return $node;
		}

		// The path continues but this node is a leaf/scalar: there is nothing deeper to remove.
		if ( ! is_array( $node[ $head ] ) ) {
			return $node;
		}

		$node[ $head ] = $this->remove_by_keys( $node[ $head ], $keys );

		// Prune a group that the removal just emptied so stored overrides do not accrue husks.
		if ( $node[ $head ] === [] ) {
			unset( $node[ $head ] );
		}

		return $node;
	}

	/**
	 * Whether a node is a token leaf to replace wholesale, rather than a group of child tokens to
	 * descend into.
	 *
	 * Keyed on the markers a stored override leaf can carry:
	 *
	 *   - "$value": a concrete value or a reset, e.g. { "$type": "color", "$value": "#3182CE" } or
	 *     { "$value": null }. Like the Resolver's effective merge, such a node is a leaf and is never
	 *     field-merged.
	 *   - "$disabled": a disable sentinel, e.g. { "$disabled": true }. Treated as a leaf here because
	 *     these transforms store sentinels verbatim for the Resolver to interpret at read time.
	 *
	 * A "$type"-only node, e.g. { "$type": "color" }, is deliberately NOT a leaf: it is invalid DTCG the
	 * validator rejects downstream, so it is descended into as a group rather than replaced.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The decoded node.
	 *
	 * @return bool
	 */
	private function is_leaf( array $node ): bool {
		return array_key_exists( Sentinels::get_value_key(), $node )
			|| array_key_exists( Sentinels::get_disabled_key(), $node );
	}
}
