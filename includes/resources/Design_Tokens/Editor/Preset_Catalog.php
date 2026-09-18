<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;

/**
 * Builds the per-library preset catalog the block editor's preset picker, "save as new preset" form, and
 * per-control token picker read.
 *
 * Keyed by token library so the picker can show the presets for the active library, then by block:
 * `{ active: <slug>, libraries: { <slug>: { <block>: {…} } } }`. Per block it carries the `$default` slug, the
 * named presets as { slug, label, userCreated }, the picker control label, the controllable surface as
 * { key, kind, token, control_attr } per bound property so the form can render one input per property, a
 * per-preset resolved-value map ({ preset slug => { property => literal } }) so a control can compare
 * its current value against the selected preset's value, and a per-preset "own override" map
 * ({ preset slug => { property => true } }) distinguishing a preset's genuine stored value from one it
 * only inherits from the baseline's own definition of that preset slug.
 *
 * Every block with preset bindings appears, but only a PICKER set (one that declares a `label`) is given
 * preset OPTIONS; a block's preset / default-preset bindings (no label) carry an empty `presets` list, which
 * is what keeps the editor from rendering a picker where the declaration says there is none. The two are
 * separate concerns: the options drive the preset dropdown, while `properties` drives the per-control token
 * picker, and a block can want the second without the first — kadence/single-icon's Icon Size is exactly
 * that case.
 *
 * It carries no resolved token values beyond those per-preset literals, so it cannot raise the alias-cycle
 * errors the admin feed must guard; preset bindings registered but absent from a token library
 * (Unknown_Preset_Exception) are skipped, so one undefined block never empties the catalog.
 *
 * @since TBD
 */
final class Preset_Catalog {

	/**
	 * The token registry, source of the registered preset-bindings blocks and their bindings.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The preset resolver, source of each block's default, names and labels per library.
	 *
	 * @since TBD
	 *
	 * @var Preset_Resolver
	 */
	private Preset_Resolver $presets;

	/**
	 * The persistence gateway, source of the stored library slugs.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The active-library pointer, so the catalog can report which library the editor renders by default.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The effective-presets reader, source of each preset's user-created provenance per library.
	 *
	 * @since TBD
	 *
	 * @var Effective_Presets
	 */
	private Effective_Presets $effective;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry             $registry  The token registry.
	 * @param Preset_Resolver            $presets  The preset resolver.
	 * @param Token_Store                $store     The persistence gateway.
	 * @param Active_Token_Library_Store $active    The active-library pointer.
	 * @param Effective_Presets          $effective The effective-presets reader.
	 */
	public function __construct(
		Token_Registry $registry,
		Preset_Resolver $presets,
		Token_Store $store,
		Active_Token_Library_Store $active,
		Effective_Presets $effective
	) {
		$this->registry  = $registry;
		$this->presets   = $presets;
		$this->store     = $store;
		$this->active    = $active;
		$this->effective = $effective;
	}

	/**
	 * The catalog: the active library slug plus the per-block catalog for every library.
	 *
	 * @since TBD
	 *
	 * @return array{active: string, libraries: array<string, array<string, mixed>>}
	 */
	public function all(): array {
		$libraries = [];

		foreach ( $this->library_slugs() as $slug ) {
			$libraries[ $slug ] = $this->for_library( $slug );
		}

		return [
			'active'    => $this->active->get(),
			'libraries' => $libraries,
		];
	}

