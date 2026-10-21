<?php

declare( strict_types=1 );

// cspell:ignore columncol idrow

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use Generator;
use Kadence_Blocks_CSS;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Site_Styles\Site_Rules;
use WP_HTML_Tag_Processor;

/**
 * Covers the instance CSS and markup of Row Layouts with site-level styles: untouched rows take the site
 * values, a row's own values keep their whole group, and rows saved with older attributes keep them.
 */
final class SiteStylesRowLayoutTest extends WPTestCase {
	protected \IntegrationTester $tester;

	/**
	 * Without site values, a row's CSS in FSE mode is the same as in classic mode.
	 *
	 * @dataProvider rowProvider
	 *
	 * @param array<string, mixed> $attributes The row's own attributes.
	 *
	 * @return void
	 */
	public function testWithoutSiteValuesTheCssMatchesClassicMode( array $attributes ): void {
		$classic = $this->row_css( $attributes );
		$this->tester->enable_fse_mode();

		$this->assertSame( $classic, $this->row_css( $attributes ) );
	}

	/**
	 * An untouched row takes every site value: the margin, the padding and max width on each device, both
	 * gaps, the border on each device, the radius, the shadow, the background and the text and link colors.
	 *
	 * @return void
	 */
	public function testAnUntouchedRowTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->row_css( [] );

