<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Variants;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the Design Tokens variants resource.
 *
 * Exposes the raw read surface for a block's variant set: the named variants and the `$default` that live in
 * the DTCG document under `$extensions.com.kadence.designTokens.variants.<block>`. Reads are served from the
 * baseline deep-merged with the stored overrides (via {@see Effective_Variants}), so a variant authored
 * through a write is visible on the next read. Resolved (CSS) variant values are out of scope here — they are
 * produced by the variant projectors, which own the resolver's override-merging.
 *
 * A block is addressable only when it has a registered variant set ({@see Token_Registry::for_block()}); a
 * block with no set has no bindings, so a variant authored for it could never project. Reads for such a block
 * are a 404.
 *
 * The block name carries a slash ("kadence/advancedbtn"), so it is routed as two path segments and
 * reassembled.
 *
 * v1 ships a single token set under Token_Store::default_slug(); every route operates on it.
 *
 * @since TBD
 */
final class Variants_Controller extends Controller {

	/**
	 * The request parameter that carries the block's vendor segment, e.g. "kadence".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VENDOR_PARAM = 'vendor';

	/**
	 * The request parameter that carries the block's name segment, e.g. "advancedbtn".
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_NAME_PARAM = 'block_name';

	/**
	 * The block vendor path segment. A slug-safe class with no slash; the block name is the second segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VENDOR_ROUTE = '(?P<' . self::VENDOR_PARAM . '>[a-z][a-z0-9-]*)';

	/**
	 * The block name path segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_NAME_ROUTE = '(?P<' . self::BLOCK_NAME_PARAM . '>[a-z0-9][a-z0-9-]*)';

	/**
	 * The full block path: vendor + "/" + name, reassembled into "vendor/name" in each handler. A block
	 * name carries a slash, so it is captured as two slug-free segments rather than one encoded segment.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const BLOCK_ROUTE = self::VENDOR_ROUTE . '/' . self::BLOCK_NAME_ROUTE;

	/**
	 * The literal sub-route, relative to a block, that reads the block's `$default`.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_ROUTE = 'default';

	/**
	 * The sole gateway to the kb_design_tokens table.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * Reads the effective (baseline-merged) variants section, so reads reflect writes.
	 *
	 * @since TBD
	 *
	 * @var Effective_Variants
	 */
	private Effective_Variants $variants;

	/**
	 * Declares which blocks accept variants. A block with no registered set is a 404.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * Memoised item schema for this request. Null until first built.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $item_schema = null;

	/**
	 * @since TBD
	 *
	 * @param Token_Store        $store    The sole gateway to the kb_design_tokens table.
	 * @param Effective_Variants $variants Reads the baseline-merged variants section.
	 * @param Token_Registry     $registry Declares which blocks accept variants.
	 */
	public function __construct(
		Token_Store $store,
		Effective_Variants $variants,
		Token_Registry $registry
	) {
		$this->store     = $store;
		$this->variants  = $variants;
		$this->registry  = $registry;
		$this->rest_base = 'variants';
	}

