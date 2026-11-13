<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Infobox;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Gate_Section;
use Kadence_Blocks_Css_Scoped_Section;
use Kadence_Blocks_Css_Side_List_Section;
use Kadence_Blocks_Css_Section;
use Kadence_Blocks_Infobox_Dimension_Ratio_Css;
use Kadence_Blocks_Infobox_Draw_Border_Condition;
use Kadence_Blocks_Infobox_Draw_Border_Css;
use Kadence_Blocks_Infobox_Flex_Align_Css;
use Kadence_Blocks_Infobox_Font_Device_Css;
use Kadence_Blocks_Infobox_Font_Family_Css;
use Kadence_Blocks_Infobox_Font_Size_Css;
use Kadence_Blocks_Infobox_Full_Height_Css;
use Kadence_Blocks_Infobox_Icon_Size_Css;
use Kadence_Blocks_Infobox_Image_Radius_Css;
use Kadence_Blocks_Infobox_Learn_More_Layout_Condition;
use Kadence_Blocks_Infobox_Margin_Placement;
use Kadence_Blocks_Infobox_Max_Width_Css;
use Kadence_Blocks_Infobox_Media;
use Kadence_Blocks_Infobox_Media_Align_Mobile_Css;
use Kadence_Blocks_Infobox_Media_Align_Tablet_Css;
use Kadence_Blocks_Infobox_Min_Height_Css;
use Kadence_Blocks_Infobox_Ratio_Css;
use Kadence_Blocks_Infobox_Ratio_Condition;
use Kadence_Blocks_Infobox_Shadow_Css;

use Kadence_Blocks_Infobox_Selector_Css;
use Kadence_Blocks_Infobox_Stretch_Css;
use Kadence_Blocks_Infobox_Svg_Css;
use Kadence_Blocks_Infobox_Text_Align_Css;
use Kadence_Blocks_Infobox_Title_Tag;
use Kadence_Blocks_Css_Block_Context;

/**
 * The sections of the info box CSS, one by one.
 */
final class InfoboxSectionsTest extends Infobox_Test_Case {

	private const BASE = '.kt-info-boxabc';

	private const LINK = '.kt-info-boxabc .kt-blocks-info-box-link-wrap';

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
	public function testSection( Kadence_Blocks_Css_Section $section, array $attributes, string $expected, string $selector = '' ): void {
		$this->assertSameCss( $expected, $this->write_info( $section, $attributes, $selector ) );
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
		$this->assertSame( $expected, $condition->is_met( $this->info_input( $attributes, new Kadence_Blocks_CSS() ) ) );
	}

	/**
	 * The title tag is asked from the block, with the level of the title font and the heading type as defaults.
	 *
	 * @return void
	 */
	public function testTitleTagIsAskedFromTheBlock(): void {
		$context = new Kadence_Blocks_Css_Block_Context(
			'infobox',
			static function ( $member, ...$arguments ) {
				return 'get_html_tag' === $member ? $arguments : [ 'h1', 'h2' ];
			}
		);

		$tag = ( new Kadence_Blocks_Infobox_Title_Tag() )->resolve( [ 'titleFont' => [ [ 'level' => 4 ] ] ], $context );

		$this->assertSame( 'titleTagType', $tag[1] );
		$this->assertSame( 'h2', $tag[2] );
		$this->assertSame( [ 'h1', 'h2' ], $tag[3] );
		$this->assertSame( 'heading', $tag[0]['titleTagType'] );
		$this->assertSame( 4, $tag[0]['titleTagLevel'] );
	}

	/**
	 * The media settings are the first entry of each attribute, and empty when it is not a list of settings.
	 *
	 * @return void
	 */
	public function testMediaSettings(): void {
		$media = new Kadence_Blocks_Infobox_Media(
			[
				'mediaIcon'   => [ [ 'size' => 10 ] ],
				'mediaStyle'  => 'none',
				'mediaImage'  => [ [ 'width' => 5 ] ],
				'mediaNumber' => [ 'x' ],
			]
		);

		$this->assertSame( [ 'size' => 10 ], $media->icon() );
		$this->assertSame( [], $media->style() );
		$this->assertSame( [ 'width' => 5 ], $media->image() );
		$this->assertSame( [], $media->number() );
	}

