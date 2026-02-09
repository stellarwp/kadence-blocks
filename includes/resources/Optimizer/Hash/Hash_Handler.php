<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Optimizer\Enums\Viewport;
use KadenceWP\KadenceBlocks\Optimizer\Path\Path_Factory;
use KadenceWP\KadenceBlocks\Optimizer\Request\Request;
use KadenceWP\KadenceBlocks\Optimizer\Skip_Rules\Rule_Collection;
use KadenceWP\KadenceBlocks\Optimizer\Store\Contracts\Store;
use KadenceWP\KadenceBlocks\Psr\Log\LoggerInterface;
use KadenceWP\KadenceBlocks\StellarWP\SuperGlobals\SuperGlobals as SG;
use KadenceWP\KadenceBlocks\Traits\Viewport_Trait;
use Throwable;

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
	private Hash_Builder $hasher;
	private Store $store;
	private Rule_Collection $rules;
	private Background_Processor $background_processor;
	private Hash_Store $hash_store;
	private Path_Factory $path_factory;
	private LoggerInterface $logger;

	/**
	 * @param Hash_Builder         $hasher
	 * @param Store                $store
	 * @param Rule_Collection      $rules
	 * @param Background_Processor $background_processor
	 * @param Hash_Store           $hash_store
	 * @param Path_Factory         $path_factory
	 * @param LoggerInterface      $logger
	 */
	public function __construct(
		Hash_Builder $hasher,
		Store $store,
		Rule_Collection $rules,
		Background_Processor $background_processor,
		Hash_Store $hash_store,
		Path_Factory $path_factory,
		LoggerInterface $logger
	) {
		$this->hasher               = $hasher;
		$this->store                = $store;
		$this->rules                = $rules;
		$this->background_processor = $background_processor;
		$this->hash_store           = $hash_store;
		$this->path_factory         = $path_factory;
		$this->logger               = $logger;
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
		if ( SG::get_get_var( Request::QUERY_OPTIMIZER_PREVIEW ) ) {
			$this->logger->debug( 'Skipping hash check due to optimizer preview query variable.' );

			return;
		}

		if ( ! $this->html ) {
			if ( ! is_admin() ) {
				$this->logger->debug(
					'Bypassing Optimizer: No HTML found to check',
					[
						'request_uri' => SG::get_server_var( 'REQUEST_URI', 'unknown' ),
					]
				);
			}

			return;
		}

		// Don't check hashes on 404 requests.
		if ( is_404() ) {
			$this->logger->debug(
				'Bypassing Optimizer: 404 not found',
				[
					'request_uri' => SG::get_server_var( 'REQUEST_URI', 'unknown' ),
				]
			);

			return;
		}

		// Return request early, if possible, so we can process this in the background.
		$this->background_processor->try_finish();

		$viewport = Viewport::current( $this->is_mobile() );

		// Process skip rules and bail if required.
		foreach ( $this->rules->all() as $rule ) {
			if ( $rule->should_skip() ) {
				$this->logger->debug(
					'Bypassing Optimizer: skip rule',
					[
						'rule'     => get_class( $rule ),
						'viewport' => $viewport->value(),
					]
				);

				return;
			}
		}

		try {
			$path = $this->path_factory->make();
		} catch ( InvalidArgumentException $e ) {
			$this->logger->error(
				'Hash handler unable to determine the path',
				[
					'viewport'  => $viewport->value(),
					'exception' => $e,
				]
			);

			return;
		}

		// Generate a hash based on the final HTML markup, note this differs for mobile vs desktop.
		$hash        = $this->hasher->build_hash( $this->html );
		$stored_hash = $this->hash_store->get( $path, $viewport );

		// The frontend script will pass this get var as a hash set request.
		$maybe_set_hash = (bool) SG::get_get_var( 'kadence_set_optimizer_hash', false );

		if ( $maybe_set_hash ) {
			$this->logger->debug(
				'Attempting to store new optimizer hash',
				[
					'path'     => $path->path(),
					'viewport' => $viewport->value(),
					'hash'     => $hash,
				]
			);

			// Store the hash for the current viewport.
			$this->hash_store->set( $path, $viewport, $hash );

			do_action( 'kadence_blocks_optimizer_set_hash', $hash, $path, $viewport );

			return;
		}

		// The HTML has been changed somehow, invalidate the optimization data, so that the next request will not have the data.
		if ( $stored_hash && $stored_hash !== $hash ) {
			$changes = $this->hasher->get_changed_components( $stored_hash, $hash );

			$this->logger->debug(
				'Optimizer hash does not match...deleting',
				[
					'path'     => $path->path(),
					'viewport' => $viewport->value(),
					'changes'  => $changes,
				]
			);

			// Delete the viewport hash.
			$this->hash_store->delete( $path, $viewport );

			$analysis = $this->store->get( $path );

			// This page isn't optimized or the data is already invalidated.
			if ( ! $analysis ) {
				return;
			}

			// Set data to stale to force invalidate data for all viewports.
			try {
				$this->logger->debug(
					'Marking optimizer path as stale to remove on next page load',
					[
						'path' => $path->path(),
					]
				);

				$analysis->isStale = true;
				$this->store->set( $path, $analysis );

				do_action( 'kadence_blocks_optimizer_data_invalidated', $analysis->isStale, $path );
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
