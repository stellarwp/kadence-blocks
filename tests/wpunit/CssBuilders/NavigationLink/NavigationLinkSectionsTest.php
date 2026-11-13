<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\NavigationLink;

use DivisionByZeroError;
use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Css_Build_Input;
use Kadence_Blocks_Navigation_Link_Css;
use Kadence_Blocks_Navigation_Link_Disabled_Link_Condition;
use Kadence_Blocks_Navigation_Link_Dropdown_Shadow;
use Kadence_Blocks_Navigation_Link_Highlight_Condition;
use Kadence_Blocks_Navigation_Link_Media_Intrinsic;
use Kadence_Blocks_Navigation_Link_Media_Max_Width;
use Kadence_Blocks_Navigation_Link_Media_Padding;
use Kadence_Blocks_Navigation_Link_Media_Ratio;
use Kadence_Blocks_Navigation_Link_Sized_Styles;
use TypeError;

/**
 * The classes that build the CSS of the navigation link, one at a time, and the builder that runs them.
 *
 * The CSS of the navigation link depends on nothing but its attributes and on the styles the block itself writes for each size, which the
 * builder asks the block for through its context. The tests give the context a fake block, so nothing here needs a post or a menu.
 */
final class NavigationLinkSectionsTest extends NavigationLink_Test_Case {

	/**
	 * The shadow of the dropdown is written as a variable.
	 *
	 * @return void
	 */
	public function testDropdownShadowWritesTheShadowVariable(): void {
		$shadow = [
			'color'   => '#112233',
			'opacity' => 0.3,
			'spread'  => 2,
			'blur'    => 10,
			'hOffset' => 1,
			'vOffset' => 4,
			'inset'   => false,
		];

		$this->assertSame(
			'.x{--kb-nav-dropdown-box-shadow:1px 4px 10px 2px rgba(17, 34, 51, 0.3);}',
			$this->write_link( new Kadence_Blocks_Navigation_Link_Dropdown_Shadow(), $shadow )
		);
	}

	/**
	 * The padding of the media container is written as variables for each device, in the unit saved with it.
	 *
	 * @return void
	 */
	public function testMediaPaddingWritesPaddingVariablesPerDevice(): void {
		$attributes = [
			'mediaStyle' => [
				[
					'padding'       => [ 1, 2, 3, 4 ],
					'paddingTablet' => [ 5, '', '', '' ],
					'paddingType'   => 'em',
				],
			],
		];

		$this->assertSame(
			'.x{--kb-nav-link-media-container-padding-top:1em;--kb-nav-link-media-container-padding-right:2em;--kb-nav-link-media-container-padding-bottom:3em;--kb-nav-link-media-container-padding-left:4em;}@media all and (max-width: 1024px){.x{--kb-nav-link-media-container-padding-top:5em;}}',
			$this->write_link( new Kadence_Blocks_Navigation_Link_Media_Padding(), $attributes )
		);
	}

