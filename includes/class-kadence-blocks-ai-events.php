<?php
/**
 * Class responsible for sending events AI Events to Stellar Prophecy WP AI.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_authorization_token;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_license_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\get_original_domain;
use function KadenceWP\KadenceBlocks\StellarWP\Uplink\is_authorized;

/**
 * Class responsible for sending events AI Events to Stellar Prophecy WP AI.
 */
class Kadence_Blocks_AI_Events {

	/**
	 * The label property key for the event request.
	 */
	public const PROP_EVENT_LABEL = 'event_label';

	/**
	 * The data property key for the event request.
	 */
	public const PROP_EVENT_DATA = 'event_data';

	/**
	 * The event endpoint.
	 */
	public const ENDPOINT = '/wp-json/prophecy/v1/analytics/event';

	/**
	 * The API domain.
	 */
	public const DOMAIN = 'https://content.startertemplatecloud.com';

	/**
	 * Registers all necessary hooks.
	 *
	 * @action plugins_loaded
	 *
	 * @return void
	 */
	public function register(): void {
		add_action( 'kadenceblocks/ai/event', [ $this, 'handle_event' ], 10, 2 );
		add_action( 'rest_api_init', [ $this, 'register_route' ], 10, 0 );
	}

	/**
	 * Registers the analytics/event endpoint in the REST API.
	 *
	 * @action rest_api_init
	 *
	 * @return void
	 */
	public function register_route(): void {
		register_rest_route(
			'kb-design-library/v1',
			'/handle_event',
			[
				[
					'methods'             => WP_REST_Server::CREATABLE,
					'callback'            => [ $this, 'handle_event_endpoint' ],
					'permission_callback' => [ $this, 'verify_user_can_edit' ],
					'args'                => [
						self::PROP_EVENT_LABEL => [
							'description'       => __( 'The Event Label', 'kadence-blocks' ),
							'type'              => 'string',
							'sanitize_callback' => 'sanitize_text_field',
						],
						self::PROP_EVENT_DATA  => [
							'description' => __( 'The Event Data', 'kadence-blocks' ),
							'type'        => 'object',
						],
					],
				],
			]
		);
	}

	/**
	 * Checks if the current user has access to edit posts.
	 *
	 * @return bool
	 */
	public function verify_user_can_edit(): bool {
		return current_user_can( 'edit_posts' );
	}

	/**
	 * Sends events to Prophecy WP (if the user has opted in through AI auth).
	 *
	 * @action kadenceblocks/ai/event
	 *
	 * @return void
	 */
	public function handle_event( string $name, array $context ): void {
		// Only pass tracking events if AI has been activated through Opt in.
		$token         = get_authorization_token( 'kadence-blocks' );
		$license_key   = kadence_blocks_get_current_license_key();
		$is_authorized = false;
		if ( ! empty( $license_key ) ) {
			$is_authorized = is_authorized( $license_key, 'kadence-blocks', ( ! empty( $token ) ? $token : '' ), get_license_domain() );
		}
		if ( ! $is_authorized ) {
			return;
		}

		/**
		 * Filters the URL used to send events to.
		 *
		 * @param string The URL to use when sending events.
		 */
		$url = apply_filters( 'kadenceblocks/ai/event_url', self::DOMAIN . self::ENDPOINT );

		wp_remote_post(
			$url,
			[
				'timeout'  => 20,
				'blocking' => false,
				'headers'  => [
					'X-Prophecy-Token' => $this->get_prophecy_token_header(),
					'Content-Type'     => 'application/json',
				],
				'body'     => wp_json_encode(
					[
						'name'    => $name,
						'context' => $context,
					] 
				),
			]
		);
	}

	/**
	 * Constructs a consistent X-Prophecy-Token header.
	 *
	 * @param array $args An array of arguments to include in the encoded header.
	 *
	 * @return string The base64 encoded string.
	 */
	public static function get_prophecy_token_header( $args = [] ) {
		$site_url     = get_original_domain();
		$site_name    = get_bloginfo( 'name' );
		$license_data = kadence_blocks_get_current_license_data();
		$product_slug = ( ! empty( $license_data['product'] ) ? $license_data['product'] : 'kadence-blocks' );
		$defaults     = [
			'domain'          => $site_url,
			'key'             => ! empty( $license_data['key'] ) ? $license_data['key'] : '',
			'site_name'       => sanitize_title( $site_name ),
			'product_slug'    => apply_filters( 'kadence-blocks-auth-slug', $product_slug ),
			'product_version' => KADENCE_BLOCKS_VERSION,
		];
		if ( ! empty( $license_data['env'] ) ) {
			$defaults['env'] = $license_data['env'];
		}
		$parsed_args = wp_parse_args( $args, $defaults );

		return base64_encode( json_encode( $parsed_args ) );
	}