	/**
	 * Register the read routes for the variants resource.
	 *
	 * A block's variant set and its `$default` are read through dedicated routes; the `$default` is read
	 * through a literal sub-route relative to the block.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			"/$this->rest_base",
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_items' ],
					'permission_callback' => [ $this, 'get_items_permissions_check' ],
					'args'                => $this->get_collection_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_block_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::BLOCK_ROUTE . '/' . self::DEFAULT_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_default' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_block_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * List the blocks that accept variants, each with its default and named variant slugs.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		$slug   = Token_Store::default_slug();
		$blocks = [];

		foreach ( $this->registry->variant_blocks() as $block ) {
			$node = $this->variants->block( $block, $slug ) ?? [];

			$blocks[] = [
				'block'   => $block,
				'default' => $this->default_of( $node ),
				'names'   => $this->variant_names( $node ),
			];
		}

		return new WP_REST_Response( [ 'blocks' => $blocks ], WP_Http::OK );
	}

	/**
	 * Read a single block's effective variant set.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		return new WP_REST_Response( $this->prepare_item( $block ), WP_Http::OK );
	}

	/**
	 * Read a block's default variant slug (GET /variants/{block}/default).
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_default( $request ) {
		$block = $this->block_from( $request );
		$error = $this->guard_block( $block );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$node = $this->variants->block( $block, Token_Store::default_slug() ) ?? [];

		return new WP_REST_Response(
			[
				'block'   => $block,
				'default' => $this->default_of( $node ),
			],
			WP_Http::OK
		);
	}

	/**
	 * The JSON Schema for a block's variant set.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_item_schema(): array {
		if ( $this->item_schema !== null ) {
			return $this->add_additional_fields_schema( $this->item_schema );
		}

		$variant_schema = [
			'type'       => 'object',
			'properties' => [
				Extensions::get_label_key()  => [
					'description' => __( 'The variant\'s human-readable label.', 'kadence-blocks' ),
					'type'        => 'string',
				],
				Extensions::get_tokens_key() => [
					'description'          => __( 'The variant\'s property => alias-or-literal token map.', 'kadence-blocks' ),
					'type'                 => 'object',
					'additionalProperties' => [ 'type' => [ 'string', 'number' ] ],
				],
			],
		];

		$this->item_schema = [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => 'design-token-variant-set',
			'type'       => 'object',
			'properties' => [
				'block'    => [
					'description' => __( 'The block name the variant set belongs to.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'slug'     => [
					'description' => __( 'The token set slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'version'  => [
					'description' => __( 'The cache-busting version hash for the set, empty when it renders from baseline.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
				'default'  => [
					'description' => __( 'The default variant slug.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
				],
				'variants' => [
					'description'          => __( 'The named variants, keyed by slug.', 'kadence-blocks' ),
					'type'                 => 'object',
					'context'              => [ 'view' ],
					'additionalProperties' => $variant_schema,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}

	/**
	 * The query parameters accepted by the collection route.
	 *
	 * No collection parameters are accepted yet; the definition is declared explicitly so the surface
	 * documents itself and gains parameters without changing shape.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_collection_params(): array {
		return [];
	}

	/**
	 * Reject a request for a block that has no registered variant set.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return WP_Error|null A WP_Error when the block accepts no variants, null otherwise.
	 */
	private function guard_block( string $block ): ?WP_Error {
		if ( $this->registry->for_block( $block ) !== null ) {
			return null;
		}

		return new WP_Error(
			'rest_design_tokens_not_found',
			__( 'Sorry, that block does not accept variants.', 'kadence-blocks' ),
			[
				'status' => WP_Http::NOT_FOUND,
				'block'  => $block,
			]
		);
	}

	/**
	 * Build the response payload for a block's variant set, read from the effective (baseline-merged) set.
	 *
	 * @since TBD
	 *
	 * @param string $block The block name.
	 *
	 * @return array<string, mixed>
	 */
	private function prepare_item( string $block ): array {
		$slug = Token_Store::default_slug();
		$node = $this->variants->block( $block, $slug ) ?? [];

		return [
			'block'    => $block,
			'slug'     => $slug,
			'version'  => $this->store->get_version( $slug ),
			'default'  => $this->default_of( $node ),
			'variants' => $this->named_variants( $node ),
		];
	}

	/**
	 * The `$default` slug of a variant node, or an empty string when none is set.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return string
	 */
	private function default_of( array $node ): string {
		return Cast::to_string( $node[ Extensions::get_default_key() ] ?? '' );
	}

	/**
	 * The named variant slugs of a variant node, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return string[]
	 */
	private function variant_names( array $node ): array {
		$names = [];

		foreach ( array_keys( $node ) as $key ) {
			if ( is_string( $key ) && strpos( $key, '$' ) === 0 ) {
				continue;
			}

			$names[] = (string) $key;
		}

		return $names;
	}

	/**
	 * The named variants of a variant node, keyed by slug, skipping "$"-prefixed metadata keys.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The block's variant node.
	 *
	 * @return array<string, mixed>
	 */
	private function named_variants( array $node ): array {
		$variants = [];

		foreach ( $node as $slug => $variant ) {
			if ( is_string( $slug ) && strpos( $slug, '$' ) === 0 ) {
				continue;
			}

			$variants[ (string) $slug ] = $variant;
		}

		return $variants;
	}

	/**
	 * Reassemble the block name from its two captured path segments.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return string
	 */
	private function block_from( WP_REST_Request $request ): string {
		return Cast::to_string( $request->get_param( self::VENDOR_PARAM ) )
			. '/'
			. Cast::to_string( $request->get_param( self::BLOCK_NAME_PARAM ) );
	}

	/**
	 * The block path segment arguments shared by every single-block route.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_block_params(): array {
		return [
			self::VENDOR_PARAM     => [
				'description'       => __( 'The block vendor segment, e.g. kadence.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[a-z][a-z0-9-]*$',
				'sanitize_callback' => 'sanitize_key',
			],
			self::BLOCK_NAME_PARAM => [
				'description'       => __( 'The block name segment, e.g. advancedbtn.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[a-z0-9][a-z0-9-]*$',
				'sanitize_callback' => 'sanitize_key',
			],
		];
	}
}
