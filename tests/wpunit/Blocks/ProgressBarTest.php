<?php
// cspell:ignore linetype ignore aaaonmouseoveralert alignnone .

namespace Tests\wpunit\Blocks;

use Generator;
use Kadence_Blocks_CSS;

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

	/**
	 * The number's line height prints with the unit of the line height it shows: its own unit with its own line
	 * height, the label's unit with the label's, and the label's unit for a font saved before it had a unit.
	 *
	 * @dataProvider numberLineHeightProvider
	 *
	 * @param array<string, mixed>|null $number_font The number font, or null for an untouched number.
	 * @param string                    $expected    The line height the number prints.
	 *
	 * @return void
	 */
	public function testTheNumberLineHeightKeepsItsUnit( ?array $number_font, string $expected ): void {
		$attributes = [
			'uniqueID'  => '4_ddd',
			'labelFont' => [
				'lineHeight' => [ '24', '', '' ],
				'lineType'   => 'px',
			],
		];
		if ( null !== $number_font ) {
			$attributes['numberFont'] = $number_font;
		}

		$this->assertSame( $expected, $this->number_line_height( $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function numberLineHeightProvider(): Generator {
		yield 'untouched number' => [
			'number_font' => null,
			'expected'    => '24px',
		];
		yield 'own unit only' => [
			'number_font' => [ 'lineType' => 'em' ],
			'expected'    => '24px',
		];
		yield 'own unitless line height' => [
			'number_font' => [
				'lineHeight' => [ '2', '', '' ],
				'lineType'   => '',
			],
			'expected'    => '2',
		];
		yield 'own line height saved without a unit' => [
			'number_font' => [
				'lineHeight' => [ '30', '', '' ],
				'linetype'   => 'px',
			],
			'expected'    => '30px',
		];
		yield 'own line height and unit' => [
			'number_font' => [
				'lineHeight' => [ '2', '', '' ],
				'lineType'   => 'em',
			],
			'expected'    => '2em',
		];
	}

	/**
	 * Renders a Progress Bar and returns the line height its number prints.
	 *
	 * @param array<string, mixed> $attributes The bar's attributes.
	 *
	 * @return string The number's line height, or an empty string when it prints none.
	 */
	private function number_line_height( array $attributes ): string {
		Kadence_Blocks_CSS::$styles = [];
		$html                       = $this->render( (string) wp_json_encode( $attributes ) );
		preg_match( '/\.kt-progress-percent\{[^}]*?line-height:([^;}]+)/', implode( '', Kadence_Blocks_CSS::$styles ) . $html, $matches );

		return $matches[1] ?? '';
	}
}
