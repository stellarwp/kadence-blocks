<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Alias_Cycle_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Exception\Dangling_Alias_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Validation\Dtcg_Validator;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Sentinels;
use KadenceWP\KadenceBlocks\StellarWP\DB\Database\Exceptions\DatabaseQueryException;
use KadenceWP\KadenceBlocks\Utils\Cast;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for the per-library color palettes.
 *
 * Owns the `$extensions.com.kadence.designTokens.colorPalettes` surface: list the library's palettes, read /
 * create / replace / delete a palette (label + ordered groups of swatches), and get / set the library's
 * `$current` (active) palette. Modeled on {@see Presets_Controller} — the closest per-library `$extensions`
 * write precedent — plus {@see Active_Token_Library_Controller} for the pointer.
 *
 * Writes go through the same gate: capability check (via {@see Controller}), the DTCG validator (swatch
 * `$value` grammar), a resolver dry-run, and palette-specific guards — `$current` / `$default` must name a
 * real palette, each swatch `token` must target a real color leaf, no duplicate `token` within a palette,
 * and `label` must be a string. Because a palette's values live under `$extensions`, the resolver dry-run
 * never sees them, so alias targets are guarded here explicitly.
 *
 * @since TBD
 */
final class Palettes_Controller extends Controller {

	/**
	 * The request parameter that carries the token library slug a read/write targets.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LIBRARY_PARAM = 'library';

	/**
	 * The palette id path/request parameter.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ID_PARAM = 'id';

	/**
	 * The palette label request parameter.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LABEL_PARAM = 'label';

	/**
	 * The palette groups request parameter.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const GROUPS_PARAM = 'groups';

	/**
	 * The `$current` pointer request parameter.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CURRENT_PARAM = 'current';

	/**
	 * The literal segment for the `$current` sub-route.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CURRENT_ROUTE = 'current';

	/**
	 * The palette-id path capture.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ID_ROUTE = '(?P<' . self::ID_PARAM . '>[\w-]+)';

	/**
	 * The swatch-token path/request parameter.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKEN_PARAM = 'token';

	/**
	 * The single-swatch sub-route under a palette: `{id}/swatches/{token}`. The token capture allows the dots
	 * and hyphens a token dot-path carries (e.g. `primitive.color.brand.button-hover`).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SWATCH_ROUTE = self::ID_ROUTE . '/swatches/(?P<' . self::TOKEN_PARAM . '>[\w.-]+)';

	/**
	 * @var Token_Store
	 *
	 * @since TBD
	 */
	private Token_Store $store;

	/**
	 * @var Mutator
	 *
	 * @since TBD
	 */
	private Mutator $mutator;

	/**
	 * @var Token_Resolver
	 *
	 * @since TBD
	 */
	private Token_Resolver $resolver;

	/**
	 * @var Dtcg_Validator
	 *
	 * @since TBD
	 */
	private Dtcg_Validator $validator;

	/**
	 * @var Effective_Palettes
	 *
	 * @since TBD
	 */
	private Effective_Palettes $palettes;

	/**
	 * @var Token_Registry
	 *
	 * @since TBD
	 */
	private Token_Registry $registry;

	/**
	 * @var Active_Token_Library_Store
	 *
	 * @since TBD
	 */
	private Active_Token_Library_Store $active;

	/**
	 * Memoised item schema for this request.
	 *
	 * @since TBD
	 *
	 * @var array<string, mixed>|null
	 */
	private ?array $item_schema = null;

	/**
	 * @since TBD
	 *
	 * @param Token_Store                $store     The sole gateway to the kb_design_tokens table.
	 * @param Mutator                    $mutator   The pure structural document transforms.
	 * @param Token_Resolver             $resolver  The resolver, for the write dry-run.
	 * @param Dtcg_Validator             $validator The DTCG grammar validator.
	 * @param Effective_Palettes         $palettes  The effective palettes reader.
	 * @param Token_Registry             $registry  The token registry, for the swatch-target guard.
	 * @param Active_Token_Library_Store $active    Owns the active-library pointer.
	 */
	public function __construct(
		Token_Store $store,
		Mutator $mutator,
		Token_Resolver $resolver,
		Dtcg_Validator $validator,
		Effective_Palettes $palettes,
		Token_Registry $registry,
		Active_Token_Library_Store $active
	) {
		$this->store     = $store;
		$this->mutator   = $mutator;
		$this->resolver  = $resolver;
		$this->validator = $validator;
		$this->palettes  = $palettes;
		$this->registry  = $registry;
		$this->active    = $active;
		$this->rest_base = 'palettes';
	}

