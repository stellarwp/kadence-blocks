<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Registry\Baseline;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;

/**
 * The real, shipped baseline DTCG document (baseline.json).
 *
 * Serves both consumers of the contract: document() returns the full decoded baseline (for the
 * Resolver's deep-merge), and has() answers "does a token exist at this dot-path?" (for the guard).
 *
 * The file ships with the plugin and is read-only, so it only changes when the plugin updates. The
 * decoded document is therefore loaded at most once per request (memoised on the instance) and cached
 * in the object cache keyed on the plugin version, so it survives across requests and invalidates
 * automatically when a new plugin version ships a new baseline.json. The id index has() consults is a
 * cheap derivation of that cached document, rebuilt per request.
 *
 * Scope is deliberately narrow: this loads and INDEXES the document (structure), it never validates
 * token VALUES — value/$type/alias validation is SOFT-3378 (the DTCG schema), shared by the Resolver
 * and REST writes. A token "leaf" is any node carrying a $value; the $extensions layer (foundation
 * presets, block presets, variants) is intentionally NOT indexed, as those are not registrable tokens.
 *
 * @since TBD
 */
final class Json_Baseline_Document implements Baseline_Document {

	/**
	 * Object-cache group for the decoded baseline document.
	 *
	 * @var string
	 *
	 * @since TBD
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * The DTCG document layers that hold registrable tokens. The $extensions layer (presets/variants)
	 * is excluded by design — its entries are not tokens and must never satisfy the guard.
	 *
	 * @var string[]
	 *
	 * @since TBD
	 */
	private const TOKEN_LAYERS = [ 'primitive', 'semantic' ];

	/**
	 * Absolute path to the shipped baseline.json.
	 *
	 * @var string
	 *
	 * @since TBD
	 */
	private string $path;

	/**
	 * Cache-busting version the decoded document is keyed on (the plugin version).
	 *
	 * @var string
	 *
	 * @since TBD
	 */
	private string $version;

	/**
	 * Memoised decoded document for this request. Null until first loaded.
	 *
	 * @var array<string, mixed>|null
	 *
	 * @since TBD
	 */
	private ?array $document = null;

	/**
	 * Memoised id index for this request: token dot-path id => true. Null until first built.
	 *
	 * @var array<string, true>|null
	 *
	 * @since TBD
	 */
	private ?array $index = null;

	/**
	 * @since TBD
	 *
	 * @param string $path    Absolute path to the shipped baseline.json.
	 * @param string $version Cache-busting version (pass the plugin version); the document cache is keyed
	 *                        on it so a new shipped baseline.json invalidates the cache automatically.
	 */
	public function __construct( string $path, string $version ) {
		$this->path    = $path;
		$this->version = $version;
	}

	/**
	 * Whether the baseline defines a token at the given dot-path id.
	 *
	 * @since TBD
	 *
	 * @param string $id A token DTCG dot-path id, e.g. "semantic.color.button-bg".
	 *
	 * @return bool
	 */
	public function has( string $id ): bool {
		return isset( $this->index()[ $id ] );
	}

	/**
	 * The full decoded baseline document, loaded once per request and cached across requests on the
	 * version.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function document(): array {
		if ( $this->document !== null ) {
			return $this->document;
		}

		$key    = 'baseline_document_' . $this->version;
		$cached = wp_cache_get( $key, self::CACHE_GROUP, false, $found );

		if ( $found && is_array( $cached ) ) {
			return $this->document = $cached;
		}

		$document = $this->load();

		// Only cache a successful load. A real baseline is never empty, so an empty result means the file
		// was missing/unreadable/malformed. Caching that would pin the failure to this version's cache
		// (keeping projection disabled) until the next version bump — so skip it and let the next request
		// recover. It is still memoised on the instance for the current request.
		if ( $document !== [] ) {
			wp_cache_set( $key, $document, self::CACHE_GROUP );
		}

		return $this->document = $document;
	}

	/**
	 * The flattened id index has() consults: every token leaf's dot-path id. Derived from the (cached)
	 * document and memoised per request.
	 *
	 * @since TBD
	 *
	 * @return array<string, true>
	 */
	private function index(): array {
		if ( $this->index !== null ) {
			return $this->index;
		}

		$document = $this->document();
		$index    = [];

		foreach ( self::TOKEN_LAYERS as $layer ) {
			if ( isset( $document[ $layer ] ) && is_array( $document[ $layer ] ) ) {
				$this->collect_leaves( $document[ $layer ], $layer, $index );
			}
		}

		return $this->index = $index;
	}

	/**
	 * Walk a DTCG subtree depth-first, recording the dot-path of every token leaf (a node with $value).
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node   The current group node.
	 * @param string               $prefix The dot-path accumulated so far.
	 * @param array<string, true>  $index  The index being built, passed by reference.
	 *
	 * @return void
	 */
	private function collect_leaves( array $node, string $prefix, array &$index ): void {
		foreach ( $node as $key => $child ) {
			// Skip DTCG metadata keys ($description, $extensions, …); only group/token nodes have ids.
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			if ( ! is_array( $child ) ) {
				continue;
			}

			$path = $prefix === '' ? (string) $key : $prefix . '.' . $key;

			// A node carrying $value is a token leaf (composite values such as shadow/typography are
			// leaves too); record it and do not descend into its value sub-fields.
			if ( array_key_exists( '$value', $child ) ) {
				$index[ $path ] = true;

				continue;
			}

			$this->collect_leaves( $child, $path, $index );
		}
	}

	/**
	 * Decode the shipped baseline.json into an array. A missing or malformed file yields an empty
	 * document, so every has() returns false and the fail-closed guard keeps token projection off
	 * rather than acting on a partial baseline.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function load(): array {
		if ( ! is_readable( $this->path ) ) {
			return [];
		}

		$raw = file_get_contents( $this->path );

		if ( $raw === false ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
