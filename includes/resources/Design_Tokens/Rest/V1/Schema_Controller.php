<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Dtcg_Schema;
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
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_item( $request ) {
		return new WP_REST_Response( $this->dtcg_schema->document(), WP_Http::OK );
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
