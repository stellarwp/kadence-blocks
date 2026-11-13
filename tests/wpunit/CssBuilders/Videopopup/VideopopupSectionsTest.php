<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Videopopup;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Videopopup_Array_Condition;
use Kadence_Blocks_Videopopup_Assets_Css;
use Kadence_Blocks_Videopopup_Background_Color_Css;
use Kadence_Blocks_Videopopup_Column_Width_Css;
use Kadence_Blocks_Videopopup_Environment;
use Kadence_Blocks_Videopopup_Max_Width_Css;
use Kadence_Blocks_Videopopup_Media_State_Css;
use Kadence_Blocks_Videopopup_Popup_Width_Css;
use Kadence_Blocks_Videopopup_Private_Vimeo_Condition;
use Kadence_Blocks_Videopopup_Pro_Css;
use Kadence_Blocks_Videopopup_Ratio_Padding_Css;
use Kadence_Blocks_Videopopup_Site_Environment;
use Kadence_Blocks_Videopopup_Spacing_Css;

/**
 * The sections of the video popup CSS, one by one.
 */
final class VideopopupSectionsTest extends Videopopup_Test_Case {

	private const WRAP = '.kadence-video-popup-wrap';

	private const SLIDE = '.glightbox-container.kadence-popup-abc .gslide-video, .glightbox-container.kadence-popup-abc .gvideo-local';

