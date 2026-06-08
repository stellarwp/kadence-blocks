<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Flattens a block variant's token bindings to CSS-ready values — the variant counterpart of the
 * Token_Resolver, and the seam the block-preset and variant projectors build on.
 *
 * A variant's values live in the document under
 * `$extensions.com.kadence.designTokens.variants.<block>.<variant>.tokens` as a property => alias-or-
 * literal map. This resolver reads that map and, for each property, returns the final value: an alias
 * (`{semantic.color.button-bg}`) is looked up in the Token_Resolver's already-resolved id map (so it
 * reuses the existing cycle-safe, cached flattening); a literal passes straight through. The output is
 * `property => value`; the projection *target* for each property comes from the Variant_Set's
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding} — value and target are kept separate
 * so each downstream projector maps them its own way.
 *
 * Variant definitions are read from the shipped baseline. The core Resolver's Effective_Document
 * deliberately strips `$extensions`, so variants are resolved here rather than through that deep-merge.
 *
 * @since TBD
 */
final class Variant_Resolver {

	/**
	 * @var Baseline_Document The shipped baseline the variant definitions are read from.
	 *
	 * @since TBD
	 */
	private Baseline_Document $baseline;

	/**
	 * @var Token_Resolver The token resolver whose flattened id map variant aliases are looked up in.
	 *
	 * @since TBD
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Baseline_Document $baseline The shipped baseline document.
	 * @param Token_Resolver    $resolver The token resolver.
	 */
	public function __construct( Baseline_Document $baseline, Token_Resolver $resolver ) {
		$this->baseline = $baseline;
		$this->resolver = $resolver;
	}

	/**
	 * Resolve a variant's bindings to a `property => value` map. Aliases flatten through the resolved
	 * token map; literals pass through. A property whose alias resolves to nothing is omitted (it would
	 * render to an empty value), so callers only ever see usable values.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name, e.g. "kadence/advancedbtn".
	 * @param string $variant The variant slug, e.g. "ghost".
	 * @param string $slug    The token set whose resolved values aliases resolve against.
	 *
	 * @throws Unknown_Variant_Exception When the block or variant is not defined.
	 *
	 * @return array<string, string> property => resolved CSS value.
	 */
	public function resolve( string $block, string $variant, string $slug = 'default' ): array {
		$tokens   = $this->variant_tokens( $block, $variant );
		$resolved = $this->resolver->resolve( $slug );

		$values = [];

		foreach ( $tokens as $property => $value ) {
			$flat = $this->flatten( $value, $resolved );

			if ( $flat !== null ) {
				$values[ (string) $property ] = $flat;
			}
		}

		return $values;
	}

	/**
	 * Resolve the block's default ("preset") variant.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token set aliases resolve against.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or declares no default.
	 *
	 * @return array<string, string> property => resolved CSS value.
	 */
	public function resolve_default( string $block, string $slug = 'default' ): array {
		return $this->resolve( $block, $this->default_variant( $block ), $slug );
	}

	/**
	 * The variant slugs a block declares, in document order — the document being the single source of
	 * truth for the variant list (a user-added variant in the store would appear here once override
	 * merging lands).
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return string[]
	 */
	public function names( string $block ): array {
		$names = [];

		foreach ( array_keys( $this->block_variants( $block ) ) as $key ) {
			// Skip `$default` and any other DTCG metadata key; only named variants are slugs.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * Whether a block declares the given variant. False for an unknown block (no throw), so callers can
	 * validate a selection without first checking the block exists.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $name  The variant slug.
	 *
	 * @return bool
	 */
	public function has_variant( string $block, string $name ): bool {
		$section = $this->variants_section();

		if ( ! isset( $section[ $block ] ) || ! is_array( $section[ $block ] ) ) {
			return false;
		}

		return in_array( $name, $this->names( $block ), true );
	}

	/**
	 * The union of every property the block's variants set a value for — what a {@see
	 * \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set::consistency()} check compares the
	 * bindings against, and what a block preset iterates.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return string[]
	 */
	public function value_properties( string $block ): array {
		$properties = [];

		foreach ( $this->names( $block ) as $variant ) {
			foreach ( array_keys( $this->variant_tokens( $block, $variant ) ) as $property ) {
				$properties[ (string) $property ] = true;
			}
		}

		return array_keys( $properties );
	}

	/**
	 * Flatten one binding value: an alias is looked up in the resolved id map; a scalar literal passes
	 * through. Anything else (or an unresolvable alias) yields null so the property is dropped.
	 *
	 * @since TBD
	 *
	 * @param mixed           $value    The raw binding value (alias string or literal).
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 *
	 * @return string|null
	 */
	private function flatten( $value, Resolved_Tokens $resolved ): ?string {
		if ( is_string( $value ) ) {
			return Alias::is_alias( $value ) ? $resolved->value( Alias::path_of( $value ) ) : $value;
		}

		if ( is_int( $value ) || is_float( $value ) ) {
			return (string) $value;
		}

		return null;
	}

	/**
	 * The property => value map for a variant, or throw when the block/variant is undefined.
	 *
	 * A variant that exists but carries no `tokens` map — or a non-array one — resolves to an empty map,
	 * not an error: a variant may legitimately set no values (it then contributes nothing downstream).
	 * Only an undefined block or variant is an error; a malformed-but-present `tokens` fails soft, in line
	 * with the resolver's other lookups.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name.
	 * @param string $variant The variant slug.
	 *
	 * @throws Unknown_Variant_Exception When the block or variant is not defined.
	 *
	 * @return array<string, mixed>
	 */
	private function variant_tokens( string $block, string $variant ): array {
		$block_variants = $this->block_variants( $block );

		if ( ! isset( $block_variants[ $variant ] ) || ! is_array( $block_variants[ $variant ] ) ) {
			throw Unknown_Variant_Exception::for_variant( $block, $variant );
		}

		$tokens = $block_variants[ $variant ][ Extensions::get_tokens_key() ] ?? [];

		return is_array( $tokens ) ? $tokens : [];
	}

	/**
	 * The block's default variant slug, read from the document's `$default` — the single source of truth
	 * for the default (no registry mirror to drift from).
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or declares no default.
	 *
	 * @return string
	 */
	public function default_variant( string $block ): string {
		$default = $this->block_variants( $block )[ Extensions::get_default_key() ] ?? '';

		if ( ! is_string( $default ) || $default === '' ) {
			throw Unknown_Variant_Exception::no_default( $block );
		}

		return $default;
	}

	/**
	 * The variants node for a block (its `$default` plus named variants), or throw when undefined.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return array<string, mixed>
	 */
	private function block_variants( string $block ): array {
		$variants = $this->variants_section();

		if ( ! isset( $variants[ $block ] ) || ! is_array( $variants[ $block ] ) ) {
			throw Unknown_Variant_Exception::for_block( $block );
		}

		return $variants[ $block ];
	}

	/**
	 * The whole variants section from the baseline, or an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function variants_section(): array {
		$node = $this->baseline->document();

		$path = [
			Extensions::get_extensions_key(),
			Extensions::get_namespace(),
			Extensions::get_section_variants(),
		];

		foreach ( $path as $key ) {
			if ( ! is_array( $node ) || ! isset( $node[ $key ] ) ) {
				return [];
			}

			$node = $node[ $key ];
		}

		return is_array( $node ) ? $node : [];
	}
}
