<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Editor_Css;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;
use WP_Http;
use WP_REST_Request;
use WP_REST_Response;
use WP_REST_Server;

/**
 * REST controller that serves the combined design-token editor CSS.
 *
 * A single read-only resource returning the exact CSS the projectors enqueue into the block editor at page
 * load — every projector's output aggregated ({@see Editor_Css}): the `--kb-token--*` token vars, the variant
 * vars + scoped retarget rules, the native-block companion CSS, and the block-default dimension CSS, for every
 * token set including the per-set switch layer. The editor fetches this after a variant (or, later, a token
 * value) change and re-injects it into the canvas, so the change applies live without a page reload.
 *
 * Read-only and gated by the shared design-tokens capability; a deactivated registry yields an empty string.
 *
 * @since TBD
 */
final class Projected_Css_Controller extends Controller {

	/**
	 * Aggregates every projector's editor CSS into one string.
	 *
	 * @since TBD
	 *
	 * @var Editor_Css
	 */
	private Editor_Css $editor_css;

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
	 * @param Editor_Css $editor_css Aggregates every projector's editor CSS.
	 */
	public function __construct( Editor_Css $editor_css ) {
		$this->editor_css = $editor_css;
		$this->rest_base  = 'projected-css';
	}

	/**
	 * Register the read route for the projected editor CSS.
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
	 * Read the combined design-token editor CSS.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return WP_REST_Response
	 */
	public function get_item( $request ) {
		return new WP_REST_Response( [ 'css' => $this->editor_css->css() ], WP_Http::OK );
	}

	/**
	 * The JSON Schema for the projected-CSS resource.
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
			'title'      => 'design-token-projected-css',
			'type'       => 'object',
			'properties' => [
				'css' => [
					'description' => __( 'The combined design-token editor CSS for every token set.', 'kadence-blocks' ),
					'type'        => 'string',
					'context'     => [ 'view' ],
					'readonly'    => true,
				],
			],
		];

		return $this->add_additional_fields_schema( $this->item_schema );
	}
}
