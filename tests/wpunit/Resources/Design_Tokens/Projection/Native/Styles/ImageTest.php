<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Native\Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Image;
use Tests\Support\Classes\TestCase;

/**
 * Covers the native image companion stylesheet: it points core/image's `<img>` at the same media tokens
 * kadence/image uses (radius, border color + width, shadow), always (these are not theme-palette colors, so
 * they are not behind the palette gate), and as ordinary single-class rules the block's own settings still
 * override.
 */
final class ImageTest extends TestCase {

	/**
	 * @var Image
	 */
	private Image $styles;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->styles = $this->container->get( Image::class );
	}

	/**
	 * The image consumes the media radius, border width, and box-shadow tokens on `.wp-block-image img` even
	 * without the palette override, since these are not theme-palette colors.
	 *
	 * @return void
	 */
	public function testItConsumesTheMediaRadiusBorderWidthAndShadowTokens(): void {
		$css = $this->styles->css( false );

		$this->assertStringContainsString(
			'.wp-block-image img{border-radius:var(--kb-token--semantic--radius--media);border-width:var(--kb-token--semantic--border-width--default);box-shadow:var(--kb-token--semantic--shadow--media);}',
			$css
		);
	}

	/**
	 * The border color follows the brand border token, guarded with `:not(.has-border-color)` so a preset
	 * border color set on the image still wins.
	 *
	 * @return void
	 */
	public function testItConsumesTheBorderColorTokenGuardedForAPresetColor(): void {
		$css = $this->styles->css( false );

		$this->assertStringContainsString(
			'.wp-block-image img:not(.has-border-color){border-color:var(--kb-token--semantic--color--border);}',
			$css
		);
	}

	/**
	 * Every border-color declaration carries the `:not(.has-border-color)` guard — there is no unguarded
	 * border-color rule that would beat a preset border color set on the image.
	 *
	 * @return void
	 */
	public function testTheBorderColorRuleIsAlwaysGuarded(): void {
		$css = $this->styles->css( false );

		$this->assertStringNotContainsString( 'img{border-color:', $css );
	}

	/**
	 * The image tokens are not gated on the palette override, so the companion emits the same CSS whether or
	 * not the design system owns native defaults — matching the button's always-on radius.
	 *
	 * @return void
	 */
	public function testItAppliesRegardlessOfTheOwnsDefaultFlag(): void {
		$this->assertSame( $this->styles->css( true ), $this->styles->css( false ) );
		$this->assertNotSame( '', $this->styles->css( false ) );
	}
}
