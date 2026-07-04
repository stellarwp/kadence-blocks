<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;

/**
 * Derives "detached from brand": a token whose baseline $value is an alias (the normal shape for
 * a semantic token pointing at a primitive/brand value) but whose effective $value — baseline
 * merged with the currently stored overrides, the exact computation Effective_Document already
 * performs for every other read — is a literal instead.
 *
 * No state is stored. Detachment is a pure function of (baseline, overrides), recomputed on
 * every call, so it can never drift from what the token store actually holds — the same ideology
 * every other projector in this module already follows (see Css_Var_Projector, Palette_Builder).
 *
 * A token whose baseline is ALREADY a literal (most primitives) is never "detached" — there was
 * no alias relationship to lose, so overriding it with a different literal is an ordinary edit,
 * not a demotion.
 *
 * @since TBD
 */
final class Detachment_Detector {

	/**
	 * @since TBD
	 *
	 * @var Baseline_Document
	 */
	private Baseline_Document $baseline;

	/**
	 * @since TBD
	 *
	 * @var Effective_Document
	 */
	private Effective_Document $effective;

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document  $baseline  The shipped baseline document.
	 * @param Effective_Document $effective Builds the baseline-merged effective document.
	 */
	public function __construct( Baseline_Document $baseline, Effective_Document $effective ) {
		$this->baseline  = $baseline;
		$this->effective = $effective;
	}

	/**
	 * Whether a token is currently detached from its baseline alias.
	 *
	 * @since TBD
	 *
	 * @param string               $token_id  The token's dot-path id, e.g. "semantic.color.button-bg".
	 * @param array<string, mixed> $overrides The decoded stored overrides document for the set being checked.
	 *
	 * @return bool
	 */
	public function is_detached( string $token_id, array $overrides ): bool {
		$baseline_leaf = $this->leaf_at( $this->baseline->document(), $token_id );
		if ( $baseline_leaf === null || ! Alias::is_alias( $baseline_leaf[ Sentinels::get_value_key() ] ?? null ) ) {
			return false; // No alias relationship in the baseline to have lost.
		}

		$effective_leaf = $this->leaf_at( $this->effective->build( $overrides ), $token_id );
		if ( $effective_leaf === null ) {
			return false; // Disabled entirely — gone, not detached.
		}

		// Effective_Document::build() already resolves a RESET override ("$value": null) by
		// skipping it and keeping the baseline leaf in place (Effective_Document::merge_node()),
		// so $effective_leaf can never itself be the reset sentinel here — it is either the
		// baseline alias (reset case) or a real stored literal/alias override.
		$value = $effective_leaf[ Sentinels::get_value_key() ] ?? null;

		return ! Alias::is_alias( $value );
	}

	/**
	 * Find the leaf node at a dot-path within a decoded document.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document
	 * @param string               $path
	 *
	 * @return array<string, mixed>|null
	 */
	private function leaf_at( array $document, string $path ): ?array {
		$node = $document;

		foreach ( explode( '.', $path ) as $segment ) {
			if ( ! is_array( $node ) || ! array_key_exists( $segment, $node ) ) {
				return null;
			}
			$node = $node[ $segment ];
		}

		return is_array( $node ) && array_key_exists( Sentinels::get_value_key(), $node ) ? $node : null;
	}
}
