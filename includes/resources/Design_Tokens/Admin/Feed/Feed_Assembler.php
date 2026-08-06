<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Label_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Order_Index;
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
 * The per-token label-override and per-group sort-order reads also live here rather than in either
 * emitter: they are applied inside Builder::build(), so both {@see Localizer} and
 * {@see \KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Feed_Controller} get the overridden labels
 * and stored order automatically instead of one of them silently missing them.
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
	 * Reads the tokenLabels display-label override map out of the stored document.
	 *
	 * @since TBD
	 *
	 * @var Token_Label_Index
	 */
	private Token_Label_Index $label_index;

	/**
	 * Reads the tokenOrder map out of the stored document.
	 *
	 * @since TBD
	 *
	 * @var Token_Order_Index
	 */
	private Token_Order_Index $order_index;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver    $resolver        The token resolver.
	 * @param Token_Store       $store           The token store.
	 * @param Presets           $preset_feed     The presets section builder.
	 * @param Builder           $builder         The pure payload assembler.
	 * @param Responsive_Feed   $responsive_feed The responsive / clamp shape extractor.
	 * @param Token_Label_Index $label_index     Reads the tokenLabels override map.
	 * @param Token_Order_Index $order_index     Reads the tokenOrder map.
	 */
	public function __construct(
		Token_Resolver $resolver,
		Token_Store $store,
		Presets $preset_feed,
		Builder $builder,
		Responsive_Feed $responsive_feed,
		Token_Label_Index $label_index,
		Token_Order_Index $order_index
	) {
		$this->resolver        = $resolver;
		$this->store           = $store;
		$this->preset_feed     = $preset_feed;
		$this->builder         = $builder;
		$this->responsive_feed = $responsive_feed;
		$this->label_index     = $label_index;
		$this->order_index     = $order_index;
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

		$document = $this->read_document( $slug );

		return $this->builder->build(
			$values,
			$resolved,
			$presets,
			$this->rest(),
			$version,
			$slug,
			$this->title( $slug ),
			$responsive,
			$this->label_index->all( $document ),
			$this->order_index->all( $document )
		);
	}

	/**
	 * The active library's display title, defaulted the same way the REST representation defaults it, so
	 * the name the selector paints on load matches the one its list supplies a moment later.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return string
	 */
	private function title( string $slug ): string {
		$stored = $this->store->get_title( $slug );

		if ( '' !== $stored ) {
			return $stored;
		}

		return $slug === Token_Store::default_slug() ? Token_Store::default_title() : '';
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

	/**
	 * Read and decode the stored overrides-only document for a library, empty when absent or
	 * unreadable. Builder stays pure (no I/O, per its own docblock), so this owns the decode the
	 * label overlay needs, alongside the store access this class already does for the version.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	private function read_document( string $slug ): array {
		$raw = $this->store->get_document( $slug );

		if ( $raw === '' ) {
			return [];
		}

		$decoded = json_decode( $raw, true );

		return is_array( $decoded ) ? $decoded : [];
	}
}
