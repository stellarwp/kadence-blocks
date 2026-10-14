<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Style_Guide;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Mapper;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Overlay;
use Tests\Support\Classes\Fake_Style_Guide_Source;
use Tests\Support\Classes\TestCase;

final class Style_Guide_OverlayTest extends TestCase {

	/**
	 * Without the Kadence theme there is nothing to overlay, and the signature stays blank so a cache
	 * key that folds it in is byte-identical to what it was before this layer existed.
	 *
	 * @return void
	 */
	public function testValuesAreEmptyAndSignatureIsBlankWithoutATheme(): void {
		$overlay = $this->overlay( new Fake_Style_Guide_Source( null ) );

		$this->assertSame( [], $overlay->values() );
		$this->assertSame( '', $overlay->signature() );
	}

	/**
	 * The overlay keys its values by the token ids the registry maps the theme's slots to.
	 *
	 * @return void
	 */
	public function testValuesFollowTheSlotTokensFromTheRegistry(): void {
		$overlay = $this->overlay( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );

		$this->assertSame( '#111111', $overlay->values()['primitive.color.brand.primary'] );
	}

	/**
	 * The overlay reads whichever palette set the theme has active, not always the first.
	 *
	 * @return void
	 */
	public function testValuesFollowTheThemesActivePaletteSet(): void {
		$overlay = $this->overlay(
			Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#222222' ], 'second-palette' )
		);

		$this->assertSame( '#222222', $overlay->values()['primitive.color.brand.primary'] );
	}

	/**
	 * A changed color changes the signature; the same colors give the same signature whatever order
	 * they were stored in. That is what makes the signature usable in a cache key.
	 *
	 * @return void
	 */
	public function testSignatureChangesWhenAColorChanges(): void {
		$first  = $this->overlay( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );
		$second = $this->overlay( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#999999' ] ) );

		$this->assertNotSame( $first->signature(), $second->signature() );

		$same = $this->overlay( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] ) );

		$this->assertSame( $first->signature(), $same->signature() );
	}

	/**
	 * Two overlays holding the same colors in a different stored order share a signature, so a
	 * reordered palette option does not needlessly bust every cache.
	 *
	 * @return void
	 */
	public function testSignatureIgnoresTheStoredOrder(): void {
		$forward = $this->overlay(
			Fake_Style_Guide_Source::with_palette(
				[
					'palette1' => '#111111',
					'palette3' => '#333333',
				]
			)
		);
		$reverse = $this->overlay(
			Fake_Style_Guide_Source::with_palette(
				[
					'palette3' => '#333333',
					'palette1' => '#111111',
				]
			)
		);

		$this->assertSame( $forward->signature(), $reverse->signature() );
	}

	/**
	 * Values are computed once per request, so the baseline decorator and the cache-version service
	 * cannot disagree within a single request.
	 *
	 * @return void
	 */
	public function testValuesAreMemoizedPerRequest(): void {
		$source  = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] );
		$overlay = $this->overlay( $source );

		$this->assertSame( '#111111', $overlay->values()['primitive.color.brand.primary'] );

		$source->set( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#999999' ] )->snapshot() );

		$this->assertSame( '#111111', $overlay->values()['primitive.color.brand.primary'] );
	}

	/**
	 * Flushing the memo lets a caller that changed the Style Guide see the new values in the same
	 * request.
	 *
	 * @return void
	 */
	public function testFlushDropsTheMemo(): void {
		$source  = Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#111111' ] );
		$overlay = $this->overlay( $source );

		$overlay->values();
		$source->set( Fake_Style_Guide_Source::with_palette( [ 'palette1' => '#999999' ] )->snapshot() );
		$overlay->flush();

		$this->assertSame( '#999999', $overlay->values()['primitive.color.brand.primary'] );
	}

	/**
	 * An overlay over the given source, with the real mapper and the real registry.
	 *
	 * @param Fake_Style_Guide_Source $source The source to read from.
	 *
	 * @return Style_Guide_Overlay
	 */
	private function overlay( Fake_Style_Guide_Source $source ): Style_Guide_Overlay {
		return new Style_Guide_Overlay(
			$source,
			new Style_Guide_Mapper(),
			$this->container->get( Token_Registry::class )
		);
	}
}
