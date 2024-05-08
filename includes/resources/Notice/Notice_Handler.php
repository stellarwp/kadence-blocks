<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Notice;

use KadenceWP\KadenceBlocks\StellarWP\Uplink\Notice\Notice;
use KadenceWP\KadenceBlocks\StellarWP\Uplink\Notice\Notice_Controller;

/**
 * Handles rendering multiple admin notices at once.
 */
final class Notice_Handler {

	/**
	 * Controller responsible for rendering notices.
	 */
	private Notice_Controller $controller;

	/**
	 * @var Notice[]
	 */
	private array $notices = [];

	public function __construct( Notice_Controller $controller ) {
		$this->controller = $controller;
	}

	/**
	 * Add a notice to the stack.
	 *
	 * @param  Notice  $notice
	 *
	 * @return self
	 */
	public function add( Notice $notice ): self {
		$this->notices[] = $notice;

		return $this;
	}

	/**
	 * Display all notices in the stack.
	 */
	public function display(): void {
		if ( count( $this->notices ) <= 0 ) {
			return;
		}

		foreach ( $this->notices as $notice ) {
			$this->controller->render( $notice->toArray() );
		}
	}

	/**
	 * Get all the notices.
	 *
	 * @return Notice[]
	 */
	public function all(): array {
		return $this->notices;
	}

	/**
	 * Clear all notices in the stack.
	 */
	public function clear(): self {
		$this->notices = [];

		return $this;
	}

}
