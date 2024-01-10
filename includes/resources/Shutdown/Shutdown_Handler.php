<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Shutdown;

/**
 * Process different tasks during the WordPress shutdown action.
 *
 * @see Shutdown_Provider::register()
 */
final class Shutdown_Handler {

	/**
	 * @var Shutdown_Collection
	 */
	private $collection;

	public function __construct( Shutdown_Collection $collection ) {
		$this->collection = $collection;
	}

	/**
	 * If running on PHP-FPM, this will return the request, but continue processing
	 * any code after in the same thread, which means it instantly sends the request back
	 * to the browser without needing to wait for the code after it to process.
	 *
	 * @action shutdown
	 *
	 * @return void
	 */
	public function handle(): void {
		// So far, there is no reason to process this unless this is a REST request.
		if ( ! defined( 'REST_REQUEST' ) || ! REST_REQUEST ) {
			return;
		}

		// Return request early, if possible.
		if ( function_exists( 'fastcgi_finish_request' ) ) {
			fastcgi_finish_request();
		}

		// Process all Terminable tasks in the background.
		foreach ( $this->collection->all() as $task ) {
			$task->terminate();
		}
	}

}
