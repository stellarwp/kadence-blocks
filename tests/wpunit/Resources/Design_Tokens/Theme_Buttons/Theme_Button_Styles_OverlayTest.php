<?php declare( strict_types=1 );
// cspell:ignore twentytwentythree .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Buttons;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Discovery;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Buttons\Theme_Button_Styles_Overlay;
use Tests\Support\Classes\Fake_Button_Style_Source;
use Tests\Support\Classes\TestCase;

/**
 * Covers the per-request memo over discovery and the signature the cache version folds in.
 */
final class Theme_Button_Styles_OverlayTest extends TestCase {

	/**
	 * A theme-base style with today's classes and no values.
	 *
	 * @var array<string, array{label: string, class: string, values: array<string, mixed>}>
	 */
	private const BASE = [
		'base' => [
			'label'  => 'Theme Base',
			'class'  => 'wp-block-button__link button kb-btn-global-inherit',
			'values' => [],
		],
	];

	/**
	 * When the theme offers nothing there is nothing to overlay, and the signature stays blank so a cache
	 * key that folds it in is unchanged.
	 *
	 * @return void
	 */
	public function testStylesAreEmptyAndSignatureIsBlankWithoutStyles(): void {
		$overlay = $this->overlay( new Fake_Button_Style_Source() );

		$this->assertSame( [], $overlay->styles() );
		$this->assertSame( '', $overlay->signature() );
	}

	/**
	 * The overlay hands back discovery's prefixed list.
	 *
	 * @return void
	 */
	public function testStylesAreTheDiscoveredOnes(): void {
		$overlay = $this->overlay( new Fake_Button_Style_Source( self::BASE ) );

		$this->assertSame( [ 'theme-base' ], array_keys( $overlay->styles() ) );
	}

	/**
	 * A changed style changes the signature; the same styles give the same signature whatever order they
	 * were discovered in.
	 *
	 * @return void
	 */
	public function testSignatureFollowsTheStylesAndIgnoresTheirOrder(): void {
		$secondary = [
			'secondary' => [
				'label'  => 'Theme Secondary',
				'class'  => 'wp-block-button__link button button-style-secondary kb-btn-global-inherit',
				'values' => [],
			],
		];

		$base    = $this->overlay( new Fake_Button_Style_Source( self::BASE ) );
		$both    = $this->overlay( new Fake_Button_Style_Source( self::BASE + $secondary ) );
		$reverse = $this->overlay( new Fake_Button_Style_Source( $secondary + self::BASE ) );

		$this->assertNotSame( $base->signature(), $both->signature() );
		$this->assertSame( $both->signature(), $reverse->signature() );
	}

	/**
	 * A changed display value changes the signature, so a Customizer save that changes only a value still
	 * invalidates the caches.
	 *
	 * @return void
	 */
	public function testSignatureChangesWhenADisplayValueChanges(): void {
		$changed                   = self::BASE;
		$changed['base']['values'] = [ 'button-bg' => '#ff0000' ];
		$overlay                   = $this->overlay( new Fake_Button_Style_Source( self::BASE ) );
		$overlay_with_value        = $this->overlay( new Fake_Button_Style_Source( $changed ) );

		$this->assertNotSame( $overlay->signature(), $overlay_with_value->signature() );
	}

	/**
	 * Styles are discovered once per request, so the baseline decorator and the cache-version service
	 * cannot disagree within a single request; flushing the memo lets a change be seen in the same request.
	 *
	 * @return void
	 */
	public function testStylesAreMemoizedUntilFlushed(): void {
		$source  = new Fake_Button_Style_Source( self::BASE );
		$overlay = $this->overlay( $source );

		$this->assertSame( [ 'theme-base' ], array_keys( $overlay->styles() ) );

		$source->set( [] );

		$this->assertSame( [ 'theme-base' ], array_keys( $overlay->styles() ) );

		$overlay->flush();

		$this->assertSame( [], $overlay->styles() );
	}

	/**
	 * The container wires the overlay over the real discovery. The suite runs twentytwentythree, a block
	 * theme whose theme.json styles the button element and defines no variation of its own, so the block
	 * theme adapter's Theme Base is what it offers, with that theme's values.
	 *
	 * @return void
	 */
	public function testTheContainerBindsItOverTheRealDiscovery(): void {
		/** @var Theme_Button_Styles_Overlay $overlay */
		$overlay = $this->container->get( Theme_Button_Styles_Overlay::class );

		$this->assertSame( $overlay, $this->container->get( Theme_Button_Styles_Overlay::class ) );
		$this->assertSame( [ 'theme-base' ], array_keys( $overlay->styles() ) );
		$this->assertSame( 'Theme Base', $overlay->styles()['theme-base']['label'] );
		$this->assertSame( 'var(--wp--preset--color--primary)', $overlay->styles()['theme-base']['values']['button-bg'] );
	}

	/**
	 * An overlay over a discovery reading only the given source.
	 *
	 * @param Fake_Button_Style_Source $source The source.
	 *
	 * @return Theme_Button_Styles_Overlay
	 */
	private function overlay( Fake_Button_Style_Source $source ): Theme_Button_Styles_Overlay {
		return new Theme_Button_Styles_Overlay( new Discovery( $source ) );
	}
}
