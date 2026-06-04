<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts;

use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Cast;
use WP_Error;
use WP_REST_Controller;
use WP_REST_Request;

/**
 * Abstract base for the v1 Design Tokens REST controllers.
 *
 * Provides the shared `kb-design-tokens/v1` namespace and a capability gate
 * applied to every route through the standard permission-check methods. Concrete
 * controllers extend this to register their routes and implement their handlers.
 *
 * @since TBD
 */
abstract class Controller extends WP_REST_Controller {

	/**
	 * The REST namespace shared by every Design Tokens route.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const REST_NAMESPACE = 'kb-design-tokens/v1';

	/**
	 * Capability required to read or write design tokens.
	 *
	 * Site-wide branding is a theme-level concern, so this gates on
	 * edit_theme_options rather than KB's content-level edit_posts.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DEFAULT_CAPABILITY = 'edit_theme_options';

	/**
	 * Sets the shared REST namespace for every Design Tokens route.
	 *
	 * @since TBD
	 */
	public function __construct() {
		$this->namespace = self::REST_NAMESPACE;
	}

	/**
	 * The capability a request must satisfy to access design-token routes.
	 *
	 * The request, when available, is passed through to the filter so a callback
	 * can vary the requirement per route or method (for example, requiring a
	 * higher capability on writes than reads) without registering a new filter.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request|null $request The current request, if any.
	 *
	 * @return string
	 */
	public function get_capability( ?WP_REST_Request $request = null ): string {
		/**
		 * Filters the capability required to access the Design Tokens REST routes.
		 *
		 * @since TBD
		 *
		 * @param string               $capability The required capability.
		 * @param WP_REST_Request|null $request    The current request, if any.
		 */
		return Cast::to_string( apply_filters( 'kadence_blocks_design_tokens_capability', self::DEFAULT_CAPABILITY, $request ) );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error
	 */
	public function get_items_permissions_check( $request ) {
		return $this->permission_check( $request );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error
	 */
	public function get_item_permissions_check( $request ) {
		return $this->permission_check( $request );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error
	 */
	public function create_item_permissions_check( $request ) {
		return $this->permission_check( $request );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error
	 */
	public function update_item_permissions_check( $request ) {
		return $this->permission_check( $request );
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error
	 */
	public function delete_item_permissions_check( $request ) {
		return $this->permission_check( $request );
	}

	/**
	 * Shared permission gate for every design-token route.
	 *
	 * @since TBD
	 *
	 * @param WP_REST_Request $request Full details about the request.
	 *
	 * @return true|WP_Error True when the current user is permitted, WP_Error otherwise.
	 */
	protected function permission_check( WP_REST_Request $request ) {
		if ( current_user_can( $this->get_capability( $request ) ) ) {
			return true;
		}

		return new WP_Error(
			'rest_forbidden',
			__( 'Sorry, you are not allowed to manage design tokens.', 'kadence-blocks' ),
			[ 'status' => rest_authorization_required_code() ]
		);
	}
}
