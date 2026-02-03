<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Optimizer\Hash;

final class Background_Processor {

	/**
	 * Try to return the request early so this can be processed in
	 * a background thread.
	 *
	 * @return void
	 */
	public function try_finish(): void {
		if ( function_exists( 'fastcgi_finish_request' ) ) {
			fastcgi_finish_request();
		} elseif ( function_exists( 'litespeed_finish_request' ) ) {
			litespeed_finish_request();
		}
	}
}
