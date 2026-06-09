<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Attaches the design-token schema feed to KB's admin dashboard bundle (SOFT-3385).
 *
 * On admin_head — after the dashboard's `admin_print_styles-{page}` enqueue has run, before the footer
 * where `admin-kadence-home` prints — it gathers the resolved values, the variants and the REST
 * root/nonce, asks {@see Feed_Builder} to shape them, and attaches the result to the existing
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
	private const HANDLE = 'admin-kadence-home';

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
	 * The variants section builder.
	 *
	 * @since TBD
	 *
	 * @var Variant_Feed
	 */
	private Variant_Feed $variant_feed;

	/**
	 * The pure payload assembler.
	 *
	 * @since TBD
	 *
	 * @var Feed_Builder
	 */
	private Feed_Builder $builder;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver $resolver     The token resolver.
	 * @param Token_Store    $store        The token store.
	 * @param Variant_Feed   $variant_feed The variants section builder.
	 * @param Feed_Builder   $builder      The pure payload assembler.
	 */
	public function __construct(
		Token_Resolver $resolver,
		Token_Store $store,
		Variant_Feed $variant_feed,
		Feed_Builder $builder
	) {
		$this->resolver     = $resolver;
		$this->store        = $store;
		$this->variant_feed = $variant_feed;
		$this->builder      = $builder;
	}

	/**
	 * Attach the feed to the dashboard bundle, when that bundle is on the page.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function localize(): void {
		if ( ! wp_script_is( self::HANDLE, 'enqueued' ) ) {
			return; // Not the dashboard page — nothing to attach to.
		}

		$slug    = Token_Store::default_slug();
		$version = $this->store->get_version( $slug );

		$values   = [];
		$variants = [];
		$resolved = false;

		try {
			$values   = $this->resolver->resolve( $slug )->by_id();
			$variants = $this->variant_feed->all( $slug );
			$resolved = true;
		} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
			// Corrupt stored document. Fail open: ship structure only.
			$resolved = false;
		}

		$feed = $this->builder->build( $values, $resolved, $variants, $this->rest(), $version );

		wp_add_inline_script(
			self::HANDLE,
			'window.' . self::OBJECT . ' = ' . wp_json_encode( $feed ) . ';',
			'before'
		);
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
			'namespace' => Controller::namespace_v1(),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
		];
	}
}