	/**
	 * The per-block catalog for one token library. Only PICKER preset bindings are surfaced; a block's preset /
	 * default-preset bindings (with no `label`) have no picker, so they are skipped.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, array<string, mixed>> block => { default, presets, properties, values,
	 *         references, responsive, overridden, label }.
	 */
	private function for_library( string $slug ): array {
		$out = [];

		foreach ( $this->registry->preset_binding_blocks() as $block ) {
			$bindings = $this->registry->for_block( $block );

			if ( $bindings === null ) {
				continue;
			}

			try {
				$names   = $this->presets->names( $block, $slug );
				$default = $this->presets->default_preset( $block, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Set registered but not defined in this token library — skip, fail soft.
			}

			$out[ $block ] = [
				'default'    => $default,
				// Only a picker-driven set offers preset OPTIONS. A block whose bindings declare no label
				// gets an empty list, which is what keeps the editor from rendering a picker where the
				// declaration says there is none.
				'presets'    => $bindings->label === null ? [] : $this->preset_options( $block, $slug, $names ),
				'properties' => $this->properties_for( $bindings ),
				'values'     => $this->values_for( $block, $slug, $names ),
				'references' => $this->references_for( $block, $slug, $names ),
				'responsive' => $this->responsive_for( $block, $slug, $names ),
				'overridden' => $this->overridden_for( $block, $slug, $names ),
				'label'      => $bindings->label,
			];
		}

		return $out;
	}

	/**
	 * A block's preset options for the picker: { slug, label, userCreated } per named preset, in catalog
	 * order.
	 *
	 * @since TBD
	 *
	 * @param string   $block The block name.
	 * @param string   $slug  The token library slug.
	 * @param string[] $names The preset slugs, in catalog order.
	 *
	 * @return array<int, array{slug: string, label: string, userCreated: bool}> The picker's options.
	 */
	private function preset_options( string $block, string $slug, array $names ): array {
		$user_created = $this->effective->user_created( $block, $slug );
		$options      = [];

		foreach ( $names as $name ) {
			$options[] = [
				'slug'        => $name,
				'label'       => $this->presets->label( $block, $name, $slug ) ?? $name,
				'userCreated' => in_array( $name, $user_created, true ),
			];
		}

		return $options;
	}

	/**
	 * The controllable surface for a block's preset bindings: one { key, kind, token, control_attr, axis }
	 * entry per bound property, in binding order, so the editor form renders an input per property and the
	 * indicator layer can key an override signal to the control attribute. Structure read from the preset
	 * bindings.
	 *
	 * `axis` is non-null only for a property sharing one composite `control_attr` with its siblings (the
	 * border trio), and names which slot of that nested value this property owns. It is what lets the editor
	 * recognize the shape from the declaration instead of from a hardcoded list of property names, so a
	 * second block declaring the same composite under different property keys works with no editor change.
	 *
	 * @since TBD
	 *
	 * @param Preset_Bindings $bindings The block's preset bindings.
	 *
	 * @return array<int, array{key: string, kind: string, token: string|null, control_attr: string|null, responsive_attrs: array<string, string>, axis: string|null}>
	 */
	private function properties_for( Preset_Bindings $bindings ): array {
		$properties = [];

		foreach ( $bindings->bindings as $property => $binding ) {
			$properties[] = [
				'key'              => (string) $property,
				'kind'             => $bindings->kind( (string) $property ),
				'token'            => $binding->token,
				'control_attr'     => $binding->control_attr(),
				'responsive_attrs' => $binding->responsive_attrs(),
				'axis'             => $binding->axis(),
			];
		}

		return $properties;
	}

	/**
	 * The per-preset resolved values for a block's library: `preset slug => ( property => literal CSS value )`,
	 * so the editor can compare a control's current value against the selected preset's value to decide
	 * bound-vs-overridden. Values are flattened literals (hex / length), matching the swatch feed — a control
	 * cannot compare against a `var()` chain. A preset whose resolution fails (undefined in this library) is
	 * skipped, so one bad preset never empties the map.
	 *
	 * A dimension property whose preset stores per-corner values carries the corners as a list rather than
	 * a joined string, so the editor's compare and the control's inherited-default display read each corner
	 * on its own — a joined shorthand is not parseable as a single length.
	 *
	 * @since TBD
	 *
	 * @param string   $block The block name.
	 * @param string   $slug  The token library slug.
	 * @param string[] $names The preset slugs to resolve, in catalog order.
	 *
	 * @return array<string, array<string, string|string[]>> preset slug => ( property => literal value or
	 *                                                       per-corner slot list ).
	 */
	private function values_for( string $block, string $slug, array $names ): array {
		$values = [];

		foreach ( $names as $name ) {
			try {
				$values[ $name ] = $this->presets->resolve_literal( $block, $name, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Preset undefined in this library — skip, fail soft.
			}
		}

		return $values;
	}

	/**
	 * The per-preset CSS REFERENCES for a block's library: `preset slug => ( property => var() chain )`,
	 * the same strings the projected CSS uses.
	 *
	 * The sibling of `values_for()`, and deliberately not a replacement for it — the two answer different
	 * questions. A literal is what a control compares against to decide bound-vs-overridden, because a
	 * `var()` chain cannot be compared to a stored hex. A reference is what the editor PAINTS with when it
	 * has to resolve a preset value itself rather than let a stylesheet do it.
	 *
	 * The difference matters wherever a token's value depends on something the flattening has already
	 * discarded. A per-block color palette is exactly that: the projector emits a `[data-kb-palette]` layer
	 * that redefines the token variables, and the editor mirrors the block's selected palette onto the block
	 * wrapper, so a `var()` reference resolves through whichever palette the block is on. A literal was
	 * resolved against the default palette before it ever reached the editor and cannot follow the block.
	 *
	 * @since TBD
	 *
	 * @param string   $block The block name.
	 * @param string   $slug  The token library slug.
	 * @param string[] $names The preset slugs to resolve, in catalog order.
	 *
	 * @return array<string, array<string, string>> preset slug => ( property => `var()` chain ).
	 */
	private function references_for( string $block, string $slug, array $names ): array {
		$references = [];

		foreach ( $names as $name ) {
			try {
				$references[ $name ] = $this->presets->resolve( $block, $name, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Preset undefined in this library — skip, fail soft.
			}
		}

		return $references;
	}

	/**
	 * The per-breakpoint resolved values for a block's library: `preset slug => ( breakpoint => ( property
	 * => literal ) )`, flattened for the same reason `values_for()` flattens — a control cannot compare
	 * against a `var()` chain.
	 *
	 * A preset that declares no breakpoint overrides carries an empty map rather than being absent, so the
	 * editor can read `responsive[preset]` unconditionally. A preset whose resolution fails is skipped,
	 * matching `values_for()`.
	 *
	 * @since TBD
	 *
	 * @param string   $block The block name.
	 * @param string   $slug  The token library slug.
	 * @param string[] $names The preset slugs to resolve, in catalog order.
	 *
	 * @return array<string, array<string, array<string, string|string[]>>> preset slug => ( breakpoint =>
	 *                                                                     ( property => literal value ) ).
	 */
	private function responsive_for( string $block, string $slug, array $names ): array {
		$responsive = [];

		foreach ( $names as $name ) {
			try {
				$responsive[ $name ] = $this->presets->resolve_responsive_literal( $block, $name, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Preset undefined in this library — skip, fail soft.
			}
		}

		return $responsive;
	}

	/**
	 * Which properties EACH preset genuinely has its own stored override for, as opposed to
	 * `values_for()`'s merged/effective read, which cannot tell a preset's own override apart from a
	 * value it only inherits from the baseline's own definition of that same preset slug (a NAMED
	 * preset the baseline itself ships — `$default`/other shipped slugs — can have real baseline values
	 * for properties nobody has ever explicitly set). A control reads this to decide whether an unset
	 * field should show as bound to the merged value (this preset has its own override) or as a muted
	 * generic default (nothing here is this preset's own).
	 *
	 * @since TBD
	 *
	 * @param string   $block The block name.
	 * @param string   $slug  The token library slug.
	 * @param string[] $names The preset slugs to inspect, in catalog order.
	 *
	 * @return array<string, array<string, bool>> preset slug => ( property => true ), only for
	 *                                            properties the preset's OWN stored tokens carry.
	 */
	private function overridden_for( string $block, string $slug, array $names ): array {
		$overridden = [];

		foreach ( $names as $name ) {
			$overridden[ $name ] = $this->effective->owned_properties( $block, $name, $slug );
		}

		return $overridden;
	}

	/**
	 * The library slugs to build the catalog for: every stored library plus the always-present default.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function library_slugs(): array {
		$slugs = array_map( 'strval', array_column( $this->store->list_stores(), 'slug' ) );

		if ( ! in_array( Token_Store::default_slug(), $slugs, true ) ) {
			array_unshift( $slugs, Token_Store::default_slug() );
		}

		return $slugs;
	}
}
