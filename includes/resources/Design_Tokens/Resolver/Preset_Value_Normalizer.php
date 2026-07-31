<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;

/**
 * Rewrites a preset's captured literal values into semantic aliases, so a value captured off a block
 * instance re-joins the theming cascade instead of freezing as a literal.
 *
 * The editor captures concrete values (a hex, a length) from a block and sends them as literals. For each
 * value this normalizer looks for a semantic token whose resolved value matches it in the target library;
 * when one is found the literal is replaced with that token's alias (`{semantic.color.button-primary-bg}`),
 * so a later edit to the semantic (or the primitive it points at) still cascades into the preset. A value
 * that is already an alias is left untouched, and a value with no matching semantic stays a literal.
 *
 * The match is deterministic: candidates are the semantic-layer entries of the library's resolved token map, in
 * document order; when several share a value the one whose id best matches the property's role wins (e.g.
 * `button-bg` prefers a semantic id containing "button" and "bg"), tie-broken by document order. Matching is
 * done PHP-side on write because the Resolver is the only authority that can guarantee the chosen alias
 * resolves, and it keeps the whole semantic value map off the editor page.
 *
 * @since TBD
 */
final class Preset_Value_Normalizer {

	/**
	 * @var Token_Resolver The resolver whose flattened semantic values captured literals are matched against.
	 *
	 * @since TBD
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver $resolver The token resolver.
	 */
	public function __construct( Token_Resolver $resolver ) {
		$this->resolver = $resolver;
	}

	/**
	 * Rewrite a property => value token map, replacing each literal with a matching semantic alias where one
	 * exists in the given library.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $tokens The preset's property => alias-or-literal token map.
	 * @param string               $slug   The token library the values are matched against.
	 *
	 * @return array<string, mixed> The token map with literals aliased where a semantic matches.
	 */
	public function normalize( array $tokens, string $slug ): array {
		$index = $this->semantic_index( $slug );

		$out = [];

		foreach ( $tokens as $property => $value ) {
			$out[ $property ] = $this->alias_for( (string) $property, $value, $index );
		}

		return $out;
	}

	/**
	 * The semantic alias for a captured value, or the value unchanged when it is already an alias, is not a
	 * string, or matches no semantic.
	 *
	 * A per-corner slot list is matched slot by slot, so a corner captured as a literal re-joins the theming
	 * cascade exactly as a scalar capture does. Without this a per-corner preset would be second-class:
	 * frozen as literals while every scalar preset gets aliased.
	 *
	 * @since TBD
	 *
	 * @param string                  $property The property the value is set on, used to break ties.
	 * @param mixed                   $value    The captured value (alias string, literal, or slot list).
	 * @param array<string, string[]> $index    The normalized-value => semantic-ids map.
	 *
	 * @return mixed The alias string when matched, otherwise the original value.
	 */
	private function alias_for( string $property, $value, array $index ) {
		if ( is_array( $value ) ) {
			$slots = [];

			foreach ( $value as $key => $slot ) {
				$slots[ $key ] = $this->alias_for( $property, $slot, $index );
			}

			return $slots;
		}

		if ( ! is_string( $value ) || Alias::is_alias( $value ) ) {
			return $value;
		}

		$candidates = $index[ $this->normalize_value( $value ) ] ?? [];

		if ( $candidates === [] ) {
			return $value;
		}

		return Alias::wrap( $this->pick( $property, $candidates ) );
	}

	/**
	 * Build the normalized-value => semantic-ids index for a library: every semantic-layer entry of the
	 * resolved token map, keyed by its normalized value, preserving document order within each bucket.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library to resolve.
	 *
	 * @return array<string, string[]>
	 */
	private function semantic_index( string $slug ): array {
		$prefix = Layers::get_semantic() . '.';
		$index  = [];

		foreach ( $this->resolver->resolve( $slug )->by_id() as $id => $value ) {
			if ( strpos( (string) $id, $prefix ) !== 0 || ! is_string( $value ) ) {
				continue;
			}

			$index[ $this->normalize_value( $value ) ][] = (string) $id;
		}

		return $index;
	}

	/**
	 * Pick the semantic id whose name best matches the property's role, tie-broken by document order.
	 *
	 * @since TBD
	 *
	 * @param string   $property   The property the value is set on, e.g. "button-bg".
	 * @param string[] $candidates The semantic ids sharing the value, in document order.
	 *
	 * @return string
	 */
	private function pick( string $property, array $candidates ): string {
		$parts = array_filter( explode( '-', $property ) );
		$best  = $candidates[0];
		$score = $this->score( $best, $parts );

		foreach ( $candidates as $id ) {
			$candidate_score = $this->score( $id, $parts );

			if ( $candidate_score > $score ) {
				$best  = $id;
				$score = $candidate_score;
			}
		}

		return $best;
	}

	/**
	 * How many of the property's role parts appear in a semantic id.
	 *
	 * @since TBD
	 *
	 * @param string   $id    The semantic id.
	 * @param string[] $parts The property's hyphen-separated role parts.
	 *
	 * @return int
	 */
	private function score( string $id, array $parts ): int {
		$score = 0;

		foreach ( $parts as $part ) {
			if ( $part !== '' && strpos( $id, $part ) !== false ) {
				++$score;
			}
		}

		return $score;
	}

	/**
	 * Normalize a literal for equality: lowercase and trim, and expand a 3-digit hex to its 6-digit form so
	 * "#ABC" matches "#aabbcc". Non-color literals compare on their trimmed, lowercased form; no unit math.
	 *
	 * @since TBD
	 *
	 * @param string $value The literal value.
	 *
	 * @return string
	 */
	private function normalize_value( string $value ): string {
		$value = strtolower( trim( $value ) );

		if ( preg_match( '/^#([0-9a-f])([0-9a-f])([0-9a-f])$/', $value, $matches ) ) {
			return '#' . $matches[1] . $matches[1] . $matches[2] . $matches[2] . $matches[3] . $matches[3];
		}

		return $value;
	}
}
