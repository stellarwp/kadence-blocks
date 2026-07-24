<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;

/**
 * Builds the pickable-token pool the block editor's token picker reads.
 *
 * Two sections: `tokens` is the set-independent STRUCTURE — one { id, alias, label, type, layer }
 * entry per registered token, in registry order, where `alias` is the {id} string a pick will later
 * write to a block attribute and `layer` (semantic | primitive) is derived from the id's first
 * dot-segment so the picker can rank semantic tokens before primitives. `values` is the per-set
 * resolved literal map (set slug => ( id => literal )) used ONLY for the picker's preview
 * swatch/number — a pick writes the alias, never the literal. A set whose stored document cannot be
 * resolved (alias cycle / dangling alias from a raw DB write) is skipped, so one corrupt set never
 * empties the pool; structure is registry-driven and always ships.
 *
 * @since TBD
 */
final class Pickable_Tokens_Catalog {

	/**
	 * The token registry, source of the registered token structure.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The token resolver, source of each set's resolved literal values (by id).
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * The persistence gateway, source of the stored set slugs.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry $registry The token registry.
	 * @param Token_Resolver $resolver The token resolver.
	 * @param Token_Store    $store    The persistence gateway.
	 */
	public function __construct( Token_Registry $registry, Token_Resolver $resolver, Token_Store $store ) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->store    = $store;
	}

	/**
	 * The pool: the pickable token structure plus the per-set resolved preview values.
	 *
	 * @since TBD
	 *
	 * @return array{tokens: array<int, array<string, string>>, values: array<string, array<string, string>>}
	 */
	public function all(): array {
		return [
			'tokens' => $this->tokens(),
			'values' => $this->values(),
		];
	}

	/**
	 * The pickable token structure: one { id, alias, label, type, layer } entry per registered token,
	 * in registry insertion order. Set-independent — values live in values().
	 *
	 * @since TBD
	 *
	 * @return array<int, array{id: string, alias: string, label: string, type: string, layer: string}>
	 */
	private function tokens(): array {
		$tokens = [];

		foreach ( $this->registry->all() as $token ) {
			$tokens[] = [
				'id'    => $token->id,
				'alias' => Alias::wrap( $token->id ),
				'label' => $token->label,
				'type'  => $token->type,
				'layer' => $this->layer_of( $token->id ),
			];
		}

		return $tokens;
	}

	/**
	 * The layer a token id lives in, derived from its first dot-segment: `semantic` for a semantic-layer
	 * id, `primitive` otherwise. Derivation, not lookup — the registry keeps no per-layer index, and the
	 * layer is by construction the id's leading segment (the document walk registers ids under their
	 * top-level layer key).
	 *
	 * @since TBD
	 *
	 * @param string $id The token id (a dot-path).
	 *
	 * @return string The layer name (semantic | primitive).
	 */
	private function layer_of( string $id ): string {
		$first = explode( '.', $id )[0];

		return $first === Layers::get_semantic() ? Layers::get_semantic() : Layers::get_primitive();
	}

	/**
	 * The per-set resolved preview values: `set slug => ( token id => literal CSS value )`, for every
	 * stored set plus the always-present default. Used only for the picker's swatch/number preview — a
	 * pick writes the alias, so a stale or missing value is cosmetic. A set whose stored document cannot
	 * be resolved is skipped, so one corrupt set never empties the map.
	 *
	 * @since TBD
	 *
	 * @return array<string, array<string, string>> set slug => ( id => literal value ).
	 */
	private function values(): array {
		$values = [];

		foreach ( $this->set_slugs() as $slug ) {
			try {
				$values[ $slug ] = $this->resolver->resolve( $slug )->by_id();
			} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
				continue; // Corrupt stored document — skip this set, fail soft.
			}
		}

		return $values;
	}

	/**
	 * The set slugs to resolve values for: every stored set plus the always-present default.
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
