<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Asset_Loader;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Set_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Attaches the design-token schema feed to KB's admin dashboard bundle.
 *
 * On admin_head — after the dashboard's `admin_print_styles-{page}` enqueue has run, before the footer
 * where `admin-kadence-home` prints — it gathers the resolved values, the presets and the REST
 * root/nonce, asks {@see Builder} to shape them, and attaches the result to the existing
 * 'admin-kadence-home' handle as `window.kadenceDesignTokens`. Guarded on
 * wp_script_is( …, 'enqueued' ) so it runs ONLY where that bundle loads (the Kadence dashboard, and any
 * future screen using it), never plugin-wide.
 *
 * Resolution is wrapped fail-open: a corrupt store (alias cycle / dangling alias from a raw DB write)
 * yields an empty, `resolved:false` feed rather than a fatal, so the editor still renders structure.
 * The fail-closed case (registry deactivated) is handled inside the builder.
 *
 * The feed is emitted with wp_add_inline_script + wp_json_encode rather than wp_localize_script, which
 * would stringify the booleans, version and nested maps.
 *
 * @since TBD
 */
final class Localizer {

	/**
	 * The dashboard script handle the feed is attached to (registered in class-kadence-blocks-settings).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DASHBOARD_HANDLE = 'admin-kadence-home';

	/**
	 * Script handles that receive the design-token feed when enqueued on the current screen.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function handles(): array {
		return [
			self::DASHBOARD_HANDLE,
			Asset_Loader::get_script_handle(),
		];
	}

	/**
	 * The JS global the React app reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const OBJECT = 'kadenceDesignTokens';

	/**
	 * The resolver supplying current token values (by_id).
	 *
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * The store, for the current set's version hash.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The active-set pointer — the same slug the registry's user primitives and every projector
	 * (CSS vars, theme.json, block presets, selectable presets) resolve against, so the dashboard edits the set that
	 * is actually live rather than always the default one.
	 *
	 * @since TBD
	 *
	 * @var Active_Set_Store
	 */
	private Active_Set_Store $active;

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
	 * @param Token_Resolver   $resolver        The token resolver.
	 * @param Token_Store      $store           The token store.
	 * @param Active_Set_Store $active          The active-set pointer.
	 * @param Presets          $preset_feed    The presets section builder.
	 * @param Builder          $builder         The pure payload assembler.
	 * @param Responsive_Feed  $responsive_feed The responsive / clamp shape extractor.
	 */
	public function __construct(
		Token_Resolver $resolver,
		Token_Store $store,
		Active_Set_Store $active,
		Presets $preset_feed,
		Builder $builder,
		Responsive_Feed $responsive_feed
	) {
		$this->resolver        = $resolver;
		$this->store           = $store;
		$this->active          = $active;
		$this->preset_feed     = $preset_feed;
		$this->builder         = $builder;
		$this->responsive_feed = $responsive_feed;
	}

	/**
	 * Attach the feed to the dashboard bundle, when that bundle is on the page.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function localize(): void {
		$handle = $this->resolve_handle();

		if ( $handle === null ) {
			return; // No supported admin bundle on this screen.
		}

		// The active set, not always Token_Store::default_slug() — the registry's user primitives and
		// every projector already resolve against whichever set is active, so the dashboard must read
		// (and, via the REST descriptor's slug, write) the same set or edits land in a document that
		// is not the one being displayed.
		$slug    = $this->active->get();
		$version = $this->store->get_version( $slug );

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

		$feed = $this->builder->build( $values, $resolved, $presets, $this->rest(), $version, $slug, $responsive );
		$json = wp_json_encode(
			$feed,
			JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
		);

		if ( $json === false ) {
			return; // Feed cannot be serialized — skip rather than inject malformed JS.
		}

		wp_add_inline_script(
			$handle,
			'window.' . self::OBJECT . ' = ' . $json . ';',
			'before'
		);
	}

	/**
	 * The first supported script handle enqueued on the current screen.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	private function resolve_handle(): ?string {
		foreach ( $this->handles() as $handle ) {
			if ( wp_script_is( $handle, 'enqueued' ) ) {
				return $handle;
			}
		}

		return null;
	}

	/**
	 * The REST descriptor the React app POSTs edits to: the wp-json root, the v1 namespace, and a
	 * wp_rest nonce (sent as X-WP-Nonce; the REST permission-check still re-validates capability).
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
