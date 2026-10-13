<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Theme_Style_Guide;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;
use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Style_Guide_Reader;
use Tests\Support\Classes\TestCase;

final class Style_Guide_ReaderTest extends TestCase {

	/**
	 * The test suite runs a non-Kadence theme, so the reader reports "nothing to read" and every other
	 * theme keeps resolving tokens exactly as it did before this layer existed.
	 *
	 * @return void
	 */
	public function testSnapshotIsNullWhenTheKadenceThemeIsNotActive(): void {
		$this->assertNull( ( new Style_Guide_Reader() )->snapshot() );
	}

	/**
	 * The palette option key is exposed for callers that invalidate on its change.
	 *
	 * @return void
	 */
	public function testPaletteOptionKeyIsTheThemesOption(): void {
		$this->assertSame( 'kadence_global_palette', Style_Guide_Reader::get_palette_option_key() );
	}

	/**
	 * A stored palette option alone does not make the reader believe the theme is active: the class
	 * check gates it, so a leftover option on a non-Kadence site changes nothing.
	 *
	 * @return void
	 */
	public function testAStoredPaletteOptionAloneDoesNotProduceASnapshot(): void {
		update_option(
			Style_Guide_Reader::get_palette_option_key(),
			(string) wp_json_encode(
				[
					'palette' => [
						[
							'color' => '#111111',
							'name'  => 'P1',
							'slug'  => 'palette1',
						],
					],
				]
			)
		);

		$this->assertNull( ( new Style_Guide_Reader() )->snapshot() );

		delete_option( Style_Guide_Reader::get_palette_option_key() );
	}

	/**
	 * The overlay's memo is dropped when the Customizer preview starts.
	 *
	 * The Kadence_Option boot pass reads the overlay on init:20, and WordPress installs the
	 * Customizer's pre_option_* preview filters later on wp_loaded. Without this hook the overlay is
	 * pinned to the saved palette before the previewed value exists, and the preview shows no change.
	 *
	 * @return void
	 */
	public function testTheOverlayIsFlushedWhenTheCustomizerPreviewStarts(): void {
		// has_action() alone would pass on WordPress's own callback, which runs at the default priority.
		// The flush is registered at 0 precisely so it lands before anything renders, so assert that.
		$this->assertArrayHasKey( 0, $GLOBALS['wp_filter']['customize_preview_init']->callbacks );
		$this->assertNotEmpty( $GLOBALS['wp_filter']['customize_preview_init']->callbacks[0] );
	}

	/**
	 * The overlay's memo is dropped when the theme's palette option is saved in this request.
	 *
	 * @return void
	 */
	public function testTheOverlayIsFlushedWhenThePaletteOptionIsWritten(): void {
		$key = Style_Guide_Reader::get_palette_option_key();

		foreach ( [ 'add_option_', 'update_option_', 'delete_option_' ] as $prefix ) {
			$this->assertNotFalse( has_action( $prefix . $key ), $prefix . ' is not hooked' );
		}
	}

	/**
	 * The container resolves the source contract to the Kadence reader.
	 *
	 * @return void
	 */
	public function testTheContainerBindsTheReaderAsTheSource(): void {
		$this->assertInstanceOf( Style_Guide_Reader::class, $this->container->get( Style_Guide_Source::class ) );
	}
}