		$this->assertStringContainsString( '.kb-row-layout-wrap.wp-block-kadence-rowlayout.kb-row-layout-idrow_test{margin-bottom:3em;}', $css );
		$this->assertStringContainsString( 'column-gap:3rem;row-gap:5px;max-width:900px;margin-left:auto;margin-right:auto;padding-top:2vw;padding-bottom:2vw;', $css );
		$this->assertStringContainsString( 'max-width:600px;margin-left:auto;margin-right:auto;padding-top:1vw;padding-bottom:1vw;', $this->media( $css, '(max-width: 1024px)' ) );
		$this->assertStringContainsString( 'border-top-left-radius:6px;border-top-right-radius:6px;border-bottom-right-radius:6px;border-bottom-left-radius:6px;overflow:clip;isolation:isolate;', $css );
		$this->assertStringContainsString( '.kb-row-layout-idrow_test > .kt-row-layout-overlay{border-top-left-radius:6px;', $css );
		$this->assertStringContainsString( '.kb-row-layout-idrow_test{box-shadow:0px 0px 14px 0px rgba(0, 0, 0, 0.2);border-top:3px dashed #ff00ff;', $css );
		$this->assertStringContainsString( 'border-top:3px dashed #0000ff;', $this->media( $css, '(max-width: 1024px)' ) );
		$this->assertStringContainsString( '.kb-row-layout-idrow_test{background-color:#ff0000;}', $css );
		$this->assertStringContainsString( '.kb-row-layout-idrow_test h6{color:#123456;}', $css );
		$this->assertStringContainsString( '.kb-row-layout-idrow_test a{color:#00aa00;}', $css );
		$this->assertStringContainsString( '.kb-row-layout-idrow_test a:hover{color:#aa0000;}', $css );
	}

	/**
	 * A site background color gives an untouched row the class for rows with a background, as the row's own
	 * background color does, and classic mode ignores it.
	 *
	 * @return void
	 */
	public function testASiteBackgroundMarksAnUntouchedRowAsHavingABackground(): void {
		$this->store_site_values();

		$this->assertFalse( $this->has_background_class( $this->row_html( [] ) ) );

		$this->tester->enable_fse_mode();

		$this->assertTrue( $this->has_background_class( $this->row_html( [] ) ) );
	}

	/**
	 * A gradient row takes the site background color's class, as an untouched row does, but its gradient
	 * paints the background, so the site color never prints for it.
	 *
	 * @return void
	 */
	public function testAGradientRowTakesTheBackgroundClassButNotTheSiteColor(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$gradient = [
			'backgroundSettingTab' => 'gradient',
			'gradient'             => 'linear-gradient(180deg,#000000 0%,#ffffff 100%)',
		];

		$css = $this->row_css( $gradient );

		$this->assertStringContainsString( 'background-image:linear-gradient(180deg,#000000 0%,#ffffff 100%)', $css );
		$this->assertStringNotContainsString( 'background-color:#ff0000', $css );
		$this->assertTrue( $this->has_background_class( $this->row_html( $gradient ) ) );
	}

	/**
	 * A row with its own overlay but no background color takes the site background color under the overlay,
	 * which keeps its own color.
	 *
	 * @return void
	 */
	public function testASiteBackgroundPaintsUnderARowsOwnOverlay(): void {
		$overlay = [ 'overlay' => '#000000' ];
		$classic = $this->overlay_colors( $this->row_css( $overlay ) );

		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$css = $this->row_css( $overlay );

		$this->assertStringContainsString( '.kb-row-layout-idrow_test{background-color:#ff0000;}', $css );
		$this->assertSame( $classic, $this->overlay_colors( $css ) );
		$this->assertStringContainsString( '#000000', $classic );
	}

	/**
	 * A row with its own padding keeps its own unit and takes no site tablet padding, while the groups it
	 * doesn't set still take the site values.
	 *
	 * @return void
	 */
	public function testAnOwnPaddingKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->row_css( [ 'padding' => [ 20, '', 20, '' ] ] );

		$this->assertStringContainsString( 'padding-top:20px', $css );
		$this->assertStringNotContainsString( 'vw', $css );
		$this->assertStringContainsString( 'column-gap:3rem', $css );
		$this->assertStringContainsString( 'background-color:#ff0000', $css );
	}

	/**
	 * A row with its own column gutter keeps its own gutter and unit, and still takes the site row gutter.
	 *
	 * @return void
	 */
	public function testAnOwnGutterKeepsItsWholeGroup(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->row_css(
			[
				'columnGutter' => 'custom',
				'customGutter' => [ 50, '', '' ],
			]
		);

		$this->assertStringContainsString( 'column-gap:50px', $css );
		$this->assertStringNotContainsString( '3rem', $css );
		$this->assertStringContainsString( 'row-gap:5px', $css );
	}

	/**
	 * A row saved with older padding, margin or border attributes renders them instead of the arrays, so its
	 * group takes none of the site values: its CSS stays as it was.
	 *
	 * @dataProvider olderAttributeProvider
	 *
	 * @param array<string, mixed> $attributes The row's older attributes.
	 * @param array<string, mixed> $site       Site values for the group they stand in for.
	 *
	 * @return void
	 */
	public function testOlderAttributesKeepTheirGroup( array $attributes, array $site ): void {
		$expected = $this->row_css( $attributes );
		$this->tester->enable_fse_mode();
		$this->store_site_values( $site, false );

		$this->assertSame( $expected, $this->row_css( $attributes ) );
	}

	/**
	 * A row saved before row versions keeps its saved markup, and takes the site values on it.
	 *
	 * @return void
	 */
	public function testARowWithoutAVersionKeepsItsMarkupAndTakesTheSiteValues(): void {
		$markup = $this->row_markup( [ 'kbVersion' => '' ], '<div class="kt-row-layout-inner" id="kt-layout-idrow_test"><div class="kt-row-column-wrap">%s</div></div>' );
		$this->store_site_values();
		$classic = $this->html_without_styles( $markup );

		$this->tester->enable_fse_mode();
		$css = $this->tester->rendered_block_css( $markup, 'rowlayout' );

		$this->assertStringContainsString( '#kt-layout-idrow_test{background-color:#ff0000;}', $css );
		$this->assertStringContainsString( 'padding-top:2vw', $css );
		$this->assertSame( $classic, $this->html_without_styles( $markup ) );
	}

	/**
	 * Custom column widths are computed with the site column gap.
	 *
	 * @return void
	 */
	public function testCustomColumnWidthsUseTheSiteGap(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$css = $this->row_css(
			[
				'firstColumnWidth'  => 30,
				'secondColumnWidth' => 70,
			]
		);

		$this->assertStringContainsString( 'grid-template-columns:minmax(0, calc(30% - ((3rem * 1 )/2)))minmax(0, calc(70% - ((3rem * 1 )/2)))', $css );
	}

	/**
	 * Site values reach a nested row, which keeps the groups it sets itself, and a row in a template part.
	 *
	 * @return void
	 */
	public function testNestedAndTemplatePartRowsTakeTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$inner  = $this->row_markup(
			[
				'uniqueID' => 'row_inner',
				'padding'  => [ 20, '', 20, '' ],
			]
		);
		$nested = $this->tester->rendered_block_css( $this->row_markup( [], '%s', $inner ), 'rowlayout' );

		$this->assertStringContainsString( '.kb-row-layout-idrow_test{background-color:#ff0000;}', $nested );
		$this->assertStringContainsString( '.kb-row-layout-idrow_inner{background-color:#ff0000;}', $nested );
		$this->assertStringContainsString( 'padding-top:20px', $nested );

		$part = $this->tester->rendered_block_css( '<!-- wp:template-part {"slug":"row-part"} /-->', 'rowlayout', [ 'row-part' => $this->row_markup( [] ) ] );

		$this->assertStringContainsString( '.kb-row-layout-idrow_test{background-color:#ff0000;}', $part );
	}

	/**
	 * Stored structure, layout and legacy settings are never applied: they belong to each row.
	 *
	 * @return void
	 */
	public function testStoredLayoutSettingsAreIgnored(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$css  = $this->row_css( [] );
		$html = $this->row_html( [] );

		$this->store_site_values(
			[
				'kbVersion'         => 1,
				'columns'           => 3,
				'colLayout'         => 'left-golden',
				'verticalAlignment' => 'middle',
				'minHeight'         => 400,
				'inheritMaxWidth'   => true,
				'bgColorClass'      => 'theme-palette1',
				'topPadding'        => 99,
				'kadenceBlockCSS'   => 'selector { color: red; }',
			]
		);

		$this->assertSame( $css, $this->row_css( [] ) );
		$this->assertSame( $html, $this->row_html( [] ) );
	}

	/**
	 * In classic mode, stored site values change nothing.
	 *
	 * @return void
	 */
	public function testClassicModeIgnoresTheSiteValues(): void {
		$untouched = $this->row_css( [] );
		$this->store_site_values();

		$this->assertSame( $untouched, $this->row_css( [] ) );
	}

	/**
	 * The CSS built in the page head reads raw attributes, and an untouched row takes the site values there.
	 *
	 * @return void
	 */
	public function testTheHeadPassTakesTheSiteValues(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$attributes = apply_filters(
			'kadence_blocks_rowlayout_render_block_attributes',
			[
				'uniqueID'  => 'row_test',
				'kbVersion' => 2,
			]
		);

		$this->assertSame( [ 2, '', 2, '' ], $attributes['padding'] );
		$this->assertSame( 'vw', $attributes['paddingUnit'] );
		$this->assertSame( '#ff0000', $attributes['bgColor'] );
	}

	/**
	 * Each older attribute keeps the group it stands in for whole in the page head, where attributes are raw:
	 * none of that group's site values come back, while the others still do.
	 *
	 * @dataProvider olderAttributeNameProvider
	 *
	 * @param string   $name  The older attribute.
	 * @param mixed    $value A value it holds.
	 * @param string[] $group The site values of the group it stands in for.
	 *
	 * @return void
	 */
	public function testTheHeadPassKeepsEachOlderAttributesGroupWhole( string $name, $value, array $group ): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();

		$attributes = apply_filters(
			'kadence_blocks_rowlayout_render_block_attributes',
			[
				'uniqueID'  => 'row_test',
				'kbVersion' => 2,
				$name       => $value,
			]
		);

		foreach ( $group as $site ) {
			$this->assertArrayNotHasKey( $site, $attributes );
		}
		$this->assertSame( '#ff0000', $attributes['bgColor'] );
	}

	/**
	 * The site rules print nothing for Row Layout, since every site value goes through the overlay.
	 *
	 * @return void
	 */
	public function testTheSiteRulesPrintNothing(): void {
		$this->tester->enable_fse_mode();
		$this->store_site_values();
		$this->row_css( [] );

		$this->assertSame( '', App::instance()->container()->get( Site_Rules::class )->css( 'kadence/rowlayout' ) );
	}

	/**
	 * @return Generator
	 */
	public function rowProvider(): Generator {
		yield 'untouched' => [ 'attributes' => [] ];
		yield 'own padding' => [ 'attributes' => [ 'padding' => [ 20, '', 20, '' ] ] ];
		yield 'own gutter' => [
			'attributes' => [
				'columnGutter' => 'custom',
				'customGutter' => [ 50, '', '' ],
			],
		];
		yield 'older padding number' => [ 'attributes' => [ 'bottomPadding' => 10 ] ];
		yield 'older tablet margin' => [ 'attributes' => [ 'bottomMarginT' => 10 ] ];
		yield 'older border' => [
			'attributes' => [
				'border'      => '#00ffff',
				'borderWidth' => [ 1, 1, 1, 1 ],
			],
		];
		yield 'custom widths' => [
			'attributes' => [
				'firstColumnWidth'  => 30,
				'secondColumnWidth' => 70,
			],
		];
		yield 'without a version' => [ 'attributes' => [ 'kbVersion' => '' ] ];
	}

	/**
	 * @return Generator
	 */
	public function olderAttributeProvider(): Generator {
		$padding = [
			'padding'       => [ 2, '', 2, '' ],
			'tabletPadding' => [ 1, '', 1, '' ],
			'paddingUnit'   => 'vw',
		];
		$margin  = [
			'margin'     => [ 4, '', 3, '' ],
			'marginUnit' => 'em',
		];
		$border  = [
			'borderStyle'       => [ self::site_border( '#ff00ff' ) ],
			'tabletBorderStyle' => [ self::site_border( '#0000ff' ) ],
		];

		yield 'top padding' => [
			'attributes' => [ 'topPadding' => 10 ],
			'site'       => $padding,
		];
		yield 'bottom padding alone' => [
			'attributes' => [ 'bottomPadding' => 10 ],
			'site'       => $padding,
		];
		yield 'mobile padding' => [
			'attributes' => [ 'rightPaddingM' => 10 ],
			'site'       => $padding,
		];
		yield 'top margin' => [
			'attributes' => [ 'topMargin' => 10 ],
			'site'       => $margin,
		];
		yield 'tablet margin' => [
			'attributes' => [ 'bottomMarginT' => 10 ],
			'site'       => $margin,
		];
		yield 'mobile margin' => [
			'attributes' => [ 'topMarginM' => 10 ],
			'site'       => $margin,
		];
		yield 'border and width' => [
			'attributes' => [
				'border'      => '#00ffff',
				'borderWidth' => [ 1, 1, 1, 1 ],
			],
			'site'       => $border,
		];
		yield 'tablet border width' => [
			'attributes' => [ 'tabletBorderWidth' => [ 2, 2, 2, 2 ] ],
			'site'       => $border,
		];
		yield 'mobile border color' => [
			'attributes' => [ 'mobileBorder' => '#00ffff' ],
			'site'       => $border,
		];
	}

	/**
	 * @return Generator
	 */
	public function olderAttributeNameProvider(): Generator {
		$padding = [ 'padding', 'tabletPadding', 'paddingUnit' ];
		$margin  = [ 'margin', 'marginUnit' ];
		$border  = [ 'borderStyle', 'tabletBorderStyle' ];

		foreach ( [ 'topPadding', 'rightPadding', 'bottomPadding', 'leftPadding', 'topPaddingM', 'rightPaddingM', 'bottomPaddingM', 'leftPaddingM' ] as $name ) {
			yield $name => [
				'name'  => $name,
				'value' => 10,
				'group' => $padding,
			];
		}
		foreach ( [ 'topMargin', 'bottomMargin', 'topMarginT', 'bottomMarginT', 'topMarginM', 'bottomMarginM' ] as $name ) {
			yield $name => [
				'name'  => $name,
				'value' => 10,
				'group' => $margin,
			];
		}
		foreach ( [ 'border', 'tabletBorder', 'mobileBorder' ] as $name ) {
			yield $name => [
				'name'  => $name,
				'value' => '#00ffff',
				'group' => $border,
			];
		}
		foreach ( [ 'borderWidth', 'tabletBorderWidth', 'mobileBorderWidth' ] as $name ) {
			yield $name => [
				'name'  => $name,
				'value' => [ 2, '', '', '' ],
				'group' => $border,
			];
		}
	}

	/**
	 * A site border of 3px dashed on every side, in the shape the border control stores.
	 *
	 * @param string $color The border color.
	 *
	 * @return array<string, mixed> The border.
	 */
	private static function site_border( string $color ): array {
		$side = [ $color, 'dashed', 3 ];

		return [
			'top'    => $side,
			'right'  => $side,
			'bottom' => $side,
			'left'   => $side,
			'unit'   => 'px',
		];
	}

	/**
	 * Stores site values for every Row Layout group plus the colors, or only the given values.
	 *
	 * @param array<string, mixed> $values      Site values to add, or to store on their own.
	 * @param bool                 $with_others Whether to store the values for every group as well.
	 *
	 * @return void
	 */
	private function store_site_values( array $values = [], bool $with_others = true ): void {
		$others = [
			'padding'            => [ 2, '', 2, '' ],
			'tabletPadding'      => [ 1, '', 1, '' ],
			'paddingUnit'        => 'vw',
			'margin'             => [ '', '', 3, '' ],
			'marginUnit'         => 'em',
			'columnGutter'       => 'custom',
			'customGutter'       => [ 3, '', '' ],
			'gutterType'         => 'rem',
			'collapseGutter'     => 'custom',
			'customRowGutter'    => [ 5, '', '' ],
			'rowGutterType'      => 'px',
			'maxWidth'           => 900,
			'responsiveMaxWidth' => [ 600, '' ],
			'maxWidthUnit'       => 'px',
			'borderStyle'        => [ self::site_border( '#ff00ff' ) ],
			'tabletBorderStyle'  => [ self::site_border( '#0000ff' ) ],
			'borderRadius'       => [ 6, 6, 6, 6 ],
			'displayBoxShadow'   => true,
			'bgColor'            => '#ff0000',
			'textColor'          => '#123456',
			'linkColor'          => '#00aa00',
			'linkHoverColor'     => '#aa0000',
		];

		$this->tester->store_user_global_styles(
			[
				'settings' => [
					'custom' => [
						'kadence' => [
							'rowlayout' => $with_others ? array_merge( $others, $values ) : $values,
						],
					],
				],
			]
		);
	}

	/**
	 * The markup of a row saved by the current editor, around one Section.
	 *
	 * @param array<string, mixed> $attributes The row's own attributes.
	 * @param string               $wrapper    The row's saved markup around its inner blocks, with `%s` for them.
	 * @param string               $inner      Extra inner blocks after the Section.
	 *
	 * @return string The markup.
	 */
	private function row_markup( array $attributes, string $wrapper = '%s', string $inner = '' ): string {
		$attributes = array_merge(
			[
				'uniqueID'  => 'row_test',
				'kbVersion' => 2,
			],
			$attributes
		);
		$section    = '<!-- wp:kadence/column {"uniqueID":"col_in"} --><div class="wp-block-kadence-column kadence-columncol_in"><div class="kt-inside-inner-col"></div></div><!-- /wp:kadence/column -->';

		return sprintf(
			'<!-- wp:kadence/rowlayout %s -->%s<!-- /wp:kadence/rowlayout -->',
			wp_json_encode( $attributes ),
			sprintf( $wrapper, $section . $inner )
		);
	}

	/**
	 * Renders a row and returns its instance CSS.
	 *
	 * @param array<string, mixed> $attributes The row's own attributes.
	 *
	 * @return string The CSS.
	 */
	private function row_css( array $attributes ): string {
		return $this->tester->rendered_block_css( $this->row_markup( $attributes ), 'rowlayout' );
	}

	/**
	 * Renders a row and returns its markup.
	 *
	 * @param array<string, mixed> $attributes The row's own attributes.
	 *
	 * @return string The markup, without the style tags.
	 */
	private function row_html( array $attributes ): string {
		return $this->html_without_styles( $this->row_markup( $attributes ) );
	}

	/**
	 * Renders block markup and returns the HTML without the style tags the blocks print inline.
	 *
	 * @param string $markup The block markup.
	 *
	 * @return string The HTML.
	 */
	private function html_without_styles( string $markup ): string {
		Kadence_Blocks_CSS::$styles = [];

		return (string) preg_replace( '/<style[^>]*>.*?<\/style>/s', '', do_blocks( $markup ) );
	}

	/**
	 * Whether the row's wrapper has the class for rows with a background.
	 *
	 * @param string $html The row's markup.
	 *
	 * @return bool
	 */
	private function has_background_class( string $html ): bool {
		$tags = new WP_HTML_Tag_Processor( $html );

		return $tags->next_tag( [ 'class_name' => 'kb-row-layout-wrap' ] ) && $tags->has_class( 'kt-row-has-bg' );
	}

	/**
	 * The color declarations of the row's overlay layer.
	 *
	 * @param string $css The CSS.
	 *
	 * @return string The declarations, in order.
	 */
	private function overlay_colors( string $css ): string {
		preg_match_all( '/\\.kb-row-layout-idrow_test > \\.kt-row-layout-overlay\\{([^}]*)\\}/', $css, $rules );
		preg_match_all( '/(?:background[^:;]*|opacity|mix-blend-mode):[^;]*;/', implode( '', $rules[1] ), $declarations );

		return implode( '', $declarations[0] );
	}

	/**
	 * Everything inside one media query.
	 *
	 * @param string $css   The CSS.
	 * @param string $query The media query, e.g. `(max-width: 1024px)`.
	 *
	 * @return string The rules inside every block for that query.
	 */
	private function media( string $css, string $query ): string {
		preg_match_all( '/@media all and ' . preg_quote( $query, '/' ) . '\{((?:[^{}]+\{[^}]*\})*)\}/', $css, $blocks );

		return implode( '', $blocks[1] );
	}
}
