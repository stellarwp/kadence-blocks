<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Posts_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class PostsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'posts';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Posts_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Posts_Block();
	}

	public function test_title_template_only_allows_heading_levels(): void {
		$GLOBALS['post'] = self::factory()->post->create_and_get();
		setup_postdata( $GLOBALS['post'] );

		$this->assertStringStartsWith( '<h3 class="entry-title">', $this->render_title( '3' ) );
		$this->assertStringStartsWith( '<h2 class="entry-title">', $this->render_title( 'x onfocus=alert(1)' ) );
	}

	private function render_title( string $level ): string {
		return kadence_blocks_get_template_html(
			'entry-loop-title.php',
			[ 'attributes' => [ 'titleFont' => [ [ 'level' => $level ] ] ] ]
		);
	}


}
