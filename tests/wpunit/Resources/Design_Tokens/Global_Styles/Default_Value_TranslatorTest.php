<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Default_Value_Translator;
use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Untranslatable_Value_Exception;
use Tests\Support\Classes\TestCase;

final class Default_Value_TranslatorTest extends TestCase {

	private Default_Value_Translator $translator;

	/**
	 * Set up test fixtures.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$this->translator = new Default_Value_Translator();
	}

	/**
	 * A hex color is passed through unchanged.
	 *
	 * @return void
	 */
	public function testColorPassesHexThrough(): void {
		$result = $this->translator->translate( 'color', '#3182CE' );

		$this->assertSame( 'color', $result['$type'] );
		$this->assertSame( '#3182CE', $result['$value'] );
	}

	/**
	 * An rgb() color is passed through unchanged.
	 *
	 * @return void
	 */
	public function testColorPassesRgbThrough(): void {
		$result = $this->translator->translate( 'color', 'rgb(49, 130, 206)' );

		$this->assertSame( 'color', $result['$type'] );
		$this->assertSame( 'rgb(49, 130, 206)', $result['$value'] );
	}

	/**
	 * An empty color value throws.
	 *
	 * @return void
	 */
	public function testColorThrowsOnEmpty(): void {
		$this->expectException( Untranslatable_Value_Exception::class );
		$this->expectExceptionMessage( 'Color value cannot be empty.' );

		$this->translator->translate( 'color', '' );
	}

	/**
	 * A spacing dimension like "8px" is passed through unchanged.
	 *
	 * @return void
	 */
	public function testDimensionPassesPxThrough(): void {
		$result = $this->translator->translate( 'spacing', '8px' );

		$this->assertSame( 'dimension', $result['$type'] );
		$this->assertSame( '8px', $result['$value'] );
	}

	/**
	 * A spacing dimension like "1rem" is passed through unchanged.
	 *
	 * @return void
	 */
	public function testDimensionPassesRemThrough(): void {
		$result = $this->translator->translate( 'spacing', '1rem' );

		$this->assertSame( 'dimension', $result['$type'] );
		$this->assertSame( '1rem', $result['$value'] );
	}

	/**
	 * A spacing dimension like "clamp(...)" is passed through unchanged.
	 *
	 * @return void
	 */
	public function testDimensionPassesClampThrough(): void {
		$result = $this->translator->translate( 'spacing', 'clamp(1rem, 2vw, 2rem)' );

		$this->assertSame( 'dimension', $result['$type'] );
		$this->assertSame( 'clamp(1rem, 2vw, 2rem)', $result['$value'] );
	}

	/**
	 * An empty spacing dimension throws.
	 *
	 * @return void
	 */
	public function testDimensionThrowsOnEmpty(): void {
		$this->expectException( Untranslatable_Value_Exception::class );
		$this->expectExceptionMessage( 'Dimension value cannot be empty.' );

		$this->translator->translate( 'spacing', '' );
	}

	/**
	 * A single font family is wrapped in an array.
	 *
	 * @return void
	 */
	public function testFontFamilyWrapsSingleName(): void {
		$result = $this->translator->translate( 'font-family', 'Georgia' );

		$this->assertSame( 'fontFamily', $result['$type'] );
		$this->assertSame( [ 'Georgia' ], $result['$value'] );
	}

	/**
	 * A comma-separated font family stack is split and trimmed.
	 *
	 * @return void
	 */
	public function testFontFamilySplitsCommaStack(): void {
		$result = $this->translator->translate( 'font-family', 'Georgia, serif' );

		$this->assertSame( 'fontFamily', $result['$type'] );
		$this->assertSame( [ 'Georgia', 'serif' ], $result['$value'] );
	}

	/**
	 * Font family values with leading/trailing whitespace are trimmed.
	 *
	 * @return void
	 */
	public function testFontFamilyTrimsWhitespace(): void {
		$result = $this->translator->translate( 'font-family', '  Georgia  ,  serif  ' );

		$this->assertSame( [ 'Georgia', 'serif' ], $result['$value'] );
	}

	/**
	 * A quoted family name (e.g. from `-apple-system, "Segoe UI", Roboto`) has its surrounding
	 * quotes stripped, so Css_Renderer::font_family() re-wrapping it in quotes on render doesn't
	 * double them up into `""Segoe UI""`.
	 *
	 * @return void
	 */
	public function testFontFamilyStripsSurroundingQuotes(): void {
		$result = $this->translator->translate( 'font-family', '-apple-system, "Segoe UI", Roboto' );

		$this->assertSame( [ '-apple-system', 'Segoe UI', 'Roboto' ], $result['$value'] );
	}

	/**
	 * A single-quoted family name has its surrounding quotes stripped too.
	 *
	 * @return void
	 */
	public function testFontFamilyStripsSingleQuotes(): void {
		$result = $this->translator->translate( 'font-family', "'Segoe UI', Roboto" );

		$this->assertSame( [ 'Segoe UI', 'Roboto' ], $result['$value'] );
	}

	/**
	 * An empty font family value throws.
	 *
	 * @return void
	 */
	public function testFontFamilyThrowsOnEmpty(): void {
		$this->expectException( Untranslatable_Value_Exception::class );
		$this->expectExceptionMessage( 'Font family value cannot be empty.' );

		$this->translator->translate( 'font-family', '' );
	}

	/**
	 * A font family that is only commas throws.
	 *
	 * @return void
	 */
	public function testFontFamilyThrowsOnAllCommas(): void {
		$this->expectException( Untranslatable_Value_Exception::class );
		$this->expectExceptionMessage( 'Font family value cannot be empty.' );

		$this->translator->translate( 'font-family', ',,,' );
	}

	/**
	 * Translating a shadow category throws (out of scope).
	 *
	 * @return void
	 */
	public function testTranslateShadowThrows(): void {
		$this->expectException( Untranslatable_Value_Exception::class );
		$this->expectExceptionMessage( 'No Value_Translator for wp_preset category "shadow".' );

		$this->translator->translate( 'shadow', '0 0 4px rgba(0, 0, 0, 0.25)' );
	}

	/**
	 * Translating an unknown category throws.
	 *
	 * @return void
	 */
	public function testTranslateUnknownCategoryThrows(): void {
		$this->expectException( Untranslatable_Value_Exception::class );
		$this->expectExceptionMessage( 'No Value_Translator for wp_preset category "unknown-category".' );

		$this->translator->translate( 'unknown-category', 'some-value' );
	}
}
