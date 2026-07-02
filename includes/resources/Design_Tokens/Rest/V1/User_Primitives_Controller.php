<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Reserved_Namespace;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Reference_Policy;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\User_Primitive_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Utils\Cast;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller for user-primitive sub-resources: preview-references, create, delete, and rename.
 *
 * Phase 9 registers the read-only references endpoint. Phase 10 will add create, delete, and rename.
 *
 * @since TBD
 */
final class User_Primitives_Controller extends Controller {

	/**
	 * The request parameter that carries the token set slug.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_PARAM = 'slug';

	/**
	 * The request parameter that carries the user-primitive canonical dot-path id.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ID_PARAM = 'id';

	/**
	 * The slug path segment shared by routes that scope to a single document.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SLUG_ROUTE = '(?P<' . self::SLUG_PARAM . '>[\w-]+)';

	/**
	 * The id path segment for user-primitive sub-resources.
	 * Matches the canonical path format: primitive.color.custom.<slug>
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ID_ROUTE = '(?P<' . self::ID_PARAM . '>[\w.-]+)';

	/**
	 * The sub-route segment for user-primitive resources within a document.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const USER_PRIMITIVES_ROUTE = 'user-primitives';

	/**
	 * The sub-route segment for the references preview endpoint.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const REFERENCES_ROUTE = 'references';

	/**
	 * Shared DTCG document write pipeline: load, validate, dry-run, conditional persist.
	 *
	 * @since TBD
	 *
	 * @var Document_Write_Pipeline
	 */
	private Document_Write_Pipeline $pipeline;

	/**
	 * Reads and writes the userPrimitives provenance map in the overrides document.
	 *
	 * @since TBD
	 *
	 * @var User_Primitive_Index
	 */
	private User_Primitive_Index $index;

	/**
	 * Scans documents for alias references to a given primitive id.
	 *
	 * @since TBD
	 *
	 * @var Token_Reference_Policy
	 */
	private Token_Reference_Policy $policy;

	/**
	 * Pure merge / set / remove transforms. Reserved for Phase 10 (create / delete / rename).
	 *
	 * @since TBD
	 *
	 * @var Mutator
	 */
	private Mutator $mutator; // @phpstan-ignore property.onlyWritten (injected now; read in the upcoming create/delete/rename methods)

	/**
	 * Baseline document. Reserved for Phase 10.
	 *
	 * @since TBD
	 *
	 * @var Baseline_Document
	 */
	private Baseline_Document $baseline; // @phpstan-ignore property.onlyWritten (injected now; read in the upcoming create/delete/rename methods)

	/**
	 * Token registry. Reserved for Phase 10.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry; // @phpstan-ignore property.onlyWritten (injected now; read in the upcoming create/delete/rename methods)

	/**
	 * @since TBD
	 *
	 * @param Document_Write_Pipeline $pipeline The shared DTCG write pipeline.
	 * @param User_Primitive_Index    $index    Reads the userPrimitives provenance map.
	 * @param Token_Reference_Policy  $policy   Scans for alias references to a primitive.
	 * @param Mutator                 $mutator  Pure document transforms (Phase 10).
	 * @param Baseline_Document       $baseline Baseline document (Phase 10).
	 * @param Token_Registry          $registry Token registry (Phase 10).
	 */
	public function __construct(
		Document_Write_Pipeline $pipeline,
		User_Primitive_Index $index,
		Token_Reference_Policy $policy,
		Mutator $mutator,
		Baseline_Document $baseline,
		Token_Registry $registry
	) {
		$this->pipeline  = $pipeline;
		$this->index     = $index;
		$this->policy    = $policy;
		$this->mutator   = $mutator;
		$this->baseline  = $baseline;
		$this->registry  = $registry;
		$this->rest_base = 'documents';
	}

