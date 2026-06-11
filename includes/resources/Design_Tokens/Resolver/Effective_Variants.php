<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads the effective variants section: the shipped baseline's variants deep-merged with a set's stored
 * overrides, so a variant authored through the store is visible alongside the baseline ones.
 *
 * This is a thin reader, not a new merge: the deep-merge is {@see Mutator::merge()} (which preserves the
 * whole "$extensions" layer untouched, exactly what a variants view needs), so this class only decodes the
 * baseline and the stored overrides, walks each down to the `$extensions...variants` subtree, and delegates
 * the merge. The sibling {@see Effective_Document} deliberately strips "$extensions", so it cannot be reused
 * here — variants are read through this seam instead.
 *
 * The REST variants controller consumes this for its raw reads. It is also the seam a later projector that
 * needs override-aware resolved values (the native-block and kbVariant projectors) can build on.
 *
 * @since TBD
 */
final class Effective_Variants {

	/**
	 * @var Baseline_Document The shipped baseline the variant definitions are merged onto.
	 *
	 * @since TBD
	 */
	private Baseline_Document $baseline;

	/**
	 * @var Token_Store The gateway the stored overrides are read from.
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * @var Mutator The pure deep-merge the baseline and overrides variants are combined through.
	 *
	 * @since TBD
	 */
	private Mutator $mutator;

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document $baseline The shipped baseline document.
	 * @param Token_Store       $store    The persistence gateway.
	 * @param Mutator           $mutator  The pure deep-merge.
	 */
	public function __construct( Baseline_Document $baseline, Token_Store $store, Mutator $mutator ) {
		$this->baseline = $baseline;
		$this->store    = $store;
		$this->mutator  = $mutator;
	}

	/**
	 * The effective variants section for a stored set: baseline deep-merged with the set's overrides, keyed
	 * by block name.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>
	 */
	public function section( string $slug = 'default' ): array {
		return $this->for_overrides( $this->stored_document( $slug ) );
	}

	/**
	 * The effective variants node for one block in a stored set, or null when neither the baseline nor the
	 * overrides define variants for it.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name, e.g. "kadence/advancedbtn".
	 * @param string $slug  The token set slug.
	 *
	 * @return array<string, mixed>|null
	 */
	public function block( string $block, string $slug = 'default' ): ?array {
		$section = $this->section( $slug );

		return isset( $section[ $block ] ) && is_array( $section[ $block ] ) ? $section[ $block ] : null;
	}

	/**
	 * The effective variants section for an arbitrary candidate overrides document: the baseline variants
	 * deep-merged with the candidate's variants subtree. Used to validate a write against its post-merge
	 * effective set before it is committed (e.g. that a `$default` still names a present variant).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, mixed>
	 */
	public function for_overrides( array $overrides ): array {
		return $this->mutator->merge( $this->variants_of( $this->baseline->document() ), $this->variants_of( $overrides ) );
	}

	/**
	 * Decode the set's stored overrides document, tolerating an absent/empty/malformed row as "no overrides".
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed>
	 */
	private function stored_document( string $slug ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}

	/**
	 * Walk a decoded document down to its `$extensions...variants` subtree, or an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded document.
	 *
	 * @return array<string, mixed>
	 */
	private function variants_of( array $document ): array {
		$node = $document;

		$path = Extensions::get_variants_path();

		foreach ( $path as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
