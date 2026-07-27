<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Time_Input_Block;
use Tests\wpunit\KadenceBlocksTestCase;

class TimeInputTest extends KadenceBlocksTestCase {

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Time_Input_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Time_Input_Block();
	}

	private function render( string $attributes ): string {
		return do_blocks( '<!-- wp:kadence/advanced-form-time ' . $attributes . ' /-->' );
	}

	public function testFieldNameIsEscaped() {
		$html = $this->render( '{"uniqueID":"9_t","inputName":"n\u0022 onmouseover=\u0022alert(1)"}' );

		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidFieldNameRendersUnchanged() {
		$html = $this->render( '{"uniqueID":"9_t","inputName":"my_time"}' );

		$this->assertStringContainsString( 'name="my_time"', $html );
	}
}
