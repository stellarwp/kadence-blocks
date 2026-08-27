<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Reads the effective presets section: the shipped baseline's presets deep-merged with a library's stored
 * overrides, so a preset authored through the store is visible alongside the baseline ones.
 *
 * This is a thin reader, not a new merge: the deep-merge is {@see Mutator::merge()} (which preserves the
 * whole "$extensions" layer untouched, exactly what a presets view needs), so this class only decodes the
 * baseline and the stored overrides, walks each down to the `$extensions...presets` subtree, and delegates
 * the merge. The sibling {@see Effective_Document} deliberately strips "$extensions", so it cannot be reused
 * here — presets are read through this seam instead.
 *
 * The REST presets controller consumes this for its raw reads. It is also the seam a later projector that
 * needs override-aware resolved values (the native-block and kbPreset projectors) can build on.
 *
 * @since TBD
 */
final class Effective_Presets {

	/**
	 * @var Baseline_Document The shipped baseline the preset definitions are merged onto.
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
	 * @var Mutator The pure deep-merge the baseline and overrides presets are combined through.
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
	 * The effective presets section for a stored library: baseline deep-merged with the library's overrides,
	 * keyed by block name.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	public function section( string $slug = 'default' ): array {
		return $this->for_overrides( $this->raw( $slug ) );
	}

	/**
	 * The effective presets node for one block in a stored library, or null when neither the baseline nor
	 * the overrides define presets for it.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name, e.g. "kadence/singlebtn".
	 * @param string $slug  The token library slug.
	 *
	 * @return array<string, mixed>|null
	 */
	public function block( string $block, string $slug = 'default' ): ?array {
		$section = $this->section( $slug );

		return isset( $section[ $block ] ) && is_array( $section[ $block ] ) ? $section[ $block ] : null;
	}

	/**
	 * The effective presets section for an arbitrary candidate overrides document: the baseline presets
	 * deep-merged with the candidate's presets subtree. Used to validate a write against its post-merge
	 * effective library before it is committed (e.g. that a `$default` still names a present preset).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $overrides A decoded overrides-only DTCG document.
	 *
	 * @return array<string, mixed>
	 */
	public function for_overrides( array $overrides ): array {
		return $this->mutator->merge( $this->presets_of( $this->baseline->document() ), $this->presets_of( $overrides ) );
	}

	/**
	 * The named preset slugs a library defines for a block that are NOT in the baseline — i.e. the
	 * user-created ones. A slug that shadows a baseline preset is excluded, since deleting it reverts to
	 * baseline rather than removing it.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name, e.g. "kadence/singlebtn".
	 * @param string $slug  The token library slug.
	 *
	 * @return string[]
	 */
	public function user_created( string $block, string $slug = 'default' ): array {
		$baseline_block  = $this->block_node( $this->presets_of( $this->baseline->document() ), $block );
		$effective_block = $this->block_node( $this->section( $slug ), $block );

		$baseline_names  = $this->named_of( $baseline_block );
		$effective_names = $this->named_of( $effective_block );

		return array_values( array_diff( $effective_names, $baseline_names ) );
	}

	/**
	 * The preset-bearing node for a block within a presets section — its `{ $default, <preset> }` map —
	 * or an empty array when absent, so the callers above fail soft.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $section The presets section (baseline or effective).
	 * @param string               $block   The block name.
	 *
	 * @return array<string, mixed>
	 */
	private function block_node( array $section, string $block ): array {
		return isset( $section[ $block ] ) && is_array( $section[ $block ] ) ? $section[ $block ] : [];
	}

	/**
	 * The named preset slugs of a block preset node, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's preset node.
	 *
	 * @return string[]
	 */
	private function named_of( array $node ): array {
		$names = [];

		foreach ( array_keys( $node ) as $key ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * Decode a library's stored overrides document, tolerating an absent/empty/malformed row as "no overrides".
	 *
	 * The single decode seam for the stored overrides: callers that need the raw decoded document, rather than
	 * its merged presets view, reuse this instead of decoding the store themselves.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	public function raw( string $slug = 'default' ): array {
		return $this->store->get_decoded_document( $slug );
	}

	/**
	 * Walk a decoded document down to its `$extensions...presets` subtree, or an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $document The decoded document.
	 *
	 * @return array<string, mixed>
	 */
	private function presets_of( array $document ): array {
		$node = $document;

		$path = Extensions::get_presets_path();

		foreach ( $path as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
