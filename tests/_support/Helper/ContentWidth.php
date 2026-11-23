<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;

/**
 * Sets the theme's `$content_width` global for a test and restores it after.
 */
final class ContentWidth extends Module {

	/**
	 * Whether the current test changed `$content_width`.
	 */
	private bool $changed = false;

	/**
	 * The `$content_width` before the test changed it, null when unset.
	 */
	private ?int $original = null;

	public function _after( TestInterface $test ): void {
		if ( ! $this->changed ) {
			return;
		}

		unset( $GLOBALS['content_width'] );
		if ( null !== $this->original ) {
			$GLOBALS['content_width'] = $this->original;
		}

		$this->changed  = false;
		$this->original = null;
	}

	public function set_content_width( int $width ): void {
		$this->back_up();

		$GLOBALS['content_width'] = $width;
	}

	public function unset_content_width(): void {
		$this->back_up();

		unset( $GLOBALS['content_width'] );
	}

	private function back_up(): void {
		if ( $this->changed ) {
			return;
		}

		$this->original = isset( $GLOBALS['content_width'] ) ? absint( $GLOBALS['content_width'] ) : null;
		$this->changed  = true;
	}
}
