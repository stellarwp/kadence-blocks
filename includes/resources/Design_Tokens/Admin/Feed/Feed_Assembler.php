<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;

/**
 * The single shared pipeline that turns a token library slug into the full
 * `window.kadenceDesignTokens` payload shape: gather the resolved values, presets, responsive
 * shapes and REST descriptor for that slug, then hand them to {@see Builder}.
 *
 * Both emitters of that payload — {@see Localizer}, which prints it inline for the page-load
 * bundle, and the REST feed endpoint that a client calls after switching libraries in place —
 * call {@see self::for_slug()} rather than assembling the arguments themselves. That is the only
 * guarantee that a switched library renders identically to a freshly loaded one: there is exactly
 * one place that decides what "the feed for a slug" means, so the two callers cannot drift apart.
 *
 * Resolution is wrapped fail-open, mirroring the Localizer's original behavior: a corrupt store
 * (alias cycle / dangling alias from a raw DB write) yields an empty, `resolved:false` feed rather
 * than a fatal, so the caller still gets structure. The fail-closed case (registry deactivated) is
 * handled inside the builder.
 *
 * @since TBD
 */
final class Feed_Assembler {

	/**
	 * The resolver supplying current token values (by_id).
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * The store, for the current library's version hash.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The presets section builder.
	 *
	 * @since TBD
	 *
	 * @var Presets
	 */
	private Presets $preset_feed;

	/**
	 * The pure payload assembler.
	 *
	 * @since TBD
	 *
	 * @var Builder
	 */
	private Builder $builder;

	/**
	 * Extracts the raw authored responsive / clamp shapes for the editor to hydrate from.
	 *
	 * @since TBD
	 *
	 * @var Responsive_Feed
	 */
	private Responsive_Feed $responsive_feed;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver  $resolver        The token resolver.
	 * @param Token_Store     $store           The token store.
	 * @param Presets         $preset_feed     The presets section builder.
	 * @param Builder         $builder         The pure payload assembler.
	 * @param Responsive_Feed $responsive_feed The responsive / clamp shape extractor.
	 */
	public function __construct(
		Token_Resolver $resolver,
		Token_Store $store,
		Presets $preset_feed,
		Builder $builder,
		Responsive_Feed $responsive_feed
	) {
		$this->resolver        = $resolver;
		$this->store           = $store;
		$this->preset_feed     = $preset_feed;
		$this->builder         = $builder;
		$this->responsive_feed = $responsive_feed;
	}

	/**
	 * Assemble the full feed payload for one token library.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug to assemble the feed for.
	 *
	 * @return array<string, mixed> The feed payload, shaped identically for every caller.
	 */
	public function for_slug( string $slug ): array {
		$version    = $this->store->get_version( $slug );
		$values     = [];
		$presets    = [];
		$responsive = [];
		$resolved   = false;

		try {
			$values     = $this->resolver->resolve( $slug )->by_id();
			$presets    = $this->preset_feed->all( $slug );
			$responsive = $this->responsive_feed->from_document( $this->resolver->effective_document( $slug ) );
			$resolved   = true;
		} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
			$resolved = false; // Corrupt stored document. Fail open: ship structure only.
		}

		return $this->builder->build( $values, $resolved, $presets, $this->rest(), $version, $slug, $responsive );
	}

	/**
	 * The REST descriptor a client uses to write back to the library it just read: the wp-json
	 * root, the v1 namespace, and a wp_rest nonce (sent as X-WP-Nonce; the REST permission-check
	 * still re-validates capability).
	 *
	 * @since TBD
	 *
	 * @return array{root: string, namespace: string, nonce: string}
	 */
	private function rest(): array {
		return [
			'root'      => esc_url_raw( rest_url() ),
			'namespace' => Controller::namespace(),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
		];
	}
}
