<?php declare( strict_types=1 );
// cspell:ignore unseed .

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Preset_Fallback;
use Tests\Support\Classes\Seeds_Theme_Presets;
use Tests\Support\Classes\TestCase;

/**
 * Covers the fallback chain a block's stored preset renders through when the library no longer
 * defines it.
 */
final class Preset_FallbackTest extends TestCase {

	use Seeds_Theme_Presets;

	private const BUTTON = 'kadence/singlebtn';

	/**
	 * @var Preset_Fallback
	 */
	private Preset_Fallback $fallback;

	/**
	 * Resolves the fallback under test from the container.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->fallback = $this->container->get( Preset_Fallback::class );
	}

	/**
	 * Drops the seeded theme presets so the next test starts from the real theme.
	 *
	 * @return void
	 */
	protected function tearDown(): void {
		$this->unseed_theme_presets();

		parent::tearDown();
	}

	/**
	 * The chain renders the stored slug, then theme-base for a theme slug, then the default, and names
	 * why the stored slug did not render.
	 *
	 * @dataProvider chainProvider
	 *
	 * @param string[] $seeded   The unprefixed theme slugs the active theme offers.
	 * @param string   $stored   The block's kbPreset.
	 * @param string   $expected The slug rendered.
	 * @param string   $reason   The fallback reason.
	 *
	 * @return void
	 */
	public function testResolvesThroughTheChain( array $seeded, string $stored, string $expected, string $reason ): void {
		$this->seed_theme_preset_slugs( $seeded );

		$this->assertSame( $expected, $this->fallback->resolve( self::BUTTON, $stored ) );
		$this->assertSame( $reason, $this->fallback->reason( self::BUTTON, $stored ) );
	}

	/**
	 * @return Generator
	 */
	public function chainProvider(): Generator {
		yield 'stored slug exists' => [
			'seeded'   => [ 'base', 'secondary' ],
			'stored'   => 'theme-secondary',
			'expected' => 'theme-secondary',
			'reason'   => '',
		];
		yield 'theme slug missing falls to theme-base' => [
			'seeded'   => [ 'base' ],
			'stored'   => 'theme-secondary',
			'expected' => 'theme-base',
			'reason'   => 'theme',
		];
		yield 'theme slug missing and no theme-base falls to default' => [
			'seeded'   => [],
			'stored'   => 'theme-secondary',
			'expected' => 'default',
			'reason'   => 'theme',
		];
		yield 'unknown slug falls to default' => [
			'seeded'   => [ 'base' ],
			'stored'   => 'gone',
			'expected' => 'default',
			'reason'   => 'missing',
		];
		yield 'a shipped slug renders as stored' => [
			'seeded'   => [ 'base' ],
			'stored'   => 'outline',
			'expected' => 'outline',
			'reason'   => '',
		];
		yield 'empty renders the default with no reason' => [
			'seeded'   => [ 'base' ],
			'stored'   => '',
			'expected' => 'default',
			'reason'   => '',
		];
	}

	/**
	 * The theme base slug the chain falls back to carries the reserved theme prefix.
	 *
	 * @return void
	 */
	public function testTheThemeBaseSlugCarriesTheThemePrefix(): void {
		$this->assertSame( 'theme-base', Preset_Fallback::get_theme_base() );
		$this->assertSame( 'theme', Preset_Fallback::get_reason_theme() );
		$this->assertSame( 'missing', Preset_Fallback::get_reason_missing() );
	}
}
