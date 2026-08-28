<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Tableofcontents_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class TableofcontentsTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'tableofcontents';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Tableofcontents_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Tableofcontents_Block();
	}

	/**
	 * Render the block against a post that has a heading, so the toggle icon output is reached.
	 *
	 * @param string $attributes JSON encoded block attributes.
	 */
	private function render( string $attributes ): string {
		$post_id = self::factory()->post->create(
			[ 'post_content' => '<!-- wp:heading --><h2 class="wp-block-heading">Section One</h2><!-- /wp:heading -->' ]
		);
		$GLOBALS['post'] = get_post( $post_id );

		return do_blocks( '<!-- wp:kadence/tableofcontents ' . $attributes . ' /-->' );
	}

	public function testToggleIconIsEscaped() {
		$html = $this->render( '{"uniqueID":"9_c","enableToggle":true,"toggleIcon":"arrow\u0022 onmouseover=\u0022alert(1)"}' );

		$this->assertStringContainsString( 'kb-toggle-icon-style-', $html );
		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidToggleIconRendersUnchanged() {
		$html = $this->render( '{"uniqueID":"9_c","enableToggle":true,"toggleIcon":"arrow"}' );

		$this->assertStringContainsString( 'kb-toggle-icon-style-arrow', $html );
	}
}
