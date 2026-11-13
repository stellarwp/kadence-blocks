<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Posts;

use Generator;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Posts_Css;
use Kadence_Blocks_Posts_Environment;
use Kadence_Blocks_Posts_Old_Theme_Condition;
use Kadence_Blocks_Posts_Site_Environment;
use Kadence_Blocks_Posts_Theme_Condition;
use Kadence_Blocks_Posts_Title_Font_Size_Css;
use Kadence_Blocks_Posts_Title_Letter_Spacing_Css;
use Kadence_Blocks_Posts_Title_Line_Height_Css;
use Kadence_Blocks_Posts_Title_Metric;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Block_Context;
use Tests\wpunit\CssBuilders\Free_Section_Test_Case;

/**
 * The sections, conditions and the environment of the posts CSS, one by one.
 */
final class PostsSectionsTest extends Free_Section_Test_Case {

	private const TITLE = '.kb-posts-id-abc .entry.loop-entry .entry-header .entry-title';

	protected function setUp(): void {
		parent::setUp();

		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-posts-css.php';
	}

	/**
	 * A title section writes the CSS expected for the font it is scoped to.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The title font.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testTitleSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_section( $section, $attributes, 'abc', self::TITLE ) );
	}

	/**
	 * The metric is the value of a device, and null for a missing, empty or non-array list.
	 *
	 * @dataProvider metricProvider
	 *
	 * @param array<string, mixed> $attributes The title font.
	 * @param int                  $index      The position of the device.
	 * @param mixed                $expected   The value expected.
	 *
	 * @return void
	 */
	public function testMetric( array $attributes, int $index, $expected ): void {
		$input = $this->input( $attributes, new Kadence_Blocks_CSS() );

		$this->assertSame( $expected, Kadence_Blocks_Posts_Title_Metric::read( $input, 'size', $index ) );
	}

	/**
	 * The theme conditions follow the theme and its version.
	 *
	 * @dataProvider themeProvider
	 *
	 * @param bool  $theme    Whether the Kadence theme is active.
	 * @param mixed $version  The version of the theme.
	 * @param bool  $any      Whether the theme condition is met.
	 * @param bool  $old      Whether the old theme condition is met.
	 *
	 * @return void
	 */
	public function testThemeConditions( bool $theme, $version, bool $any, bool $old ): void {
		$environment = $this->environment( $theme, $version );
		$input       = $this->input( [], new Kadence_Blocks_CSS() );

		$this->assertSame( $any, ( new Kadence_Blocks_Posts_Theme_Condition( $environment ) )->is_met( $input ) );
		$this->assertSame( $old, ( new Kadence_Blocks_Posts_Old_Theme_Condition( $environment ) )->is_met( $input ) );
	}

	/**
	 * The site environment tells what the site really offers.
	 *
	 * @return void
	 */
	public function testSiteEnvironment(): void {
		$environment = new Kadence_Blocks_Posts_Site_Environment();

		$this->assertSame( class_exists( 'Kadence\Theme' ), $environment->has_kadence_theme() );
		$this->assertSame( defined( 'KADENCE_VERSION' ) ? KADENCE_VERSION : null, $environment->kadence_version() );
	}

	/**
	 * The whole block writes the title per device, the grid, and nothing for a loop that is not unboxed without the theme.
	 *
	 * @return void
	 */
	public function testBuildWritesTheTitleAndTheGrid(): void {
		$context = new Kadence_Blocks_Css_Block_Context(
			'posts',
			static function () {
				return null;
			} 
		);
		$font    = [
			'size'          => [ 20, 18, 16 ],
			'lineHeight'    => [ 2, 3, 4 ],
			'letterSpacing' => [ 1, 2, 3 ],
			'textTransform' => 'uppercase',
		];
		$css     = ( new Kadence_Blocks_Posts_Css( $context ) )->build( [ 'titleFont' => [ $font ] ], new Kadence_Blocks_CSS(), 'abc', 'posts-build-test' );

		$this->assertSameCss(
			self::TITLE . '{font-size:20px;line-height:2px;letter-spacing:1px;text-transform:uppercase;}'
			. '@media all and (max-width: 1024px){' . self::TITLE . '{font-size:18px;line-height:3px;letter-spacing:2px;}}'
			. '@media all and (max-width: 767px){' . self::TITLE . '{font-size:16px;line-height:4px;letter-spacing:3px;}}'
			. '.kb-posts-id-abc .kb-post-list-item{display:grid;}',
			(string) $css
		);
	}

