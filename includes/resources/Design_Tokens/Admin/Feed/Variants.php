<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;

/**
 * Builds the admin UI feed's "variants" section: for every block that registered a variant set, its
 * default, variant names, bound properties, per-property bindings (structure) and resolved preview
 * values.
 *
 * Structure comes from the registry ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set::to_ui_schema()});
 * the variant list and resolved values come from the {@see Variant_Resolver} against the live store. A
 * block registered but absent from the document (Unknown_Variant_Exception) is skipped, and a single
 * variant that fails to resolve is omitted, so one malformed block never breaks the whole feed. The
 * corrupt-store case (the Token_Resolver throwing an alias-cycle / dangling-alias RuntimeException from
 * inside resolve()) is NOT swallowed here — it is the Localizer's fail-open boundary.
 *
 * @since TBD
 */
final class Variants {

	/**
	 * The token registry, source of the registered variant sets.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The variant resolver, source of the variant list and resolved values.
	 *
	 * @since TBD
	 *
	 * @var Variant_Resolver
	 */
	private Variant_Resolver $variants;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry The token registry.
	 * @param Variant_Resolver $variants The variant resolver.
	 */
	public function __construct( Token_Registry $registry, Variant_Resolver $variants ) {
		$this->registry = $registry;
		$this->variants = $variants;
	}

	/**
	 * The variants section, keyed by block name. Bindings and the bound-property union are block-wide; the
	 * default, variant names and resolved preview values are nested per group (axis). A flat block surfaces
	 * a single group flagged "implicit"; a grouped block surfaces one entry per axis.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set whose values variant aliases resolve against.
	 *
	 * @return array<string, mixed> block => { bindings, properties, groups: [ { group, implicit, default,
	 *                              names, values, label? } ] }.
	 */
	public function all( string $slug = 'default' ): array {
		$out = [];

		foreach ( $this->registry->variant_sets() as $block => $set ) {
			try {
				$groups     = $this->variants->groups( $block );
				$properties = $this->variants->value_properties( $block );
			} catch ( Unknown_Variant_Exception $e ) {
				continue; // Block registered but not defined in the document — skip, fail soft.
			}

			$group_entries = [];

			foreach ( $groups as $group ) {
				try {
					$names   = $this->variants->names( $block, $group );
					$default = $this->variants->default_variant( $block, $group );
				} catch ( Unknown_Variant_Exception $e ) {
					continue; // One malformed group never empties the rest of the block's axes.
				}

				$values = [];

				foreach ( $names as $variant ) {
					try {
						$values[ $variant ] = $this->variants->resolve( $block, $variant, $slug, $group );
					} catch ( Unknown_Variant_Exception $e ) {
						continue; // Omit a single unresolvable variant; keep the rest.
					}
				}

				$implicit = $group === Variant_Resolver::IMPLICIT_GROUP;

				$entry = [
					'group'    => $implicit ? '' : $group,
					'implicit' => $implicit,
					'default'  => $default,
					'names'    => $names,
					'values'   => $values,
				];

				$label = $set->group_label( $group );

				if ( $label !== null ) {
					$entry['label'] = $label;
				}

				$group_entries[] = $entry;
			}

			if ( $group_entries === [] ) {
				continue;
			}

			$out[ $block ] = array_merge(
				$set->to_ui_schema(),
				[
					'properties' => $properties,
					'groups'     => $group_entries,
				]
			);
		}

		return $out;
	}
}
