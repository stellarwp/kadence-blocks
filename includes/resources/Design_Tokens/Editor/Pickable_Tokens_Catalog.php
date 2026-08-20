<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Reserved_Namespace;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;

/**
 * Builds the pickable-token pool the block editor's token picker reads.
 *
 * Two sections: `tokens` is the library-independent STRUCTURE — one { id, alias, label, type, layer, role }
 * entry per registered token, in registry order, where `alias` is the {id} string a pick will later
 * write to a block attribute, `layer` (semantic | primitive) is derived from the id's first
 * dot-segment so the picker can rank semantic tokens before primitives, and `role` is the sub-kind
 * (radius | spacing | … ) derived from the id so the picker can narrow one `$type` to the control's
 * sub-kind. `values` is the per-library
 * resolved literal map (library slug => ( id => literal )) used ONLY for the picker's preview
 * swatch/number — a pick writes the alias, never the literal. A library whose stored document cannot be
 * resolved (alias cycle / dangling alias from a raw DB write) is skipped, so one corrupt library never
 * empties the pool; structure is registry-driven and always ships.
 *
 * @since TBD
 */
final class Pickable_Tokens_Catalog {

	/**
	 * The id segment wrapping the dimension primitives (`primitive.dimension.<role>.<step>`). Semantic
	 * dimension tokens carry no such wrapper (`semantic.<role>.<name>`), so it is normalized away in
	 * role derivation to make both layers report the same role for the same sub-kind.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DIMENSION_GROUP = 'dimension';

	/**
	 * The token registry, source of the registered token structure.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The token resolver, source of each library's resolved literal values (by id).
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * The persistence gateway, source of the stored library slugs.
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
	 * The pool: the pickable token structure plus the per-library resolved preview values.
	 *
	 * @since TBD
	 *
	 * @return array{tokens: array<int, array{id: string, alias: string, label: string, type: string, layer: string, role: string}>, values: array<string, array<string, string>>}
	 */
	public function all(): array {
		return [
			'tokens' => $this->tokens(),
			'values' => $this->values(),
		];
	}

	/**
	 * The pickable token structure: one { id, alias, label, type, layer, role } entry per registered
	 * token, in registry insertion order. Library-independent — values live in values().
	 *
	 * @since TBD
	 *
	 * @return array<int, array{id: string, alias: string, label: string, type: string, layer: string, role: string}>
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
				'role'  => $this->role_of( $token->id, $token->group_key ),
			];
		}

		return $tokens;
	}

	/**
	 * The sub-kind role a token id carries — the discriminator that splits one DTCG `$type` into the
	 * distinct things a control picks from: `dimension` fans out to `radius`, `spacing`, `gap`,
	 * `border-width`, `icon-size`, `font-size`, and so on. Derived from the id, not stored: the role is
	 * the segment right after the layer (`semantic.<role>.…`, `primitive.<role>.…`), except the
	 * dimension primitives nest it one level deeper under the `dimension` wrapper
	 * (`primitive.dimension.<role>.<step>`), which is normalized away so a semantic and a primitive
	 * token of the same sub-kind report the same role. An id with no role segment yields "".
	 *
	 * A user-minted scale token nests `custom` where the sub-kind would be
	 * (`primitive.dimension.custom.<slug>`), so the id alone reports the literal `custom`. In that one
	 * case the real sub-kind is taken from the token's `group_key` — the group the "+ Add …" flow minted
	 * it into, whose vocabulary is the role vocabulary — falling back to the id-derived `custom` when the
	 * token carries no group_key. Only `primitive.dimension.custom.*` derives role `custom`, so no other
	 * token (colors included, which carry no machine group_key) is affected.
	 *
	 * @since TBD
	 *
	 * @param string $id        The token id (a dot-path).
	 * @param string $group_key The token's group_key, used to recover a custom dimension token's sub-kind.
	 *
	 * @return string The role sub-kind, or "" when the id carries none.
	 */
	private function role_of( string $id, string $group_key ): string {
		$segments = explode( '.', $id );

		if ( ( $segments[0] ?? '' ) === Layers::get_primitive() && ( $segments[1] ?? '' ) === self::DIMENSION_GROUP ) {
			$role = $segments[2] ?? '';

			if ( $role === Reserved_Namespace::get_segment() && $group_key !== '' ) {
				return $group_key;
			}

			return $role;
		}

		return $segments[1] ?? '';
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
	 * The per-library resolved preview values: `library slug => ( token id => literal CSS value )`, for
	 * every stored library plus the always-present default. Used only for the picker's swatch/number
	 * preview — a pick writes the alias, so a stale or missing value is cosmetic. A library whose stored
	 * document cannot be resolved is skipped, so one corrupt library never empties the map.
	 *
	 * @since TBD
	 *
	 * @return array<string, array<string, string>> library slug => ( id => literal value ).
	 */
	private function values(): array {
		$values = [];

		foreach ( $this->library_slugs() as $slug ) {
			try {
				$values[ $slug ] = $this->resolver->resolve( $slug )->by_id();
			} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
				continue; // Corrupt stored document — skip this library, fail soft.
			}
		}

		return $values;
	}

	/**
	 * The library slugs to resolve values for: every stored library plus the always-present default.
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
