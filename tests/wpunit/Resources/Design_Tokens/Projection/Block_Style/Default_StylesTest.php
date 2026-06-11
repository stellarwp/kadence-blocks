<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style\Default_Styles;
use Tests\Support\Classes\TestCase;

/**
 * Covers the native $default theme.json payload: it points each native block's style properties at their
 * token-backed presets, so an unstyled block renders on-brand.
 */
final class Default_StylesTest extends TestCase {

	private Default_Styles $styles;

	protected function setUp(): void {
		parent::setUp();

		$this->styles = $this->container->get( Default_Styles::class );
	}

	public function testItPointsNativeBlockDefaultsAtTokenPresets(): void {
		$payload = $this->styles->payload();

		$this->assertSame( 2, $payload['version'] );

		$button = $payload['styles']['blocks']['core/button'];
		$this->assertSame( 'var(--wp--preset--color--button-bg)', $button['color']['background'] );
		$this->assertSame( 'var(--wp--preset--color--button-text)', $button['color']['text'] );
	}

	public function testItExcludesKadenceBlocks(): void {
		$payload = $this->styles->payload();

		$this->assertArrayNotHasKey( 'kadence/advancedbtn', $payload['styles']['blocks'] );
	}

	public function testHasStylesReportsNativeContribution(): void {
		$this->assertTrue( $this->styles->has_styles() );
	}
}