	/**
	 * @return Generator
	 */
	public function sectionProvider(): Generator {
		// Data providers run before the tests are set up.
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/infobox/loader.php';

		yield from $this->layoutProvider();
		yield from $this->mediaProvider();
		yield from $this->fontProvider();
		yield from $this->shadowProvider();
	}

	/**
	 * @return Generator
	 */
	private function layoutProvider(): Generator {
		yield 'full height' => [
			'section'    => new Kadence_Blocks_Infobox_Full_Height_Css(),
			'attributes' => [ 'fullHeight' => true ],
			'expected'   => self::BASE . '{height:100%;}.wp-block-kadence-column.kb-section-dir-horizontal > .kt-inside-inner-col > ' . self::BASE . '{height:auto;align-self:stretch;}',
		];
		yield 'not full height' => [
			'section'    => new Kadence_Blocks_Infobox_Full_Height_Css(),
			'attributes' => [ 'fullHeight' => false ],
			'expected'   => '',
		];
		yield 'the link of a full height info box' => [
			'section'    => new Kadence_Blocks_Infobox_Stretch_Css(),
			'attributes' => [ 'fullHeight' => true ],
			'expected'   => '{height:100%;}',
		];
		yield 'the learn more link goes to the bottom of a full height info box' => [
			'section'    => new Kadence_Blocks_Css_Gate_Section( [ 'fullHeight' ], [ new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap' ), new Kadence_Blocks_Infobox_Stretch_Css() ] ),
			'attributes' => [
				'fullHeight'       => true,
				'displayLearnMore' => true,
				'hAlign'           => 'right',
				'hAlignTablet'     => 'left',
				'hAlignMobile'     => 'center',
			],
			'expected'   => self::LINK . '{height:100%;display:flex;flex-direction:column;}'
				. self::LINK . ' .kt-infobox-textcontent{display:flex;flex-direction:column;align-items:flex-end;flex-grow:1;}'
				. self::LINK . ' .kt-infobox-textcontent .kt-blocks-info-box-learnmore-wrap{margin-top:auto;}'
				. '@media all and (max-width: 1024px){' . self::LINK . ' .kt-infobox-textcontent{align-items:flex-start;}}'
				. '@media all and (max-width: 767px){' . self::LINK . ' .kt-infobox-textcontent{align-items:center;}}',
		];
		yield 'the learn more link is centered unless the info box says otherwise' => [
			'section'    => new Kadence_Blocks_Css_Gate_Section( [ 'fullHeight' ], [ new Kadence_Blocks_Infobox_Selector_Css( '{base} .kt-blocks-info-box-link-wrap' ), new Kadence_Blocks_Infobox_Stretch_Css() ] ),
			'attributes' => [
				'fullHeight'       => true,
				'displayLearnMore' => true,
				'hAlign'           => 'justify',
			],
			'expected'   => self::LINK . '{height:100%;display:flex;flex-direction:column;}'
				. self::LINK . ' .kt-infobox-textcontent{display:flex;flex-direction:column;align-items:center;flex-grow:1;}'
				. self::LINK . ' .kt-infobox-textcontent .kt-blocks-info-box-learnmore-wrap{margin-top:auto;}',
		];
		yield 'no height when the info box is not full height' => [
			'section'    => new Kadence_Blocks_Infobox_Stretch_Css(),
			'attributes' => [ 'displayLearnMore' => true ],
			'expected'   => '',
		];
		yield 'alignment of a device' => [
			'section'    => new Kadence_Blocks_Infobox_Flex_Align_Css( 'hAlignTablet', 'tablet' ),
			'attributes' => [ 'hAlignTablet' => 'right' ],
			'expected'   => '@media all and (max-width: 1024px){' . self::LINK . ' .kt-infobox-textcontent{align-items:flex-end;}}',
		];
		yield 'unknown alignment of a device' => [
			'section'    => new Kadence_Blocks_Infobox_Flex_Align_Css( 'hAlignTablet', 'tablet' ),
			'attributes' => [ 'hAlignTablet' => 'justify' ],
			'expected'   => '',
		];
		yield 'maximum width on desktop' => [
			'section'    => new Kadence_Blocks_Infobox_Max_Width_Css( 'maxWidth', 'desktop', 0 ),
			'attributes' => [
				'maxWidth'     => 500,
				'maxWidthUnit' => '%',
			],
			'expected'   => '{max-width:500%;}',
		];
		yield 'maximum width on mobile takes the unit of the device before' => [
			'section'    => new Kadence_Blocks_Infobox_Max_Width_Css( 'mobileMaxWidth', 'mobile', 2 ),
			'attributes' => [
				'mobileMaxWidth'     => 300,
				'maxWidthUnit'       => '%',
				'maxWidthTabletUnit' => 'vw',
			],
			'expected'   => '@media all and (max-width: 767px){{max-width:300vw;}}',
		];
		yield 'no maximum width' => [
			'section'    => new Kadence_Blocks_Infobox_Max_Width_Css( 'maxWidth', 'desktop', 0 ),
			'attributes' => [ 'maxWidth' => '' ],
			'expected'   => '',
		];
		yield 'text alignment of a device' => [
			'section'    => new Kadence_Blocks_Infobox_Text_Align_Css( 'hAlignMobile', 'mobile' ),
			'attributes' => [ 'hAlignMobile' => 'center' ],
			'expected'   => '@media all and (max-width: 767px){{text-align:center;}}',
		];
		yield 'media on the left on tablet' => [
			'section'    => new Kadence_Blocks_Infobox_Media_Align_Tablet_Css(),
			'attributes' => [ 'mediaAlignTablet' => 'left' ],
			'expected'   => '@media all and (max-width: 1024px){' . self::LINK . '{display:flex;align-items:center;justify-content:flex-start;}' . self::LINK . ' .kt-blocks-info-box-media{display:block;}}',
		];
		yield 'media on top on tablet' => [
			'section'    => new Kadence_Blocks_Infobox_Media_Align_Tablet_Css(),
			'attributes' => [ 'mediaAlignTablet' => 'top' ],
			'expected'   => '@media all and (max-width: 1024px){' . self::LINK . '{display:block;}' . self::LINK . ' .kt-blocks-info-box-media{display:inline-block;max-width:100%;}}',
		];
		yield 'media on the right on tablet' => [
			'section'    => new Kadence_Blocks_Infobox_Media_Align_Tablet_Css(),
			'attributes' => [ 'mediaAlignTablet' => 'right' ],
			'expected'   => '@media all and (max-width: 1024px){' . self::LINK . '{display:flex;align-items:center;justify-content:flex-end;}' . self::LINK . ' .kt-blocks-info-box-media{display:block;}}',
		];
		yield 'media on the right on mobile' => [
			'section'    => new Kadence_Blocks_Infobox_Media_Align_Mobile_Css(),
			'attributes' => [ 'mediaAlignMobile' => 'right' ],
			'expected'   => '@media all and (max-width: 767px){' . self::LINK . '{display:flex;justify-content:flex-end;flex-direction:row-reverse;}' . self::LINK . ' .kt-blocks-info-box-media{display:inline-block;max-width:100%;}}',
		];
		yield 'media on top on mobile' => [
			'section'    => new Kadence_Blocks_Infobox_Media_Align_Mobile_Css(),
			'attributes' => [ 'mediaAlignMobile' => 'top' ],
			'expected'   => '@media all and (max-width: 767px){' . self::LINK . '{display:block;}' . self::LINK . ' .kt-blocks-info-box-media{display:inline-block;max-width:100%;}}',
		];
		yield 'no media alignment on mobile' => [
			'section'    => new Kadence_Blocks_Infobox_Media_Align_Mobile_Css(),
			'attributes' => [],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function mediaProvider(): Generator {
		yield 'ratio of the image' => [
			'section'    => new Kadence_Blocks_Infobox_Ratio_Css(),
			'attributes' => [ 'imageRatio' => 'land169' ],
			'expected'   => '{padding-bottom:56.25%;}',
		];
		yield 'ratio of the image that is unknown is square' => [
			'section'    => new Kadence_Blocks_Infobox_Ratio_Css(),
			'attributes' => [ 'imageRatio' => 'weird' ],
			'expected'   => '{padding-bottom:100%;}',
		];
		yield 'ratio of the image from its size' => [
			'section'    => new Kadence_Blocks_Infobox_Dimension_Ratio_Css(),
			'attributes' => [
				'height' => 150,
				'width'  => 200,
			],
			'expected'   => '{padding-bottom:75%;}',
		];
		yield 'no ratio when the image has no size' => [
			'section'    => new Kadence_Blocks_Infobox_Dimension_Ratio_Css(),
			'attributes' => [
				'height' => 150,
				'width'  => 'wide',
			],
			'expected'   => '',
		];
		yield 'size of an SVG and its colors' => [
			'section'    => new Kadence_Blocks_Infobox_Svg_Css(),
			'attributes' => [
				'mediaImage' => [
					[
						'maxWidth' => 40,
						'subtype'  => 'svg+xml',
					],
				],
				'mediaIcon'  => [
					[
						'color'      => '#111111',
						'hoverColor' => '#222222',
					],
				],
			],
			'expected'   => self::BASE . ' .kt-blocks-info-box-media .kt-info-box-image{width:40px;height:auto;}'
				. self::BASE . ' .kt-blocks-info-box-media .kt-info-box-image, ' . self::BASE . ' .kt-blocks-info-box-media .kt-info-box-image path{fill:#111111;}'
				. self::LINK . ':hover .kt-blocks-info-box-media .kt-info-box-image, ' . self::LINK . ':hover .kt-blocks-info-box-media .kt-info-box-image path{fill:#222222;}',
		];
		yield 'size of the icon' => [
			'section'    => new Kadence_Blocks_Infobox_Icon_Size_Css( 'size', 'desktop', false ),
			'attributes' => [
				'mediaIcon' => [
					[
						'size' => 50,
						'unit' => 'em',
					],
				],
			],
			'expected'   => self::BASE . ' .kadence-info-box-icon-container .kt-info-svg-icon, ' . self::BASE . ' .kt-info-svg-icon-flip, ' . self::BASE . ' .kt-blocks-info-box-number{font-size:50em;}',
		];
		yield 'size of the icon on tablet has to be a number' => [
			'section'    => new Kadence_Blocks_Infobox_Icon_Size_Css( 'tabletSize', 'tablet', true ),
			'attributes' => [ 'mediaIcon' => [ [ 'tabletSize' => 'big' ] ] ],
			'expected'   => '',
		];
		yield 'margin of the media on its container' => [
			'section'    => new Kadence_Blocks_Css_Scoped_Section( 'mediaStyle', [ new Kadence_Blocks_Css_Side_List_Section( 'margin', 'margin-%s', 'marginUnit', false ) ] ),
			'attributes' => [
				'mediaStyle' => [
					[
						'margin'     => [ 1, '', 3, 4 ],
						'marginUnit' => 'em',
					],
				],
			],
			'expected'   => '{margin-top:1em;margin-bottom:3em;margin-left:4em;}',
		];
		yield 'padding of the learn more link counts an empty unit as pixels' => [
			'section'    => new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s', 'paddingUnit', true ),
			'attributes' => [
				'padding'     => [ 1, 2, 3, 4 ],
				'paddingUnit' => '',
			],
			'expected'   => '{padding-top:1px;padding-right:2px;padding-bottom:3px;padding-left:4px;}',
		];
		yield 'sides that are not a list' => [
			'section'    => new Kadence_Blocks_Css_Side_List_Section( 'padding', 'padding-%s', 'paddingUnit', false ),
			'attributes' => [ 'padding' => 5 ],
			'expected'   => '',
		];
		yield 'the image of padded media is rounded as well' => [
			'section'    => new Kadence_Blocks_Infobox_Image_Radius_Css(),
			'attributes' => [
				'mediaStyle' => [
					[
						'borderRadius' => 10,
						'padding'      => [ 0, 5, 0, 0 ],
					],
				],
			],
			'expected'   => self::BASE . ' .kt-blocks-info-box-media .kadence-info-box-image-intrisic img{border-radius:10px;}',
		];
		yield 'the image of media without padding is not rounded' => [
			'section'    => new Kadence_Blocks_Infobox_Image_Radius_Css(),
			'attributes' => [
				'mediaStyle' => [
					[
						'borderRadius' => 10,
						'padding'      => [ 0, 0, 0, 0 ],
					],
				],
			],
			'expected'   => '',
		];
		yield 'the border of the media is drawn on hover' => [
			'section'    => new Kadence_Blocks_Infobox_Draw_Border_Css(),
			'attributes' => [
				'mediaStyle' => [
					[
						'borderWidth'  => [ 3, 0, 0, 0 ],
						'borderRadius' => 8,
						'border'       => '#ff0000',
						'hoverBorder'  => '#00ff00',
					],
				],
			],
			'expected'   => self::LINK . ' .kt-blocks-info-box-media{border-width:0px;box-shadow:inset 0 0 0 3px #ff0000;}'
				. self::LINK . ' .kt-blocks-info-box-media:before, ' . self::LINK . ' .kt-blocks-info-box-media:after{border-radius:8px;}'
				. self::LINK . ' .kt-blocks-info-box-media:before{border-width:3px;}'
				. self::LINK . ':hover .kt-blocks-info-box-media:after{border-right-color:#00ff00;border-right-width:3px;border-top-width:3px;border-bottom-width:3px;}'
				. self::LINK . ':hover .kt-blocks-info-box-media:before{border-top-color:#00ff00;border-right-color:#00ff00;border-bottom-color:#00ff00;}',
		];
		yield 'the border of media without a width is drawn in the default color' => [
			'section'    => new Kadence_Blocks_Infobox_Draw_Border_Css(),
			'attributes' => [],
			'expected'   => self::LINK . ' .kt-blocks-info-box-media{border-width:0px;}'
				. self::LINK . ':hover .kt-blocks-info-box-media:before{border-top-color:#444444;border-right-color:#444444;border-bottom-color:#444444;}',
		];
	}

	/**
	 * @return Generator
	 */
	private function fontProvider(): Generator {
		yield 'size and line height of a font' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Size_Css(),
			'attributes' => [
				'size'       => [ 20, 16 ],
				'sizeType'   => 'em',
				'lineHeight' => [ 1.5 ],
				'lineType'   => 'em',
			],
			'expected'   => '{font-size:20em;line-height:1.5em;}',
		];
		yield 'a font with no size' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Size_Css(),
			'attributes' => [ 'size' => [ '' ] ],
			'expected'   => '',
		];
		yield 'family of a Google font' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Family_Css(),
			'attributes' => [
				'family'     => 'Roboto',
				'google'     => true,
				'loadGoogle' => false,
				'variant'    => '700',
			],
			'expected'   => '{font-family:Roboto;}',
		];
		yield 'no family' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Family_Css(),
			'attributes' => [ 'family' => '' ],
			'expected'   => '',
		];
		yield 'font size of a device' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Device_Css( 'titleFont', '{base} {tag}.title', 'tablet', 1 ),
			'attributes' => [
				'titleFont' => [
					[
						'size'       => [ 20, 16 ],
						'sizeType'   => 'em',
						'lineHeight' => [ 1, 1.2 ],
						'lineType'   => 'em',
					],
				],
			],
			'expected'   => '@media all and (max-width: 1024px){' . self::BASE . ' h2.title{font-size:16em;line-height:1.2em;}}',
		];
		yield 'line height of a device' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Device_Css( 'titleFont', '{base} {tag}.title', 'mobile', 2 ),
			'attributes' => [ 'titleFont' => [ [ 'lineHeight' => [ 1, 1.2, 1.4 ] ] ] ],
			'expected'   => '@media all and (max-width: 767px){' . self::BASE . ' h2.title{line-height:1.4px;}}',
		];
		yield 'no font size or line height of a device' => [
			'section'    => new Kadence_Blocks_Infobox_Font_Device_Css( 'titleFont', '{base} {tag}.title', 'mobile', 2 ),
			'attributes' => [ 'titleFont' => [ [ 'size' => [ 1, 2 ] ] ] ],
			'expected'   => '',
		];
		yield 'minimum heights of a text on every device' => [
			'section'    => new Kadence_Blocks_Infobox_Min_Height_Css( 'textMinHeight', 'textMinHeightUnit', '{base} .text' ),
			'attributes' => [
				'textMinHeight'     => [ 50, 40, 'x' ],
				'textMinHeightUnit' => 'em',
			],
			'expected'   => self::BASE . ' .text{min-height:50em;}@media all and (max-width: 1024px){' . self::BASE . ' .text{min-height:40em;}}',
		];
		yield 'no minimum height without a height for desktop' => [
			'section'    => new Kadence_Blocks_Infobox_Min_Height_Css( 'textMinHeight', 'textMinHeightUnit', '{base} .text' ),
			'attributes' => [ 'textMinHeight' => [ null, 40 ] ],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	private function shadowProvider(): Generator {
		$shadow = [
			'color'   => '#000000',
			'opacity' => 0.5,
			'blur'    => 4,
			'spread'  => 1,
			'hOffset' => 2,
			'vOffset' => 3,
			'inset'   => false,
		];
		$empty  = array_fill_keys( array_keys( $shadow ), '' );

		yield 'a shadow whose tablet and mobile fill in what they leave empty' => [
			'section'    => new Kadence_Blocks_Infobox_Shadow_Css(),
			'attributes' => [
				'displayShadow' => true,
				'shadow'        => [ $shadow ],
				'tabletShadow'  => [ [ 'blur' => 8 ] + $empty ],
				'mobileShadow'  => [ [ 'vOffset' => 9 ] + $empty ],
			],
			'expected'   => self::LINK . '{box-shadow:2px 3px 4px 1px rgba(0, 0, 0, 0.5);}'
				. '@media all and (max-width: 1024px){' . self::LINK . '{box-shadow:2px 3px 8px 1px rgba(0, 0, 0, 0.5);}}'
				. '@media all and (max-width: 767px){' . self::LINK . '{box-shadow:2px 9px 8px 1px rgba(0, 0, 0, 0.5);}}'
				. self::LINK . ':hover{box-shadow:0px 0px 14px 0px rgba(0,0,0,0.2);}',
		];
		yield 'a hover shadow with its tablet and mobile shadows' => [
			'section'    => new Kadence_Blocks_Infobox_Shadow_Css(),
			'attributes' => [
				'displayShadow'     => true,
				'shadowHover'       => [ $shadow ],
				'tabletShadowHover' => [ [ 'blur' => 8 ] + $empty ],
				'mobileShadowHover' => [ $empty ],
			],
			'expected'   => self::LINK . ':hover{box-shadow:2px 3px 4px 1px rgba(0, 0, 0, 0.5);}'
				. '@media all and (max-width: 1024px){' . self::LINK . ':hover{box-shadow:2px 3px 8px 1px rgba(0, 0, 0, 0.5);}}'
				. '@media all and (max-width: 767px){' . self::LINK . ':hover{box-shadow:2px 3px 8px 1px rgba(0, 0, 0, 0.5);}}',
		];
		yield 'no shadow unless it is switched on' => [
			'section'    => new Kadence_Blocks_Infobox_Shadow_Css(),
			'attributes' => [
				'displayShadow' => 1,
				'shadow'        => [ $shadow ],
			],
			'expected'   => '',
		];
	}

	/**
	 * @return Generator
	 */
	public function conditionProvider(): Generator {
		require_once KADENCE_BLOCKS_PATH . 'includes/css-builders/infobox/loader.php';

		yield 'learn more on the bottom' => [
			'condition'  => new Kadence_Blocks_Infobox_Learn_More_Layout_Condition(),
			'attributes' => [
				'displayLearnMore' => true,
				'mediaAlign'       => 'top',
				'alignLearnMore'   => true,
			],
			'expected'   => true,
		];
		yield 'learn more with nothing saved about the media' => [
			'condition'  => new Kadence_Blocks_Infobox_Learn_More_Layout_Condition(),
			'attributes' => [ 'displayLearnMore' => true ],
			'expected'   => true,
		];
		yield 'learn more with the media on the side' => [
			'condition'  => new Kadence_Blocks_Infobox_Learn_More_Layout_Condition(),
			'attributes' => [
				'displayLearnMore' => true,
				'mediaAlign'       => 'left',
			],
			'expected'   => false,
		];
		yield 'learn more that is not aligned' => [
			'condition'  => new Kadence_Blocks_Infobox_Learn_More_Layout_Condition(),
			'attributes' => [
				'displayLearnMore' => true,
				'alignLearnMore'   => false,
			],
			'expected'   => false,
		];
		yield 'a ratio was chosen' => [
			'condition'  => new Kadence_Blocks_Infobox_Ratio_Condition(),
			'attributes' => [ 'imageRatio' => 'land43' ],
			'expected'   => true,
		];
		yield 'the ratio of the image was chosen' => [
			'condition'  => new Kadence_Blocks_Infobox_Ratio_Condition(),
			'attributes' => [ 'imageRatio' => 'inherit' ],
			'expected'   => false,
		];
		yield 'the margin goes on the media when it is on the side' => [
			'condition'  => new Kadence_Blocks_Infobox_Margin_Placement( false ),
			'attributes' => [
				'mediaAlign' => 'left',
				'mediaStyle' => [ [ 'margin' => [ 1, 2, 3, 4 ] ] ],
			],
			'expected'   => true,
		];
		yield 'the margin goes on the container when the media is on top' => [
			'condition'  => new Kadence_Blocks_Infobox_Margin_Placement( true ),
			'attributes' => [ 'mediaStyle' => [ [ 'margin' => [ 1, 2, 3, 4 ] ] ] ],
			'expected'   => true,
		];
		yield 'no margin no placement' => [
			'condition'  => new Kadence_Blocks_Infobox_Margin_Placement( true ),
			'attributes' => [ 'mediaStyle' => [ [ 'margin' => 5 ] ] ],
			'expected'   => false,
		];
		yield 'an icon that draws its border' => [
			'condition'  => new Kadence_Blocks_Infobox_Draw_Border_Condition(),
			'attributes' => [ 'mediaIcon' => [ [ 'hoverAnimation' => 'drawborder' ] ] ],
			'expected'   => true,
		];
		yield 'a number that draws its border' => [
			'condition'  => new Kadence_Blocks_Infobox_Draw_Border_Condition(),
			'attributes' => [
				'mediaType'   => 'number',
				'mediaNumber' => [ [ 'hoverAnimation' => 'drawborder' ] ],
			],
			'expected'   => true,
		];
		yield 'an image that draws its border in grayscale' => [
			'condition'  => new Kadence_Blocks_Infobox_Draw_Border_Condition(),
			'attributes' => [
				'mediaType'  => 'image',
				'mediaImage' => [ [ 'hoverAnimation' => 'grayscale-border-draw' ] ],
			],
			'expected'   => true,
		];
		yield 'an image with another animation' => [
			'condition'  => new Kadence_Blocks_Infobox_Draw_Border_Condition(),
			'attributes' => [
				'mediaType'  => 'image',
				'mediaImage' => [ [ 'hoverAnimation' => 'zoom' ] ],
			],
			'expected'   => false,
		];
	}
}
