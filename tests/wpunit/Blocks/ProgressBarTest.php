<?php

namespace Tests\wpunit\Blocks;

// cspell:ignore aaaonmouseoveralert alignnone

use Kadence_Blocks_Progress_Bar_Block;
use Tests\Support\Classes\KadenceBlocksUnit;

class ProgressBarTest extends KadenceBlocksUnit {
	/**
	 * Block name.
	 *
	 * @var string
	 */
	protected $block_name = 'progress-bar';

	/**
	 * Block instance.
	 *
	 * @var Kadence_Blocks_Progress_Bar_Block
	 */
	protected $block;

	protected function setUp(): void {
		parent::setUp();
		$this->block = new Kadence_Blocks_Progress_Bar_Block();
	}

	/**
	 * Render the block from its serialized attributes.
	 *
	 * @param string $attributes JSON encoded block attributes.
	 *
	 * @return string
	 */
	private function render( string $attributes ): string {
		return do_blocks( '<!-- wp:kadence/progress-bar ' . $attributes . ' /-->' );
	}

	public function testUniqueIdIsNormalizedInMarkupAndStyles() {
		$html = $this->render( '{"uniqueID":"1_aaa\u0022 onmouseover=\u0022alert(1)"}' );

		$this->assertStringNotContainsString( 'onmouseover="', $html );
		$this->assertStringContainsString( 'id="current-progress-above1_aaaonmouseoveralert1"', $html );
		$this->assertStringContainsString( 'kb-progress-bar-container1_aaaonmouseoveralert1', $html );
	}

	public function testNumberPrefixAndSuffixAreEscaped() {
		$html = $this->render( '{"uniqueID":"2_bbb","numberPrefix":"<img src=x onerror=alert(1)>","numberSuffix":"</span><script>alert(2)</script>"}' );

		$this->assertStringNotContainsString( '<img', $html );
		$this->assertStringNotContainsString( '<script>', $html );
		$this->assertStringNotContainsString( 'onerror', $html );
	}

	/**
	 * A multiply entity-encoded prefix and suffix reach the localized script data as plain text with no markup.
	 *
	 * @return void
	 */
	public function testEncodedNumberPrefixAndSuffixAreLocalizedAsPlainText(): void {
		$this->render( '{"uniqueID":"4_ddd","numberPrefix":"&amp;lt;img src=x onerror=alert(1)&amp;gt;$","numberSuffix":"&amp;lt;b&amp;gt;%"}' );
		$this->block->data_enqueue();

		$data = (string) wp_scripts()->get_data( 'kadence-blocks-progress-bar', 'data' );
		$this->assertNotSame( '', $data, 'The block localizes its items.' );

		// No tag or encoded tag may remain in the localized data.
		$this->assertStringNotContainsString( '<img', $data );
		$this->assertStringNotContainsString( '&lt;img', $data );
		$this->assertStringContainsString( '\"prefix\":\"$\",\"suffix\":\"%\"', $data );
	}

	/**
	 * A multiply entity-encoded prefix and suffix render in the initial label with their tags removed, matching the animated label.
	 *
	 * @return void
	 */
	public function testEncodedNumberPrefixAndSuffixRenderAsPlainTextInInitialLabel(): void {
		$html = $this->render( '{"uniqueID":"6_fff","numberPrefix":"&amp;lt;b&amp;gt;$","numberSuffix":"%"}' );

		$this->assertStringContainsString( '>$90%</span>', $html );
		$this->assertStringNotContainsString( '&amp;lt;', $html );
		$this->assertStringNotContainsString( '&lt;b', $html );
	}

	/**
	 * A prefix and suffix keep their leading and trailing spaces in the localized script data.
	 *
	 * @return void
	 */
	public function testNumberPrefixAndSuffixKeepEdgeWhitespaceWhenLocalized(): void {
		$this->render( '{"uniqueID":"5_eee","numberPrefix":"USD ","numberSuffix":" pts"}' );
		$this->block->data_enqueue();

		$data = (string) wp_scripts()->get_data( 'kadence-blocks-progress-bar', 'data' );

		$this->assertStringContainsString( '\"prefix\":\"USD \",\"suffix\":\" pts\"', $data );
	}

	public function testAlignIsEscapedInContainerClasses() {
		$html = $this->render( '{"uniqueID":"3_ccc","align":"none\u0022 onfocus=\u0022alert(1)"}' );

		$this->assertStringNotContainsString( 'onfocus="', $html );
		$this->assertStringContainsString( 'alignnone&quot; onfocus=&quot;alert(1)', $html );
	}

	public function testValidAttributesRenderUnchanged() {
		$html = $this->render( '{"uniqueID":"372_bebd31-3e","numberPrefix":"$","numberSuffix":" USD","progressAmount":42,"showMaxProgressOnPageLoad":true}' );

		$this->assertStringContainsString( 'kb-progress-bar-container372_bebd31-3e', $html );
		$this->assertStringContainsString( 'id="current-progress-above372_bebd31-3e"', $html );
		$this->assertStringContainsString( '>$42 USD</span>', $html );
	}
}
