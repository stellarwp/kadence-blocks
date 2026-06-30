<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Native\Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Button;
use Tests\Support\Classes\TestCase;

/**
 * Covers the native button companion stylesheet: it makes core/button consume the Kadence button slots for
 * Fill and Outline — resting and on :hover/:focus — guarded so an editor-set color still wins, and scoped
 * to variant-selected buttons unless the design system owns the default.
 */
final class ButtonTest extends TestCase {

	private Button $styles;

	protected function setUp(): void {
		parent::setUp();

		$this->styles = $this->container->get( Button::class );
	}

	/**
	 * @return void
	 */
	public function testItConsumesTheButtonSlotsForTheFillShape(): void {
		$css = $this->styles->css( false );

		$this->assertStringContainsString(
			'.wp-block-button[class*="kb-variant--"]:not(.is-style-outline) > .wp-block-button__link:not(.has-background){background-color:var(--global-palette-btn-bg);}',
			$css
		);
		$this->assertStringContainsString(
			'.wp-block-button[class*="kb-variant--"]:not(.is-style-outline) > .wp-block-button__link:not(.has-text-color){color:var(--global-palette-btn);}',
			$css
		);
	}

	/**
	 * @return void
	 */
	public function testItRecolorsTheHoverAndFocusStates(): void {
		$css = $this->styles->css( false );

		$this->assertStringContainsString( ':not(.has-background):focus{background-color:var(--global-palette-btn-bg-hover);}', $css );
		$this->assertStringContainsString( ':not(.has-text-color):hover,', $css );
	}

	/**
	 * @return void
	 */
	public function testItTurnsTheBackgroundIntoTheBorderAndTextForTheOutlineShape(): void {
		$css = $this->styles->css( false );

		$this->assertStringContainsString(
			'.wp-block-button[class*="kb-variant--"].is-style-outline > .wp-block-button__link:not(.has-text-color){color:var(--global-palette-btn-bg);}',
			$css
		);
		$this->assertStringContainsString(
			'.wp-block-button[class*="kb-variant--"].is-style-outline > .wp-block-button__link:not(.has-border-color){border-color:var(--global-palette-btn-bg);}',
			$css
		);
	}

	/**
	 * @return void
	 */
	public function testEveryDeclarationIsGuardedSoAnEditorColorWins(): void {
		// Each rule carries a :not(.has-*) guard, so a color set on a specific button suppresses the default.
		$css = $this->styles->css( false );

		$this->assertStringNotContainsString( '__link{', $css );
		$this->assertStringNotContainsString( '__link:hover', $css );
	}

	/**
	 * @return void
	 */
	public function testItOwnsEveryButtonDefaultWhenThePaletteIsOverridden(): void {
		// When the theme palette is replaced, the rules target every core/button, not only variant ones,
		// so an untouched button gets the (Primary) $default look the Variant\Css_Builder seeds.
		$css = $this->styles->css( true );

		$this->assertStringContainsString(
			'.wp-block-button:not(.is-style-outline) > .wp-block-button__link:not(.has-background){background-color:var(--global-palette-btn-bg);}',
			$css
		);
		$this->assertStringNotContainsString( 'kb-variant--', $css );
	}
}