	/**
	 * Register the palette collection, `$current` pointer, and single-palette routes.
	 *
	 * The `current` sub-route is registered before the single-palette `{id}` route so the literal segment
	 * is not captured as a palette id.
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
					'args'                => [ self::LIBRARY_PARAM => $this->library_param() ],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::CURRENT_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_current' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [ self::LIBRARY_PARAM => $this->library_param() ],
				],
				[
					// POST and PUT both set the pointer; it is an idempotent write, so they share one handler.
					'methods'             => [ WP_REST_Server::CREATABLE, 'PUT' ],
					'callback'            => [ $this, 'set_current' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_current_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::ID_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_id_params(),
				],
				[
					// POST creates and PUT replaces the palette at this id; a single palette node write is
					// create-or-replace either way, so both verbs share one handler.
					'methods'             => [ WP_REST_Server::CREATABLE, 'PUT' ],
					'callback'            => [ $this, 'update_item' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_write_params(),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_item' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_id_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);

		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::SWATCH_ROUTE,
			[
				[
					// POST and PUT both set one swatch's value; it is an idempotent upsert, so they share a handler.
					'methods'             => [ WP_REST_Server::CREATABLE, 'PUT' ],
					'callback'            => [ $this, 'update_swatch' ],
					'permission_callback' => [ $this, 'update_item_permissions_check' ],
					'args'                => $this->get_swatch_write_params(),
				],
				[
					'methods'             => WP_REST_Server::DELETABLE,
					'callback'            => [ $this, 'delete_swatch' ],
					'permission_callback' => [ $this, 'delete_item_permissions_check' ],
					'args'                => $this->get_swatch_params(),
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * List a library's palettes: the `$default` / `$current` pointers and each palette's id + label.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_items( $request ) {
		return new WP_REST_Response( $this->prepare_items( $this->slug( $request ) ), WP_Http::OK );
	}

	/**
	 * Read a single palette node, or 404 when the library defines no palette with that id.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$slug    = $this->slug( $request );
		$id      = Cast::to_string( $request->get_param( self::ID_PARAM ) );
		$palette = $this->palettes->palette( $id, $slug );

		if ( $palette === null ) {
			return $this->not_found( $id );
		}

		return new WP_REST_Response(
			[
				self::ID_PARAM     => $id,
				self::LABEL_PARAM  => $palette[ Extensions::get_label_key() ] ?? '',
				self::GROUPS_PARAM => $palette[ Extensions::get_groups_key() ] ?? [],
			],
			WP_Http::OK
		);
	}

	/**
	 * Create or replace a palette (POST or PUT /palettes/{id}): read its label + groups from the request, run
	 * the shape and swatch guards, deep-merge the node into the library's stored overrides, and validate-and-save.
	 * A single palette node write is create-or-replace either way, so POST and PUT share this handler.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_item( $request ) {
		$slug = $this->slug( $request );
		$id   = Cast::to_string( $request->get_param( self::ID_PARAM ) );

		$node = [
			Extensions::get_label_key()  => Cast::to_string( $request->get_param( self::LABEL_PARAM ) ),
			Extensions::get_groups_key() => $this->groups_param( $request ),
		];

		$shape = $this->guard_palette_shape( $node, $id );
		if ( $shape !== null ) {
			return $shape;
		}

		$swatches = $this->guard_swatches( $node, $id );
		if ( $swatches !== null ) {
			return $swatches;
		}

		$candidate = $this->mutator->merge( $this->stored_document( $slug ), $this->palette_partial( $id, $node ) );

		return $this->validate_and_save( $candidate, $id, $slug );
	}

	/**
	 * Delete a palette (DELETE /palettes/{id}). The library's `$default` palette cannot be deleted, and a
	 * request for a palette the library does not define is a 404.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_item( $request ) {
		$slug = $this->slug( $request );
		$id   = Cast::to_string( $request->get_param( self::ID_PARAM ) );

		if ( $this->palettes->palette( $id, $slug ) === null ) {
			return $this->not_found( $id );
		}

		if ( $id === $this->palettes->default_palette( $slug ) ) {
			return new WP_Error(
				'rest_design_tokens_forbidden',
				__( 'The default palette cannot be deleted.', 'kadence-blocks' ),
				[
					'status'       => WP_Http::BAD_REQUEST,
					self::ID_PARAM => $id,
				]
			);
		}

		$document = $this->mutator->remove_by_keys( $this->stored_document( $slug ), $this->palette_keys( $id ) );

		return $this->validate_and_save( $document, $id, $slug );
	}

	/**
	 * Set a single palette swatch (POST or PUT /palettes/{id}/swatches/{token}): validate just this one token
	 * and value, upsert it into the palette, and save. Only the sent swatch is guarded, so editing one color
	 * never depends on the palette's other swatches being valid, and every token the palette does not set falls
	 * back to the default palette. Setting a non-default palette's swatch to the default value reverts it to
	 * inherited, the same as a DELETE. A request for a palette the library does not define is a 404.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function update_swatch( $request ) {
		$slug  = $this->slug( $request );
		$id    = Cast::to_string( $request->get_param( self::ID_PARAM ) );
		$token = Cast::to_string( $request->get_param( self::TOKEN_PARAM ) );

		$node = $this->palettes->palette( $id, $slug );

		if ( $node === null ) {
			return $this->not_found( $id );
		}

		$value = $request->get_param( Sentinels::get_value_key() );

		if ( ! is_string( $value ) || $value === '' ) {
			return $this->invalid( $id, __( 'A swatch value is required.', 'kadence-blocks' ) );
		}

		$guard = $this->guard_swatch_target( $id, $token, $value );

		if ( $guard !== null ) {
			return $guard;
		}

		$default_id = $this->palettes->default_palette( $slug );
		$default    = $this->palettes->swatch_values( $default_id, $slug );

		// A non-default swatch equal to the default value is inherited, not stored, so setting it back to the
		// default reverts it — identical to a DELETE.
		$node = ( $id !== $default_id && ( $default[ $token ] ?? null ) === $value )
			? $this->remove_swatch_from_node( $node, $token )
			: $this->set_swatch_in_node( $node, $token, $value, $slug );

		return $this->write_palette_node( $slug, $id, $node );
	}

	/**
	 * Revert a single palette swatch to inherited (DELETE /palettes/{id}/swatches/{token}): drop the palette's
	 * own value for this token so it falls back to the default palette. A token the palette never set is already
	 * inherited, so the delete is idempotent. The default palette is the base and has nothing to inherit from,
	 * so reverting one of its swatches is a 400; an unknown palette is a 404.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function delete_swatch( $request ) {
		$slug  = $this->slug( $request );
		$id    = Cast::to_string( $request->get_param( self::ID_PARAM ) );
		$token = Cast::to_string( $request->get_param( self::TOKEN_PARAM ) );

		$node = $this->palettes->palette( $id, $slug );

		if ( $node === null ) {
			return $this->not_found( $id );
		}

		if ( $id === $this->palettes->default_palette( $slug ) ) {
			return new WP_Error(
				'rest_design_tokens_forbidden',
				__( 'A swatch of the default palette cannot be reverted.', 'kadence-blocks' ),
				[
					'status'       => WP_Http::BAD_REQUEST,
					self::ID_PARAM => $id,
				]
			);
		}

		return $this->write_palette_node( $slug, $id, $this->remove_swatch_from_node( $node, $token ) );
	}

	/**
	 * Read the library's `$current` palette id.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_current( $request ) {
		return new WP_REST_Response( [ self::CURRENT_PARAM => $this->palettes->current( $this->slug( $request ) ) ], WP_Http::OK );
	}

	/**
	 * Set the library's `$current` palette (PUT /palettes/current). The target must name a palette the library
	 * defines, otherwise it is a 422.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function set_current( $request ) {
		$slug = $this->slug( $request );
		$id   = Cast::to_string( $request->get_param( self::CURRENT_PARAM ) );

		if ( $this->palettes->palette( $id, $slug ) === null ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'The current palette must name a palette the library defines.', 'kadence-blocks' ),
				[
					'status'            => WP_Http::UNPROCESSABLE_ENTITY,
					self::CURRENT_PARAM => $id,
				]
			);
		}

		$partial   = $this->pointer_partial( Extensions::get_current_key(), $id );
		$candidate = $this->mutator->merge( $this->stored_document( $slug ), $partial );

		$saved = $this->validate_and_save( $candidate, $id, $slug );

		if ( $saved instanceof WP_Error ) {
			return $saved;
		}

		return new WP_REST_Response( [ self::CURRENT_PARAM => $this->palettes->current( $slug ) ], $saved->get_status() );
	}

	/**
	 * The JSON Schema for a palette resource.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_item_schema(): array {
		if ( $this->item_schema !== null ) {
			return $this->add_additional_fields_schema( $this->item_schema );
		}

		$this->item_schema = [
			'$schema'    => 'http://json-schema.org/draft-07/schema#',
			'title'      => 'design-token-palette',
			'type'       => 'object',
			'properties' => [
				self::ID_PARAM     => [
					'description' => __( 'The palette id.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
				],
				self::LABEL_PARAM  => [
					'description' => __( 'The palette label.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
				],
				self::GROUPS_PARAM => [
					'description' => __( 'The ordered color groups, each an ordered list of swatches.', 'kadence-blocks' ),
					'type'        => 'array',
					'context'     => [ 'view' ],
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}

	/**
	 * Validate and persist a candidate overrides document, then respond with the library's palette listing.
	 *
	 * Mirrors {@see Presets_Controller::validate_and_save()}: an empty candidate clears the library; otherwise
	 * the DTCG validator (422) and a resolver dry-run (422) gate the write, the encode is guarded (500), and
	 * the store persists it. First write to a library reports 201.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $candidate The full candidate overrides document.
	 * @param string               $id        The palette id being written, for error context.
	 * @param string               $slug      The token library slug being written.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function validate_and_save( array $candidate, string $id, string $slug ) {
		$status = $this->store->get_version( $slug ) !== '' ? WP_Http::OK : WP_Http::CREATED;

		if ( $candidate === [] ) {
			return $this->persist( '', $id, $status, $slug );
		}

		$result = $this->validator->validate( $candidate, Dtcg_Validator::get_context_overrides() );

		if ( ! $result->is_valid() ) {
			return new WP_Error(
				'rest_design_tokens_invalid',
				__( 'The color palette failed validation.', 'kadence-blocks' ),
				[
					'status'       => WP_Http::UNPROCESSABLE_ENTITY,
					self::ID_PARAM => $id,
					'errors'       => $result->to_array(),
				]
			);
		}

		try {
			$this->resolver->resolve_overrides( $candidate );
		} catch ( Alias_Cycle_Exception | Dangling_Alias_Exception $e ) {
			return new WP_Error(
				'rest_design_tokens_unresolvable',
				$e->getMessage(),
				[
					'status'       => WP_Http::UNPROCESSABLE_ENTITY,
					self::ID_PARAM => $id,
				]
			);
		}

		$encoded = wp_json_encode( $candidate );

		if ( $encoded === false ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The color palette could not be encoded.', 'kadence-blocks' ),
				[
					'status'       => WP_Http::INTERNAL_SERVER_ERROR,
					self::ID_PARAM => $id,
				]
			);
		}

		return $this->persist( $encoded, $id, $status, $slug );
	}

	/**
	 * Commit a raw document to a library and respond with the palette listing, mapping a write failure to 500.
	 *
	 * @since TBD
	 *
	 * @param string $document The raw overrides-only DTCG JSON (empty string clears the library).
	 * @param string $id       The palette id being written, for error context.
	 * @param int    $status   The success status code.
	 * @param string $slug     The token library slug being written.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function persist( string $document, string $id, int $status, string $slug ) {
		try {
			$this->store->save_document( $document, $slug );
		} catch ( DatabaseQueryException $e ) {
			return new WP_Error(
				'rest_design_tokens_save_failed',
				__( 'The color palette could not be saved.', 'kadence-blocks' ),
				[
					'status'       => WP_Http::INTERNAL_SERVER_ERROR,
					self::ID_PARAM => $id,
				]
			);
		}

		return new WP_REST_Response( $this->prepare_items( $slug ), $status );
	}

	/**
	 * Reject a palette node whose shape is malformed: the label must be a string, groups an array, each
	 * group an object with an id / label / swatches list, and each swatch an object with a string token,
	 * a string label, and a `$value`. The swatch `$value` grammar itself is left to the DTCG validator.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The palette node being written.
	 * @param string               $id   The palette id, for error context.
	 *
	 * @return WP_Error|null A WP_Error when the shape is malformed, null otherwise.
	 */
	private function guard_palette_shape( array $node, string $id ): ?WP_Error {
		if ( ! is_string( $node[ Extensions::get_label_key() ] ) ) {
			return $this->invalid( $id, __( 'The palette label must be a string.', 'kadence-blocks' ) );
		}

		$groups = $node[ Extensions::get_groups_key() ];

		if ( ! is_array( $groups ) || $groups === [] ) {
			return $this->invalid( $id, __( 'A palette must define at least one color group.', 'kadence-blocks' ) );
		}

		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();
		$value_key    = Sentinels::get_value_key();
		$label_key    = Extensions::get_label_key();

		foreach ( $groups as $group ) {
			if ( ! is_array( $group )
				|| ! isset( $group[ Extensions::get_group_id_key() ] ) || ! is_string( $group[ Extensions::get_group_id_key() ] )
				|| ! isset( $group[ $label_key ] ) || ! is_string( $group[ $label_key ] )
				|| ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] )
			) {
				return $this->invalid( $id, __( 'Each color group must have an id, a label, and a swatches list.', 'kadence-blocks' ) );
			}

