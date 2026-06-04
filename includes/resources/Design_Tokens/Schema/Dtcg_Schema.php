<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema;

/**
 * Runtime accessor for the committed, published DTCG JSON Schema (dtcg.schema.json).
 *
 * The schema is a generated artifact built from the PHP source of truth by the dev-only
 * Dtcg_Schema_Generator and committed to the repo; production never regenerates it. The REST schema
 * endpoint serves this static file so external tooling (and the MCP layer) can introspect the DTCG
 * document grammar — the runtime validator does not consult it.
 *
 * The file ships with the plugin and is read-only, so it only changes when the plugin updates. The
 * decoded schema is therefore loaded at most once per request (memoised on the instance) and cached in
 * the object cache keyed on the plugin version, so it survives across requests and invalidates
 * automatically when a new plugin version ships a new dtcg.schema.json. Mirrors Json_Baseline_Document.
 *
 * @since TBD
 */
final class Dtcg_Schema {

	/**
	 * Object-cache group shared with the rest of the Design Tokens module.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CACHE_GROUP = 'kb_design_tokens';

	/**
	 * Absolute path to the committed dtcg.schema.json.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private string $path;

	/**
	 * Cache-busting version the decoded schema is keyed on (the plugin version).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private string $version;

	/**
	 * Memoised decoded schema for this request. Null until first loaded.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $document = null;

	/**
	 * @since TBD
	 *
	 * @param string $path    Absolute path to the committed dtcg.schema.json.
	 * @param string $version Cache-busting version (pass the plugin version); the decoded-schema cache is
	 *                        keyed on it so a new shipped dtcg.schema.json invalidates the cache automatically.
	 */
	public function __construct( string $path, string $version ) {
		$this->path    = $path;
		$this->version = $version;
	}

	/**
	 * The full decoded DTCG JSON Schema, loaded once per request and cached across requests on the version.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed> The decoded schema, or an empty array when the file is missing or malformed.
	 */
	public function document(): array {
		if ( $this->document !== null ) {
			return $this->document;
		}

		$key    = 'dtcg_schema_' . $this->version;
		$cached = wp_cache_get( $key, self::CACHE_GROUP, false, $found );

		if ( $found && is_array( $cached ) ) {
			$this->document = $cached;

			return $cached;
		}

		$document = $this->load();

		// Only cache a successful load. The committed schema is never empty, so an empty result means the
		// file was missing/unreadable/malformed. Caching that would pin the failure to this version's cache
		// until the next version bump — so skip it and let the next request recover. It is still memoised on
		// the instance for the current request.
		if ( $document !== [] ) {
			wp_cache_set( $key, $document, self::CACHE_GROUP );
		}

		$this->document = $document;

		return $document;
	}

	/**
	 * Decode the committed dtcg.schema.json into an array. A missing or malformed file yields an empty
	 * document so the endpoint degrades to an empty body rather than fataling. The readability guard runs
	 * first so a missing file short-circuits before wp_json_file_decode() would warn about it.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function load(): array {
		if ( ! is_readable( $this->path ) ) {
			return [];
		}

		$decoded = wp_json_file_decode( $this->path, [ 'associative' => true ] );

		return is_array( $decoded ) ? $decoded : [];
	}
}
