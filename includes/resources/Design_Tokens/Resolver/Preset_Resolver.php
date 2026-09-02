<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Preset_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;
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
 * presets deep-merged with that library's stored overrides, so a preset a user authored through the store
 * is resolved alongside the baseline ones. The core Resolver's Effective_Document deliberately strips
 * `$extensions`, so presets are resolved here rather than through that deep-merge.
 *
 * @since TBD
 */
final class Preset_Resolver {

	/**
	 * @var Effective_Presets The per-library effective preset definitions (the baseline deep-merged with the library's stored overrides) are read from.
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
	 * @var Preset_Order_Index Applies the stored per-block display order to names(), the single seam every
	 *                          other names()-derived surface (the admin feed, the editor picker) inherits it
	 *                          through.
	 *
	 * @since TBD
	 */
	private Preset_Order_Index $order_index;

	/**
	 * @var Css_Renderer Renders a composite value into the one CSS string its property takes, so a stored
	 *                    composite and an aliased one reach output in the same form.
	 *
	 * @since TBD
	 */
	private Css_Renderer $renderer;

	/**
	 * @since TBD
	 *
	 * @param Effective_Presets  $presets     The per-library effective preset definitions.
	 * @param Token_Resolver     $resolver    The token resolver.
	 * @param Preset_Order_Index $order_index Applies the stored per-block display order to names().
	 * @param Css_Renderer       $renderer    Renders a composite value into its CSS string.
	 */
	public function __construct( Effective_Presets $presets, Token_Resolver $resolver, Preset_Order_Index $order_index, Css_Renderer $renderer ) {
		$this->presets     = $presets;
		$this->resolver    = $resolver;
		$this->order_index = $order_index;
		$this->renderer    = $renderer;
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
	 * @param string $block  The block name, e.g. "kadence/singlebtn".
	 * @param string $preset The preset slug, e.g. "ghost".
	 * @param string $slug   The token library whose effective presets and resolved values are read.
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
			$base = Extensions::preset_value_of( $value );

			if ( $this->flatten( $base, $resolved ) === null ) {
				continue;
			}

			$values[ $property ] = $this->project( $base );
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
	 * @param string $block   The block name, e.g. "kadence/singlebtn".
	 * @param string $preset The preset slug, e.g. "ghost".
	 * @param string $slug    The token library whose effective presets and resolved values are read.
	 *
	 * @throws Unknown_Preset_Exception When the block or preset is not defined.
	 *
	 * @return array<string, string|string[]> property => flattened literal CSS value, or the per-corner
	 *                                        slot list when the preset stores one.
	 */
	public function resolve_literal( string $block, string $preset, string $slug = 'default' ): array {
		$tokens   = $this->preset_tokens( $block, $preset, $slug );
		$resolved = $this->resolver->resolve( $slug );

		$values = [];

		foreach ( $tokens as $property => $value ) {
			$flat = $this->flatten( Extensions::preset_value_of( $value ), $resolved );

			if ( $flat !== null ) {
				$values[ $property ] = $flat;
			}
		}

		return $values;
	}

	/**
	 * Resolve a preset's PER-BREAKPOINT overrides for the css-var projection, in the same var()-preserving
	 * form as resolve().
	 *
	 * A property that varies by breakpoint carries the same envelope a responsive token leaf uses, so an
	 * override is just another preset value — alias, literal or per-corner slot list — and flattens and
	 * projects through the identical path. Only breakpoints that actually override something appear.
	 *
	 * An override whose alias resolves to nothing is dropped for THAT breakpoint only: the base and the
	 * other breakpoints are unaffected, so a stale reference degrades to "no override here" rather than
	 * taking the whole property down.
	 *
	 * @since TBD
	 *
	 * @param string $block  The block name.
	 * @param string $preset The preset slug.
	 * @param string $slug   The token library whose effective presets and resolved values are read.
	 *
	 * @throws Unknown_Preset_Exception When the block or preset is not defined.
	 *
	 * @return array<string, array<string, string>> breakpoint => ( property => var()-preserving value ).
	 */
	public function resolve_responsive( string $block, string $preset, string $slug = 'default' ): array {
		$resolved = $this->resolver->resolve( $slug );
		$out      = [];

		foreach ( $this->preset_tokens( $block, $preset, $slug ) as $property => $value ) {
			foreach ( Extensions::preset_responsive_of( $value ) as $breakpoint => $override ) {
				// Gate on the literal first, exactly as resolve() does, so an override that resolves to
				// nothing never emits a var() pointing at a token the base projection did not define.
				// keep_gaps: true — a per-corner override may legally leave a corner as a `''` gap
				// (see flatten_slots()); that must not fail the whole property here either.
				if ( $this->flatten( $override, $resolved, true ) === null ) {
					continue;
				}

				$out[ (string) $breakpoint ][ (string) $property ] = $this->project( $override );
			}
		}

		return $out;
	}

	/**
	 * Resolve a preset's PER-BREAKPOINT overrides to flattened LITERALS, for the editor surfaces that
	 * cannot consume a var() chain. The literal counterpart of resolve_responsive(), covering exactly the
	 * same overrides.
	 *
	 * A per-corner override may leave some corners as a `''` gap — "not overridden at this breakpoint,
	 * keep inheriting live from the cascade." Unlike every other value this resolver flattens, a gap is
	 * kept in the returned slot list rather than resolved or dropped, so a caller can tell "overridden
	 * here" apart from "not overridden here" per corner. This is the one place this resolver's output is
	 * deliberately sparse; every other property/value it returns is fully resolved.
	 *
	 * @since TBD
	 *
	 * @param string $block  The block name.
	 * @param string $preset The preset slug.
	 * @param string $slug   The token library whose effective presets and resolved values are read.
	 *
	 * @throws Unknown_Preset_Exception When the block or preset is not defined.
	 *
	 * @return array<string, array<string, string|string[]>> breakpoint => ( property => literal value ).
	 */
	public function resolve_responsive_literal( string $block, string $preset, string $slug = 'default' ): array {
		$resolved = $this->resolver->resolve( $slug );
		$out      = [];

		foreach ( $this->preset_tokens( $block, $preset, $slug ) as $property => $value ) {
			foreach ( Extensions::preset_responsive_of( $value ) as $breakpoint => $override ) {
				// keep_gaps: true — the returned slot list must keep a `''` gap in place rather than
				// resolve or drop it, so the editor's per-corner breakpoint cascade can tell "overridden
				// at this breakpoint" apart from "not overridden" per corner.
				$flat = $this->flatten( $override, $resolved, true );

				if ( $flat === null ) {
					continue;
				}

				$out[ (string) $breakpoint ][ (string) $property ] = $flat;
			}
		}

		return $out;
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
	 * @return array<string, string|string[]> property => flattened literal CSS value, or the per-corner
	 *                                        slot list when the preset stores one.
	 */
	public function resolve_default( string $block, string $slug = 'default' ): array {
		return $this->resolve_literal( $block, $this->default_preset( $block, $slug ), $slug );
	}

	/**
	 * The preset slugs a block declares for a library, in DISPLAY order — the effective library (the
	 * baseline deep-merged with the library's stored overrides) being the source of truth for membership, so
	 * a user-added preset in the store appears here alongside the baseline ones, and the stored presetOrder
	 * (when any) determines the sequence. This is the single seam every names()-derived surface (the admin
	 * feed's presets section, the editor picker, Preset_Nav consumers) inherits the display order through,
	 * so the Style Library and the editor can never disagree on it.
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

		return $this->order_index->apply( $this->presets->raw( $slug ), $block, $names );
	}

	/**
	 * Whether a block declares the given preset in a library. False for an unknown block (no throw), so callers
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
	 * The human-readable label a block's preset declares in a library, or null when the block, the preset, or
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
	 * The union of every property the block's presets set a value for in a library — what a
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
	 * A block's default preset slug for a library, read from the effective library's `$default` — the
	 * single source of truth for the default (no registry mirror to drift from).
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
	 * A per-corner slot list flattens slot by slot and STAYS a list — it is deliberately not joined here.
	 * flatten() feeds the editor and admin surfaces through resolve_literal(), and those read a dimension
	 * corner by corner; a pre-joined "8px 4px 8px 4px" is not parseable as a single length and would read
	 * back as one opaque literal. Joining is the css-emitting caller's job, in project().
	 *
	 * @since TBD
	 *
	 * @param mixed           $value     The raw binding value (alias string, literal, or slot list).
	 * @param Resolved_Tokens $resolved  The resolved token maps.
	 * @param bool            $keep_gaps Whether a per-corner `''` gap slot should be kept in the
	 *                                   output instead of failing the whole value closed. Only the
	 *                                   responsive path (resolve_responsive()/resolve_responsive_literal())
	 *                                   passes true — see flatten_slots().
	 *
	 * @return string|string[]|null
	 */
	private function flatten( $value, Resolved_Tokens $resolved, bool $keep_gaps = false ) {
		if ( is_string( $value ) ) {
			return Alias::is_alias( $value ) ? $resolved->value( Alias::path_of( $value ) ) : $value;
		}

		if ( is_int( $value ) || is_float( $value ) ) {
			return (string) $value;
		}

		if ( Token_Type::is_composite_shape( Token_Type::get_type_shadow(), $value ) ) {
			return $this->flatten_composite( $value, $resolved );
		}

		if ( is_array( $value ) ) {
			return $this->flatten_slots( $value, $resolved, $keep_gaps );
		}

		return null;
	}

	/**
	 * Flatten a composite value into the single CSS string its property takes, or null when any required
	 * sub-field fails to flatten.
	 *
	 * Rendered here rather than left as a map because the aliased form of the same property already
	 * arrives rendered — an alias resolves through Resolved_Tokens, which ran the composite through this
	 * same renderer. A stored composite that stayed a map would make one property answer in two different
	 * shapes depending on how it happened to be written.
	 *
	 * `inset` is carried across rather than flattened: it is a boolean, and flatten() answers null for a
	 * boolean, which would drop the whole property. A shadow that saved cleanly and then rendered nothing
	 * is the worst way for this to fail, so the flag skips the step that cannot handle it.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $value    The composite's sub-field map.
	 * @param Resolved_Tokens      $resolved The resolved token maps.
	 *
	 * @return string|null The rendered CSS string, or null when the composite cannot be rendered.
	 */
	private function flatten_composite( array $value, Resolved_Tokens $resolved ): ?string {
		$fields = [];

		foreach ( $value as $field => $sub ) {
			if ( $field === 'inset' ) {
				$fields[ $field ] = $sub;

				continue;
			}

			$flat = $this->flatten( $sub, $resolved );

			if ( ! is_string( $flat ) || $flat === '' ) {
				return null;
			}

			$fields[ $field ] = $flat;
		}

		$rendered = $this->renderer->render( Token_Type::get_type_shadow(), $fields );

		return $rendered === '' ? null : $rendered;
	}

	/**
	 * Flatten a per-corner slot list, or null when any slot fails to flatten.
	 *
	 * A single unresolvable slot drops the WHOLE property rather than emitting a partial shorthand: a
	 * border-radius missing one corner is not a usable value, so failing the property is the same
	 * fail-closed choice a scalar binding makes when its alias resolves to nothing.
	 *
	 * A `''` slot is the "gap" sentinel — "this corner isn't set here, keep inheriting live from the
	 * cascade." It is legal ONLY inside a responsive-override slot list (enforced at write time by
	 * Presets_Controller/Dtcg_Validator); a base value's slot list must never contain one. This method
	 * does not trust that the write-time validation actually ran, so $keep_gaps gates the behavior
	 * itself: resolve_responsive()/resolve_responsive_literal() pass true and get the gap back in
	 * place (their whole point — the editor's per-corner breakpoint cascade needs to see which corners
	 * are, and are not, overridden at a breakpoint); resolve()/resolve_literal() (the base path, via flatten()'s default
	 * false) fail the property closed exactly like any other unresolvable slot, so a gap that somehow
	 * reaches the base path here is caught rather than silently emitted as an empty literal.
	 *
	 * @since TBD
	 *
	 * @param array<int|string, mixed> $slots     The raw slot list.
	 * @param Resolved_Tokens          $resolved  The resolved token maps.
	 * @param bool                     $keep_gaps Whether a `''` gap slot is kept as-is (responsive path)
	 *                                             instead of failing the whole slot list closed (base path).
	 *
	 * @return string[]|null
	 */
	private function flatten_slots( array $slots, Resolved_Tokens $resolved, bool $keep_gaps = false ): ?array {
		$flat = [];

		foreach ( $slots as $slot ) {
			if ( $slot === '' ) {
				if ( ! $keep_gaps ) {
					return null;
				}

				$flat[] = '';
				continue;
			}

			// Nested lists are rejected at validation; guard anyway so a hand-edited document fails closed.
			// $slot is therefore always a scalar here, so flatten() never reaches its array branch — the only
			// branch $keep_gaps affects — and is left at its default.
			$value = is_array( $slot ) ? null : $this->flatten( $slot, $resolved );

			if ( ! is_string( $value ) ) {
				return null;
			}

			$flat[] = $value;
		}

		return $flat === [] ? null : $flat;
	}

	/**
	 * Project one binding value for the css-var output: an alias becomes a `var(--kb-token--<target>)`
	 * reference to its immediate target; a literal (string or number) passes through. The var counterpart
	 * of flatten(), called only after flatten() has confirmed the value resolves, so the target var is
	 * guaranteed to be emitted.
	 *
	 * A per-corner slot list projects each slot the same way and joins them with a space, yielding a CSS
	 * shorthand (e.g. `var(--kb-token--…) 8px var(--kb-token--…) 8px`) that each aliased corner still
	 * chains through, so a token edit reaches that corner live.
	 *
	 * @since TBD
	 *
	 * @param mixed $value The raw binding value (alias string, literal, or slot list).
	 *
	 * @return string
	 */
	private function project( $value ): string {
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			return 'var(' . Css_Var::from_id( Alias::path_of( $value ) ) . ')';
		}

		// Before the slot-list branch: that one joins VALUES in insertion order, which for a composite
		// would emit its color first and produce a valid-looking, wrong shorthand.
		if ( Token_Type::is_composite_shape( Token_Type::get_type_shadow(), $value ) ) {
			$fields = [];

			foreach ( $value as $field => $sub ) {
				$fields[ $field ] = $field === 'inset' ? $sub : $this->project( $sub );
			}

			return $this->renderer->render( Token_Type::get_type_shadow(), $fields );
		}

		if ( is_array( $value ) ) {
			$projected = [];

			foreach ( $value as $slot ) {
				$projected[] = $this->project( $slot );
			}

			return implode( ' ', $projected );
		}

		return Cast::to_string( $value );
	}

	/**
	 * The property => value map for a preset in a library, or throw when the block/preset is undefined.
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
	 * The preset-bearing node for a block in a library: the `$default` plus named presets the rest of the
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
	 * The whole effective presets section for a library (the baseline deep-merged with the library's stored
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
