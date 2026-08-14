<?php

namespace Tests\wpunit\Blocks;

use Kadence_Blocks_Identity_Block;
use Tests\wpunit\KadenceBlocksTestCase;
use WP_HTML_Tag_Processor;

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

	private function renderWithContent( string $attributes, string $content ): string {
		return do_blocks( '<!-- wp:kadence/identity ' . $attributes . ' -->' . $content . '<!-- /wp:kadence/identity -->' );
	}

	/**
	 * Collects every event handler attribute a browser would parse out of the markup.
	 */
	private function eventHandlers( string $html ): array {
		$processor = new WP_HTML_Tag_Processor( $html );
		$handlers  = [];

		while ( $processor->next_tag() ) {
			foreach ( (array) $processor->get_attribute_names_with_prefix( 'on' ) as $name ) {
				$handlers[] = $processor->get_tag() . '[' . $name . ']';
			}
		}

		return $handlers;
	}

	public function testLayoutClassIsEscaped() {
		$html = $this->render( '{"uniqueID":"9_i","layout":"logo\u0022 onmouseover=\u0022alert(1)"}' );

		$this->assertStringNotContainsString( 'onmouseover="', $html );
	}

	public function testValidLayoutRendersUnchanged() {
		$html = $this->render( '{"uniqueID":"9_i","layout":"logo-left"}' );

		$this->assertStringContainsString( 'kb-identity-layout-logo-left', $html );
	}

	public function testInnerImageMarkupCannotCreateEventHandlers() {
		$html = $this->renderWithContent(
			'{"uniqueID":"9_i","urlTransparent":"https://example.com/t.png","urlSticky":"https://example.com/s.png"}',
			'<img id="class=" alt=\' src=x onerror=alert(1)//\' />'
		);

		$this->assertSame( [], $this->eventHandlers( $html ) );
	}

	public function testTransparentAndStickyImagesReuseLogoAttributes() {
		$html = $this->renderWithContent(
			'{"uniqueID":"9_i","urlTransparent":"https://example.com/t.png","urlSticky":"https://example.com/s.png"}',
			'<img width="200" height="60" src="https://example.com/logo.png" class="custom-logo" alt="Site logo" decoding="async" srcset="https://example.com/logo-2x.png 2x" sizes="100vw" />'
		);

		$this->assertStringContainsString( '<img src="https://example.com/t.png" class="kb-img kb-img-transparent" alt="Site logo" width="200" height="60" decoding="async" />', $html );
		$this->assertStringContainsString( '<img src="https://example.com/s.png" class="kb-img kb-img-sticky" alt="Site logo" width="200" height="60" decoding="async" />', $html );
	}

	public function testAlternateImagesAreNotAddedWithoutUrls() {
		$html = $this->renderWithContent(
			'{"uniqueID":"9_i"}',
			'<img src="https://example.com/logo.png" class="custom-logo" alt="Site logo" />'
		);

		$this->assertStringNotContainsString( 'kb-img-transparent', $html );
		$this->assertStringNotContainsString( 'kb-img-sticky', $html );
	}
}