	/**
	 * An unboxed loop and an old Kadence theme write their rules; others write none.
	 *
	 * @dataProvider loopProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $theme      Whether the Kadence theme is active.
	 * @param mixed                $version    The version of the theme.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testLoopStyle( array $attributes, bool $theme, $version, string $expected ): void {
		$this->assertSameCss( $expected, $this->build_loop( $attributes, $this->environment( $theme, $version ) ) );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-posts-css.php';

		$font = [
			'size'          => [ 20, 18, 16 ],
			'lineHeight'    => [ 2, 3, 4 ],
			'letterSpacing' => [ 1, 2, 3 ],
			'sizeType'      => 'em',
			'lineType'      => 'rem',
			'letterType'    => '%',
		];

		yield 'desktop size with the unit' => [
			'section'    => new Kadence_Blocks_Posts_Title_Font_Size_Css( 0 ),
			'attributes' => $font,
			'expected'   => self::TITLE . '{font-size:20em;}',
		];
		yield 'tablet size without a unit' => [
			'section'    => new Kadence_Blocks_Posts_Title_Font_Size_Css( 1 ),
			'attributes' => [ 'size' => [ 20, 18 ] ],
			'expected'   => self::TITLE . '{font-size:18px;}',
		];
		yield 'mobile line height with the unit' => [
			'section'    => new Kadence_Blocks_Posts_Title_Line_Height_Css( 2 ),
			'attributes' => $font,
			'expected'   => self::TITLE . '{line-height:4rem;}',
		];
		yield 'line height without a unit' => [
			'section'    => new Kadence_Blocks_Posts_Title_Line_Height_Css( 0 ),
			'attributes' => [ 'lineHeight' => [ 2 ] ],
			'expected'   => self::TITLE . '{line-height:2px;}',
		];
		yield 'tablet letter spacing with the unit' => [
			'section'    => new Kadence_Blocks_Posts_Title_Letter_Spacing_Css( 1 ),
			'attributes' => $font,
			'expected'   => self::TITLE . '{letter-spacing:2%;}',
		];
		yield 'letter spacing without a unit' => [
			'section'    => new Kadence_Blocks_Posts_Title_Letter_Spacing_Css( 0 ),
			'attributes' => [ 'letterSpacing' => [ 3 ] ],
			'expected'   => self::TITLE . '{letter-spacing:3px;}',
		];
		yield 'an empty value writes nothing' => [
			'section'    => new Kadence_Blocks_Posts_Title_Font_Size_Css( 0 ),
			'attributes' => [ 'size' => [ 0 ] ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function metricProvider(): Generator {
		yield 'a value' => [
			'attributes' => [ 'size' => [ 1, 2 ] ],
			'index'      => 1,
			'expected'   => 2,
		];
		yield 'an empty value' => [
			'attributes' => [ 'size' => [ 1, '' ] ],
			'index'      => 1,
			'expected'   => null,
		];
		yield 'a missing value' => [
			'attributes' => [ 'size' => [ 1 ] ],
			'index'      => 2,
			'expected'   => null,
		];
		yield 'not a list' => [
			'attributes' => [ 'size' => '20' ],
			'index'      => 0,
			'expected'   => null,
		];
		yield 'no attribute' => [
			'attributes' => [],
			'index'      => 0,
			'expected'   => null,
		];
	}

	/**
	 * @return Generator
	 */
	public function themeProvider(): Generator {
		yield 'no theme' => [
			'theme'   => false,
			'version' => '1.0.0',
			'any'     => false,
			'old'     => false,
		];
		yield 'theme without a version' => [
			'theme'   => true,
			'version' => null,
			'any'     => true,
			'old'     => false,
		];
		yield 'an old theme' => [
			'theme'   => true,
			'version' => '1.0.15',
			'any'     => true,
			'old'     => true,
		];
		yield 'a theme that styles the padding' => [
			'theme'   => true,
			'version' => '1.0.16',
			'any'     => true,
			'old'     => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function loopProvider(): Generator {
		$unboxed = '.kb-posts-id-abc .loop-entry{background:transparent;box-shadow:none;}'
			. '.kb-posts-id-abc .loop-entry > .entry-content-wrap{padding:0px;}'
			. '.kb-posts-id-abc .loop-entry .post-thumbnail{margin-bottom:1em;}';
		$padding = '.wp-block-kadence-posts.kb-posts-id-abc .entry.loop-entry > .entry-content-wrap{padding:2rem;}';

		yield 'unboxed with the theme' => [
			'attributes' => [ 'loopStyle' => 'unboxed' ],
			'theme'      => true,
			'version'    => '1.0.15',
			'expected'   => $unboxed,
		];
		yield 'unboxed without the theme' => [
			'attributes' => [ 'loopStyle' => 'unboxed' ],
			'theme'      => false,
			'version'    => null,
			'expected'   => '',
		];
		yield 'boxed with an old theme' => [
			'attributes' => [ 'loopStyle' => 'boxed' ],
			'theme'      => true,
			'version'    => '1.0.15',
			'expected'   => $padding,
		];
		yield 'boxed with a new theme' => [
			'attributes' => [],
			'theme'      => true,
			'version'    => '1.2.0',
			'expected'   => '',
		];
	}

	/**
	 * Build the posts CSS with a fake site, by running the loop section of the builder.
	 *
	 * @param array<string, mixed>             $attributes  The block attributes.
	 * @param Kadence_Blocks_Posts_Environment $environment The site.
	 *
	 * @return string
	 */
	private function build_loop( array $attributes, Kadence_Blocks_Posts_Environment $environment ): string {
		$builder = new Kadence_Blocks_Posts_Css(
			new Kadence_Blocks_Css_Block_Context(
				'posts',
				static function () {
					return null;
				} 
			)
		);
		$method  = new \ReflectionMethod( $builder, 'loop_style_section' );
		$method->setAccessible( true );

		return $this->write_section( $method->invoke( $builder, $environment ), $attributes );
	}

	/**
	 * A fake site.
	 *
	 * @param bool  $theme   Whether the Kadence theme is active.
	 * @param mixed $version The version of the theme.
	 *
	 * @return Kadence_Blocks_Posts_Environment
	 */
	private function environment( bool $theme, $version ): Kadence_Blocks_Posts_Environment {
		return new class( $theme, $version ) implements Kadence_Blocks_Posts_Environment {

			private $theme;

			private $version;

			public function __construct( bool $theme, $version ) {
				$this->theme   = $theme;
				$this->version = $version;
			}

			public function has_kadence_theme(): bool {
				return $this->theme;
			}

			public function kadence_version() {
				return $this->version;
			}
		};
	}
}
