<?php declare( strict_types=1 );
// cspell:ignore pagenow .

namespace Tests\wpunit\Resources\Design_Tokens\Utils;

use KadenceWP\KadenceBlocks\Design_Tokens\Utils\Location;
use Tests\Support\Classes\TestCase;

final class LocationTest extends TestCase {

	/**
	 * @var string|null
	 */
	private $prev_pagenow;

	protected function setUp(): void {
		parent::setUp();

		global $pagenow;
		$this->prev_pagenow = $pagenow;
	}

	protected function tearDown(): void {
		global $pagenow;
		$pagenow = $this->prev_pagenow; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited

		unset( $_GET['post'], $_GET['post_type'] );

		parent::tearDown();
	}

	private function set_pagenow( string $value ): void {
		global $pagenow;
		$pagenow = $value; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
	}

	public function testSiteEditorIsAlwaysBlockEditor(): void {
		$this->set_pagenow( 'site-editor.php' );

		$this->assertTrue( Location::is_block_editor() );
	}

	public function testWidgetsScreenIsAlwaysBlockEditor(): void {
		$this->set_pagenow( 'widgets.php' );

		$this->assertTrue( Location::is_block_editor() );
	}

	public function testNewPostDefaultsToBlockEditor(): void {
		$this->set_pagenow( 'post-new.php' );

		$this->assertTrue( Location::is_block_editor() );
	}

	public function testNewPostForANonBlockEditorTypeIsNotBlockEditor(): void {
		$this->set_pagenow( 'post-new.php' );
		$_GET['post_type'] = 'attachment'; // The media type does not use the block editor.

		$this->assertFalse( Location::is_block_editor() );
	}

	public function testEditPostWithoutAPostIdIsNotBlockEditor(): void {
		// Mirrors a classic-editor request (or a malformed one): no resolvable block-editor post.
		$this->set_pagenow( 'post.php' );

		$this->assertFalse( Location::is_block_editor() );
	}

	public function testUnknownAdminPageIsNotBlockEditor(): void {
		$this->set_pagenow( 'options-general.php' );

		$this->assertFalse( Location::is_block_editor() );
	}
}
