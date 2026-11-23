<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\ClassicFeatures;

use Codeception\TestCase\WPTestCase;
use Kadence_Blocks_Posts_Block;

/**
 * Covers what the posts block leaves to the Kadence theme: the loop styles and
 * the archive category colors. The theme keeps providing both in Full Site
 * Editing mode, so the block behaves the same in both modes.
 */
final class PostsBlockTest extends WPTestCase {
	private const UNBOXED_POSTS = [
		'uniqueID'  => '10_posts',
		'loopStyle' => 'unboxed',
	];

	protected \IntegrationTester $tester;

	/**
	 * @after
	 */
	public function remove_posts_stylesheet(): void {
		wp_dequeue_style( 'kadence-blocks-posts' );
		wp_deregister_style( 'kadence-blocks-posts' );
	}

	public function testClassicUnboxedLoopResetsTheThemeLoopStyles(): void {
		$css = $this->tester->block_css( Kadence_Blocks_Posts_Block::get_instance(), self::UNBOXED_POSTS );

		$this->assertStringContainsString( '.kb-posts-id-10_posts .loop-entry{background:transparent;', $css );
	}

	public function testFseModeUnboxedLoopResetsTheThemeLoopStyles(): void {
		$this->tester->enable_fse_mode();

		$css = $this->tester->block_css( Kadence_Blocks_Posts_Block::get_instance(), self::UNBOXED_POSTS );

		$this->assertStringContainsString( '.kb-posts-id-10_posts .loop-entry{background:transparent;', $css );
	}

	public function testClassicThemeProvidesThePostsStylesheet(): void {
		Kadence_Blocks_Posts_Block::get_instance()->render_scripts( [] );

		$this->assertFalse( wp_style_is( 'kadence-blocks-posts', 'enqueued' ) );
	}

	public function testFseModeThemeProvidesThePostsStylesheet(): void {
		$this->tester->enable_fse_mode();

		Kadence_Blocks_Posts_Block::get_instance()->render_scripts( [] );

		$this->assertFalse( wp_style_is( 'kadence-blocks-posts', 'enqueued' ) );
	}

	public function testClassicPrintsTheArchiveCategoryColors(): void {
		$color = $this->set_up_colored_category_post();

		$this->assertStringContainsString( $color, $this->taxonomies_html() );
	}

	public function testFseModePrintsTheArchiveCategoryColors(): void {
		$color = $this->set_up_colored_category_post();
		$this->tester->enable_fse_mode();

		$this->assertStringContainsString( $color, $this->taxonomies_html() );
	}

	/**
	 * Creates a post in a category with a theme archive color and makes it the current post.
	 *
	 * @return string The category color.
	 */
	private function set_up_colored_category_post(): string {
		$color       = '#a1b2c3';
		$category_id = self::factory()->category->create( [ 'name' => 'Colored' ] );
		update_term_meta( $category_id, 'archive_category_color', $color );
		$GLOBALS['post'] = self::factory()->post->create_and_get( [ 'post_category' => [ $category_id ] ] );
		setup_postdata( $GLOBALS['post'] );

		return $color;
	}

	private function taxonomies_html(): string {
		ob_start();
		kadence_blocks_get_template( 'entry-loop-taxonomies.php', [ 'attributes' => [ 'customKadenceArchiveColors' => true ] ] );

		return ob_get_clean();
	}
}
