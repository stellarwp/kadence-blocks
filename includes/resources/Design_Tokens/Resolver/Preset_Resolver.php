<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Utils\Cast;

/**
 * Flattens a block preset's token bindings to CSS-ready values — the preset counterpart of the
 * Token_Resolver, and the seam the block-preset and preset projectors build on.
 *
 * A preset's values live in the document under
 * `$extensions.com.kadence.designTokens.presets.<block>.<preset>.tokens` as a property => alias-or-
 * literal map. This resolver reads that map and, for each property, returns the final value: an alias
 * (`{semantic.color.button-bg}`) is looked up in the Token_Resolver's already-resolved id map (so it
 * reuses the existing cycle-safe, cached flattening); a literal passes straight through. The output is
 * `property => value`; the projection *target* for each property comes from the Preset_Bindings's
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Binding} — value and target are kept separate
 * so each downstream projector maps them its own way.
 *
 * Two value forms are exposed, mirroring the Token_Resolver's literal/projected split. resolve() is the
 * default: it preserves an alias as a `var(--kb-token--<target>)` reference (for the css-var projection,
 * so a preset var chains to the semantic/primitive it points at and follows a token edit live).
 * resolve_literal() is the opt-in exception: it flattens the alias to its concrete leaf value for the
 * surfaces that cannot consume a var() chain (block-attribute presets, the dimension-default fallback,
 * the editor preset-catalog feed).
 *
 * A block declares one flat preset list: the document nests `presets.<block>.{ $default, <preset> }`,
 * where `$default` names the default preset and each named key is a preset. Different presets may
 * define different subsets of the block's bound surface — a property a preset omits simply does not
 * resolve for it, inherited from the block `$default` through the cascade. A user-authored preset (added
 * through the store) is a preset in the same list, so it sits underneath the override merge unchanged.
 *
 * Preset definitions are read per token library through {@see Effective_Presets}: the shipped baseline's
 * presets deep-merged with that set's stored overrides, so a preset a user authored through the store
 * is resolved alongside the baseline ones. The core Resolver's Effective_Document deliberately strips
 * `$extensions`, so presets are resolved here rather than through that deep-merge.
 *
 * @since TBD
 */
final class Preset_Resolver {

	/**
	 * @var Effective_Presets The per-set effective preset definitions (the baseline deep-merged with the set's stored overrides) are read from.
	 *
	 * @since TBD
	 */
	private Effective_Presets $presets;

	/**
	 * @var Token_Resolver The token resolver whose flattened id map preset aliases are looked up in.
	 *
	 * @since TBD
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Effective_Presets $presets The per-set effective preset definitions.
	 * @param Token_Resolver     $resolver The token resolver.
	 */
	public function __construct( Effective_Presets $presets, Token_Resolver $resolver ) {
		$this->presets = $presets;
		$this->resolver = $resolver;
	}

	/**
	 * Resolve a preset's bindings to a `property => value` map for the css-var projection, preserving
	 * alias indirection: an alias binding becomes a `var(--kb-token--<target>)` reference (so the preset
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
	 * @param string $preset The preset slug, e.g. "ghost".
	 * @param string $slug    The token library whose effective presets and resolved values are read.
	 *
	 * @throws Unknown_Preset_Exception When the block or preset is not defined.
	 *
	 * @return array<string, string> property => var()-preserving CSS value.
	 */
	public function resolve( string $block, string $preset, string $slug = 'default' ): array {
		$tokens   = $this->preset_tokens( $block, $preset, $slug );
		$resolved = $this->resolver->resolve( $slug );

		$values = [];

		foreach ( $tokens as $property => $value ) {
			if ( $this->flatten( $value, $resolved ) === null ) {
				continue;
			}

			$values[ $property ] = $this->project( $value );
		}

		return $values;
	}

