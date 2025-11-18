<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Request;

use KadenceWP\KadenceBlocks\Optimizer\Nonce\Nonce;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;

/**
 * Handles the anonymization of authenticated requests for performance optimization.
 *
 * This class detects optimizer requests using a nonce-based query parameter and
 * forces them to run as anonymous (logged-out) requests. This ensures that
 * performance testing through iframes captures the public-facing version of
 * pages without any user-specific customizations or cached content.
 */
final class Request_Anonymizer {

	private Nonce $nonce;

	public function __construct( Nonce $nonce ) {
		$this->nonce = $nonce;
	}

	/**
	 * Detect if this is an optimizer request, and log the user out for that request so
	 * we're loading the public version of the URL through the iframe.
	 *
	 * @filter plugins_loaded
	 *
	 * @return void
	 */
	public function force_anonymous_request(): void {
		$nonce = SG::get_get_var( Request::QUERY_TOKEN );

		if ( ! $nonce ) {
			return;
		}

		// If using a browser that supports IFrame credentialless, they will be logged out already.
		if ( ! is_user_logged_in() ) {
			return;
		}

		if ( ! $this->nonce->verify( $nonce ) ) {
			wp_die( 'Invalid optimizer nonce.', 403 );
		}

		// Override the current user for the remainder of this request.
		wp_set_current_user( 0 );
	}
}
