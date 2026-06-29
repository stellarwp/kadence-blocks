<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Layers;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Token_Type;

/**
 * Flattens the effective DTCG document into two ready-to-emit maps. The single place
 * alias semantics are interpreted — projectors downstream never see an alias.
 *
 * @since TBD
 */
final class Token_Resolver {

	/**
	 * Object-cache group shared by all resolved-token entries.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @var Effective_Document
	 */
	private Effective_Document $effective;

	/**
	 * @var Css_Renderer
	 */
	private Css_Renderer $renderer;

	/**
	 * Per-request memo of resolved results, keyed on "{slug}:{store-version}".
	 *
	 * @var array<string,Resolved_Tokens>
	 */
	private array $memo = [];

	public function __construct(
		Token_Store $store,
		Effective_Document $effective,
		Css_Renderer $renderer
	) {
		$this->store     = $store;
		$this->effective = $effective;
		$this->renderer  = $renderer;
	}

	/**
	 * Resolve a stored token set into flat maps. Memoized per request on the store version,
	 * which is bumped on every write, so the memo invalidates automatically.
	 *
	 * @param string $slug The token set slug to resolve.
	 *
	 * @return Resolved_Tokens
	 *
	 * @throws Alias_Cycle_Exception    When a stored alias forms an unresolvable cycle.
	 * @throws Dangling_Alias_Exception When a stored alias references a path with no token leaf.
	 *                                  Writes are gated by resolve_overrides(), so a clean store never hits this.
	 */
	public function resolve( string $slug = 'default' ): Resolved_Tokens {
		$version = $this->store->get_version( $slug );
		$key     = $slug . ':' . $version;

		if ( isset( $this->memo[ $key ] ) ) {
			return $this->memo[ $key ];
		}

		// L2: persistent object cache (requires a drop-in such as Memcached or Redis) — survives across requests, keyed on the store version.
		$cache_key = 'resolved_tokens_' . $slug . '_' . $version;
		$cached    = wp_cache_get( $cache_key, self::CACHE_GROUP, false, $found );

		if ( $found && $cached instanceof Resolved_Tokens ) {
			$this->memo[ $key ] = $cached;

			return $cached;
		}

		$raw      = $this->store->get_document( $slug );
		$decoded  = $raw === '' ? [] : json_decode( $raw, true );
		$over     = is_array( $decoded ) ? $decoded : [];
		$document = $this->effective->build( $over );

		$result = $this->resolve_document( $document );

		wp_cache_set( $cache_key, $result, self::CACHE_GROUP, DAY_IN_SECONDS );
		$this->memo[ $key ] = $result;

		return $result;
	}

	/**
	 * Resolve an ad-hoc overrides array against the baseline without persisting — used by the REST
	 * write layer to reject aliasing cycles and dangling aliases before committing. A dry run by
	 * nature: it never touches the store or the memo.
	 *
	 * @param array<string,mixed> $overrides Decoded candidate overrides.
	 *
	 * @throws Alias_Cycle_Exception    When the candidate introduces an unresolvable cycle.
	 * @throws Dangling_Alias_Exception When the candidate aliases a path with no token leaf.
	 */
	public function resolve_overrides( array $overrides ): Resolved_Tokens {
		return $this->resolve_document( $this->effective->build( $overrides ) );
	}

	/**
	 * Walk an effective document into the two flat maps.
	 *
	 * @param array<string,mixed> $document
	 */
	private function resolve_document( array $document ): Resolved_Tokens {
		$by_id            = [];
		$by_var           = [];
		$by_var_projected = [];
		$by_id_target     = [];

		foreach ( Layers::token_layers() as $layer ) {
			if ( isset( $document[ $layer ] ) && is_array( $document[ $layer ] ) ) {
				$this->walk( $document[ $layer ], $layer, $document, $by_id, $by_var, $by_var_projected, $by_id_target );
			}
		}

		return new Resolved_Tokens( $by_id, $by_var, $by_var_projected, $by_id_target );
	}