	/**
	 * A section writes the CSS expected for the attributes.
	 *
	 * @dataProvider sectionProvider
	 *
	 * @param Kadence_Blocks_Css_Section $section    The section under test.
	 * @param array<string, mixed>       $attributes The block attributes.
	 * @param string                     $expected   The CSS expected.
	 * @param string                     $selector   The selector that is current when the section runs.
	 *
	 * @return void
	 */
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected, string $selector = '.x' ): void {
		$this->assertSameCss( $expected, $this->write_popup( $section, $attributes, $selector ) );
	}

	/**
	 * A condition is met, or not, for the attributes.
	 *
	 * @dataProvider conditionProvider
	 *
	 * @param object               $condition  The condition.
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the condition is met.
	 *
	 * @return void
	 */
	public function testCondition( $condition, array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $condition->is_met( $this->popup_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The assets are enqueued through the block, scripts first.
	 *
	 * @return void
	 */
	public function testAssetsAreEnqueuedThroughTheBlock(): void {
		$this->write_popup( new Kadence_Blocks_Videopopup_Assets_Css() );

		$this->assertSame(
			[
				[ 'enqueue_script', 'kadence-blocks-pro-glight-video-init' ],
				[ 'enqueue_script', 'kadence-glightbox' ],
				[ 'enqueue_style', 'kadence-glightbox' ],
			],
			$this->calls
		);
	}

	/**
	 * The media state of the CSS builder is the one the section set.
	 *
	 * @return void
	 */
	public function testMediaStateIsSet(): void {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test-state' );
		$css->set_selector( '.x' );

		( new Kadence_Blocks_Videopopup_Media_State_Css( 'tablet' ) )->write( $this->popup_input( [], $css ) );
		$css->add_property( 'color', 'red' );

		$this->assertSameCss( '@media all and (max-width: 1024px) { .x{color:red;} }', $css->css_output() );
	}

	/**
	 * The Pro block builds its CSS from the same attributes and ids, after the sections before it.
	 *
	 * @return void
	 */
	public function testProBlockBuildsItsCss(): void {
		$environment = new Kadence_Blocks_Videopopup_Site_Environment( Fake_Pro_Plugin::class, Fake_Pro_Video_Popup_Block::class );

		$css = $this->write_popup( new Kadence_Blocks_Videopopup_Pro_Css(), [ 'a' => 1 ], '', $environment );

		$this->assertSameCss( '.pro{color:red;}', $css );
		$this->assertSame( [ [ 'a' => 1 ], 'abc', 'abc' ], Fake_Pro_Video_Popup_Block::$arguments );
	}

	/**
	 * Without the Pro block nothing is written.
	 *
	 * @return void
	 */
	public function testNoProBlockWritesNothing(): void {
		$environment = new Kadence_Blocks_Videopopup_Site_Environment( 'Missing_Pro_Plugin', Fake_Pro_Video_Popup_Block::class );

		$this->assertSame( '', $this->write_popup( new Kadence_Blocks_Videopopup_Pro_Css(), [], '', $environment ) );
	}

	/**
	 * The Pro block is looked up only when both its plugin and its block class exist.
	 *
	 * @dataProvider environmentProvider
	 *
	 * @param string $plugin_class The class that tells Pro is active.
	 * @param string $block_class  The Pro video popup block class.
	 * @param bool   $expected     Whether a block is found.
	 *
	 * @return void
	 */
	public function testSiteEnvironmentFindsTheProBlock( string $plugin_class, string $block_class, bool $expected ): void {
		$block = ( new Kadence_Blocks_Videopopup_Site_Environment( $plugin_class, $block_class ) )->pro_block();

		$this->assertSame( $expected, $block instanceof Fake_Pro_Video_Popup_Block );
		$this->assertSame( $expected, null !== $block );
	}

	/**
	 * The site environment looks for the real Pro classes by default, which are not there in the tests.
	 *
	 * @return void
	 */
	public function testSiteEnvironmentDefaultsToTheProClasses(): void {
		$this->assertInstanceOf( Kadence_Blocks_Videopopup_Environment::class, new Kadence_Blocks_Videopopup_Site_Environment() );
		$this->assertSame( class_exists( 'Kadence_Blocks_Pro' ) && class_exists( 'Kadence_Blocks_Pro_Video_Popup_Block' ), null !== ( new Kadence_Blocks_Videopopup_Site_Environment() )->pro_block() );
	}

	/**
	 * A popup width without a unit key falls back to pixels.
	 *
	 * @return void
	 */
	public function testPopupWidthWithoutUnitFallsBackToPixels(): void {
		$css = $this->write_popup( new Kadence_Blocks_Videopopup_Popup_Width_Css( 'maxWidth', true ), [ 'maxWidth' => 10 ], '.x' );

		$this->assertSameCss( '.x{max-width:10px !important;}', $css );
	}

	/**
	 * A non numeric image size stops the ratio, the way the original arithmetic did.
	 *
	 * @return void
	 */
	public function testRatioPaddingOfNonNumericSizeThrows(): void {
		$this->expectException( \TypeError::class );

		$this->write_popup(
			new Kadence_Blocks_Videopopup_Ratio_Padding_Css(),
			[
				'imageHeight' => 'tall',
				'imgWidth'    => 'wide',
			],
			'.x' 
		);
	}

	/**
	 * @return Generator
	 */
	public function environmentProvider(): Generator {
		yield 'both there' => [
			'plugin_class' => Fake_Pro_Plugin::class,
			'block_class'  => Fake_Pro_Video_Popup_Block::class,
			'expected'     => true,
		];
		yield 'no plugin' => [
			'plugin_class' => 'Missing_Pro_Plugin',
			'block_class'  => Fake_Pro_Video_Popup_Block::class,
			'expected'     => false,
		];
		yield 'no block' => [
			'plugin_class' => Fake_Pro_Plugin::class,
			'block_class'  => 'Missing_Pro_Block',
			'expected'     => false,
		];
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-videopopup-css.php';

		yield from $this->widthProvider();
		yield from $this->spacingProvider();
		yield from $this->colorProvider();
		yield from $this->popupWidthProvider();
	}

	/**
	 * @return Generator
	 */
	private function widthProvider(): Generator {
		yield 'max width in pixels by default' => [
			'section'    => new Kadence_Blocks_Videopopup_Max_Width_Css(),
			'attributes' => [ 'maxWidth' => 500 ],
			'expected'   => '.x{max-width:500px;;}',
		];
		yield 'max width with a unit' => [
			'section'    => new Kadence_Blocks_Videopopup_Max_Width_Css(),
			'attributes' => [
				'maxWidth'     => 80,
				'maxWidthUnit' => '%',
			],
			'expected'   => '.x{max-width:80%;;}',
		];
		yield 'max width with an empty unit' => [
			'section'    => new Kadence_Blocks_Videopopup_Max_Width_Css(),
			'attributes' => [
				'maxWidth'     => 80,
				'maxWidthUnit' => '',
			],
			'expected'   => '.x{max-width:80px;;}',
		];
		yield 'column width is in pixels and full width' => [
			'section'    => new Kadence_Blocks_Videopopup_Column_Width_Css(),
			'attributes' => [
				'maxWidth'     => 80,
				'maxWidthUnit' => '%',
			],
			'expected'   => '.x{max-width:80px;width:100%;}',
		];
		yield 'ratio padding follows the image' => [
			'section'    => new Kadence_Blocks_Videopopup_Ratio_Padding_Css(),
			'attributes' => [
				'imageHeight' => 300,
				'imgWidth'    => 400,
			],
			'expected'   => '.x{padding-bottom:75% !important;}',
		];
		yield 'ratio padding is rounded down' => [
			'section'    => new Kadence_Blocks_Videopopup_Ratio_Padding_Css(),
			'attributes' => [
				'imageHeight' => '9',
				'imgWidth'    => '16',
			],
			'expected'   => '.x{padding-bottom:56% !important;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function spacingProvider(): Generator {
		$sides = [
			'desk'   => [ '1', '2', '3', '4' ],
			'tablet' => [ 5, 6, 7, 8 ],
			'mobile' => [ '', '', 9, '' ],
		];

		yield 'padding of every device in pixels' => [
			'section'    => new Kadence_Blocks_Videopopup_Spacing_Css( 'padding' ),
			'attributes' => [ 'padding' => [ $sides ] ],
			'expected'   => '.x{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;} @media all and (max-width: 1024px) { .x{padding-top:5px;padding-right:6px;padding-bottom:7px;padding-left:8px;} } @media all and (max-width: 767px) { .x{padding-bottom:9px;} }',
		];
		yield 'margin with a unit' => [
			'section'    => new Kadence_Blocks_Videopopup_Spacing_Css( 'margin' ),
			'attributes' => [
				'margin'     => [ $sides ],
				'marginUnit' => '%',
			],
			'expected'   => '.x{margin-top:1%;margin-right:2%;margin-bottom:3%;margin-left:4%;} @media all and (max-width: 1024px) { .x{margin-top:5%;margin-right:6%;margin-bottom:7%;margin-left:8%;} } @media all and (max-width: 767px) { .x{margin-bottom:9%;} }',
		];
		yield 'spacing that is not a list writes nothing' => [
			'section'    => new Kadence_Blocks_Videopopup_Spacing_Css( 'padding' ),
			'attributes' => [ 'padding' => '10px' ],
			'expected'   => '',
		];
		yield 'spacing of a device that is not a list writes nothing' => [
			'section'    => new Kadence_Blocks_Videopopup_Spacing_Css( 'padding' ),
			'attributes' => [
				'padding' => [
					[
						'desk'   => '5',
						'tablet' => 5,
					],
				],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function colorProvider(): Generator {
		yield 'background color without opacity is solid' => [
			'section'    => new Kadence_Blocks_Videopopup_Background_Color_Css(),
			'attributes' => [ 'color' => '#112233' ],
			'expected'   => '.x{background-color:#112233;}',
		];
		yield 'background color with opacity' => [
			'section'    => new Kadence_Blocks_Videopopup_Background_Color_Css(),
			'attributes' => [
				'color'        => '#112233',
				'colorOpacity' => 0.5,
			],
			'expected'   => '.x{background-color:rgba(17, 34, 51, 0.5);}',
		];
	}

	/**
	 * @return Generator
	 */
	private function popupWidthProvider(): Generator {
		yield 'popup width with important in the value' => [
			'section'    => new Kadence_Blocks_Videopopup_Popup_Width_Css( 'maxWidthTablet', true ),
			'attributes' => [
				'maxWidthTablet' => 600,
				'maxWidthUnit'   => '%',
			],
			'expected'   => '.x{max-width:600% !important;}',
		];
		yield 'popup width without important' => [
			'section'    => new Kadence_Blocks_Videopopup_Popup_Width_Css( 'maxWidthMobile', false ),
			'attributes' => [
				'maxWidthMobile' => 300,
				'maxWidthUnit'   => 'vw',
			],
			'expected'   => '.x{max-width:300vw;}',
		];
		yield 'popup width with an empty unit is in pixels' => [
			'section'    => new Kadence_Blocks_Videopopup_Popup_Width_Css( 'maxWidthMobile', false ),
			'attributes' => [
				'maxWidthMobile' => 300,
				'maxWidthUnit'   => '',
			],
			'expected'   => '.x{max-width:300px;}',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/class-kadence-blocks-videopopup-css.php';

		yield 'a list is a list' => [ new Kadence_Blocks_Videopopup_Array_Condition( 'a' ), [ 'a' => [] ], true ];
		yield 'a string is not a list' => [ new Kadence_Blocks_Videopopup_Array_Condition( 'a' ), [ 'a' => 'x' ], false ];
		yield 'a missing attribute is not a list' => [ new Kadence_Blocks_Videopopup_Array_Condition( 'a' ), [], false ];
		yield 'private Vimeo video' => [
			new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(),
			[
				'url'            => 'https://vimeo.com/1',
				'isVimeoPrivate' => true,
			],
			true,
		];
		yield 'private flag as a truthy string' => [
			new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(),
			[
				'url'            => 'https://player.vimeo.com/video/1',
				'isVimeoPrivate' => 'yes',
			],
			true,
		];
		yield 'public Vimeo video' => [
			new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(),
			[
				'url'            => 'https://vimeo.com/1',
				'isVimeoPrivate' => false,
			],
			false,
		];
		yield 'private video of another site' => [
			new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(),
			[
				'url'            => 'https://youtube.com/1',
				'isVimeoPrivate' => true,
			],
			false,
		];
		yield 'no url' => [ new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(), [ 'isVimeoPrivate' => true ], false ];
		yield 'no flag' => [ new Kadence_Blocks_Videopopup_Private_Vimeo_Condition(), [ 'url' => 'https://vimeo.com/1' ], false ];
	}
}
