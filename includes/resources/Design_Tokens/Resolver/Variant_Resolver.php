<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Utils\Cast;

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
 * Two value forms are exposed, mirroring the Token_Resolver's literal/projected split. resolve() is the
 * default: it preserves an alias as a `var(--kb-token--<target>)` reference (for the css-var projection,
 * so a variant var chains to the semantic/primitive it points at and follows a token edit live).
 * resolve_literal() is the opt-in exception: it flattens the alias to its concrete leaf value for the
 * surfaces that cannot consume a var() chain (block-attribute presets, the dimension-default fallback,
 * the editor variant-catalog feed).
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
	 * Resolve a variant's bindings to a `property => value` map for the css-var projection, preserving
	 * alias indirection: an alias binding becomes a `var(--kb-token--<target>)` reference (so the variant
	 * var chains to the semantic/primitive it points at and follows a token edit live) while a literal
	 * passes straight through.
	 *
	 * This is the default form — the chain stays intact end to end, with the concrete value living only at
	 * the leaf (the primitive). Reach for resolve_literal() only on a surface that cannot consume a var().
	 *
	 * A property whose alias resolves to nothing is omitted — the same property set resolve_literal()
	 * produces — so only the value *form* differs, not which properties resolve. Gating on the literal
	 * (via flatten()) is what guarantees an aliased target resolves to a real token, hence that its
	 * `--kb-token--*` var is emitted by the base projection for the reference to point at.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name, e.g. "kadence/advancedbtn".
	 * @param string $variant The variant slug, e.g. "ghost".
	 * @param string $slug    The token set whose resolved values aliases resolve against.
	 *
	 * @throws Unknown_Variant_Exception When the block or variant is not defined.
	 *
	 * @return array<string, string> property => var()-preserving CSS value.
	 */
	public function resolve( string $block, string $variant, string $slug = 'default' ): array {
		$tokens   = $this->variant_tokens( $block, $variant );
		$resolved = $this->resolver->resolve( $slug );

		$values = [];

		foreach ( $tokens as $property => $value ) {
			if ( $this->flatten( $value, $resolved ) === null ) {
				continue;
			}

			$values[ (string) $property ] = $this->project( $value );
		}

		return $values;
	}

	/**
	 * Resolve a variant's bindings to a `property => value` map of flattened LITERALS — each alias
	 * collapsed to its final leaf value (a hex/length), not a `var()` reference.
	 *
	 * This is the opt-in exception to resolve(), for the surfaces that cannot consume a var() chain and so
	 * need a concrete value:
	 *
	 *   - block-attribute presets ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Preset\Projector}):
	 *     the value seeds a block attribute an editor control reads back — a color picker can't parse
	 *     `var(...)` into a swatch and a numeric slider can't hold a string, so the default must be concrete;
	 *   - the block-default dimension CSS ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Default_Css\Css_Builder}):
	 *     the literal is the `var(--token, <here>)` fallback for contexts that lack the token vars (e.g. a
	 *     preview iframe);
	 *   - the editor variant-catalog feed ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Variants}):
	 *     the UI renders each value as a swatch.
	 *
	 * Everywhere else prefer resolve() so the indirection survives and the value follows a token edit live.
	 * A property whose alias resolves to nothing is omitted, matching resolve()'s property set.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name, e.g. "kadence/advancedbtn".
	 * @param string $variant The variant slug, e.g. "ghost".
	 * @param string $slug    The token set whose resolved values aliases resolve against.
	 *
	 * @throws Unknown_Variant_Exception When the block or variant is not defined.
	 *
	 * @return array<string, string> property => flattened literal CSS value.
	 */
	public function resolve_literal( string $block, string $variant, string $slug = 'default' ): array {
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
	 * Resolve the block's default ("preset") variant to flattened LITERALS.
	 *
	 * Returns literals — it delegates to resolve_literal(), not resolve() — because its only callers are
	 * concrete-value surfaces: Block_Preset seeds the value into a block attribute default an editor
	 * control reads back, and Block_Default_Css uses it as the literal fallback inside `var(--token, …)`.
	 * Neither can consume a var() chain, so the default must be a concrete leaf value here. The css-var
	 * projection never calls this — it walks the named variants through resolve() (projected) and re-emits
	 * the `$default`'s declarations from those, so the default still chains in CSS.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token set aliases resolve against.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or declares no default.
	 *
	 * @return array<string, string> property => flattened literal CSS value.
	 */
	public function resolve_default( string $block, string $slug = 'default' ): array {
		return $this->resolve_literal( $block, $this->default_variant( $block ), $slug );
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
	 * The human-readable label a block's variant declares in the document, or null when the block, the
	 * variant, or its label is absent. A lookup convenience that never throws, mirroring has_variant().
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name.
	 * @param string $variant The variant slug.
	 *
	 * @return string|null
	 */
	public function label( string $block, string $variant ): ?string {
		$block_node = $this->variants_section()[ $block ] ?? null;

		if ( ! is_array( $block_node ) ) {
			return null;
		}

		$variant_node = $block_node[ $variant ] ?? null;

		if ( ! is_array( $variant_node ) ) {
			return null;
		}

		$label = $variant_node['label'] ?? null;

		return is_string( $label ) && $label !== '' ? $label : null;
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
	 * Project one binding value for the css-var output: an alias becomes a `var(--kb-token--<target>)`
	 * reference to its immediate target; a literal (string or number) passes through. The var counterpart
	 * of flatten(), called only after flatten() has confirmed the value resolves, so the target var is
	 * guaranteed to be emitted.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw binding value (alias string or literal).
	 *
	 * @return string
	 */
	private function project( $value ): string {
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			return 'var(' . Css_Var::from_id( Alias::path_of( $value ) ) . ')';
		}

		return Cast::to_string( $value );
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
