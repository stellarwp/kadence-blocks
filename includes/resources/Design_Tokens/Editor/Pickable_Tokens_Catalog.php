<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Reserved_Namespace;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Sorter;
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
 * entry per registered token, in the active library's stored sort order, where `alias` is the {id} string
 * a pick will later write to a block attribute, `layer` (semantic | primitive) is derived from the id's
 * first dot-segment so the picker can rank semantic tokens before primitives, and `role` is the sub-kind
 * (radius | spacing | … ) derived from the id so the picker can narrow one `$type` to the control's
 * sub-kind. `values` is the per-library
 * resolved literal map (library slug => ( id => literal )) used ONLY for the picker's preview
 * swatch/number — a pick writes the alias, never the literal. A library whose stored document cannot be
 * resolved (alias cycle / dangling alias from a raw DB write) is skipped, so one corrupt library never
 * empties the pool; structure is registry-driven and always ships.
 *
 * Nothing downstream reorders the pool — the picker only filters and partitions it — so the order the
 * user dragged tokens into on the Style Library screen has to be applied here or not at all. It is
 * applied group by group through the shared {@see Token_Sorter}, exactly as the admin feed applies it,
 * and read from the ACTIVE library: `tokens` is one shared structure rather than a per-library one, so
 * it honors the order of the library the editor renders by default (the same pointer the feed reads),
 * and a picker opened against another library keeps that ordering.
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
	 * The active-library pointer, naming the library whose stored sort order the pool honors.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The shared stored-order permutation, applied one group at a time.
	 *
	 * @since TBD
	 *
	 * @var Token_Sorter
	 */
	private Token_Sorter $sorter;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry             $registry The token registry.
	 * @param Token_Resolver             $resolver The token resolver.
	 * @param Token_Store                $store    The persistence gateway.
	 * @param Active_Token_Library_Store $active   The active-library pointer.
	 * @param Token_Sorter               $sorter   The shared stored-order permutation.
	 */
	public function __construct(
		Token_Registry $registry,
		Token_Resolver $resolver,
		Token_Store $store,
		Active_Token_Library_Store $active,
		Token_Sorter $sorter
	) {
		$this->registry = $registry;
		$this->resolver = $resolver;
		$this->store    = $store;
		$this->active   = $active;
		$this->sorter   = $sorter;
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
	 * token, in the active library's stored sort order within each UI group, registry insertion order
	 * for the ids that order does not mention. Library-independent — values live in values().
	 *
	 * @since TBD
	 *
	 * @return array<int, array{id: string, alias: string, label: string, type: string, layer: string, role: string}>
	 */
	private function tokens(): array {
		$tokens = [];
		$slots  = [];

		foreach ( $this->registry->all() as $token ) {
			$slots[ $token->group ][] = count( $tokens );

			$tokens[] = [
				'id'    => $token->id,
				'alias' => Alias::wrap( $token->id ),
				'label' => $token->label,
				'type'  => $token->type,
				'layer' => $this->layer_of( $token->id ),
				'role'  => $this->role_of( $token->id, $token->group_key ),
			];
		}

		return $this->apply_order( $tokens, $slots );
	}

	/**
	 * Permute the flat pool by the active library's stored order, one UI group at a time.
	 *
	 * Grouping is by the token's `group` — the very bucket {@see Token_Registry::to_ui_schema()} keys
	 * the admin feed's schema by, and therefore the bucket the Style Library's per-group reorder writes
	 * against. That is what makes the pool agree with the screen: a custom token interleaves only among
	 * the built-ins of its own group, never across the whole pool. The picker's `role` looks like a
	 * cheaper partition but is a different one — a derivation off the id that can span two groups.
	 *
	 * Each group's entries are written back into the very slots they already occupied, so the pool's
	 * overall sequence is unchanged except within a group. The picker's type-only filter and its
	 * semantic-before-primitive ranking read the pool as one flat list, and both keep behaving exactly
	 * as they did before any order was stored.
	 *
	 * @since TBD
	 *
	 * @param array<int, array{id: string, alias: string, label: string, type: string, layer: string, role: string}> $tokens The pool in registry order.
	 * @param array<string, array<int, int>>                                                                         $slots  UI group => the pool positions its tokens occupy.
	 *
	 * @return array<int, array{id: string, alias: string, label: string, type: string, layer: string, role: string}> The pool, permuted.
	 */
	private function apply_order( array $tokens, array $slots ): array {
		$order = $this->sorter->order_for( $this->store->get_decoded_document( $this->active->get() ) );

		if ( $order === [] ) {
			return $tokens;
		}

		foreach ( $slots as $positions ) {
			$sorted = $this->sorter->sort(
				array_map( static fn( int $position ): array => $tokens[ $position ], $positions ),
				$order
			);

			foreach ( $positions as $slot => $position ) {
				$tokens[ $position ] = $sorted[ $slot ];
			}
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
