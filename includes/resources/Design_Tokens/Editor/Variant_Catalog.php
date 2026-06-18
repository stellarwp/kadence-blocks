<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;

/**
 * Builds the compact per-block variant catalog the block editor's variant picker reads.
 *
 * Only the data the variant picker needs — each block's `$default` slug and its named variants as
 * { slug, label } — so it carries no resolved token values and cannot raise the alias-cycle errors
 * the admin feed must guard. A block registered but absent from the document
 * (Unknown_Variant_Exception) is skipped, so one undefined block never empties the whole catalog.
 *
 * @since TBD
 */
final class Variant_Catalog {

	/**
	 * The token registry, source of the registered variant-set blocks.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The variant resolver, source of each block's default, names and labels.
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
	 * The catalog, keyed by block name.
	 *
	 * @since TBD
	 *
	 * @return array<string, array{default: string, variants: array<int, array{slug: string, label: string}>}>
	 */
	public function all(): array {
		$out = [];

		foreach ( $this->registry->variant_blocks() as $block ) {
			try {
				$names   = $this->variants->names( $block );
				$default = $this->variants->default_variant( $block );
			} catch ( Unknown_Variant_Exception $e ) {
				continue; // Block registered but not defined in the document — skip, fail soft.
			}

			$variants = [];

			foreach ( $names as $name ) {
				$variants[] = [
					'slug'  => $name,
					'label' => $this->variants->label( $block, $name ) ?? $name,
				];
			}

			$entry = [
				'default'  => $default,
				'variants' => $variants,
			];

			// The picker's control label (the variant axis), declared on the variant set. Omitted when the
			// block declares none, so the editor falls back to its default label.
			$set = $this->registry->for_block( $block );

			if ( $set !== null && $set->label !== null ) {
				$entry['label'] = $set->label;
			}

			$out[ $block ] = $entry;
		}

		return $out;
	}
}
