<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

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
 * The match is deterministic, and its precedence is: the semantic the property's own BINDING declares, then
 * the candidate whose id best matches the property's role, then document order.
 *
 * The binding comes first because it is a statement of intent rather than a guess. Candidates are the
 * semantic-layer entries of the library's resolved token map that share the captured value, so several
 * unrelated semantics collide the moment they resolve alike — four of the shipped ones resolve to `0`. Role
 * scoring alone cannot separate those: it counts how much of the property's name appears in a candidate id,
 * and a preset property is named in camelCase (`borderRadius`) while ids are kebab-case, so before this every
 * candidate scored zero and document order decided. A heading's corner radius of `0` was stored as
 * `{semantic.spacing.media-padding}` — it rendered correctly, because the wrong token resolved to the same
 * literal, and would have drifted the moment that token was edited.
 *
 * A binding that declares no token still falls through to scoring: eight shipped bindings name only a slot or
 * a CSS variable, and requiring a declared token would freeze every one of their captures as a literal.
 *
 * Matching is done PHP-side on write because the Resolver is the only authority that can guarantee the chosen
 * alias resolves, and it keeps the whole semantic value map off the editor page.
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
	 * @param array<string, mixed> $tokens   The preset's property => alias-or-literal token map.
	 * @param string               $slug     The token library the values are matched against.
	 * @param Preset_Bindings|null $bindings The block's bindings, so a property can prefer the semantic it
	 *                                       declares. Null when the caller has no block in hand, which
	 *                                       falls back to role scoring alone.
	 *
	 * @return array<string, mixed> The token map with literals aliased where a semantic matches.
	 */
	public function normalize( array $tokens, string $slug, ?Preset_Bindings $bindings = null ): array {
		$index = $this->semantic_index( $slug );

		$out = [];

		foreach ( $tokens as $property => $value ) {
			$out[ $property ] = $this->alias_for(
				(string) $property,
				$value,
				$index,
				$this->preferred_semantic( $bindings, (string) $property )
			);
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
	 * @param string                  $property  The property the value is set on, used to break ties.
	 * @param mixed                   $value     The captured value (alias string, literal, or slot list).
	 * @param array<string, string[]> $index     The normalized-value => semantic-ids map.
	 * @param string|null             $preferred The semantic this property's binding declares, if any.
	 *
	 * @return mixed The alias string when matched, otherwise the original value.
	 */
	private function alias_for( string $property, $value, array $index, ?string $preferred = null ) {
		// A property that varies by breakpoint keeps its envelope; its base and each override are matched
		// on their own, so a captured per-breakpoint literal re-joins the cascade like any other value.
		if ( is_array( $value ) && array_key_exists( Sentinels::get_value_key(), $value ) ) {
			$entry = $value;

			$entry[ Sentinels::get_value_key() ] = $this->alias_for( $property, Extensions::preset_value_of( $value ), $index, $preferred );

			foreach ( Extensions::preset_responsive_of( $value ) as $breakpoint => $override ) {
				$entry[ Extensions::get_extensions_key() ][ Extensions::get_namespace() ][ Responsive::get_responsive_key() ][ $breakpoint ] =
					$this->alias_for( $property, $override, $index, $preferred );
			}

			return $entry;
		}

		if ( is_array( $value ) ) {
			$slots = [];

			foreach ( $value as $key => $slot ) {
				$slots[ $key ] = $this->alias_for( $property, $slot, $index, $preferred );
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

		// Membership in the candidate list IS the proof that the declared semantic resolves to this exact
		// value, so no second resolve is needed. A declaration that has drifted out of the list falls
		// through to scoring rather than minting an alias that would not round-trip.
		if ( $preferred !== null && in_array( $preferred, $candidates, true ) ) {
			return Alias::wrap( $preferred );
		}

		return Alias::wrap( $this->pick( $property, $candidates ) );
	}

	/**
	 * The semantic a property's binding declares, when it declares one.
	 *
	 * Only a semantic-layer token qualifies. A binding may point straight at a primitive, and aliasing a
	 * captured value to a primitive would skip the semantic layer the cascade is built on.
	 *
	 * @since TBD
	 *
	 * @param Preset_Bindings|null $bindings The block's bindings, or null when the caller has none.
	 * @param string               $property The property to read the declared token for.
	 *
	 * @return string|null The declared semantic id, or null when there is none to prefer.
	 */
	private function preferred_semantic( ?Preset_Bindings $bindings, string $property ): ?string {
		$token = $bindings === null ? null : ( $bindings->binding( $property )->token ?? null );

		if ( ! is_string( $token ) || strpos( $token, Layers::get_semantic() . '.' ) !== 0 ) {
			return null;
		}

		return $token;
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
	 * @param string   $property   The property the value is set on, e.g. "button-bg" or "borderRadius".
	 * @param string[] $candidates The semantic ids sharing the value, in document order.
	 *
	 * @return string
	 */
	private function pick( string $property, array $candidates ): string {
		$parts = $this->role_parts( $property );
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
	 * Split a property name into the role words a semantic id can be scored against.
	 *
	 * Two naming conventions meet here. A binding property is named either kebab-case (`button-bg`) or
	 * camelCase (`borderRadius`), while every token id is kebab-case. Splitting on hyphens alone left a
	 * camelCase property as a single run of characters that appears in no id, so every candidate scored
	 * zero and the tie-break fell through to document order.
	 *
	 * @since TBD
	 *
	 * @param string $property The property name.
	 *
	 * @return string[] The lowercased role words.
	 */
	private function role_parts( string $property ): array {
		$hyphenated = preg_replace( '/(?<=[a-z0-9])(?=[A-Z])/', '-', $property ) ?? $property;

		return array_values( array_filter( explode( '-', strtolower( $hyphenated ) ) ) );
	}

	/**
	 * How many of the property's role words appear in a semantic id.
	 *
	 * @since TBD
	 *
	 * @param string   $id    The semantic id.
	 * @param string[] $parts The property's role words, lowercased.
	 *
	 * @return int
	 */
	private function score( string $id, array $parts ): int {
		$score    = 0;
		$haystack = strtolower( $id );

		foreach ( $parts as $part ) {
			if ( $part !== '' && strpos( $haystack, $part ) !== false ) {
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
