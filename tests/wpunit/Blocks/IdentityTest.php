<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Identity_Block;
use Tests\wpunit\KadenceBlocksTestCase;

class IdentityTest extends KadenceBlocksTestCase {

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Identity_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Identity_Block();
	}

	private function render( string $attributes ): string {
		return do_blocks( '<!-- wp:kadence/identity ' . $attributes . ' /-->' );
	}

	public function testLayoutClassIsEscaped() {
		$html = $this->render( '{"uniqueID":"9_i","layout":"logo\u0022 onmouseover=\u0022alert(1)"}' );

		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidLayoutRendersUnchanged() {
		$html = $this->render( '{"uniqueID":"9_i","layout":"logo-left"}' );

		$this->assertStringContainsString( 'kb-identity-layout-logo-left', $html );
	}
}
