<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Dtcg_Schema;
use WP_Error;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller that serves the published DTCG JSON Schema.
 *
 * Returns the committed, read-only dtcg.schema.json — the document grammar a valid DTCG document must
 * satisfy ($type enum, alias pattern, leaf and composite shapes). This is the format contract for
 * external tooling and the MCP layer, distinct from the registry's to_ui_schema() admin-UI catalog.
 *
 * @since TBD
 */
final class Schema_Controller extends Controller {

	/**
	 * Runtime accessor for the committed DTCG JSON Schema.
	 *
	 * @since TBD
	 *
	 * @var Dtcg_Schema
	 */
	private Dtcg_Schema $dtcg_schema;

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
	 * @param Dtcg_Schema $dtcg_schema Runtime accessor for the committed DTCG JSON Schema.
	 */
	public function __construct( Dtcg_Schema $dtcg_schema ) {
		$this->dtcg_schema = $dtcg_schema;
		$this->rest_base   = 'schema';
	}

	/**
	 * Register the read route for the DTCG schema.
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
					'callback'            => [ $this, 'get_item' ],
					'permission_callback' => [ $this, 'get_item_permissions_check' ],
					'args'                => [],
				],
				'schema' => [ $this, 'get_item_schema' ],
			]
		);
	}

	/**
	 * Read the published DTCG JSON Schema.
	 *
	 * The committed schema file is already JSON, so over HTTP it is served verbatim: returning a decoded
	 * array and letting the REST server re-encode it would reformat the published document for no reason
	 * (and risk altering it). Serialization is short-circuited and the raw bytes are echoed instead.
	 *
	 * The decoded schema is also set as the response data so server-side callers (rest_do_request(), which
	 * never runs the rest_pre_serve_request filter) read it via get_data() rather than getting an empty body.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response|WP_Error
	 */
	public function get_item( $request ) {
		$json     = $this->dtcg_schema->json();
		$document = json_decode( $json, true );

		// An empty or unparseable result means the committed file is missing or corrupt. Serving an empty
		// or invalid 200 body would hand consumers bad JSON, so surface the failure explicitly instead.
		if ( $json === '' || ! is_array( $document ) ) {
			return new WP_Error(
				'rest_design_tokens_schema_unavailable',
				__( 'The DTCG schema could not be read.', 'kadence-blocks' ),
				[ 'status' => WP_Http::INTERNAL_SERVER_ERROR ]
			);
		}

		// Fallback for a server-side call: rest_do_request() never runs the rest_pre_serve_request filter,
		// so it reads the schema from this decoded data. An HTTP call is the preferred usage — the filter
		// below streams the exact committed bytes and this decoded copy is ignored.
		$response = new WP_REST_Response( $document );

		add_filter(
			'rest_pre_serve_request',
			function ( $served, $result ) use ( $response, $json ) {
				if ( $result !== $response ) {
					return $served;
				}

				echo $json; // phpcs:ignore StellarWP.XSS.EscapeOutput.OutputNotEscaped, WordPress.Security.EscapeOutput.OutputNotEscaped -- Raw JSON Schema body; escaping would corrupt it.

				return true;
			},
			10,
			2
		);

		return $response;
	}

	/**
	 * The JSON Schema describing this endpoint's response: a DTCG JSON Schema (draft-07) document.
	 *
	 * The response is itself an open-ended JSON Schema document, so the properties are described
	 * permissively rather than enumerated.
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
			'$schema'              => 'http://json-schema.org/draft-07/schema#',
			'title'                => 'design-token-dtcg-schema',
			'description'          => __( 'The published DTCG JSON Schema that a valid design token document must satisfy.', 'kadence-blocks' ),
			'type'                 => 'object',
			'context'              => [ 'view' ],
			'readonly'             => true,
			'additionalProperties' => true,
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}
}
