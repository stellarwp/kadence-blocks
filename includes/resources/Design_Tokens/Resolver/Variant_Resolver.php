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
 * A block's variants may be organized into named GROUPS (independent single-select axes, e.g. a "color"
 * group alongside an "emphasis" group): the document then nests `variants.<block>.<group>.{ $default,
 * <variant> }`. The flat shape (`variants.<block>.{ $default, <variant> }`) is read as the degenerate
 * single group — addressed by the {@see Variant_Resolver::IMPLICIT_GROUP} sentinel — so every accessor
 * takes an optional `$group` and a flat block resolves through that one implicit group with no group
 * argument.
 *
 * Variant definitions are read from the shipped baseline. The core Resolver's Effective_Document
 * deliberately strips `$extensions`, so variants are resolved here rather than through that deep-merge.
 *
 * @since TBD
 */
final class Variant_Resolver {

	/**
	 * The sentinel naming a flat block's single implicit group. A `$`-prefixed id so it can never collide
	 * with a real (kebab-case) group slug, and is skipped by the same `$`-prefix filter that skips
	 * `$default`. A null `$group` argument resolves to this for a flat block.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	public const IMPLICIT_GROUP = '$single';

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
	 * The variant groups (axes) a block declares, in document order. A grouped block returns its explicit
	 * group slugs; a flat block returns a single-element list naming the {@see self::IMPLICIT_GROUP}
	 * sentinel, so callers can iterate axes uniformly whether or not the block is grouped.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return string[]
	 */
	public function groups( string $block ): array {
		$node = $this->block_node( $block );

		if ( ! $this->node_is_grouped( $node ) ) {
			return [ self::IMPLICIT_GROUP ];
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
	 *
	 * @return bool
	 */
	public function is_grouped( string $block ): bool {
		try {
			return $this->node_is_grouped( $this->block_node( $block ) );
		} catch ( Unknown_Variant_Exception $e ) {
			return false;
		}
	}

	/**
	 * Resolve a variant's bindings to a `property => value` map. Aliases flatten through the resolved
	 * token map; literals pass through. A property whose alias resolves to nothing is omitted (it would
	 * render to an empty value), so callers only ever see usable values.
	 *
	 * @since TBD
	 *
	 * @param string      $block   The block name, e.g. "kadence/advancedbtn".
	 * @param string      $variant The variant slug, e.g. "ghost".
	 * @param string      $slug    The token set whose resolved values aliases resolve against.
	 * @param string|null $group   The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block, group or variant is not defined.
	 *
	 * @return array<string, string> property => resolved CSS value.
	 */
	public function resolve( string $block, string $variant, string $slug = 'default', ?string $group = null ): array {
		$tokens   = $this->variant_tokens( $block, $variant, $group );
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
	 * Resolve a group's default ("preset") variant.
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string      $slug  The token set aliases resolve against.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or the group declares no default.
	 *
	 * @return array<string, string> property => resolved CSS value.
	 */
	public function resolve_default( string $block, string $slug = 'default', ?string $group = null ): array {
		return $this->resolve( $block, $this->default_variant( $block, $group ), $slug, $group );
	}

	/**
	 * The variant slugs a group declares, in document order — the document being the single source of
	 * truth for the variant list (a user-added variant in the store would appear here once override
	 * merging lands).
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block or group defines no variants.
	 *
	 * @return string[]
	 */
	public function names( string $block, ?string $group = null ): array {
		$names = [];

		foreach ( array_keys( $this->group_node( $block, $group ) ) as $key ) {
			// Skip `$default` and any other DTCG metadata key; only named variants are slugs.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * Whether a block's group declares the given variant. False for an unknown block or group (no throw),
	 * so callers can validate a selection without first checking the block exists.
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string      $name  The variant slug.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @return bool
	 */
	public function has_variant( string $block, string $name, ?string $group = null ): bool {
		try {
			return in_array( $name, $this->names( $block, $group ), true );
		} catch ( Unknown_Variant_Exception $e ) {
			return false;
		}
	}

	/**
	 * The human-readable label a block's variant declares in the document, or null when the block, the
	 * group, the variant, or its label is absent. A lookup convenience that never throws, mirroring
	 * has_variant().
	 *
	 * @since TBD
	 *
	 * @param string      $block   The block name.
	 * @param string      $variant The variant slug.
	 * @param string|null $group   The variant group, or null for a flat block's implicit group.
	 *
	 * @return string|null
	 */
	public function label( string $block, string $variant, ?string $group = null ): ?string {
		try {
			$group_node = $this->group_node( $block, $group );
		} catch ( Unknown_Variant_Exception $e ) {
			return null;
		}

		$variant_node = $group_node[ $variant ] ?? null;

		if ( ! is_array( $variant_node ) ) {
			return null;
		}

		$label = $variant_node[ Extensions::get_label_key() ] ?? null;

		return is_string( $label ) && $label !== '' ? $label : null;
	}

	/**
	 * The union of every property the block's variants set a value for, across all of its groups — what a
	 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set::consistency()} check compares the
	 * (per-block) bindings against, and what a block preset iterates.
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

		foreach ( $this->groups( $block ) as $group ) {
			foreach ( $this->names( $block, $group ) as $variant ) {
				foreach ( array_keys( $this->variant_tokens( $block, $variant, $group ) ) as $property ) {
					$properties[ (string) $property ] = true;
				}
			}
		}

		return array_keys( $properties );
	}

	/**
	 * A group's default variant slug, read from its `$default` — the single source of truth for the
	 * default (no registry mirror to drift from).
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block is not defined or the group declares no default.
	 *
	 * @return string
	 */
	public function default_variant( string $block, ?string $group = null ): string {
		$default = $this->group_node( $block, $group )[ Extensions::get_default_key() ] ?? '';

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
	 * The property => value map for a variant, or throw when the block/group/variant is undefined.
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
	 * @param string|null $group   The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block, group or variant is not defined.
	 *
	 * @return array<string, mixed>
	 */
	private function variant_tokens( string $block, string $variant, ?string $group = null ): array {
		$group_node = $this->group_node( $block, $group );

		if ( ! isset( $group_node[ $variant ] ) || ! is_array( $group_node[ $variant ] ) ) {
			throw Unknown_Variant_Exception::for_variant( $block, $variant );
		}

		$tokens = $group_node[ $variant ][ Extensions::get_tokens_key() ] ?? [];

		return is_array( $tokens ) ? $tokens : [];
	}

	/**
	 * The variant-bearing node for a (block, group): the `$default` plus named variants the rest of the
	 * resolver reads. For a flat block the block node itself is the single implicit group, so a null or
	 * implicit-sentinel `$group` returns it; an explicit group name then walks one level deeper. A group
	 * mismatch (an explicit name on a flat block, or a null/implicit lookup on a grouped block) throws.
	 *
	 * @since TBD
	 *
	 * @param string      $block The block name.
	 * @param string|null $group The variant group, or null for a flat block's implicit group.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants or the group is unknown.
	 *
	 * @return array<string, mixed>
	 */
	private function group_node( string $block, ?string $group ): array {
		$node       = $this->block_node( $block );
		$is_implicit = $group === null || $group === self::IMPLICIT_GROUP;

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
	 * The raw variants node for a block — either a flat `{ $default, <variant> }` map or a grouped
	 * `{ <group>: { $default, <variant> } }` map — or throw when the block is undefined.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @throws Unknown_Variant_Exception When the block defines no variants.
	 *
	 * @return array<string, mixed>
	 */
	private function block_node( string $block ): array {
		$variants = $this->variants_section();

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
