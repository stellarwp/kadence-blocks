<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use Tests\Support\Classes\TestCase;

final class Css_RendererTest extends TestCase {

	private Css_Renderer $renderer;

	protected function setUp(): void {
		parent::setUp();

		$this->renderer = new Css_Renderer();
	}

	public function testColorPassesThrough(): void {
		$this->assertSame( '#3182CE', $this->renderer->render( 'color', '#3182CE' ) );
	}

	public function testDimensionPassesThrough(): void {
		$this->assertSame( '1rem', $this->renderer->render( 'dimension', '1rem' ) );
	}

	public function testUnknownScalarTypePassesThrough(): void {
		$this->assertSame( '700', $this->renderer->render( 'number', 700 ) );
	}

	public function testFontFamilyJoinsWithCommas(): void {
		$this->assertSame(
			'Inter, system-ui, sans-serif',
			$this->renderer->render( 'fontFamily', [ 'Inter', 'system-ui', 'sans-serif' ] )
		);
	}

	public function testFontFamilyQuotesNamesContainingSpaces(): void {
		$this->assertSame(
			'"Times New Roman", Georgia, serif',
			$this->renderer->render( 'fontFamily', [ 'Times New Roman', 'Georgia', 'serif' ] )
		);
	}

	public function testFontFamilyAcceptsASingleString(): void {
		$this->assertSame( 'Inter', $this->renderer->render( 'fontFamily', 'Inter' ) );
	}

	public function testShadowRendersInOffsetBlurSpreadColorOrder(): void {
		$shadow = [
			'color'   => '#1A202C',
			'offsetX' => '0px',
			'offsetY' => '2px',
			'blur'    => '8px',
			'spread'  => '0px',
		];

		$this->assertSame( '0px 2px 8px 0px #1A202C', $this->renderer->render( 'shadow', $shadow ) );
	}

	public function testTypographyRendersTheFontShorthand(): void {
		$typography = [
			'fontFamily' => 'Inter, sans-serif',
			'fontSize'   => '1.953rem',
			'fontWeight' => 700,
			'lineHeight' => 1.2,
		];

		$this->assertSame( '700 1.953rem/1.2 Inter, sans-serif', $this->renderer->render( 'typography', $typography ) );
	}

	public function testTypographyRendersAFontFamilyListField(): void {
		$typography = [
			'fontFamily' => [ 'Inter', 'system-ui', 'sans-serif' ],
			'fontSize'   => '1rem',
			'fontWeight' => 400,
			'lineHeight' => 1.6,
		];

		$this->assertSame(
			'400 1rem/1.6 Inter, system-ui, sans-serif',
			$this->renderer->render( 'typography', $typography )
		);
	}

	public function testCompositeTypesReturnEmptyStringForNonArrayValues(): void {
		$this->assertSame( '', $this->renderer->render( 'shadow', '#fff' ) );
		$this->assertSame( '', $this->renderer->render( 'typography', 'nonsense' ) );
	}

	public function testNonScalarScalarTypeReturnsEmptyString(): void {
		$this->assertSame( '', $this->renderer->render( 'color', [ 'unexpected' => 'array' ] ) );
	}
}
