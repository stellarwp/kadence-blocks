<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Resolver;

/**
 * Builds the admin UI feed's "presets" section: for every block's registered preset bindings — keyed
 * by block — its default, preset names, per-property bindings (structure) and resolved preview values.
 *
 * Structure comes from the registry ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Preset_Bindings::to_ui_schema()});
 * the preset list and resolved values come from the {@see Preset_Resolver} against the live store. A
 * preset bindings registered but absent from the document (Unknown_Preset_Exception) are skipped, and a
 * single preset that fails to resolve is omitted, so one block's malformed preset bindings never break the whole
 * feed. The corrupt-store case (the Token_Resolver throwing an alias-cycle / dangling-alias
 * RuntimeException from inside resolve()) is NOT swallowed here — it is the Localizer's fail-open
 * boundary. A block's preset / default-preset bindings (with no picker) surface the same way, without a
 * `label`.
 *
 * @since TBD
 */
final class Presets {

	/**
	 * The token registry, source of the registered preset bindings.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The preset resolver, source of the preset list and resolved values.
	 *
	 * @since TBD
	 *
	 * @var Preset_Resolver
	 */
	private Preset_Resolver $presets;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry  $registry The token registry.
	 * @param Preset_Resolver $presets The preset resolver.
	 */
	public function __construct( Token_Registry $registry, Preset_Resolver $presets ) {
		$this->registry = $registry;
		$this->presets  = $presets;
	}

	/**
	 * The presets section, keyed by block name.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library whose values preset aliases resolve against.
	 *
	 * @return array<string, array<string, mixed>> block => { bindings, default, names, properties, values,
	 *                                             label? }.
	 */
	public function all( string $slug = 'default' ): array {
		$out = [];

		foreach ( $this->registry->all_preset_bindings() as $block => $bindings ) {
			try {
				$names   = $this->presets->names( $block, $slug );
				$default = $this->presets->default_preset( $block, $slug );
			} catch ( Unknown_Preset_Exception $e ) {
				continue; // Set registered but not defined in the document — skip, fail soft.
			}

			$values = [];

			foreach ( $names as $preset ) {
				try {
					// Literal values: the editor renders each as a swatch, which a var() chain can't paint.
					$values[ $preset ] = $this->presets->resolve_literal( $block, $preset, $slug );
				} catch ( Unknown_Preset_Exception $e ) {
					continue; // Omit a single unresolvable preset; keep the rest.
				}
			}

			$entry = array_merge(
				$bindings->to_ui_schema(),
				[
					'default'    => $default,
					'names'      => $names,
					'properties' => array_keys( $bindings->bindings ),
					'values'     => $values,
				]
			);

			if ( $bindings->label !== null ) {
				$entry['label'] = $bindings->label;
			}

			$out[ $block ] = $entry;
		}

		return $out;
	}
}