	/**
	 * Depth-first walk, collecting every token leaf.
	 *
	 * @param array<string,mixed>  $node             The current group node.
	 * @param string               $prefix           The dot-path accumulated so far.
	 * @param array<string,mixed>  $document         Full effective doc, for alias lookups.
	 * @param array<string,string> $by_id            By-reference id => literal CSS value map.
	 * @param array<string,string> $by_var           By-reference css-var => literal CSS value map.
	 * @param array<string,string> $by_var_projected By-reference css-var => var()-preserving CSS value map.
	 * @param array<string,string> $by_id_target     By-reference id => target id map (whole-$value aliases only).
	 *
	 * @return void
	 */
	private function walk( array $node, string $prefix, array $document, array &$by_id, array &$by_var, array &$by_var_projected, array &$by_id_target ): void {
		foreach ( $node as $key => $child ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue; // DTCG metadata key.
			}
			if ( ! is_array( $child ) ) {
				continue;
			}

			$path = $prefix . '.' . $key;

			if ( array_key_exists( '$value', $child ) ) {
				$raw   = $child['$value'];
				$type  = (string) ( $child[ Token_Type::get_type_key() ] ?? '' );
				$value = $this->resolve_value( $raw, $document, [] );
				$css   = $this->renderer->render( $type, $value );
				$var   = Css_Var::from_id( $path );

				$by_id[ $path ] = $css;
				$by_var[ $var ] = $css;

				if ( is_string( $raw ) && Alias::is_alias( $raw ) ) {
					// Whole-$value alias: the token's variable points straight at its immediate
					// target's variable (bypassing the type renderer, which expects a literal), so the
					// indirection survives into CSS and dependents follow live. resolve_value() has
					// already validated the alias (no cycle, not dangling), so the target is a real leaf
					// this same walk emits a --kb-token--* var for. The literal above still feeds host
					// surfaces.
					$target_id                = Alias::path_of( $raw );
					$by_id_target[ $path ]    = $target_id;
					$by_var_projected[ $var ] = 'var(' . Css_Var::from_id( $target_id ) . ')';
				} else {
					// A composite (shadow/typography) may alias individual fields; project those to
					// var() references and render the shorthand around them. Scalars and lists carry no
					// alias and render identically to the literal.
					$by_var_projected[ $var ] = $this->renderer->render( $type, $this->project_value( $raw ) );
				}

				continue;
			}

			$this->walk( $child, $path, $document, $by_id, $by_var, $by_var_projected, $by_id_target );
		}
	}

	/**
	 * Project a raw $value for the css-var output, preserving alias indirection as var() references
	 * instead of flattening to literals: a whole-string alias (e.g. a composite field that is one)
	 * becomes var(--<target>); a composite recurses field by field; scalars and lists pass through.
	 *
	 * Unlike resolve_value() this neither follows alias chains nor re-validates them — it stops at the
	 * immediate target (the chain is preserved across tokens by the cascade) and only ever runs after
	 * resolve_value() has already rejected cycles and dangling aliases for the same leaf.
	 *
	 * @param mixed $value
	 *
	 * @return mixed The value with aliases replaced by var() references.
	 */
	private function project_value( $value ) {
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			return 'var(' . Css_Var::from_id( Alias::path_of( $value ) ) . ')';
		}

		if ( is_array( $value ) && ! $this->is_list( $value ) ) {
			$projected = [];
			foreach ( $value as $field => $sub ) {
				$projected[ $field ] = $this->project_value( $sub );
			}

			return $projected;
		}

		return $value;
	}

	/**
	 * Resolve a raw $value to a literal: aliases follow their reference recursively;
	 * composite arrays resolve field by field; scalars and lists pass through.
	 *
	 * @param mixed               $value
	 * @param array<string,mixed> $document
	 * @param array<string,true>  $visited  Dot-paths currently being resolved (cycle guard).
	 *
	 * @return mixed The literal (scalar, list, or composite array with literal fields).
	 *
	 * @throws Alias_Cycle_Exception    When resolution re-enters a dot-path already being resolved.
	 * @throws Dangling_Alias_Exception When an alias references a path with no token leaf.
	 */
	private function resolve_value( $value, array $document, array $visited ) {
		// Alias: jump to the referenced token's $value and resolve that.
		// Only strings can be aliases; the is_string() narrows $value for path_of()'s string parameter.
		if ( is_string( $value ) && Alias::is_alias( $value ) ) {
			$target = Alias::path_of( $value );

			// is_alias() guarantees a non-empty path; the guard keeps the type tight for what follows.
			if ( $target === '' ) {
				return $value;
			}

			if ( isset( $visited[ $target ] ) ) {
				throw new Alias_Cycle_Exception(
					sprintf( 'Alias cycle detected at "%s".', $target )
				);
			}

			$leaf = $this->lookup( $target, $document );

			// Dangling alias: the target is missing, or points at a group rather than a
			// token leaf. There is nothing to resolve to, and passing the "{…}" reference
			// through would emit invalid CSS, so reject it. resolve_overrides() surfaces this to the
			// REST write layer (HTTP 422) before the document is ever stored — symmetric
			// with cycle handling.
			if ( $leaf === null || ! array_key_exists( '$value', $leaf ) ) {
				throw new Dangling_Alias_Exception(
					sprintf( 'Alias references a missing token at "%s".', $target )
				);
			}

			$visited[ $target ] = true;

			return $this->resolve_value( $leaf['$value'], $document, $visited );
		}

		// Composite (shadow/typography): each field may itself be an alias.
		if ( is_array( $value ) && ! $this->is_list( $value ) ) {
			$resolved = [];
			foreach ( $value as $field => $sub ) {
				$resolved[ $field ] = $this->resolve_value( $sub, $document, $visited );
			}

			return $resolved;
		}

		// Scalar or list: literal already. Lists (e.g. a fontFamily stack, or a
		// multi-layer shadow — see Css_Renderer::shadow) pass through untouched; their
		// elements are not alias-resolved in v1.
		return $value;
	}

	/**
	 * Look up a leaf node by dot-path within the effective document.
	 *
	 * @param string              $path     The dot-path to look up.
	 * @param array<string,mixed> $document The effective document to search.
	 *
	 * @return array<string,mixed>|null
	 */
	private function lookup( string $path, array $document ): ?array {
		$node = $document;
		foreach ( explode( '.', $path ) as $segment ) {
			if ( ! is_array( $node ) || ! isset( $node[ $segment ] ) ) {
				return null;
			}
			$node = $node[ $segment ];
		}

		return is_array( $node ) ? $node : null;
	}

	/**
	 * @param array<mixed> $value
	 */
	private function is_list( array $value ): bool {
		return $value === [] || array_keys( $value ) === range( 0, count( $value ) - 1 );
	}
}
