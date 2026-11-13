<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Tableofcontents;

use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * Shared setup for tests of the table of contents CSS sections.
 */
abstract class Tableofcontents_Test_Case extends Free_Section_Test_Case {

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-tableofcontents-css.php';
	}
}
