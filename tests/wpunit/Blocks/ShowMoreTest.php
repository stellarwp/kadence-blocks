<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Show_More_Block;
use Tests\Support\Classes\KadenceBlocksUnit;
use WP_HTML_Tag_Processor;

class ShowMoreTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'show-more';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Show_More_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Show_More_Block();
	}

	private function render( string $content ): string {
		return do_blocks( '<!-- wp:kadence/show-more {"uniqueID":"9_i"} -->' . $content . '<!-- /wp:kadence/show-more -->' );
	}

	public function testContainerMarkupCannotCreateEventHandlers() {
		$html = $this->render( '<div class="kb-block-show-more-container onmouseover=alert(1) $0">INNER</div>' );

		$processor = new WP_HTML_Tag_Processor( $html );
		$handlers  = [];

		while ( $processor->next_tag() ) {
			foreach ( (array) $processor->get_attribute_names_with_prefix( 'on' ) as $name ) {
				$handlers[] = $processor->get_tag() . '[' . $name . ']';
			}
		}

		$this->assertSame( [], $handlers );
	}

	public function testExcerptIsInsertedAfterTheContainer() {
		$html = $this->render( '<div class="kb-block-show-more-container kb-block-show-more-container9_i">INNER</div>' );

		$this->assertStringContainsString( '<div class="kb-block-show-more-container kb-block-show-more-container9_i"><div class="kb-show-more-sr-excerpt" aria-live="polite" aria-atomic="true"></div>INNER</div>', $html );
	}
}