	/**
	 * Resolve a preset's bindings to a `property => value` map of flattened LITERALS — each alias
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
	 *   - the editor preset-catalog feed ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Presets}):
	 *     the UI renders each value as a swatch.
	 *
	 * Everywhere else prefer resolve() so the indirection survives and the value follows a token edit live.
	 * A property whose alias resolves to nothing is omitted, matching resolve()'s property set.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name, e.g. "kadence/advancedbtn".
	 * @param string $preset The preset slug, e.g. "ghost".
	 * @param string $slug    The token library whose effective presets and resolved values are read.
	 *
	 * @throws Unknown_Preset_Exception When the block or preset is not defined.
	 *
	 * @return array<string, string> property => flattened literal CSS value.
	 */
	public function resolve_literal( string $block, string $preset, string $slug = 'default' ): array {
		$tokens   = $this->preset_tokens( $block, $preset, $slug );
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
	 * Resolve a block's default ("preset") preset to flattened LITERALS.
	 *
	 * Returns literals — it delegates to resolve_literal(), not resolve() — because its only callers are
	 * concrete-value surfaces: Block_Preset seeds the value into a block attribute default an editor
	 * control reads back, and Block_Default_Css uses it as the literal fallback inside `var(--token, …)`.
	 * Neither can consume a var() chain, so the default must be a concrete leaf value here. The css-var
	 * projection never calls this — it walks the named presets through resolve() (projected) and re-emits
	 * the `$default`'s declarations from those, so the default still chains in CSS.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token library whose effective presets and resolved values are read.
	 *
	 * @throws Unknown_Preset_Exception When the block is not defined or declares no default.
	 *
	 * @return array<string, string> property => flattened literal CSS value.
	 */
	public function resolve_default( string $block, string $slug = 'default' ): array {
		return $this->resolve_literal( $block, $this->default_preset( $block, $slug ), $slug );
	}

	/**
	 * The preset slugs a block declares for a set, in document order — the effective set (the baseline
	 * deep-merged with the set's stored overrides) being the source of truth, so a user-added preset in the
	 * store appears here alongside the baseline ones.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token library whose effective presets are read.
	 *
	 * @throws Unknown_Preset_Exception When the block defines no presets.
	 *
	 * @return string[]
	 */
	public function names( string $block, string $slug = 'default' ): array {
		$names = [];

		foreach ( array_keys( $this->block_presets( $block, $slug ) ) as $key ) {
			// Skip `$default` and any other DTCG metadata key; only named presets are slugs.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * Whether a block declares the given preset in a set. False for an unknown block (no throw), so callers
	 * can validate a selection without first checking the block exists.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $name  The preset slug.
	 * @param string $slug  The token library whose effective presets are read.
	 *
	 * @return bool
	 */
	public function has_preset( string $block, string $name, string $slug = 'default' ): bool {
		try {
			return in_array( $name, $this->names( $block, $slug ), true );
		} catch ( Unknown_Preset_Exception $e ) {
			return false;
		}
	}

	/**
	 * The human-readable label a block's preset declares in a set, or null when the block, the preset, or
	 * its label is absent. A lookup convenience that never throws, mirroring has_preset().
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name.
	 * @param string $preset The preset slug.
	 * @param string $slug    The token library whose effective presets are read.
	 *
	 * @return string|null
	 */
	public function label( string $block, string $preset, string $slug = 'default' ): ?string {
		try {
			$node = $this->block_presets( $block, $slug );
		} catch ( Unknown_Preset_Exception $e ) {
			return null;
		}

		$preset_node = $node[ $preset ] ?? null;

		if ( ! is_array( $preset_node ) ) {
			return null;
		}

		$label = $preset_node['label'] ?? null;

		return is_string( $label ) && $label !== '' ? $label : null;
	}

	/**
	 * The union of every property the block's presets set a value for in a set — what a
	 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings::consistency()} check compares the
	 * block's bindings against, and what a block preset iterates.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token library whose effective presets are read.
	 *
	 * @throws Unknown_Preset_Exception When the block defines no presets.
	 *
	 * @return string[]
	 */
	public function value_properties( string $block, string $slug = 'default' ): array {
		$properties = [];

		foreach ( $this->names( $block, $slug ) as $preset ) {
			foreach ( array_keys( $this->preset_tokens( $block, $preset, $slug ) ) as $property ) {
				$properties[ $property ] = true;
			}
		}

		return array_keys( $properties );
	}

	/**
	 * A block's default preset slug for a set, read from the effective set's `$default` — the single
	 * source of truth for the default (no registry mirror to drift from).
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token library whose effective presets are read.
	 *
	 * @throws Unknown_Preset_Exception When the block is not defined or declares no default.
	 *
	 * @return string
	 */
	public function default_preset( string $block, string $slug = 'default' ): string {
		$default = $this->block_presets( $block, $slug )[ Extensions::get_default_key() ] ?? '';

		if ( ! is_string( $default ) || $default === '' ) {
			throw Unknown_Preset_Exception::no_default( $block );
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
	 * The property => value map for a preset in a set, or throw when the block/preset is undefined.
	 *
	 * A preset that exists but carries no `tokens` map — or a non-array one — resolves to an empty map,
	 * not an error: a preset may legitimately set no values (it then contributes nothing downstream).
	 * Only an undefined block or preset is an error; a malformed-but-present `tokens` fails soft, in line
	 * with the resolver's other lookups.
	 *
	 * @since TBD
	 *
	 * @param string $block   The block name.
	 * @param string $preset The preset slug.
	 * @param string $slug    The token library whose effective presets are read.
	 *
	 * @throws Unknown_Preset_Exception When the block or preset is not defined.
	 *
	 * @return array<string, mixed>
	 */
	private function preset_tokens( string $block, string $preset, string $slug = 'default' ): array {
		$node = $this->block_presets( $block, $slug );

		if ( ! isset( $node[ $preset ] ) || ! is_array( $node[ $preset ] ) ) {
			throw Unknown_Preset_Exception::for_preset( $block, $preset );
		}

		$tokens = $node[ $preset ][ Extensions::get_tokens_key() ] ?? [];

		return is_array( $tokens ) ? $tokens : [];
	}

	/**
	 * The preset-bearing node for a block in a set: the `$default` plus named presets the rest of the
	 * resolver reads — or throw when the block is undefined.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 * @param string $slug  The token library whose effective presets are read.
	 *
	 * @throws Unknown_Preset_Exception When the block defines no presets.
	 *
	 * @return array<string, mixed>
	 */
	private function block_presets( string $block, string $slug = 'default' ): array {
		$presets = $this->presets_section( $slug );

		if ( ! isset( $presets[ $block ] ) || ! is_array( $presets[ $block ] ) ) {
			throw Unknown_Preset_Exception::for_block( $block );
		}

		return $presets[ $block ];
	}

	/**
	 * The whole effective presets section for a set (the baseline deep-merged with the set's stored
	 * overrides), or an empty array when absent.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library whose effective presets are read.
	 *
	 * @return array<string, mixed>
	 */
	private function presets_section( string $slug = 'default' ): array {
		return $this->presets->section( $slug );
	}
}
