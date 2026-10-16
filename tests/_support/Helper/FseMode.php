<?php

declare( strict_types=1 );

namespace Helper;

use Codeception\Module;
use Codeception\TestInterface;
use Kadence\FSE\Mode;
use Kadence\Theme;

/**
 * Switches the Kadence theme's Full Site Editing mode on for a test and back
 * off after it.
 */
final class FseMode extends Module {

	/**
	 * Whether the current test switched the mode on.
	 */
	private bool $enabled = false;

	public function _after( TestInterface $test ): void {
		if ( ! $this->enabled ) {
			return;
		}

		$this->mode()->disable();

		$this->enabled = false;
	}

	public function enable_fse_mode(): void {
		$this->assertTrue( $this->mode()->enable(), 'The Kadence theme refused to switch its Full Site Editing mode on.' );

		$this->enabled = true;
	}

	public function disable_fse_mode(): void {
		$this->assertTrue( $this->mode()->disable(), 'The Kadence theme refused to switch its Full Site Editing mode off.' );
	}

	private function mode(): Mode {
		return Theme::instance()->container()->get( Mode::class );
	}
}
