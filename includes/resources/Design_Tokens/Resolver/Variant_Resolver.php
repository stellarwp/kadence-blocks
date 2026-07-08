<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set;
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
 * A block's variants can be organized as named variant SETS (picker-driven axes, e.g. a button's "style"
 * set): the document then nests `variants.<block>.<group>.{ $default, <variant> }`, and each set resolves
 * independently. A block may instead ship a single flat PRESET set (`variants.<block>.{ $default,
 * <variant> }`) — its default look, with no picker — which is read through the
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set::get_implicit_group_key()} sentinel. So every
 * accessor takes an optional `$group`: a null argument resolves to that single implicit preset set, while a
 * named set is addressed by its slug. A user-authored variant (added through the store) is a variant within
 * its set, so it sits underneath the per-set override merge unchanged.
 *
 * Variant definitions are read per token set through {@see Effective_Variants}: the shipped baseline's
 * variants deep-merged with that set's stored overrides, so a variant a user authored through the store
 * is resolved alongside the baseline ones. The core Resolver's Effective_Document deliberately strips
 * `$extensions`, so variants are resolved here rather than through that deep-merge.
 *
 * @since TBD
 */
final class Variant_Resolver {

	/**
	 * @var Effective_Variants The per-set effective variant definitions (the baseline deep-merged with the set's stored overrides) are read from.
	 *
	 * @since TBD
	 */
	private Effective_Variants $variants;

	/**
	 * @var Token_Resolver The token resolver whose flattened id map variant aliases are looked up in.
	 *
	 * @since TBD
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Effective_Variants $variants The per-set effective variant definitions.
	 * @param Token_Resolver     $resolver The token resolver.
	 */
	public function __construct( Effective_Variants $variants, Token_Resolver $resolver ) {
		$this->variants = $variants;
		$this->resolver = $resolver;
	}

	/**
	 * The variant groups (axes) a block declares for a set, in document order. A grouped block returns its
	 * explicit group slugs; a flat block returns a single-element list naming the {@see Variant_Set::get_implicit_group_key()}
	 * sentinel, so callers can iterate axes uniformly whether or not the block is grouped.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token set whose effective variants are read.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return string[]
	 */
	public function groups( string $block, string $slug = 'default' ): array {
		$node = $this->block_variants( $block, $slug );

		if ( ! $this->node_is_grouped( $node ) ) {
			return [ Variant_Set::get_implicit_group_key() ];
		}

		$groups = [];

		foreach ( array_keys( $node ) as $key ) {
			// Skip `$default` and any other DTCG metadata key; only named groups are axes.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$groups[] = (string) $key;
		}

		return $groups;
	}

