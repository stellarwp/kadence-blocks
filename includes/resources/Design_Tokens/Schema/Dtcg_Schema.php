<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Schema;

use WP_Filesystem_Direct;

/**
 * Runtime accessor for the committed, published DTCG JSON Schema (dtcg.schema.json).
 *
 * The schema is a generated artifact built from the PHP source of truth by the dev-only
 * Dtcg_Schema_Generator and committed to the repo; production never regenerates it. The REST schema
 * endpoint serves this file verbatim so external tooling (and the MCP layer) can introspect the DTCG
 * document grammar — the runtime validator does not consult it.
 *
 * The file is served as-is, so this returns the raw JSON string rather than a decoded array: the
 * endpoint would only re-encode a decoded array straight back to JSON, reformatting the published
 * document for no reason. The bytes ship with the plugin and are read-only, so they are loaded at most
 * once per request (memoised on the instance) and cached in the object cache keyed on the plugin
 * version, surviving across requests and invalidating automatically when a new plugin version ships.
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
	 * Cache-busting version the schema is keyed on (the plugin version).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private string $version;

	/**
	 * Memoised raw schema JSON for this request. Null until first loaded.
	 *
	 * @since TBD
	 *
	 * @var string|null
	 */
	private ?string $json = null;

	/**
	 * @since TBD
	 *
	 * @param string $path    Absolute path to the committed dtcg.schema.json.
	 * @param string $version Cache-busting version (pass the plugin version); the schema cache is keyed on
	 *                        it so a new shipped dtcg.schema.json invalidates the cache automatically.
	 */
	public function __construct( string $path, string $version ) {
		$this->path    = $path;
		$this->version = $version;
	}

	/**
	 * The committed DTCG JSON Schema as its raw, ready-to-serve JSON string, loaded once per request and
	 * cached across requests on the version.
	 *
	 * @since TBD
	 *
	 * @return string The raw schema JSON, or an empty string when the file is missing or unreadable.
	 */
	public function json(): string {
		if ( $this->json !== null ) {
			return $this->json;
		}

		$key    = 'dtcg_schema_' . $this->version;
		$cached = wp_cache_get( $key, self::CACHE_GROUP, false, $found );

		if ( $found && is_string( $cached ) ) {
			$this->json = $cached;

			return $cached;
		}

		$json = $this->load();

		// Only cache a successful read. The committed schema is never empty, so an empty result means the
		// file was missing/unreadable. Caching that would pin the failure to this version's cache until the
		// next version bump — so skip it and let the next request recover. It is still memoised on the
		// instance for the current request.
		if ( $json !== '' ) {
			wp_cache_set( $key, $json, self::CACHE_GROUP );
		}

		$this->json = $json;

		return $json;
	}

	/**
	 * Read the committed dtcg.schema.json as a raw string. A missing or unreadable file yields an empty
	 * string so the endpoint degrades to an empty body rather than a fatal error.
	 *
	 * Uses WP_Filesystem_Direct rather than the WP_Filesystem() bootstrap: the file is a read-only plugin
	 * asset, and the direct handler always reads it without the credential prompt that the bootstrap can
	 * trigger on non-direct hosts.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	private function load(): string {
		if ( ! class_exists( WP_Filesystem_Direct::class ) ) {
			require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-base.php';
			require_once ABSPATH . 'wp-admin/includes/class-wp-filesystem-direct.php';
		}

		$filesystem = new WP_Filesystem_Direct( false );
		$raw        = $filesystem->get_contents( $this->path );

		return is_string( $raw ) ? $raw : '';
	}
}
