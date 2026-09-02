<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Extracts the raw authored responsive / clamp shape for every responsive-capable leaf in an effective
 * document, so the Style Library token editor can hydrate its per-breakpoint (and clamp) inputs exactly as
 * authored rather than from the flat resolved value (which loses the tablet / mobile steps and the clamp
 * slots).
 *
 * The feed's `values` map already carries the flat resolved value per token for a flat editor; this adds a
 * parallel `responsive` map keyed by token id, present ONLY for tokens that actually carry a shape:
 *
 *   "semantic.font-size.control" => { "base": "1.125rem", "responsive": { "tablet": "…", "mobile": "…" } }
 *   "semantic.font-size.control" => { "base": "clamp(…)",  "clamp": { "min": "…", "preferred": "…", "max": "…" } }
 *
 * A flat token is absent, so the editor falls back to the flat value for its desktop input. Values are the
 * raw authored strings (an alias slot stays a "{dot.path}" reference); the editor shows what was authored.
 * Pure: no WordPress calls, no globals, no I/O.
 *
 * @since TBD
 */
final class Responsive_Feed {

	/**
	 * Build the id => authored-shape map for every responsive-capable leaf that carries a responsive or
	 * clamp shape.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed> $document The effective (baseline-merged) DTCG document.
	 *
	 * @return array<string,array<string,mixed>>
	 */
	public function from_document( array $document ): array {
		$out = [];
		$this->walk( $document, '', $out );

		return $out;
	}

	/**
	 * Depth-first walk collecting the authored shape of each responsive-capable leaf.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed>               $node   The current node.
	 * @param string                            $prefix The dot-path accumulated so far.
	 * @param array<string,array<string,mixed>> $out    By-reference id => authored-shape map.
	 *
	 * @return void
	 */
	private function walk( array $node, string $prefix, array &$out ): void {
		foreach ( $node as $key => $child ) {
			if ( ! is_string( $key ) || strncmp( $key, '$', 1 ) === 0 || ! is_array( $child ) ) {
				continue;
			}

			$path = $prefix === '' ? $key : $prefix . '.' . $key;

			if ( ! array_key_exists( Sentinels::get_value_key(), $child ) ) {
				$this->walk( $child, $path, $out );

				continue;
			}

			$type = $child[ Token_Type::get_type_key() ] ?? '';

			if ( ! is_string( $type ) || ! Responsive::is_responsive_capable( $type ) ) {
				continue;
			}

			$entry = $this->authored_shape( $child );

			if ( $entry !== [] ) {
				$out[ $path ] = $entry;
			}
		}
	}

	/**
	 * The authored responsive / clamp shape for a leaf, or an empty array when it is flat. Base is the raw
	 * scalar $value; responsive and clamp are the raw authored maps.
	 *
	 * @since TBD
	 *
	 * @param array<string,mixed> $leaf The decoded leaf.
	 *
	 * @return array<string,mixed>
	 */
	private function authored_shape( array $leaf ): array {
		$base = $leaf[ Sentinels::get_value_key() ] ?? null;

		if ( Responsive::has_responsive( $leaf ) ) {
			$responsive = Responsive::responsive_of( $leaf );

			if ( is_array( $responsive ) ) {
				return [
					'base'       => $base,
					'responsive' => $responsive,
				];
			}
		}

		if ( Responsive::has_clamp( $leaf ) ) {
			$clamp = Responsive::clamp_of( $leaf );

			if ( is_array( $clamp ) ) {
				return [
					'base'  => $base,
					'clamp' => $clamp,
				];
			}
		}

		return [];
	}
}