	/**
	 * Whether the block organizes its variants into explicit named groups (multi-axis), as opposed to the
	 * flat single-axis shape read as one implicit group. False for an unknown block (no throw).
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token set whose effective variants are read.
	 *
	 * @return bool
	 */
	public function is_grouped( string $block, string $slug = 'default' ): bool {
		try {
			return $this->node_is_grouped( $this->block_variants( $block, $slug ) );
		} catch ( Unknown_Variant_Exception $e ) {
			return false;
		}
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
	 * @param string      $block     The block name, e.g. "kadence/advancedbtn".
	 * @param string      $variant   The variant slug, e.g. "ghost".
	 * @param string      $slug      The token set whose effective variants and resolved values are read.
	 * @param string      $namespace Css-var namespace for the var() target ('' for the canonical name). When set,
	 *                               an alias becomes var(--kb-token--<namespace>--<target>), so a namespaced
	 *                               variant var chains to that set's namespaced token and stays inside the set.
	 * @param string|null $group     The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block, group or variant is not defined.
	 *
	 * @return array<string, string> property => var()-preserving CSS value.
	 */
	public function resolve( string $block, string $variant, string $slug = 'default', string $namespace = '', ?string $group = null ): array {
		$tokens   = $this->variant_tokens( $block, $variant, $slug, $group );
		$resolved = $this->resolver->resolve( $slug );

		$values = [];

		foreach ( $tokens as $property => $value ) {
			if ( $this->flatten( $value, $resolved ) === null ) {
				continue;
			}

			$values[ $property ] = $this->project( $value, $namespace );
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
	 * @param string      $block   The block name, e.g. "kadence/advancedbtn".
	 * @param string      $variant The variant slug, e.g. "ghost".
	 * @param string      $slug    The token set whose effective variants and resolved values are read.
	 * @param string|null $group   The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block, group or variant is not defined.
	 *
	 * @return array<string, string> property => flattened literal CSS value.
	 */
	public function resolve_literal( string $block, string $variant, string $slug = 'default', ?string $group = null ): array {
		$tokens   = $this->variant_tokens( $block, $variant, $slug, $group );
		$resolved = $this->resolver->resolve( $slug );

		$values = [];

		foreach ( $tokens as $property => $value ) {
			$flat = $this->flatten( $value, $resolved );

			if ( $flat !== null ) {
				$values[ $property ] = $flat;
			}
		}

		return $values;
	}

	/**
	 * Resolve a group's default ("preset") variant to flattened LITERALS.
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
	 * @param string      $block The block name.
	 * @param string      $slug  The token set whose effective variants and resolved values are read.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or the group declares no default.
	 *
	 * @return array<string, string> property => flattened literal CSS value.
	 */
	public function resolve_default( string $block, string $slug = 'default', ?string $group = null ): array {
		return $this->resolve_literal( $block, $this->default_variant( $block, $slug, $group ), $slug, $group );
	}

	/**
	 * The variant slugs a group declares for a set, in document order — the effective set (the baseline
	 * deep-merged with the set's stored overrides) being the source of truth, so a user-added variant in the
	 * store appears here alongside the baseline ones.
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string      $slug  The token set whose effective variants are read.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block or group defines no variants.
	 *
	 * @return string[]
	 */
	public function names( string $block, string $slug = 'default', ?string $group = null ): array {
		$names = [];

		foreach ( array_keys( $this->group_node( $block, $slug, $group ) ) as $key ) {
			// Skip `$default` and any other DTCG metadata key; only named variants are slugs.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * Whether a block's group declares the given variant in a set. False for an unknown block or group (no
	 * throw), so callers can validate a selection without first checking the block exists.
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string      $name  The variant slug.
	 * @param string      $slug  The token set whose effective variants are read.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @return bool
	 */
	public function has_variant( string $block, string $name, string $slug = 'default', ?string $group = null ): bool {
		try {
			return in_array( $name, $this->names( $block, $slug, $group ), true );
		} catch ( Unknown_Variant_Exception $e ) {
			return false;
		}
	}

	/**
	 * The human-readable label a block's variant declares in a set, or null when the block, the group, the
	 * variant, or its label is absent. A lookup convenience that never throws, mirroring has_variant().
	 *
	 * @since TBD
	 *
	 * @param string      $block   The block name.
	 * @param string      $variant The variant slug.
	 * @param string      $slug    The token set whose effective variants are read.
	 * @param string|null $group   The variant group, or null for a flat block's implicit group.
	 *
	 * @return string|null
	 */
	public function label( string $block, string $variant, string $slug = 'default', ?string $group = null ): ?string {
		try {
			$group_node = $this->group_node( $block, $slug, $group );
		} catch ( Unknown_Variant_Exception $e ) {
			return null;
		}

		$variant_node = $group_node[ $variant ] ?? null;

		if ( ! is_array( $variant_node ) ) {
			return null;
		}

		$label = $variant_node['label'] ?? null;

		return is_string( $label ) && $label !== '' ? $label : null;
	}

	/**
	 * The union of every property the block's variants set a value for in a set, across all of its groups —
	 * what a {@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set::consistency()} check compares
	 * the (per-block) bindings against, and what a block preset iterates.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token set whose effective variants are read.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return string[]
	 */
	public function value_properties( string $block, string $slug = 'default' ): array {
		$properties = [];

		foreach ( $this->groups( $block, $slug ) as $group ) {
			foreach ( $this->names( $block, $slug, $group ) as $variant ) {
				foreach ( array_keys( $this->variant_tokens( $block, $variant, $slug, $group ) ) as $property ) {
					$properties[ $property ] = true;
				}
			}
		}

		return array_keys( $properties );
	}

	/**
	 * A group's default variant slug for a set, read from the effective set's `$default` — the single
	 * source of truth for the default (no registry mirror to drift from).
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string      $slug  The token set whose effective variants are read.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or the group declares no default.
	 *
	 * @return string
	 */
	public function default_variant( string $block, string $slug = 'default', ?string $group = null ): string {
		$default = $this->group_node( $block, $slug, $group )[ Extensions::get_default_key() ] ?? '';

		if ( ! is_string( $default ) || $default === '' ) {
			throw Unknown_Variant_Exception::no_default( $block );
		}

		return $default;
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
	 * @param mixed  $value     The raw binding value (alias string or literal).
	 * @param string $namespace Css-var namespace for the var() target ('' for the canonical name).
	 *
	 * @return string
	 */
	private function project( $value, string $namespace = '' ): string {
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			return 'var(' . Css_Var::from_id( Alias::path_of( $value ), $namespace ) . ')';
		}

		return Cast::to_string( $value );
	}

	/**
	 * The property => value map for a variant in a set, or throw when the block/group/variant is undefined.
	 *
	 * A variant that exists but carries no `tokens` map — or a non-array one — resolves to an empty map,
	 * not an error: a variant may legitimately set no values (it then contributes nothing downstream).
	 * Only an undefined block, group or variant is an error; a malformed-but-present `tokens` fails soft,
	 * in line with the resolver's other lookups.
	 *
	 * @since TBD
	 *
	 * @param string      $block   The block name.
	 * @param string      $variant The variant slug.
	 * @param string      $slug    The token set whose effective variants are read.
	 * @param string|null $group   The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block, group or variant is not defined.
	 *
	 * @return array<string, mixed>
	 */
	private function variant_tokens( string $block, string $variant, string $slug = 'default', ?string $group = null ): array {
		$group_node = $this->group_node( $block, $slug, $group );

		if ( ! isset( $group_node[ $variant ] ) || ! is_array( $group_node[ $variant ] ) ) {
			throw Unknown_Variant_Exception::for_variant( $block, $variant );
		}

		$tokens = $group_node[ $variant ][ Extensions::get_tokens_key() ] ?? [];

		return is_array( $tokens ) ? $tokens : [];
	}

	/**
	 * The variant-bearing node for a (block, group) in a set: the `$default` plus named variants the rest
	 * of the resolver reads. For a flat block the block node itself is the single implicit group, so a null
	 * or implicit-sentinel `$group` returns it; an explicit group name then walks one level deeper. A group
	 * mismatch (an explicit name on a flat block, or a null/implicit lookup on a grouped block) throws.
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string      $slug  The token set whose effective variants are read.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants or the group is unknown.
	 *
	 * @return array<string, mixed>
	 */
	private function group_node( string $block, string $slug, ?string $group ): array {
		$node        = $this->block_variants( $block, $slug );
		$is_implicit = $group === null || $group === Variant_Set::get_implicit_group_key();

		if ( ! $this->node_is_grouped( $node ) ) {
			if ( $is_implicit ) {
				return $node;
			}

			throw Unknown_Variant_Exception::for_group( $block, (string) $group );
		}

		if ( $is_implicit || ! isset( $node[ $group ] ) || ! is_array( $node[ $group ] ) ) {
			throw Unknown_Variant_Exception::for_group( $block, (string) $group );
		}

		return $node[ $group ];
	}

	/**
	 * The raw variants node for a block in a set — either a flat `{ $default, <variant> }` map or a grouped
	 * `{ <group>: { $default, <variant> } }` map — or throw when the block is undefined.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token set whose effective variants are read.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return array<string, mixed>
	 */
	private function block_variants( string $block, string $slug = 'default' ): array {
		$variants = $this->variants_section( $slug );

		if ( ! isset( $variants[ $block ] ) || ! is_array( $variants[ $block ] ) ) {
			throw Unknown_Variant_Exception::for_block( $block );
		}

		return $variants[ $block ];
	}

	/**
	 * Whether a block node nests named groups rather than variants directly. A variant always carries a
	 * `tokens` key; a group node does not (it holds `$default` and nested variants). So the block is
	 * grouped when its first named (non-`$`) child is an array with no `tokens` key. A block is uniformly
	 * flat or grouped — pinned by the baseline shape test.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The raw block variants node.
	 *
	 * @return bool
	 */
	private function node_is_grouped( array $node ): bool {
		foreach ( $node as $key => $child ) {
			// Skip `$default` and any other DTCG metadata key; only named children disambiguate the shape.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			return is_array( $child ) && ! array_key_exists( Extensions::get_tokens_key(), $child );
		}

		return false;
	}

	/**
	 * The whole effective variants section for a set (the baseline deep-merged with the set's stored
	 * overrides), or an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set whose effective variants are read.
	 *
	 * @return array<string, mixed>
	 */
	private function variants_section( string $slug = 'default' ): array {
		return $this->variants->section( $slug );
	}
}
