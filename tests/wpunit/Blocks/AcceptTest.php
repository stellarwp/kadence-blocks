<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Accept_Block;
use Tests\wpunit\KadenceBlocksTestCase;

class AcceptTest extends KadenceBlocksTestCase {

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Accept_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Accept_Block();
	}

	private function render( string $attributes ): string {
		return do_blocks( '<!-- wp:kadence/advanced-form-accept ' . $attributes . ' /-->' );
	}

	public function testFieldNameAndAnchorAreEscaped() {
		$html = $this->render( '{"uniqueID":"9_a","inputName":"n\u0022 onmouseover=\u0022alert(1)","anchor":"a\u0022 onfocus=\u0022alert(2)"}' );

		$this->assertStringNotContainsString( 'onmouseover="', $html );
		$this->assertStringNotContainsString( 'onfocus="', $html );
	}

	public function testValidAnchorRendersUnchanged() {
		$html = $this->render( '{"uniqueID":"9_a","inputName":"agree","anchor":"myid"}' );

		$this->assertStringContainsString( 'id="myid_0"', $html );
	}
}
