<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Unknown_Variant_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Variant_Resolver;

/**
 * Builds the per-set variant catalog the block editor's variant picker and "save as new variant" form read.
 *
 * Keyed by token set so the picker can show the variants for whichever set a block is on (its `kbTokenSet`,
 * or the active set), not just the active one: `{ active: <slug>, sets: { <slug>: { <block>: {…} } } }`. Per
 * block it carries the `$default` slug, the named variants as { slug, label, userCreated }, the picker
 * control label, and the controllable surface as { key, kind, token } per bound property so the form can
 * render one input per property. It carries no resolved token values, so it cannot raise the alias-cycle
 * errors the admin feed must guard; a block registered but absent from a set (Unknown_Variant_Exception) is
 * skipped, so one undefined block never empties the catalog.
 *
 * @since TBD
 */
final class Variant_Catalog {

	/**
	 * The token registry, source of the registered variant-set blocks and their bindings.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The variant resolver, source of each block's default, names and labels per set.
	 *
	 * @since TBD
	 *
	 * @var Variant_Resolver
	 */
	private Variant_Resolver $variants;

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
	 * The effective-variants reader, source of each variant's user-created provenance per set.
	 *
	 * @since TBD
	 *
	 * @var Effective_Variants
	 */
	private Effective_Variants $effective;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry    $registry  The token registry.
	 * @param Variant_Resolver  $variants  The variant resolver.
	 * @param Token_Store       $store     The persistence gateway.
	 * @param Active_Set_Store  $active    The active-set pointer.
	 * @param Effective_Variants $effective The effective-variants reader.
	 */
	public function __construct(
		Token_Registry $registry,
		Variant_Resolver $variants,
		Token_Store $store,
		Active_Set_Store $active,
		Effective_Variants $effective
	) {
		$this->registry  = $registry;
		$this->variants  = $variants;
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
	 * The per-block catalog for one set.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token set slug.
	 *
	 * @return array<string, mixed> block => { default, variants, properties, label? }.
	 */
	private function for_set( string $slug ): array {
		$out = [];

		foreach ( $this->registry->variant_blocks() as $block ) {
			try {
				$names   = $this->variants->names( $block, $slug );
				$default = $this->variants->default_variant( $block, $slug );
			} catch ( Unknown_Variant_Exception $e ) {
				continue; // Block registered but not defined in this set — skip, fail soft.
			}

			$user_created = $this->effective->user_created( $block, $slug );

			$variants = [];

			foreach ( $names as $name ) {
				$variants[] = [
					'slug'        => $name,
					'label'       => $this->variants->label( $block, $name, $slug ) ?? $name,
					'userCreated' => in_array( $name, $user_created, true ),
				];
			}

			$entry = [
				'default'    => $default,
				'variants'   => $variants,
				'properties' => $this->properties_for( $block ),
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

	/**
	 * The controllable surface for a block: one { key, kind, token } entry per bound property, in binding
	 * order, so the editor form renders an input per property. Set-independent structure read from the
	 * registry's bindings.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return array<int, array{key: string, kind: string, token: string|null}>
	 */
	private function properties_for( string $block ): array {
		$set = $this->registry->for_block( $block );

		if ( $set === null ) {
			return [];
		}

		$properties = [];

		foreach ( $set->bindings as $property => $binding ) {
			$properties[] = [
				'key'   => (string) $property,
				'kind'  => $set->kind( (string) $property ),
				'token' => $binding->token,
			];
		}

		return $properties;
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
