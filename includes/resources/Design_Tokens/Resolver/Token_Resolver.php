<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;

/**
 * Flattens the effective DTCG document into two ready-to-emit maps. The single place
 * alias semantics are interpreted — projectors downstream never see an alias.
 *
 * @since TBD
 */
final class Token_Resolver {

	/**
	 * The DTCG layers carrying resolvable tokens; $extensions is excluded by design.
	 *
	 * @var string[]
	 */
	private const TOKEN_LAYERS = [ 'primitive', 'semantic' ];

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
	 * Resolve a stored token set into flat maps. Memoised per request on the store version,
	 * which is bumped on every write, so the memo invalidates automatically.
	 */
	public function resolve( string $slug = 'default' ): Resolved_Tokens {
		$version = $this->store->get_version( $slug );
		$key     = $slug . ':' . $version;

		if ( isset( $this->memo[ $key ] ) ) {
			return $this->memo[ $key ];
		}

		$raw      = $this->store->get_document( $slug );
		$over     = $raw === '' ? [] : ( json_decode( $raw, true ) ?: [] );
		$document = $this->effective->build( $over );

		return $this->memo[ $key ] = $this->resolve_document( $document );
	}

	/**
	 * Dry-run resolution against an ad-hoc overrides array — used by the REST write layer
	 * to reject aliasing cycles before committing. Never touches the store/memo.
	 *
	 * @param array<string,mixed> $overrides Decoded candidate overrides.
	 *
	 * @throws Alias_Cycle_Exception When the candidate introduces an unresolvable cycle.
	 */
	public function dry_run( array $overrides ): Resolved_Tokens {
		return $this->resolve_document( $this->effective->build( $overrides ) );
	}

	/**
	 * Walk an effective document into the two flat maps.
	 *
	 * @param array<string,mixed> $document
	 */
	private function resolve_document( array $document ): Resolved_Tokens {
		$by_id  = [];
		$by_var = [];

		foreach ( self::TOKEN_LAYERS as $layer ) {
			if ( isset( $document[ $layer ] ) && is_array( $document[ $layer ] ) ) {
				$this->walk( $document[ $layer ], $layer, $document, $by_id, $by_var );
			}
		}

		return new Resolved_Tokens( $by_id, $by_var );
	}

	/**
	 * Depth-first walk, collecting every token leaf.
	 *
	 * @param array<string,mixed>  $node
	 * @param array<string,mixed>  $document Full effective doc, for alias lookups.
	 * @param array<string,string> $by_id    By-reference id => CSS value map.
	 * @param array<string,string> $by_var   By-reference css-var => CSS value map.
	 */
	private function walk( array $node, string $prefix, array $document, array &$by_id, array &$by_var ): void {
		foreach ( $node as $key => $child ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue; // DTCG metadata key
			}
			if ( ! is_array( $child ) ) {
				continue;
			}

			$path = $prefix . '.' . $key;

			if ( array_key_exists( '$value', $child ) ) {
				$type  = $child['$type'] ?? '';
				$value = $this->resolve_value( $child['$value'], $document, [] );
				$css   = $this->renderer->render( (string) $type, $value );

				$by_id[ $path ]                     = $css;
				$by_var[ Css_Var::from_id( $path ) ] = $css;
				continue;
			}

			$this->walk( $child, $path, $document, $by_id, $by_var );
		}
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
	 * @throws Alias_Cycle_Exception
	 */
	private function resolve_value( $value, array $document, array $visited ) {
		// Alias: jump to the referenced token's $value and resolve that.
		if ( Alias::is_alias( $value ) ) {
			$target = Alias::path_of( $value );

			if ( isset( $visited[ $target ] ) ) {
				throw new Alias_Cycle_Exception(
					sprintf( 'Alias cycle detected at "%s".', $target )
				);
			}

			$leaf = $this->lookup( $target, $document );

			// Dangling alias: nothing to resolve to. Pass the reference through unchanged
			// so the failure is visible rather than silently emitting an empty value.
			if ( $leaf === null || ! array_key_exists( '$value', $leaf ) ) {
				return $value;
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

		// Scalar or list (e.g. fontFamily): literal already.
		return $value;
	}

	/**
	 * Look up a leaf node by dot-path within the effective document.
	 *
	 * @param array<string,mixed> $document
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