	/**
	 * Configures various event requests to the /analytics/event endpoint
	 * and sends them to ProphecyWP.
	 *
	 * @param WP_REST_Request $request The request to the endpoint.
	 */
	public function handle_event_endpoint( WP_REST_Request $request ): WP_REST_Response {
		$event_label = $request->get_param( self::PROP_EVENT_LABEL );
		$event_data  = $request->get_param( self::PROP_EVENT_DATA );

		$event   = '';
		$context = [];

		switch ( $event_label ) {
			case 'ai_wizard_started':
				$event = 'AI Wizard Started';
				break;

			case 'ai_wizard_update':
				$event   = 'AI Wizard Update';
				$context = [
					'organization_type' => $event_data['entityType'] ?? '',
					'location_type'     => $event_data['locationType'] ?? '',
					'location'          => $event_data['location'] ?? '',
					'industry'          => $event_data['industry'] ?? '',
					'description'       => $event_data['missionStatement'] ?? '',
					'keywords'          => $event_data['keywords'] ?? '',
					'tone'              => $event_data['tone'] ?? '',
					'collections'       => $event_data['customCollections'] ?? '',
					'lang'              => $event_data['lang'] ?? '',
					'goals'             => $event_data['goals'] ?? '',
				];
				break;
			case 'ai_wizard_complete':
				$event   = 'AI Wizard Complete';
				$context = [
					'organization_type' => $event_data['entityType'] ?? '',
					'location_type'     => $event_data['locationType'] ?? '',
					'location'          => $event_data['location'] ?? '',
					'industry'          => $event_data['industry'] ?? '',
					'description'       => $event_data['missionStatement'] ?? '',
					'keywords'          => $event_data['keywords'] ?? '',
					'tone'              => $event_data['tone'] ?? '',
					'collections'       => $event_data['customCollections'] ?? '',
					'lang'              => $event_data['lang'] ?? '',
					'goals'             => $event_data['goals'] ?? '',
				];
				break;
			case 'pattern_added_to_page':
				$event   = 'Pattern Added to Page';
				$context = [
					'pattern_id'         => $event_data['id'] ?? '',
					'pattern_slug'       => $event_data['slug'] ?? '',
					'pattern_name'       => $event_data['name'] ?? '',
					'pattern_style'      => $event_data['style'] ?? '',
					'pattern_is_ai'      => $event_data['is_ai'] ?? false,
					'pattern_context'    => $event_data['context'] ?? '',
					'pattern_categories' => $event_data['categories'] ?? [],
				];
				break;
			case 'ai_inline_completed':
				$event   = 'AI Inline Completed';
				$context = [
					'tool_name'      => $event_data['tool_name'],
					'type'           => $event_data['type'],
					'initial_text'   => $event_data['initial_text'],
					'result'         => $event_data['result'],
					'credits_before' => $event_data['credits_before'],
					'credits_after'  => $event_data['credits_after'],
					'credits_used'   => $event_data['credits_used'],
				];
				break;
			case 'collection_updated':
				$event   = 'Collection Updated';
				$context = $this->build_collection_updated_event_data( $event_data['customCollections'], $event_data['photoLibrary'] );
				break;
			case 'ai_inline_requested':
				$event   = 'AI Inline Requested';
				$context = [
					'tool_name'    => $event_data['tool_name'],
					'type'         => $event_data['type'],
					'initial_text' => $event_data['initial_text'],
				];
				break;
		}

		if ( strlen( $event ) !== 0 ) {
			do_action( 'kadenceblocks/ai/event', $event, $context );

			return new WP_REST_Response( [ 'message' => 'Event handled.' ], 200 );
		}

		return new WP_REST_Response( [ 'message' => 'Event not handled.' ], 500 );
	}

	/**
	 * Get the collection name of custom made collections, otherwise return the prepared collection name.
	 *
	 * @param  array<array{label?: string, value: string}> $collections  An array of custom collections.
	 * @param  string                                      $id_or_name   The ID of a custom collection, or the name
	 *                                                                   of a prepared collection.
	 *
	 * @return array
	 */
	private function build_collection_updated_event_data( array $collections, string $id_or_name ): array {
		$event = [
			'collection_name' => $id_or_name,
			'is_custom'       => false,
		];

		foreach ( $collections as $collection ) {
			if ( $collection['value'] === $id_or_name ) {
				return [
					'collection_name' => $collection['label'] ?? '',
					'is_custom'       => true,
				];
			}
		}

		return $event;
	}
}
