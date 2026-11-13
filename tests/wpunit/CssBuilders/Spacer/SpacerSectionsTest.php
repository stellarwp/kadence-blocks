<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Spacer;

use Generator;
use Kadence_Blocks_Spacer_Blur_Fix_Css;
use Kadence_Blocks_Spacer_Border_Width_Css;
use Kadence_Blocks_Spacer_Color_Css;
use Kadence_Blocks_Spacer_Device_Divider_Height_Css;
use Kadence_Blocks_Spacer_Device_Divider_Width_Css;
use Kadence_Blocks_Spacer_Device_Height_Css;
use Kadence_Blocks_Spacer_Divider_Width_Css;
use Kadence_Blocks_Spacer_Environment;
use Kadence_Blocks_Spacer_Height_Css;
use Kadence_Blocks_Spacer_Site_Environment;
use Kadence_Blocks_Spacer_Stripe_Height_Css;
use Kadence_Blocks_Spacer_Width_Units;
use Kadence_Blocks_Css_Section;

/**
 * The sections of the spacer CSS, one by one.
 */
final class SpacerSectionsTest extends Spacer_Test_Case {

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected ): void {
		$this->assertSameCss( $expected, $this->write_spacer( $section, $attributes ) );
	}

	/**
	 * The unit of the width of the divider is the one saved, or percent.
	 *
	 * @dataProvider widthUnitsProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The unit expected.
	 *
	 * @return void
	 */
	public function testWidthUnits( array $attributes, string $expected ): void {
		$this->assertSame( $expected, Kadence_Blocks_Spacer_Width_Units::resolve( $attributes ) );
	}

	/**
	 * The color of the divider gets the alpha the editor always wrote for its opacity.
	 *
	 * @dataProvider opacityProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The color expected.
	 *
	 * @return void
	 */
	public function testColorOpacity( array $attributes, string $expected ): void {
		$attributes['dividerColor'] = '#ff0000';

		$this->assertSameCss( '.s{border-top-color:' . $expected . ';}', $this->write_spacer( new Kadence_Blocks_Spacer_Color_Css(), $attributes ) );
	}

	/**
	 * The stripe falls back to the height of the spacer in the classic mode, and takes its own in the Full Site Editing mode.
	 *
	 * @dataProvider stripeHeightProvider
	 *
	 * @param bool   $fse_mode Whether the site runs in the Full Site Editing mode.
	 * @param string $expected The CSS expected.
	 *
	 * @return void
	 */
	public function testStripeHeightOnDevice( bool $fse_mode, string $expected ): void {
		$environment = new class( $fse_mode ) implements Kadence_Blocks_Spacer_Environment {
			/** @var bool */
			private $fse_mode;

			public function __construct( bool $fse_mode ) {
				$this->fse_mode = $fse_mode;
			}

			public function is_fse_mode(): bool {
				return $this->fse_mode;
			}
		};
		$section     = new Kadence_Blocks_Spacer_Device_Divider_Height_Css( 'tablet', 'height', $environment );

		$this->assertSame(
			$expected,
			$this->write_spacer(
				$section,
				[
					'tabletDividerHeight' => 5,
					'tabletSpacerHeight'  => 30,
				] 
			) 
		);
	}

	/**
	 * In the classic mode a stripe with no height of the spacer for its device reads a missing value, as the original did.
	 *
	 * @return void
	 */
	public function testStripeHeightReadsTheMissingHeightOfTheSpacer(): void {
		$warnings    = 0;
		$environment = new class() implements Kadence_Blocks_Spacer_Environment {
			public function is_fse_mode(): bool {
				return false;
			}
		};

		set_error_handler(
			static function () use ( &$warnings ) {
				++$warnings;

				return true;
			}
		);

		$css = $this->write_spacer( new Kadence_Blocks_Spacer_Device_Divider_Height_Css( 'mobile', 'height', $environment ), [ 'mobileDividerHeight' => 5 ] );

		restore_error_handler();

		$this->assertSame( 1, $warnings );
		$this->assertSame( '.s{height:px !important;}', $css );
	}

	/**
	 * The site environment asks the site whether it runs in the Full Site Editing mode.
	 *
	 * @return void
	 */
	public function testSiteEnvironment(): void {
		$environment = new Kadence_Blocks_Spacer_Site_Environment();

		$this->assertFalse( $environment->is_fse_mode() );

		add_filter( 'kadence_blocks_is_fse_mode', '__return_true' );

		$this->assertTrue( $environment->is_fse_mode() );

		remove_filter( 'kadence_blocks_is_fse_mode', '__return_true' );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/spacer/loader.php';

		yield from $this->heightProvider();
		yield from $this->dividerProvider();
	}

	/**
	 * @return Generator
	 */
	private function heightProvider(): Generator {
		yield 'the height saved' => [
			'section'    => new Kadence_Blocks_Spacer_Height_Css(),
			'attributes' => [ 'spacerHeight' => 40 ],
			'expected'   => '.s{height:40px;}',
		];
		yield 'the height saved in another unit' => [
			'section'    => new Kadence_Blocks_Spacer_Height_Css(),
			'attributes' => [
				'spacerHeight'      => 4,
				'spacerHeightUnits' => 'em',
			],
			'expected'   => '.s{height:4em;}',
		];
		yield 'the default height in another unit' => [
			'section'    => new Kadence_Blocks_Spacer_Height_Css(),
			'attributes' => [ 'spacerHeightUnits' => 'vh' ],
			'expected'   => '.s{height:60vh;}',
		];
		yield 'no unit saved' => [
			'section'    => new Kadence_Blocks_Spacer_Height_Css(),
			'attributes' => [
				'spacerHeight'      => 7,
				'spacerHeightUnits' => '',
			],
			'expected'   => '.s{height:7px;}',
		];
		yield 'no height in pixels' => [
			'section'    => new Kadence_Blocks_Spacer_Height_Css(),
			'attributes' => [ 'spacerHeight' => '' ],
			'expected'   => '',
		];
		yield 'the height of a device' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Height_Css( 'tabletSpacerHeight' ),
			'attributes' => [ 'tabletSpacerHeight' => 20 ],
			'expected'   => '.s{height:20px!important;}',
		];
		yield 'the height of a device in the unit of the spacer' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Height_Css( 'mobileSpacerHeight' ),
			'attributes' => [
				'mobileSpacerHeight' => 2,
				'spacerHeightUnits'  => 'em',
			],
			'expected'   => '.s{height:2em!important;}',
		];
		yield 'the height of a device with an empty unit' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Height_Css( 'mobileSpacerHeight' ),
			'attributes' => [
				'mobileSpacerHeight' => 2,
				'spacerHeightUnits'  => '',
			],
			'expected'   => '.s{height:2!important;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function dividerProvider(): Generator {
		yield 'the height of the stripe' => [
			'section'    => new Kadence_Blocks_Spacer_Stripe_Height_Css(),
			'attributes' => [ 'dividerHeight' => 12 ],
			'expected'   => '.s{height:12px;}',
		];
		yield 'the default height of the stripe' => [
			'section'    => new Kadence_Blocks_Spacer_Stripe_Height_Css(),
			'attributes' => [ 'dividerHeight' => 0 ],
			'expected'   => '.s{height:10px;}',
		];
		yield 'the width of the divider' => [
			'section'    => new Kadence_Blocks_Spacer_Divider_Width_Css(),
			'attributes' => [
				'dividerWidth'      => 50,
				'dividerWidthUnits' => 'px',
			],
			'expected'   => '.s{width:50px;}',
		];
		yield 'the default width of the divider' => [
			'section'    => new Kadence_Blocks_Spacer_Divider_Width_Css(),
			'attributes' => [],
			'expected'   => '.s{width:80%;}',
		];
		yield 'the width of the divider on a device' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Divider_Width_Css( 'tabletDividerWidth' ),
			'attributes' => [ 'tabletDividerWidth' => 40 ],
			'expected'   => '.s{width:40%!important;}',
		];
		yield 'no width of the divider on a device' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Divider_Width_Css( 'tabletDividerWidth' ),
			'attributes' => [ 'tabletDividerWidth' => 0 ],
			'expected'   => '',
		];
		yield 'the height of the line on a device' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Divider_Height_Css( 'tablet', 'border-top-width', null ),
			'attributes' => [
				'tabletDividerHeight' => 4,
				'tabletSpacerHeight'  => 9,
			],
			'expected'   => '.s{border-top-width:4px !important;}',
		];
		yield 'no height of the line on a device' => [
			'section'    => new Kadence_Blocks_Spacer_Device_Divider_Height_Css( 'tablet', 'border-top-width', null ),
			'attributes' => [ 'mobileDividerHeight' => 4 ],
			'expected'   => '',
		];
		yield 'the thickness of the line' => [
			'section'    => new Kadence_Blocks_Spacer_Border_Width_Css(),
			'attributes' => [ 'dividerHeight' => 4 ],
			'expected'   => '.s{border-top-width:4px;}',
		];
		yield 'an odd line is one pixel high' => [
			'section'    => new Kadence_Blocks_Spacer_Blur_Fix_Css(),
			'attributes' => [ 'dividerHeight' => 3 ],
			'expected'   => '.s{height:1px;}',
		];
		yield 'a negative odd line is one pixel high' => [
			'section'    => new Kadence_Blocks_Spacer_Blur_Fix_Css(),
			'attributes' => [ 'dividerHeight' => -3 ],
			'expected'   => '.s{height:1px;}',
		];
		yield 'an even line is not' => [
			'section'    => new Kadence_Blocks_Spacer_Blur_Fix_Css(),
			'attributes' => [ 'dividerHeight' => 4 ],
			'expected'   => '',
		];
		yield 'no color of the divider' => [
			'section'    => new Kadence_Blocks_Spacer_Color_Css(),
			'attributes' => [ 'dividerColor' => '' ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function widthUnitsProvider(): Generator {
		yield 'the unit saved' => [
			'attributes' => [ 'dividerWidthUnits' => 'px' ],
			'expected'   => 'px',
		];
		yield 'an empty unit' => [
			'attributes' => [ 'dividerWidthUnits' => '' ],
			'expected'   => '%',
		];
		yield 'no unit' => [
			'attributes' => [],
			'expected'   => '%',
		];
	}

	/**
	 * @return Generator
	 */
	public function opacityProvider(): Generator {
		yield 'no opacity is opaque' => [
			'attributes' => [],
			'expected'   => '#ff0000',
		];
		yield 'a single digit' => [
			'attributes' => [ 'dividerOpacity' => 5 ],
			'expected'   => 'rgba(255, 0, 0, 0.05)',
		];
		yield 'zero' => [
			'attributes' => [ 'dividerOpacity' => 0 ],
			'expected'   => 'rgba(255, 0, 0, 0.00)',
		];
		yield 'two digits' => [
			'attributes' => [ 'dividerOpacity' => 50 ],
			'expected'   => 'rgba(255, 0, 0, 0.50)',
		];
		yield 'a numeric string' => [
			'attributes' => [ 'dividerOpacity' => '20' ],
			'expected'   => 'rgba(255, 0, 0, 0.20)',
		];
		yield 'a hundred' => [
			'attributes' => [ 'dividerOpacity' => 100 ],
			'expected'   => '#ff0000',
		];
		yield 'more than a hundred' => [
			'attributes' => [ 'dividerOpacity' => 150 ],
			'expected'   => '#ff0000',
		];
		yield 'not a number' => [
			'attributes' => [ 'dividerOpacity' => 'abc' ],
			'expected'   => '#ff0000',
		];
	}

	/**
	 * @return Generator
	 */
	public function stripeHeightProvider(): Generator {
		yield 'the full site editing mode takes the height of the divider' => [
			'fse_mode' => true,
			'expected' => '.s{height:5px !important;}',
		];
		yield 'the classic mode takes the height of the spacer' => [
			'fse_mode' => false,
			'expected' => '.s{height:30px !important;}',
		];
	}
}
