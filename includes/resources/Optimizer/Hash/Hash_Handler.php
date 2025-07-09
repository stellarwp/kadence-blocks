<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

use DateTimeImmutable;
use DateTimeZone;
use KadenceWP\KadenceBlocks\Hasher;
use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Hash\Rule\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use Throwable;
use WP_Post;

/**
 * Handles output‑buffer hashing during the WordPress shutdown phase to detect
 * whether the rendered HTML for the current request has changed since the last
 * optimization pass and invalidates the current optimization data if it's outdated.
 */
final class Hash_Handler {

	use Viewport_Trait;

	/**
	 * Captures the final HTML before output buffering is
	 * flushed.
	 *
	 * @var string
	 */
	private string $html = '';
	private Hasher $hasher;
	private Store $store;
	private Rule_Collection $rules;
	private Background_Processor $background_processor;
	private Hash_Store $hash_store;

	public function __construct(
		Hasher $hasher,
		Store $store,
		Rule_Collection $rules,
		Background_Processor $background_processor,
		Hash_Store $hash_store
	) {
		$this->hasher               = $hasher;
		$this->store                = $store;
		$this->rules                = $rules;
		$this->background_processor = $background_processor;
		$this->hash_store           = $hash_store;
	}

	/**
	 * Begin buffering the request.
	 *
	 * @action template_redirect
	 *
	 * @return void
	 */
	public function start_buffering(): void {
		ob_start( [ $this, 'end_buffering' ] );
	}

	/**
	 * Manage the current HTML hash state for the request.
	 *
	 * Compares the freshly generated hash of the final output buffer
	 * against the previously stored hash. If the hash differs, this indicates
	 * that the page content has changed since the last optimization pass.
	 *
	 * This method is intended to be called AS LATE AS POSSIBLE in the `shutdown` phase, after
	 * output buffering has captured the full HTML content.
	 *
	 * If running under fastcgi or litespeed, the request will be returned immediately and the logic
	 * processed in the background.
	 *
	 * @action shutdown
	 *
	 * @return void
	 */
	public function check_hash(): void {
		if ( ! $this->html ) {
			return;
		}

		// Return request early, if possible, so we can process this in the background.
		$this->background_processor->try_finish();

		global $post, $wp_query;

		if ( ! $post instanceof WP_Post || ! $wp_query->is_main_query() ) {
			return;
		}

		// Process skip rules and bail if required.
		foreach ( $this->rules->all() as $rule ) {
			if ( $rule->should_skip() ) {
				return;
			}
		}

		// Generate a hash based on the final HTML markup, note this differs for mobile vs desktop.
		$hash        = $this->hasher->hash( $this->html );
		$viewport    = Viewport::current( $this->is_mobile() );
		$stored_hash = $this->hash_store->get( $post->ID, $viewport );

		// The frontend script will pass this get var as a hash set request.
		$maybe_set_hash = (bool) SG::get_get_var( 'kadence_set_optimizer_hash', false );

		if ( $maybe_set_hash ) {
			// Store the hash for the current viewport.
			$this->hash_store->set( $post->ID, $viewport, $hash );

			do_action( 'kadence_blocks_optimizer_set_hash', $hash, $post->ID, $viewport );

			return;
		}

		// The HTML has been changed somehow, invalidate the optimization data, so that the next request will not have the data.
		if ( $stored_hash && $stored_hash !== $hash ) {
			// Delete the viewport hash.
			$this->hash_store->delete( $post->ID, $viewport );

			$analysis = $this->store->get( $post->ID );

			// This page isn't optimized or the data is already invalidated.
			if ( ! $analysis ) {
				return;
			}

			// Set the lastModified time way in the past to force invalidate data for all viewports.
			try {
				$analysis->lastModified = new DateTimeImmutable( '1902-12-13', new DateTimeZone( 'UTC' ) );
				$this->store->set( $post->ID, $analysis );

				do_action( 'kadence_blocks_optimizer_data_invalidated', $analysis->lastModified, $post->ID );
			} catch ( Throwable $e ) {
				// Our DateTimeImmutable should never throw an exception, but this is here just in case.
				return;
			}
		}

		$this->html = '';

		do_action( 'kadence_blocks_hash_check_complete' );
	}

	/**
	 * Get the HTML, which will differ as the request proceeds.
	 *
	 * @return string
	 */
	public function html(): string {
		return $this->html;
	}

	/**
	 * Callback that receives the buffer's contents. Captures the full page HTML
	 * in our property for use when we manage the hash state down the line.
	 *
	 * @param string $html The final HTML.
	 * @param int    $phase The bitmask of the PHP_OUTPUT_HANDLER_* constants.
	 *
	 * @return string
	 */
	private function end_buffering( string $html, int $phase ): string {
		if ( $phase & PHP_OUTPUT_HANDLER_FINAL ) {
			$this->html = $html;
		}

		return $html;
	}
}