	/**
	 * Register routes for user-primitive sub-resources.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function register_routes(): void {
		register_rest_route(
			$this->namespace,
			'/' . $this->rest_base . '/' . self::SLUG_ROUTE . '/' . self::USER_PRIMITIVES_ROUTE . '/' . self::ID_ROUTE . '/' . self::REFERENCES_ROUTE,
			[
				[
					'methods'             => WP_REST_Server::READABLE,
					'callback'            => [ $this, 'get_references' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => $this->get_references_params(),
				],
				'schema' => [ $this, 'get_references_schema' ],
			]
		);
	}

	/**
	 * Return the set of alias references to a user primitive and whether deletion is safe.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_references( $request ) {
		$slug  = Cast::to_string( $request->get_param( self::SLUG_PARAM ) );
		$id    = Cast::to_string( $request->get_param( self::ID_PARAM ) );
		$error = $this->pipeline->guard_slug( $slug ) ?? $this->validate_canonical_id( $id );

		if ( $error instanceof WP_Error ) {
			return $error;
		}

		$stored = $this->pipeline->load_document( $slug );

		if ( ! $this->index->has( $stored, $id ) ) {
			return new WP_Error(
				'rest_design_tokens_not_found',
				__( 'That custom token does not exist.', 'kadence-blocks' ),
				[
					'status' => WP_Http::NOT_FOUND,
					'id'     => $id,
				]
			);
		}

		$references  = $this->policy->find( $stored, $id );
		$all_support = $this->policy->all_supported( $references );
		$ref_payload = [];

		foreach ( $references as $ref ) {
			$ref_payload[] = [
				'kind'      => $ref->kind,
				'path'      => $ref->path,
				'supported' => $ref->supported,
				'action'    => $ref->supported ? 'revert_to_baseline' : 'unsupported',
			];
		}

		return new WP_REST_Response(
			[
				'id'         => $id,
				'label'      => $this->index->label_for( $stored, $id ) ?? '',
				'version'    => $this->pipeline->get_version( $slug ),
				'deletable'  => $all_support,
				'references' => $ref_payload,
			],
			WP_Http::OK
		);
	}

	/**
	 * The JSON Schema for the references preview response.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	public function get_references_schema(): array {
		return $this->add_additional_fields_schema(
			[
				'$schema'    => 'http://json-schema.org/draft-07/schema#',
				'title'      => 'design-token-user-primitive-references',
				'type'       => 'object',
				'properties' => [
					'id'         => [
						'description' => __( 'The canonical dot-path id of the user primitive.', 'kadence-blocks' ),
						'type'        => 'string',
						'context'     => [ 'view' ],
						'readonly'    => true,
					],
					'label'      => [
						'description' => __( 'The human-readable label stored in the provenance map.', 'kadence-blocks' ),
						'type'        => 'string',
						'context'     => [ 'view' ],
						'readonly'    => true,
					],
					'version'    => [
						'description' => __( 'The cache-busting version hash for the token set.', 'kadence-blocks' ),
						'type'        => 'string',
						'context'     => [ 'view' ],
						'readonly'    => true,
					],
					'deletable'  => [
						'description' => __( 'Whether the primitive can be safely deleted (all references are supported).', 'kadence-blocks' ),
						'type'        => 'boolean',
						'context'     => [ 'view' ],
						'readonly'    => true,
					],
					'references' => [
						'description' => __( 'All alias references to this primitive found in the document.', 'kadence-blocks' ),
						'type'        => 'array',
						'context'     => [ 'view' ],
						'readonly'    => true,
						'items'       => [
							'type'       => 'object',
							'properties' => [
								'kind'      => [ 'type' => 'string' ],
								'path'      => [ 'type' => 'string' ],
								'supported' => [ 'type' => 'boolean' ],
								'action'    => [ 'type' => 'string' ],
							],
						],
					],
				],
			] 
		);
	}

	/**
	 * Validate that the supplied id is in the allowed phase-1 user-primitive namespace.
	 *
	 * @since TBD
	 *
	 * @param string $id
	 *
	 * @return WP_Error|null
	 */
	private function validate_canonical_id( string $id ): ?WP_Error {
		if ( Reserved_Namespace::is_reserved_id( $id ) ) {
			return null;
		}

		return new WP_Error(
			'rest_invalid_param',
			__( 'The id must be a canonical color custom primitive path (primitive.color.custom.<slug>).', 'kadence-blocks' ),
			[
				'status' => WP_Http::BAD_REQUEST,
				'id'     => $id,
			]
		);
	}

	/**
	 * Route arguments for the references endpoint.
	 *
	 * @since TBD
	 *
	 * @return array<string, mixed>
	 */
	private function get_references_params(): array {
		return [
			self::SLUG_PARAM => [
				'description'       => __( 'The token set slug.', 'kadence-blocks' ),
				'type'              => 'string',
				'required'          => true,
				'pattern'           => '^[\w-]+$',
				'sanitize_callback' => 'sanitize_key',
			],
			self::ID_PARAM   => [
				'description' => __( 'The canonical dot-path id of the user primitive.', 'kadence-blocks' ),
				'type'        => 'string',
				'required'    => true,
				'pattern'     => '^[\w.-]+$',
			],
		];
	}
}
