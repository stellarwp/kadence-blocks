<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Presets;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;

/**
 * Builds the per-set preset catalog the block editor's preset picker and "save as new preset" form read.
 *
 * Keyed by token set so the picker can show the presets for whichever set a block is on (its `kbTokenSet`,
 * or the active set), not just the active one, then by block:
 * `{ active: <slug>, sets: { <slug>: { <block>: {…} } } }`. Per block it carries the `$default` slug, the
 * named presets as { slug, label, userCreated }, the picker control label, the controllable surface as
 * { key, kind, token, control_attr } per bound property so the form can render one input per property, and
 * a per-preset resolved-value map ({ preset slug => { property => literal } }) so a control can compare
 * its current value against the selected preset's value. Only PICKER binding sets appear (a binding set
 * that declares a `label`); a block's preset / default-preset binding set (no label) has no picker and is
 * omitted. It carries no
 * resolved token values beyond those per-preset literals, so it cannot raise the alias-cycle errors the
 * admin feed must guard; a set registered but absent from a token set (Unknown_Preset_Exception) is
 * skipped, so one undefined set never empties the catalog.
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
	 * The preset resolver, source of each block's default, names and labels per set.
	 *
	 * @since TBD
	 *
	 * @var Preset_Resolver
	 */
	private Preset_Resolver $presets;

	/**
	 * The persistence gateway, source of the stored set slugs.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The active-set pointer, so the catalog can report which set the editor renders by default.
	 *
	 * @since TBD
	 *
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

	/**
	 * The effective-presets reader, source of each preset's user-created provenance per set.
	 *
	 * @since TBD
	 *
	 * @var Effective_Presets
	 */
	private Effective_Presets $effective;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry    $registry  The token registry.
	 * @param Preset_Resolver   $presets  The preset resolver.
	 * @param Token_Store       $store     The persistence gateway.
	 * @param Active_Set_Store  $active    The active-set pointer.
	 * @param Effective_Presets $effective The effective-presets reader.
	 */
	public function __construct(
		Token_Registry $registry,
		Preset_Resolver $presets,
		Token_Store $store,
		Active_Set_Store $active,
		Effective_Presets $effective
	) {
		$this->registry  = $registry;
		$this->presets   = $presets;
		$this->store     = $store;
		$this->active    = $active;
		$this->effective = $effective;
	}

	/**
	 * The catalog: the active set slug plus the per-block catalog for every set.
	 *
	 * @since TBD
	 *
	 * @return array{active: string, sets: array<string, array<string, mixed>>}
	 */
	public function all(): array {
		$sets = [];

		foreach ( $this->set_slugs() as $slug ) {
			$sets[ $slug ] = $this->for_set( $slug );
		}

		return [
			'active' => $this->active->get(),
			'sets'   => $sets,
		];
	}

	/**
	 * The per-block catalog for one token set. Only PICKER binding sets are surfaced; a block's preset /
	 * default-preset binding set (one with no `label`) has no picker, so it is skipped.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, array<string, mixed>> block => { default, presets, properties, values, label }.
	 */
	private function for_set( string $slug ): array {
		$out = [];

		foreach ( $this->registry->preset_binding_blocks() as $block ) {
			$set = $this->registry->for_block( $block );

			// A preset / default-preset binding set (no label) shows no picker, so it is not offered here.
			if ( $set === null || $set->label === null ) {
				continue;
			}

			try {
				$names   = $this->presets->names( $block, $slug );
				$default = $this->presets->default_preset( $block, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Set registered but not defined in this token set — skip, fail soft.
			}

			$user_created = $this->effective->user_created( $block, $slug );

			$presets = [];

			foreach ( $names as $name ) {
				$presets[] = [
					'slug'        => $name,
					'label'       => $this->presets->label( $block, $name, $slug ) ?? $name,
					'userCreated' => in_array( $name, $user_created, true ),
				];
			}

			$out[ $block ] = [
				'default'    => $default,
				'presets'    => $presets,
				'properties' => $this->properties_for( $set ),
				'values'     => $this->values_for( $block, $slug, $names ),
				'label'      => $set->label,
			];
		}

		return $out;
	}

	/**
	 * The controllable surface for a binding set: one { key, kind, token, control_attr } entry per bound
	 * property, in binding order, so the editor form renders an input per property and the indicator layer
	 * can key an override signal to the control attribute. Set-structure read from the set's bindings.
	 *
	 * @since TBD
	 *
	 * @param Preset_Bindings $set The binding set.
	 *
	 * @return array<int, array{key: string, kind: string, token: string|null, control_attr: string|null}>
	 */
	private function properties_for( Preset_Bindings $set ): array {
		$properties = [];

		foreach ( $set->bindings as $property => $binding ) {
			$properties[] = [
				'key'          => (string) $property,
				'kind'         => $set->kind( (string) $property ),
				'token'        => $binding->token,
				'control_attr' => $binding->control_attr(),
			];
		}

		return $properties;
	}

	/**
	 * The per-preset resolved values for a block's set: `preset slug => ( property => literal CSS value )`,
	 * so the editor can compare a control's current value against the selected preset's value to decide
	 * bound-vs-overridden. Values are flattened literals (hex / length), matching the swatch feed — a control
	 * cannot compare against a `var()` chain. A preset whose resolution fails (undefined in this set) is
	 * skipped, so one bad preset never empties the map.
	 *
	 * @since TBD
	 *
	 * @param string   $block The block name.
	 * @param string   $slug  The token set slug.
	 * @param string[] $names The preset slugs to resolve, in catalog order.
	 *
	 * @return array<string, array<string, string>> preset slug => ( property => literal value ).
	 */
	private function values_for( string $block, string $slug, array $names ): array {
		$values = [];

		foreach ( $names as $name ) {
			try {
				$values[ $name ] = $this->presets->resolve_literal( $block, $name, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Preset undefined in this set — skip, fail soft.
			}
		}

		return $values;
	}

	/**
	 * The set slugs to build the catalog for: every stored set plus the always-present default.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function set_slugs(): array {
		$slugs = array_map( 'strval', array_column( $this->store->list_stores(), 'slug' ) );

		if ( ! in_array( Token_Store::default_slug(), $slugs, true ) ) {
			array_unshift( $slugs, Token_Store::default_slug() );
		}

		return $slugs;
	}
}
