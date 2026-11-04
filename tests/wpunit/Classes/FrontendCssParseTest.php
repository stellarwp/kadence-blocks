<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_Frontend;
use RuntimeException;
use Tests\wpunit\KadenceBlocksTestCase;

/**
 * Tests the front-end CSS walk through a page's blocks and the posts they reference.
 */
class FrontendCssParseTest extends KadenceBlocksTestCase {

	/**
	 * More visits than any test page has blocks, so a walk past it is looping.
	 */
	private const MAX_VISITS = 200;

	/**
	 * The heading text of each block the walk visited, in order.
	 *
	 * @var string[]
	 */
	private array $visited = [];

	/**
	 * Records every block the walk visits, and stops a walk that never ends.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->visited = [];

		add_filter( 'kadence_blocks_frontend_build_css', [ $this, 'record_visit' ] );
	}

	/**
	 * Removes the visit recorder.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		remove_filter( 'kadence_blocks_frontend_build_css', [ $this, 'record_visit' ] );

		parent::tearDown();
	}

	/**
	 * Two synced patterns that include each other don't loop forever, and both still get walked.
	 *
	 * @return void
	 */
	public function test_patterns_that_include_each_other_are_walked_once(): void {
		$a = $this->pattern( 'A' );
		$b = $this->pattern( 'B', $a );
		$this->set_pattern( $a, 'A', $b );

		$this->walk( $this->synced( $a ) );

		$this->assertSame( [ 'A', 'B' ], $this->headings() );
	}

	/**
	 * A synced pattern that includes itself is walked once.
	 *
	 * @return void
	 */
	public function test_a_pattern_that_includes_itself_is_walked_once(): void {
		$a = $this->pattern( 'A' );
		$this->set_pattern( $a, 'A', $a );

		$this->walk( $this->synced( $a ) );

		$this->assertSame( [ 'A' ], $this->headings() );
	}

	/**
	 * Blocks after a self-including pattern are still walked.
	 *
	 * @return void
	 */
	public function test_blocks_after_a_self_including_pattern_are_still_walked(): void {
		$a = $this->pattern( 'A' );
		wp_update_post(
			[
				'ID'           => $a,
				'post_content' => $this->synced( $a ),
			]
		);

		$this->walk( $this->group( $this->synced( $a ) . $this->heading( 'After' ) ) );

		$this->assertSame( [ 'After' ], $this->headings() );
	}

	/**
	 * The same pattern used twice on a page is walked both times.
	 *
	 * @return void
	 */
	public function test_a_pattern_used_twice_is_walked_twice(): void {
		$a = $this->pattern( 'A' );

		$this->walk( $this->synced( $a ) . $this->synced( $a ) );

		$this->assertSame( [ 'A', 'A' ], $this->headings() );
	}

	/**
	 * A chain of patterns that doesn't loop is walked all the way down.
	 *
	 * @return void
	 */
	public function test_nested_patterns_are_walked_all_the_way_down(): void {
		$c = $this->pattern( 'C' );
		$b = $this->pattern( 'B', $c );
		$a = $this->pattern( 'A', $b );

		$this->walk( $this->synced( $a ) );

		$this->assertSame( [ 'A', 'B', 'C' ], $this->headings() );
	}

	/**
	 * Filter callback: records the block's heading text and stops the walk once it has clearly looped.
	 *
	 * @param mixed $block The block being walked.
	 *
	 * @return mixed
	 */
	public function record_visit( $block ) {
		if ( count( $this->visited ) >= self::MAX_VISITS ) {
			throw new RuntimeException( 'The block walk did not end.' );
		}

		$this->visited[] = is_array( $block ) && 'core/heading' === ( $block['blockName'] ?? '' ) ? trim( wp_strip_all_tags( $block['innerHTML'] ) ) : '';

		return $block;
	}

	/**
	 * Walk a page with the given content the way the front end does.
	 *
	 * @param string $content The page's block markup.
	 *
	 * @return void
	 */
	private function walk( string $content ): void {
		$page = self::factory()->post->create_and_get(
			[
				'post_type'    => 'page',
				'post_content' => $content,
			]
		);

		Kadence_Blocks_Frontend::get_instance()->frontend_build_css( $page );
	}

	/**
	 * The heading text of each heading block the walk visited.
	 *
	 * @return string[]
	 */
	private function headings(): array {
		return array_values( array_filter( $this->visited ) );
	}

	/**
	 * Create a synced pattern holding a heading, and optionally another synced pattern after it.
	 *
	 * @param string   $text     The heading text.
	 * @param int|null $includes The id of a synced pattern to include.
	 *
	 * @return int The pattern's id.
	 */
	private function pattern( string $text, ?int $includes = null ): int {
		return self::factory()->post->create(
			[
				'post_type'    => 'wp_block',
				'post_status'  => 'publish',
				'post_content' => $this->heading( $text ) . ( $includes ? $this->synced( $includes ) : '' ),
			]
		);
	}

	/**
	 * Replace a synced pattern's content with a heading and another synced pattern.
	 *
	 * @param int    $id       The pattern's id.
	 * @param string $text     The heading text.
	 * @param int    $includes The id of the synced pattern to include.
	 *
	 * @return void
	 */
	private function set_pattern( int $id, string $text, int $includes ): void {
		wp_update_post(
			[
				'ID'           => $id,
				'post_content' => $this->heading( $text ) . $this->synced( $includes ),
			]
		);
	}

	/**
	 * Block markup for a synced pattern reference.
	 *
	 * @param int $id The pattern's id.
	 *
	 * @return string
	 */
	private function synced( int $id ): string {
		return '<!-- wp:block {"ref":' . $id . '} /-->';
	}

	/**
	 * Block markup for a heading.
	 *
	 * @param string $text The heading text.
	 *
	 * @return string
	 */
	private function heading( string $text ): string {
		return '<!-- wp:heading --><h2>' . $text . '</h2><!-- /wp:heading -->';
	}

	/**
	 * Block markup for a group wrapping other blocks.
	 *
	 * @param string $inner The inner block markup.
	 *
	 * @return string
	 */
	private function group( string $inner ): string {
		return '<!-- wp:group --><div class="wp-block-group">' . $inner . '</div><!-- /wp:group -->';
	}
}
