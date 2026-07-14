<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;

/**
 * Builds the admin UI feed's "variants" section: for every variant set a block registers — keyed by block —
 * its default, variant names, per-property bindings (structure) and resolved preview values.
 *
 * Structure comes from the registry ({@see \KadenceWP\KadenceBlocks\Design_Tokens\Registry\Variant_Set::to_ui_schema()});
 * the variant list and resolved values come from the {@see Variant_Resolver} against the live store. A set
 * registered but absent from the document (Unknown_Variant_Exception) is skipped, and a single variant that
 * fails to resolve is omitted, so one malformed set never breaks the whole feed. The corrupt-store case (the
 * Token_Resolver throwing an alias-cycle / dangling-alias RuntimeException from inside resolve()) is NOT
 * swallowed here — it is the Localizer's fail-open boundary. A preset / default-variant set (one with no
 * picker) surfaces the same way, without a `label`.
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
	 * The variants section, keyed by block name.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set whose values variant aliases resolve against.
	 *
	 * @return array<string, array<string, mixed>> block => { bindings, default, names, properties, values,
	 *                                             label? }.
	 */
	public function all( string $slug = 'default' ): array {
		$out = [];

		foreach ( $this->registry->variant_sets() as $block => $set ) {
			try {
				$names   = $this->variants->names( $block, $slug );
				$default = $this->variants->default_variant( $block, $slug );
			} catch ( Unknown_Variant_Exception $e ) {
				continue; // Set registered but not defined in the document — skip, fail soft.
			}

			$values = [];

			foreach ( $names as $variant ) {
				try {
					// Literal values: the editor renders each as a swatch, which a var() chain can't paint.
					$values[ $variant ] = $this->variants->resolve_literal( $block, $variant, $slug );
				} catch ( Unknown_Variant_Exception $e ) {
					continue; // Omit a single unresolvable variant; keep the rest.
				}
			}

			$entry = array_merge(
				$set->to_ui_schema(),
				[
					'default'    => $default,
					'names'      => $names,
					'properties' => array_keys( $set->bindings ),
					'values'     => $values,
				]
			);

			if ( $set->label !== null ) {
				$entry['label'] = $set->label;
			}

			$out[ $block ] = $entry;
		}

		return $out;
	}
}