	/**
	 * Without media style settings there is no media padding.
	 *
	 * @dataProvider emptyMediaStyleProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 *
	 * @return void
	 */
	public function testMediaPaddingNeedsMediaStyleSettings( array $attributes ): void {
		$this->assertSame( '', $this->write_link( new Kadence_Blocks_Navigation_Link_Media_Padding(), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function emptyMediaStyleProvider(): Generator {
		yield 'no attribute' => [ 'attributes' => [] ];
		yield 'no item' => [ 'attributes' => [ 'mediaStyle' => [] ] ];
		yield 'empty item' => [ 'attributes' => [ 'mediaStyle' => [ [] ] ] ];
		yield 'zero item' => [ 'attributes' => [ 'mediaStyle' => [ 0 ] ] ];
	}

	/**
	 * Settings that are text instead of an array write nothing, as in the original; the block fails on them in its own styles first.
	 *
	 * @return void
	 */
	public function testMediaPaddingOfTextWritesNothing(): void {
		$this->assertSame( '', $this->write_link( new Kadence_Blocks_Navigation_Link_Media_Padding(), [ 'mediaStyle' => [ 'abc' ] ] ) );
	}

	/**
	 * The largest width of the media is the saved width in pixels, and only the unit when no width was saved.
	 *
	 * @dataProvider maxWidthProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $expected   The CSS expected.
	 *
	 * @return void
	 */
	public function testMediaMaxWidthEndsInPixels( array $attributes, string $expected ): void {
		$this->assertSame( $expected, $this->write_link( new Kadence_Blocks_Navigation_Link_Media_Max_Width(), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function maxWidthProvider(): Generator {
		yield 'a width' => [
			'attributes' => [ 'mediaImage' => [ [ 'maxWidth' => 120 ] ] ],
			'expected'   => '.x{--kb-nav-link-media-max-width:120px;}',
		];
		yield 'an empty width' => [
			'attributes' => [ 'mediaImage' => [ [ 'maxWidth' => '' ] ] ],
			'expected'   => '.x{--kb-nav-link-media-max-width:px;}',
		];
		yield 'no width' => [
			'attributes' => [ 'mediaImage' => [ [] ] ],
			'expected'   => '.x{--kb-nav-link-media-max-width:px;}',
		];
	}

	/**
	 * The ratio is the one of the saved image, or the one of a preset when a preset is saved.
	 *
	 * @dataProvider ratioProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string|null          $padding    The padding that gives the box its ratio.
	 * @param bool                 $has_ratio  Whether a preset ratio is saved.
	 *
	 * @return void
	 */
	public function testMediaRatio( array $attributes, ?string $padding, bool $has_ratio ): void {
		$ratio = new Kadence_Blocks_Navigation_Link_Media_Ratio( $attributes );

		$this->assertSame( $padding, $ratio->padding() );
		$this->assertSame( $has_ratio, $ratio->has_ratio() );
	}

	/**
	 * @return Generator
	 */
	public function ratioProvider(): Generator {
		$image = [
			[
				'height' => 200,
				'width'  => 300,
			],
		];

		yield 'the image' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => '',
			],
			'padding'    => '66.666666666667%',
			'has_ratio'  => false,
		];
		yield 'the image in text' => [
			'attributes' => [
				'mediaImage' => [
					[
						'height' => '150',
						'width'  => '300',
					],
				],
				'imageRatio' => 'inherit',
			],
			'padding'    => '50%',
			'has_ratio'  => false,
		];
		yield 'an image without a height' => [
			'attributes' => [
				'mediaImage' => [
					[
						'height' => '',
						'width'  => 300,
					],
				],
				'imageRatio' => 'inherit',
			],
			'padding'    => null,
			'has_ratio'  => false,
		];
		yield 'a zero ratio' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => '0',
			],
			'padding'    => '66.666666666667%',
			'has_ratio'  => false,
		];
		yield 'a landscape 4 to 3' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'land43',
			],
			'padding'    => '75%',
			'has_ratio'  => true,
		];
		yield 'a landscape 3 to 2' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'land32',
			],
			'padding'    => '66.67%',
			'has_ratio'  => true,
		];
		yield 'a landscape 16 to 9' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'land169',
			],
			'padding'    => '56.25%',
			'has_ratio'  => true,
		];
		yield 'a landscape 2 to 1' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'land21',
			],
			'padding'    => '50%',
			'has_ratio'  => true,
		];
		yield 'a landscape 3 to 1' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'land31',
			],
			'padding'    => '33%',
			'has_ratio'  => true,
		];
		yield 'a landscape 4 to 1' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'land41',
			],
			'padding'    => '25%',
			'has_ratio'  => true,
		];
		yield 'a portrait 3 to 4' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'port34',
			],
			'padding'    => '133.33%',
			'has_ratio'  => true,
		];
		yield 'a portrait 2 to 3' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'port23',
			],
			'padding'    => '150%',
			'has_ratio'  => true,
		];
		yield 'a preset nobody knows' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 'square',
			],
			'padding'    => '100%',
			'has_ratio'  => true,
		];
		yield 'a preset that is a switch on' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => true,
			],
			'padding'    => '75%',
			'has_ratio'  => true,
		];
		yield 'a preset that is a number' => [
			'attributes' => [
				'mediaImage' => $image,
				'imageRatio' => 7,
			],
			'padding'    => '100%',
			'has_ratio'  => true,
		];
		yield 'a preset and an image without a height' => [
			'attributes' => [
				'mediaImage' => [
					[
						'height' => '',
						'width'  => '',
					],
				],
				'imageRatio' => 'port23',
			],
			'padding'    => '150%',
			'has_ratio'  => true,
		];
	}

	/**
	 * An image of a width that cannot divide breaks the builder the way it broke the original, even when a preset replaces the ratio of the image.
	 *
	 * @dataProvider brokenImageProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param string               $error      The class of the error.
	 *
	 * @return void
	 */
	public function testMediaRatioOfAnImageThatCannotDivideBreaks( array $attributes, string $error ): void {
		$this->expectException( $error );

		$this->without_warnings(
			static function () use ( $attributes ) {
				new Kadence_Blocks_Navigation_Link_Media_Ratio( $attributes );
			}
		);
	}

	/**
	 * @return Generator
	 */
	public function brokenImageProvider(): Generator {
		yield 'a width of zero' => [
			'attributes' => [
				'mediaImage' => [
					[
						'height' => 10,
						'width'  => 0,
					],
				],
				'imageRatio' => '',
			],
			'error'      => DivisionByZeroError::class,
		];
		yield 'no width' => [
			'attributes' => [
				'mediaImage' => [ [ 'height' => 10 ] ],
				'imageRatio' => '',
			],
			'error'      => DivisionByZeroError::class,
		];
		yield 'a width in letters' => [
			'attributes' => [
				'mediaImage' => [
					[
						'height' => 10,
						'width'  => 'abc',
					],
				],
				'imageRatio' => '',
			],
			'error'      => TypeError::class,
		];
		yield 'a width in letters and a preset' => [
			'attributes' => [
				'mediaImage' => [
					[
						'height' => 10,
						'width'  => 'abc',
					],
				],
				'imageRatio' => 'land43',
			],
			'error'      => TypeError::class,
		];
	}

	/**
	 * Missing image settings are only warnings: no ratio, no preset.
	 *
	 * @return void
	 */
	public function testMediaRatioWithoutImageSettingsHasNoRatio(): void {
		$ratio = null;

		$this->without_warnings(
			static function () use ( &$ratio ) {
				$ratio = new Kadence_Blocks_Navigation_Link_Media_Ratio(
					[
						'mediaImage' => [ [] ],
						'imageRatio' => '',
					] 
				);
			}
		);

		$this->assertNull( $ratio->padding() );
		$this->assertFalse( $ratio->has_ratio() );
	}

	/**
	 * A preset ratio writes the padding, a height of zero and the width of the image.
	 *
	 * @return void
	 */
	public function testMediaIntrinsicWritesTheSizeOfAPresetRatio(): void {
		$attributes = [
			'mediaImage' => [
				[
					'height'   => 200,
					'width'    => 300,
					'maxWidth' => 120,
				],
			],
			'imageRatio' => 'land43',
		];

		$this->assertSame(
			'.x{--kb-nav-link-media-intrinsic-padding-bottom:75%;--kb-nav-link-media-intrinsic-height:0px;--kb-nav-link-media-intrinsic-width:300px;}',
			$this->write_link( new Kadence_Blocks_Navigation_Link_Media_Intrinsic(), $attributes )
		);
	}

	/**
	 * An image without a width has no intrinsic width, whatever the preset.
	 *
	 * @return void
	 */
	public function testMediaIntrinsicSkipsAnImageWithoutAWidth(): void {
		$attributes = [
			'mediaImage' => [
				[
					'height' => '',
					'width'  => '',
				],
			],
			'imageRatio' => 'port34',
		];

		$this->assertSame(
			'.x{--kb-nav-link-media-intrinsic-padding-bottom:133.33%;--kb-nav-link-media-intrinsic-height:0px;}',
			$this->write_link( new Kadence_Blocks_Navigation_Link_Media_Intrinsic(), $attributes )
		);
	}

	/**
	 * Without a preset ratio nothing is written for the intrinsic size.
	 *
	 * @return void
	 */
	public function testMediaIntrinsicNeedsAPresetRatio(): void {
		$attributes = [
			'mediaImage' => [
				[
					'height' => 200,
					'width'  => 300,
				],
			],
			'imageRatio' => 'inherit',
		];

		$this->assertSame( '', $this->write_link( new Kadence_Blocks_Navigation_Link_Media_Intrinsic(), $attributes ) );
	}

	/**
	 * The block is asked for the styles of each size, in order, and the CSS goes back to desktop when it is done.
	 *
	 * @return void
	 */
	public function testSizedStylesAskTheBlockForEverySizeAndReturnToDesktop(): void {
		$css = new Kadence_Blocks_CSS();
		$css->set_style_id( 'section-test' );
		$css->set_selector( '.x' );

		$context = $this->recording_context(
			static function ( $member, $css, $attributes, $unique_id, $size ) {
				$css->set_media_state( strtolower( $size ) );
			}
		);

		( new Kadence_Blocks_Navigation_Link_Sized_Styles() )->write( new Kadence_Blocks_Css_Build_Input( [ 'a' => 1 ], $css, 'abc', 'abc', $context ) );
		$css->add_property( 'color', 'red' );

		$this->assertSame( '.x{color:red;}', $css->css_output() );
		$this->assertSame(
			[
				[ 'sized_dynamic_styles', $css, [ 'a' => 1 ], 'abc', 'Desktop' ],
				[ 'sized_dynamic_styles', $css, [ 'a' => 1 ], 'abc', 'Tablet' ],
				[ 'sized_dynamic_styles', $css, [ 'a' => 1 ], 'abc', 'Mobile' ],
			],
			$this->calls
		);
	}

	/**
	 * A link has a highlight when it has a label, or an icon saved straight on the highlight setting.
	 *
	 * @dataProvider highlightProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the link has a highlight.
	 *
	 * @return void
	 */
	public function testHighlightCondition( array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $this->is_met( new Kadence_Blocks_Navigation_Link_Highlight_Condition(), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function highlightProvider(): Generator {
		yield 'nothing' => [
			'attributes' => [],
			'expected'   => false,
		];
		yield 'a label' => [
			'attributes' => [ 'highlightLabel' => 'New' ],
			'expected'   => true,
		];
		yield 'an empty label' => [
			'attributes' => [
				'highlightLabel' => '',
				'highlightIcon'  => [ [ 'icon' => 'fe_star' ] ],
			],
			'expected'   => false,
		];
		yield 'an icon saved on the setting' => [
			'attributes' => [ 'highlightIcon' => [ 'icon' => 'fe_star' ] ],
			'expected'   => true,
		];
		yield 'text instead of the setting' => [
			'attributes' => [ 'highlightIcon' => 'abc' ],
			'expected'   => false,
		];
	}

	/**
	 * A link is disabled only by a switch that is on, and only when the dropdown does not open on click.
	 *
	 * @dataProvider disabledLinkProvider
	 *
	 * @param array<string, mixed> $attributes The block attributes.
	 * @param bool                 $expected   Whether the link is disabled.
	 *
	 * @return void
	 */
	public function testDisabledLinkCondition( array $attributes, bool $expected ): void {
		$this->assertSame( $expected, $this->is_met( new Kadence_Blocks_Navigation_Link_Disabled_Link_Condition(), $attributes ) );
	}

	/**
	 * @return Generator
	 */
	public function disabledLinkProvider(): Generator {
		yield 'disabled' => [
			'attributes' => [
				'disableLink'   => true,
				'dropdownClick' => false,
			],
			'expected'   => true,
		];
		yield 'disabled and no click setting' => [
			'attributes' => [ 'disableLink' => true ],
			'expected'   => true,
		];
		yield 'disabled and the dropdown opens on click' => [
			'attributes' => [
				'disableLink'   => true,
				'dropdownClick' => true,
			],
			'expected'   => false,
		];
		yield 'not disabled' => [
			'attributes' => [
				'disableLink'   => false,
				'dropdownClick' => false,
			],
			'expected'   => false,
		];
		yield 'a switch in text' => [
			'attributes' => [
				'disableLink'   => 'yes',
				'dropdownClick' => false,
			],
			'expected'   => false,
		];
	}

	/**
	 * A plain link writes its size variable after the block wrote the styles of its sizes.
	 *
	 * @return void
	 */
	public function testBuilderOfAPlainLink(): void {
		$attributes = [
			'mediaImage'    => [
				[
					'height'   => 200,
					'width'    => 300,
					'maxWidth' => 120,
				],
			],
			'imageRatio'    => 'inherit',
			'dropdownClick' => false,
			'mediaType'     => '',
		];

		$css = $this->without_warnings_result(
			function () use ( $attributes ) {
				return ( new Kadence_Blocks_Navigation_Link_Css( $this->recording_context() ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', 'plain' );
			}
		);

		$this->assertSameCss( '.kb-nav-link-abc > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap{--kb-nav-link-media-max-width:120px;}', (string) $css );
		$this->assertSame( [ 'Desktop', 'Tablet', 'Mobile' ], array_column( $this->calls, 4 ) );
		$this->assertSame( 'navigation-link', ( $this->recording_context() )->block_name() );
	}

	/**
	 * A busy link writes the shadow, the spacing, the highlight, the intrinsic size, the overlay of the image, the fonts, the icon size and the cursor.
	 *
	 * @return void
	 */
	public function testBuilderOfALinkWithEverything(): void {
		$attributes = [
			'mediaImage'       => [
				[
					'height'   => 200,
					'width'    => 300,
					'maxWidth' => 120,
				],
			],
			'imageRatio'       => 'land43',
			'dropdownClick'    => false,
			'mediaType'        => 'image',
			'highlightLabel'   => 'New',
			'highlightIcon'    => [
				[
					'icon' => 'fe_star',
					'size' => 20,
				],
			],
			'highlightSpacing' => [
				[
					'padding' => [ 1, 2, 3, 4 ],
					'gap'     => [ 4, 5, 6 ],
					'gapUnit' => 'em',
				],
			],
			'disableLink'      => true,
			'dropdownShadow'   => [
				[
					'enable'  => true,
					'color'   => '#112233',
					'opacity' => 0.3,
					'spread'  => 2,
					'blur'    => 10,
					'hOffset' => 1,
					'vOffset' => 4,
					'inset'   => false,
				],
			],
			'margin'           => [ 1, 2, 3, 4 ],
			'marginUnit'       => 'rem',
			'typography'       => [
				[
					'size'     => [ 18, '', '' ],
					'sizeType' => 'px',
				],
			],
		];
		$base       = '.kb-nav-link-abc';
		$wrap       = $base . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap.kb-link-wrap';
		$overlay    = $base . ' .kb-nav-link-image-overlay';
		$expected   = $base . '{--kb-nav-dropdown-box-shadow:1px 4px 10px 2px rgba(17, 34, 51, 0.3);}'
			. $wrap . '{--kb-nav-link-margin-top:1rem;--kb-nav-link-margin-right:2rem;--kb-nav-link-margin-bottom:3rem;--kb-nav-link-margin-left:4rem;'
			. '--kb-nav-link-highlight-padding-top:1px;--kb-nav-link-highlight-padding-right:2px;--kb-nav-link-highlight-padding-bottom:3px;--kb-nav-link-highlight-padding-left:4px;'
			. '--kb-nav-link-highlight-gap:4em;--kb-nav-link-media-max-width:120px;--kb-nav-link-media-intrinsic-padding-bottom:75%;'
			. '--kb-nav-link-media-intrinsic-height:0px;--kb-nav-link-media-intrinsic-width:300px;}'
			. '@media all and (max-width: 1024px){' . $wrap . '{--kb-nav-link-highlight-gap:5em;}}'
			. '@media all and (max-width: 767px){' . $wrap . '{--kb-nav-link-highlight-gap:6em;}}'
			. $base . '.kb-menu-has-image .link-media-container{background:transparent;}'
			. $base . ' .link-media-container .kadence-navigation-link-image-intrinsic{position:relative;}'
			. $overlay . '{position:absolute;background-color:var(--kb-nav-link-media-container-background, transparent);opacity:0.5;pointer-events:none;}'
			. $base . ' .kb-link-wrap:hover .kb-nav-link-image-overlay{background-color:var(--kb-nav-link-media-container-background-hover, var(--kb-nav-link-media-container-background, transparent));}'
			. $base . ' .kb-link-wrap:active .kb-nav-link-image-overlay{background-color:var(--kb-nav-link-media-container-background-active, var(--kb-nav-link-media-container-background-hover, var(--kb-nav-link-media-container-background, transparent)));}'
			. $base . '.current-menu-item .kb-nav-link-image-overlay{background-color:var(--kb-nav-link-media-container-background-active, var(--kb-nav-link-media-container-background, transparent));}'
			. $base . ' > .kb-link-wrap.kb-link-wrap.kb-link-wrap > .kb-nav-link-content{font-size:18px;}'
			. $base . ' .link-highlight-label .link-highlight-icon-wrap svg{height:20px;width:20px;}'
			. $base . ' > .kb-link-wrap > .kb-nav-link-content{cursor:default;}';

		$css = $this->without_warnings_result(
			function () use ( $attributes ) {
				return ( new Kadence_Blocks_Navigation_Link_Css( $this->recording_context() ) )->build( $attributes, new Kadence_Blocks_CSS(), 'abc', 'busy' );
			}
		);

		$this->assertSameCss( $expected, (string) $css );
	}

	/**
	 * Run code that is allowed warnings and return what it returns.
	 *
	 * @param callable $code The code to run.
	 *
	 * @return mixed
	 */
	private function without_warnings_result( callable $code ) {
		$result = null;

		$this->without_warnings(
			static function () use ( $code, &$result ) {
				$result = $code();
			}
		);

		return $result;
	}
}