			foreach ( $group[ $swatches_key ] as $swatch ) {
				if ( ! is_array( $swatch )
					|| ! isset( $swatch[ $token_key ] ) || ! is_string( $swatch[ $token_key ] ) || $swatch[ $token_key ] === ''
					|| ! isset( $swatch[ $label_key ] ) || ! is_string( $swatch[ $label_key ] )
					|| ! array_key_exists( $value_key, $swatch )
				) {
					return $this->invalid( $id, __( 'Each swatch must have a token, a label, and a value.', 'kadence-blocks' ) );
				}
			}
		}

		return null;
	}

	/**
	 * Reject a palette whose swatches target something other than a real color leaf, or repeat a token:
	 * every swatch `token` must name a registered color token, and no token may appear twice within the
	 * palette. Because palette `$value`s live under `$extensions`, the resolver dry-run never sees them, so
	 * any alias `$value` target is checked here against the registry too.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node The palette node being written.
	 * @param string               $id   The palette id, for error context.
	 *
	 * @return WP_Error|null A WP_Error when a swatch target is invalid, null otherwise.
	 */
	private function guard_swatches( array $node, string $id ): ?WP_Error {
		$token_key = Extensions::get_swatch_token_key();
		$value_key = Sentinels::get_value_key();
		$groups    = $node[ Extensions::get_groups_key() ];
		$seen      = [];

		// guard_palette_shape() runs first, so the structure below is well-formed; the is_array narrowing
		// keeps this fail-soft (and keeps static analysis honest) if it is ever called on its own.
		if ( ! is_array( $groups ) ) {
			return null;
		}

		foreach ( $groups as $group ) {
			$swatches = is_array( $group ) ? ( $group[ Extensions::get_swatches_key() ] ?? [] ) : [];

			if ( ! is_array( $swatches ) ) {
				continue;
			}

			foreach ( $swatches as $swatch ) {
				if ( ! is_array( $swatch ) || ! isset( $swatch[ $token_key ] ) || ! is_string( $swatch[ $token_key ] ) ) {
					continue;
				}

				$token = $swatch[ $token_key ];

				$definition = $this->registry->get( $token );

				if ( $definition === null || $definition->type !== 'color' ) {
					return $this->invalid(
						$id,
						sprintf( /* translators: %s: the token dot-path. */ __( 'Swatch token "%s" does not target a color.', 'kadence-blocks' ), $token )
					);
				}

				if ( isset( $seen[ $token ] ) ) {
					return $this->invalid(
						$id,
						sprintf( /* translators: %s: the token dot-path. */ __( 'Token "%s" appears more than once in the palette.', 'kadence-blocks' ), $token )
					);
				}

				$seen[ $token ] = true;

				$value = $swatch[ $value_key ] ?? null;

				if ( is_string( $value ) && Alias::is_alias( $value ) && ! $this->registry->has( Alias::path_of( $value ) ) ) {
					return $this->invalid(
						$id,
						sprintf( /* translators: %s: the alias target. */ __( 'Swatch value aliases a token that does not exist: "%s".', 'kadence-blocks' ), Alias::path_of( $value ) )
					);
				}
			}
		}

		return null;
	}

	/**
	 * Guard a single swatch (a token + value), reusing the palette-write swatch guards: the token must target
	 * a registered color, and an aliased value must name a token that exists.
	 *
	 * @since TBD
	 *
	 * @param string $id    The palette id, for error context.
	 * @param string $token The swatch token dot-path.
	 * @param string $value The swatch value (literal color or alias).
	 *
	 * @return WP_Error|null A WP_Error when the swatch is invalid, null otherwise.
	 */
	private function guard_swatch_target( string $id, string $token, string $value ): ?WP_Error {
		return $this->guard_swatches(
			[
				Extensions::get_groups_key() => [
					[
						Extensions::get_group_id_key() => 'swatch',
						Extensions::get_label_key()    => 'swatch',
						Extensions::get_swatches_key() => [
							[
								Extensions::get_swatch_token_key() => $token,
								Extensions::get_label_key() => '',
								Sentinels::get_value_key() => $value,
							],
						],
					],
				],
			],
			$id
		);
	}

	/**
	 * Upsert a swatch into a palette node: update its value in place if the palette already carries the token,
	 * otherwise add it to the group the default template places it in (creating that group if the palette does
	 * not have it yet). Returns the updated node.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node  The palette node.
	 * @param string               $token The swatch token dot-path.
	 * @param string               $value The swatch value.
	 * @param string               $slug  The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	private function set_swatch_in_node( array $node, string $token, string $value, string $slug ): array {
		$groups_key   = Extensions::get_groups_key();
		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();
		$value_key    = Sentinels::get_value_key();
		$group_id_key = Extensions::get_group_id_key();

		$groups = isset( $node[ $groups_key ] ) && is_array( $node[ $groups_key ] ) ? array_values( $node[ $groups_key ] ) : [];

		foreach ( $groups as $gi => $group ) {
			if ( ! is_array( $group ) || ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] ) ) {
				continue;
			}

			foreach ( array_values( $group[ $swatches_key ] ) as $si => $swatch ) {
				if ( is_array( $swatch ) && ( $swatch[ $token_key ] ?? null ) === $token ) {
					$groups[ $gi ][ $swatches_key ]                      = array_values( $group[ $swatches_key ] );
					$groups[ $gi ][ $swatches_key ][ $si ][ $value_key ] = $value;
					$node[ $groups_key ]                                 = $groups;

					return $node;
				}
			}
		}

		[ $group_id, $group_label, $swatch_label ] = $this->template_slot_for( $token, $slug );

		$swatch = [
			$token_key                  => $token,
			Extensions::get_label_key() => $swatch_label,
			$value_key                  => $value,
		];

		foreach ( $groups as $gi => $group ) {
			if ( is_array( $group ) && ( $group[ $group_id_key ] ?? null ) === $group_id ) {
				$swatches   = isset( $group[ $swatches_key ] ) && is_array( $group[ $swatches_key ] ) ? array_values( $group[ $swatches_key ] ) : [];
				$swatches[] = $swatch;

				$groups[ $gi ][ $swatches_key ] = $swatches;
				$node[ $groups_key ]            = $groups;

				return $node;
			}
		}

		$groups[] = [
			$group_id_key               => $group_id,
			Extensions::get_label_key() => $group_label,
			$swatches_key               => [ $swatch ],
		];

		$node[ $groups_key ] = $groups;

		return $node;
	}

	/**
	 * Remove a swatch from a palette node by token, dropping a group left empty. Returns the updated node.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $node  The palette node.
	 * @param string               $token The swatch token dot-path.
	 *
	 * @return array<string, mixed>
	 */
	private function remove_swatch_from_node( array $node, string $token ): array {
		$groups_key   = Extensions::get_groups_key();
		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();

		$groups = isset( $node[ $groups_key ] ) && is_array( $node[ $groups_key ] ) ? array_values( $node[ $groups_key ] ) : [];
		$out    = [];

		foreach ( $groups as $group ) {
			if ( ! is_array( $group ) || ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] ) ) {
				$out[] = $group;

				continue;
			}

			$swatches = [];

			foreach ( $group[ $swatches_key ] as $swatch ) {
				if ( is_array( $swatch ) && ( $swatch[ $token_key ] ?? null ) === $token ) {
					continue;
				}

				$swatches[] = $swatch;
			}

			if ( $swatches !== [] ) {
				$group[ $swatches_key ] = $swatches;
				$out[]                  = $group;
			}
		}

		$node[ $groups_key ] = $out;

		return $node;
	}

	/**
	 * The default palette's group id, group label, and swatch label for a token — the template a new swatch is
	 * placed under when the edited palette does not carry the token yet. Falls back to a generic Accent group
	 * when the template does not group the token (it is still a valid color, since the guard passed).
	 *
	 * @since TBD
	 *
	 * @param string $token The swatch token dot-path.
	 * @param string $slug  The token library slug.
	 *
	 * @return array{0:string,1:string,2:string} The group id, group label, and swatch label.
	 */
	private function template_slot_for( string $token, string $slug ): array {
		$template     = $this->palettes->palette( $this->palettes->default_palette( $slug ), $slug ) ?? [];
		$groups_key   = Extensions::get_groups_key();
		$swatches_key = Extensions::get_swatches_key();
		$token_key    = Extensions::get_swatch_token_key();
		$label_key    = Extensions::get_label_key();
		$group_id_key = Extensions::get_group_id_key();

		$groups = isset( $template[ $groups_key ] ) && is_array( $template[ $groups_key ] ) ? $template[ $groups_key ] : [];

		foreach ( $groups as $group ) {
			if ( ! is_array( $group ) || ! isset( $group[ $swatches_key ] ) || ! is_array( $group[ $swatches_key ] ) ) {
				continue;
			}

			foreach ( $group[ $swatches_key ] as $swatch ) {
				if ( is_array( $swatch ) && ( $swatch[ $token_key ] ?? null ) === $token ) {
					return [
						Cast::to_string( $group[ $group_id_key ] ?? 'accent' ),
						Cast::to_string( $group[ $label_key ] ?? '' ),
						Cast::to_string( $swatch[ $label_key ] ?? $token ),
					];
				}
			}
		}

		return [ 'accent', __( 'Accent', 'kadence-blocks' ), $token ];
	}

	/**
	 * Replace a palette's stored node wholesale: remove the old node from the overrides, then merge the new one
	 * in. The remove-then-merge avoids index-merging the rebuilt groups list into the previous stored node, and
	 * runs the same validate-and-save path as the full palette write.
	 *
	 * @since TBD
	 *
	 * @param string               $slug The token library slug.
	 * @param string               $id   The palette id.
	 * @param array<string, mixed> $node The rebuilt palette node.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	private function write_palette_node( string $slug, string $id, array $node ) {
		$document  = $this->mutator->remove_by_keys( $this->stored_document( $slug ), $this->palette_keys( $id ) );
		$candidate = $this->mutator->merge( $document, $this->palette_partial( $id, $node ) );

		return $this->validate_and_save( $candidate, $id, $slug );
	}

	/**
	 * The palette listing for a library: the `$default` / `$current` pointers and each palette's id + label.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	private function prepare_items( string $slug ): array {
		$section  = $this->palettes->section( $slug );
		$palettes = [];

		foreach ( $this->palettes->palette_ids( $slug ) as $palette_id ) {
			$node = $section[ $palette_id ] ?? [];

			$palettes[] = [
				self::ID_PARAM    => $palette_id,
				self::LABEL_PARAM => is_array( $node ) ? ( $node[ Extensions::get_label_key() ] ?? '' ) : '',
			];
		}

		return [
			Extensions::get_default_key() => $this->palettes->default_palette( $slug ),
			Extensions::get_current_key() => $this->palettes->current( $slug ),
			'palettes'                    => $palettes,
		];
	}

	/**
	 * The decoded stored overrides document for a library (the raw palettes source), or an empty array.
	 *
	 * @since TBD
	 *
	 * @param string $slug The token library slug.
	 *
	 * @return array<string, mixed>
	 */
	private function stored_document( string $slug ): array {
		return $this->palettes->raw( $slug );
	}

	/**
	 * A partial document nesting one palette node under the colorPalettes section, for a deep-merge.
	 *
	 * @since TBD
	 *
	 * @param string               $id   The palette id.
	 * @param array<string, mixed> $node The palette node.
	 *
	 * @return array<string, mixed>
	 */
	private function palette_partial( string $id, array $node ): array {
		return $this->color_palettes_partial( [ $id => $node ] );
	}

	/**
	 * A partial document nesting a colorPalettes pointer (`$default` / `$current`) for a deep-merge.
	 *
	 * @since TBD
	 *
	 * @param string $key The pointer key.
	 * @param string $id  The palette id the pointer names.
	 *
	 * @return array<string, mixed>
	 */
	private function pointer_partial( string $key, string $id ): array {
		return $this->color_palettes_partial( [ $key => $id ] );
	}

	/**
	 * Nest a colorPalettes subtree under `$extensions.<namespace>.colorPalettes` for a deep-merge.
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $subtree The colorPalettes subtree to nest.
	 *
	 * @return array<string, mixed>
	 */
	private function color_palettes_partial( array $subtree ): array {
		return [
			Extensions::get_extensions_key() => [
				Extensions::get_namespace() => [
					Extensions::get_section_color_palettes() => $subtree,
				],
			],
		];
	}

	/**
	 * The literal key path to a palette node, for {@see Mutator::remove_by_keys()} — literal keys so the
	 * dotted namespace segment is not split.
	 *
	 * @since TBD
	 *
	 * @param string $id The palette id.
	 *
	 * @return string[]
	 */
	private function palette_keys( string $id ): array {
		return [
			Extensions::get_extensions_key(),
			Extensions::get_namespace(),
			Extensions::get_section_color_palettes(),
			$id,
		];
	}

	/**
	 * The groups payload from the request as an array (an absent / non-array payload becomes an empty list,
	 * which the shape guard rejects).
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return array<int, mixed>
	 */
	private function groups_param( WP_REST_Request $request ): array {
		$groups = $request->get_param( self::GROUPS_PARAM );

		return is_array( $groups ) ? array_values( $groups ) : [];
	}

	/**
	 * The token library a request targets: the `library` parameter when it names a known library, otherwise the
	 * active library. An unknown or absent `library` falls back rather than 404ing.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return string
	 */
	private function slug( WP_REST_Request $request ): string {
		$library = Cast::to_string( $request->get_param( self::LIBRARY_PARAM ) );

		if ( $library !== '' && ( $library === Token_Store::default_slug() || $this->store->exists( $library ) ) ) {
			return $library;
		}

		return $this->active->get();
	}

	/**
	 * A 404 for a palette a library does not define.
	 *
	 * @since TBD
	 *
	 * @param string $id The palette id.
	 *
	 * @return WP_Error
	 */
	private function not_found( string $id ): WP_Error {
		return new WP_Error(
			'rest_design_tokens_not_found',
			__( 'Sorry, that palette does not exist.', 'kadence-blocks' ),
			[
				'status'       => WP_Http::NOT_FOUND,
				self::ID_PARAM => $id,
			]
		);
	}

	/**
	 * A 422 for a malformed palette write.
	 *
	 * @since TBD
	 *
	 * @param string $id      The palette id.
	 * @param string $message The human-readable reason.
	 *
	 * @return WP_Error
	 */
	private function invalid( string $id, string $message ): WP_Error {
		return new WP_Error(
			'rest_design_tokens_invalid',
			$message,
			[
				'status'       => WP_Http::UNPROCESSABLE_ENTITY,
				self::ID_PARAM => $id,
			]
		);
	}

	/**
	 * The optional token-library argument shared by every route.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function library_param(): array {
		return [
			'description'       => __( 'Optional token library slug to target; defaults to the active library.', 'kadence-blocks' ),
			'type'              => 'string',
			'required'          => false,
			'pattern'           => '^[\w-]+$',
			'sanitize_callback' => 'sanitize_key',
		];
	}

	/**
	 * The arguments for the single-palette read / delete routes: the palette id plus the optional library.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_id_params(): array {
		return [
			self::ID_PARAM      => [
				'description'       => __( 'The palette id.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
			self::LIBRARY_PARAM => $this->library_param(),
		];
	}

	/**
	 * The arguments for the palette write route: id, label, groups, and the optional library.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_write_params(): array {
		return array_merge(
			$this->get_id_params(),
			[
				self::LABEL_PARAM  => [
					'description' => __( 'The palette label.', 'kadence-blocks' ),
					'type'        => 'string',
					'required'    => true,
				],
				self::GROUPS_PARAM => [
					'description' => __( 'The ordered color groups, each an ordered list of swatches.', 'kadence-blocks' ),
					'type'        => 'array',
					'required'    => true,
				],
			]
		);
	}

	/**
	 * The arguments for the single-swatch routes: the palette id, the token dot-path, and the optional library.
	 * The token keeps its dots (a dot-path), so it is sanitized with sanitize_text_field rather than the id's
	 * sanitize_key, which would strip them.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_swatch_params(): array {
		return array_merge(
			$this->get_id_params(),
			[
				self::TOKEN_PARAM => [
					'description'       => __( 'The swatch token dot-path.', 'kadence-blocks' ),
					'type'              => 'string',
					'required'          => true,
					'pattern'           => '^[\w.-]+$',
					'sanitize_callback' => 'sanitize_text_field',
				],
			]
		);
	}

	/**
	 * The arguments for the single-swatch write route: the swatch params plus the required `$value`.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_swatch_write_params(): array {
		return array_merge(
			$this->get_swatch_params(),
			[
				Sentinels::get_value_key() => [
					'description' => __( 'The swatch value: a literal color or a {dot.path} alias.', 'kadence-blocks' ),
					'type'        => 'string',
					'required'    => true,
				],
			]
		);
	}

	/**
	 * The arguments for the `$current` write route: the target palette id plus the optional library.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_current_params(): array {
		return [
			self::CURRENT_PARAM => [
				'description'       => __( 'The palette id to make current.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
			self::LIBRARY_PARAM => $this->library_param(),
		];
	}
}
