<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Preset;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Preset\Style;
use Tests\Support\Classes\TestCase;

/**
 * Guards the preset class shape the editor adds and the projector targets, so the "kb-preset--<preset>"
 * class can never drift from the selector the CSS hooks.
 */
final class StyleTest extends TestCase {

	/**
	 * A preset keeps the "kb-preset--<preset>" shape.
	 *
	 * @return void
	 */
	public function testPresetClass(): void {
		$this->assertSame( 'kb-preset--secondary', Style::preset_class( 'secondary' ) );
	}

	/**
	 * The preset slug is sanitized, so a stray character cannot break the class shape.
	 *
	 * @dataProvider unsafeSegmentProvider
	 *
	 * @param string $preset  The raw preset slug.
	 * @param string $expected The sanitized class.
	 *
	 * @return void
	 */
	public function testItSanitizesThePresetSlug( string $preset, string $expected ): void {
		$this->assertSame( $expected, Style::preset_class( $preset ) );
	}

	/**
	 * A slug is a theme preset only when it carries the reserved prefix followed by a name.
	 *
	 * @dataProvider themeSlugProvider
	 *
	 * @param string $slug     The preset slug.
	 * @param bool   $expected Whether the slug names a theme preset.
	 *
	 * @return void
	 */
	public function testIsThemeSlug( string $slug, bool $expected ): void {
		$this->assertSame( $expected, Style::is_theme_slug( $slug ) );
	}

	/**
	 * @return Generator
	 */
	public function themeSlugProvider(): Generator {
		yield 'theme preset' => [
			'slug'     => 'theme-base',
			'expected' => true,
		];
		yield 'prefix inside a word' => [
			'slug'     => 'themed',
			'expected' => false,
		];
		yield 'bare prefix' => [
			'slug'     => 'theme-',
			'expected' => false,
		];
	}

	/**
	 * The reserved theme prefix is exposed for the REST guard.
	 *
	 * @return void
	 */
	public function testThemePrefix(): void {
		$this->assertSame( 'theme-', Style::get_theme_prefix() );
	}

	/**
	 * @return Generator
	 */
	public function unsafeSegmentProvider(): Generator {
		yield 'space in preset' => [
			'preset'   => 'sea green',
			'expected' => 'kb-preset--sea-green',
		];
		yield 'slash in preset' => [
			'preset'   => 'a/b',
			'expected' => 'kb-preset--a-b',
		];
	}
}
