<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Preset;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;
use RuntimeException;

/**
 * Projects a block's preset — its `$default` variant — onto Kadence Blocks' per-block attribute defaults.
 *
 * A block dropped on a page should look on-brand out of the box. KB already merges its registration
 * defaults (block.json) with a block's instance attributes; this projector slots a layer in between via
 * the `kadence_blocks_block_default_attributes` filter: the preset's resolved values become defaults that
 * sit ABOVE block.json (the brand preset wins over the generic default) yet BELOW the instance (a user's
 * per-instance edit still wins). So a block is "locked" to its preset until it is overridden.
 *
 * Only a property whose binding declares a `block_attr` can seed an attribute default; a property bound
 * solely to a CSS var or palette slot has no attribute to land in and is left to the CSS-variable
 * projectors. It is a no-op — returning KB's own defaults untouched — when projection is fail-closed,
 * when the block has no registered variant set, or when the token graph cannot resolve, so the filter
 * is safe to run for every block on every render.
 *
 * @since TBD
 */
final class Projector {

	/**
	 * @var Token_Registry The registry the block's variant set (and its bindings) is read from.
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Variant_Resolver Resolves the block's `$default` variant to its `property => value` map.
	 *
	 * @since TBD
	 */
	private Variant_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry   $registry The token registry.
	 * @param Variant_Resolver $resolver The variant resolver.
	 */
	public function __construct( Token_Registry $registry, Variant_Resolver $resolver ) {
		$this->registry = $registry;
		$this->resolver = $resolver;
	}

	/**
	 * Overlay a block's preset (its `$default` variant) onto the given attribute defaults.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $defaults The registration (block.json) attribute defaults.
	 * @param string               $block    The block name, e.g. "kadence/advancedbtn".
	 *
	 * @return array<string, mixed> The defaults with the preset overlaid; unchanged when the block has none.
	 */
	public function add_preset_defaults( array $defaults, string $block ): array {
		// Respect the fail-closed guard: when projection is disabled (e.g. a declared token is missing
		// from the baseline) fall back to KB's own defaults rather than seeding a partial preset.
		if ( ! $this->registry->is_active() ) {
			return $defaults;
		}

		$set = $this->registry->for_block( $block );

		if ( $set === null ) {
			return $defaults;
		}

		try {
			$values = $this->resolver->resolve_default( $block );
		} catch ( RuntimeException $e ) {
			// No `$default` defined for the block, or the token graph cannot resolve (alias cycle/dangling
			// reference). This runs in the render path, so fail soft to KB's defaults rather than fatally.
			return $defaults;
		}

		$preset = [];

		foreach ( $values as $property => $value ) {
			$binding   = $set->binding( $property );
			$attribute = $binding !== null ? $binding->block_attr() : null;

			if ( $attribute !== null ) {
				$preset[ $attribute ] = $value;
			}
		}

		// The preset wins over the generic block.json default; KB's own merge then lets the instance win.
		return array_merge( $defaults, $preset );
	}
}
