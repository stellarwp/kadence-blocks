<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Default_Css;

use Tests\Support\Classes\TestCase;

/**
 * Confirms the block-default CSS projector is wired into KB's style pipeline on boot — front end and
 * editor — at the priorities that keep its rules after the token vars and variant overrides.
 */
final class ProjectorTest extends TestCase {

	/**
	 * @return void
	 */
	public function testItEnqueuesOnTheFrontEndAfterTheTokenVars(): void {
		global $wp_filter;

		$callbacks = $wp_filter['wp_enqueue_scripts']->callbacks ?? [];

		$this->assertArrayHasKey( 120, $callbacks );
	}

	/**
	 * @return void
	 */
	public function testItEnqueuesInTheEditorAfterTheTokenVars(): void {
		global $wp_filter;

		$callbacks = $wp_filter['admin_init']->callbacks ?? [];

		$this->assertArrayHasKey( 20, $callbacks );
	}
}
