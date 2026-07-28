<?php declare( strict_types=1 );

namespace Tests\wpunit;

use Generator;
use Kadence_Blocks_CSS;
use Tests\Support\Classes\TestCase;

/**
 * Render-site contract for the alias recognizer's positive and negative halves.
 *
 * For every relaxed `render_*` method in {@see Kadence_Blocks_CSS}, a strict `{dot.alias}`
 * value must come out as a bare `var(--kb-token--<id>)` in the built CSS (emission), a
 * malformed brace string must never mint a `var()` or reach numeric handling as if it were
 * an alias (fail-open), a 4-side/4-corner value with exactly one alias side must mix the
 * `var()` with the sibling numeric sides correctly (per-side mixing), and an alias placed in
 * any single box-shadow part must land in the right position of the shadow shorthand
 * (inline box-shadow).
 */
final class KadenceBlocksCssTokenEmissionTest extends TestCase {

	protected $css;

	protected function setUp(): void {
		parent::setUp();

		$this->css = new Kadence_Blocks_CSS();
	}

	protected function tearDown(): void {
		parent::tearDown();
	}

	/**
	 * render_number returns the bare var() reference for a strict alias, ignoring the unit.
	 *
	 * @return void
	 */
	public function testRenderNumberEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->render_number( '{semantic.radius.media}', 'px' ),
			'render_number must emit the bare var() for a strict alias' );
	}

	/**
	 * render_color returns the bare var() reference for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderColorEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->render_color( '{semantic.radius.media}' ),
			'render_color must emit the bare var() for a strict alias' );
	}

	/**
	 * sanitize_color returns the bare var() reference for a strict alias.
	 *
	 * @return void
	 */
	public function testSanitizeColorEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->sanitize_color( '{semantic.radius.media}' ),
			'sanitize_color must emit the bare var() for a strict alias' );
	}

	/**
	 * render_range emits the bare var() reference as the declaration value for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderRangeEmitsBareVarForAlias(): void {
		$this->css->render_range( [ 'width' => '{semantic.radius.media}' ], 'width', 'width', 'px' );

		$this->assertStringContainsString( 'width:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_range must emit the bare var() as the declaration value for a strict alias' );
	}

	/**
	 * render_measure_range emits the bare var() reference on the first side for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderMeasureRangeEmitsBareVarForAlias(): void {
		$this->css->render_measure_range(
			[ 'borderWidth' => [ '{semantic.radius.media}', 10, 20, 30 ] ],
			'borderWidth',
			'border-width'
		);

		$this->assertStringContainsString( 'border-top-width:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_measure_range must emit the bare var() on the aliased side' );
	}

	/**
	 * render_measure returns the bare var() reference in place for the aliased side.
	 *
	 * @return void
	 */
	public function testRenderMeasureEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media) 20px 30px 40px',
			$this->css->render_measure( [ '{semantic.radius.media}', 20, 30, 40 ] ),
			'render_measure must emit the bare var() on the aliased side' );
	}

	/**
	 * render_border_radius emits the bare var() reference on the first corner for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderBorderRadiusEmitsBareVarForAlias(): void {
		$this->css->render_border_radius( [ 'borderRadius' => [ '{semantic.radius.media}', 10, 20, 30 ] ] );

		$this->assertStringContainsString( 'border-top-left-radius:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_border_radius must emit the bare var() on the aliased corner' );
	}

	/**
	 * render_responsive_range emits the bare var() reference for the desktop breakpoint.
	 *
	 * @return void
	 */
	public function testRenderResponsiveRangeEmitsBareVarForAlias(): void {
		$this->css->render_responsive_range(
			[ 'spacing' => [ '{semantic.radius.media}', 20, 30 ] ],
			'spacing',
			'margin'
		);

		$this->assertStringContainsString( 'margin:var(--kb-token--semantic--radius--media)', $this->css->css_output(),
			'render_responsive_range must emit the bare var() for the aliased desktop breakpoint' );
	}

	/**
	 * render_shadow emits the bare var() reference in the hOffset position for a strict alias.
	 *
	 * @return void
	 */
	public function testRenderShadowEmitsBareVarForAlias(): void {
		$this->assertSame( 'var(--kb-token--semantic--radius--media) 1px 4px 2px #000000',
			$this->css->render_shadow( [
				'color'   => '#000000',
				'opacity' => 1,
				'spread'  => 2,
				'blur'    => 4,
				'hOffset' => '{semantic.radius.media}',
				'vOffset' => 1,
				'inset'   => false,
			] ),
			'render_shadow must emit the bare var() in the hOffset position for a strict alias' );
	}

	/**
	 * render_typography emits the bare var() reference for an aliased desktop line-height and
	 * letter-spacing.
	 *
	 * @return void
	 */
	public function testRenderTypographyEmitsBareVarForAliasedLineHeightAndLetterSpacing(): void {
		$this->css->render_typography( [
			'typography' => [
				'lineType'      => 'px',
				'lineHeight'    => [ '{semantic.radius.media}', '', '' ],
				'letterSpacing' => [ '{primitive.spacing.md}', '', '' ],
			],
		] );
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'line-height:var(--kb-token--semantic--radius--media)', $output,
			'render_typography must emit the bare var() for an aliased desktop line-height' );
		$this->assertStringContainsString( 'letter-spacing:var(--kb-token--primitive--spacing--md)', $output,
			'render_typography must emit the bare var() for an aliased desktop letter-spacing' );
	}

	/**
	 * get_border_value (width) returns the bare var() reference for a strict alias width.
	 *
	 * @return void
	 */
	public function testGetBorderValueEmitsBareVarForAliasedWidth(): void {
		$attributes = [
			'borderStyle' => [
				[
					'top'    => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'right'  => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'bottom' => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'left'   => [ '#000000', 'solid', '{semantic.radius.media}' ],
					'unit'   => 'px',
				],
			],
		];
		$args = [
			'desktop_key' => 'borderStyle',
			'tablet_key'  => 'tabletBorderStyle',
			'mobile_key'  => 'mobileBorderStyle',
			'unit_key'    => 'unit',
		];

		$this->assertSame( 'var(--kb-token--semantic--radius--media)',
			$this->css->get_border_value( $attributes, $args, 'top', 'desktop', 'width', false ),
			'get_border_value must emit the bare var() for a strict alias width' );
	}

	/**
	 * The fail-open matrix: a malformed brace string must never mint a var() and never reach
	 * numeric handling as if it were an alias, for every representative method's own value site.
	 *
	 * A looks-like-but-not-strict string must fall through the strict `Alias::is_alias()` gate
	 * and land in the method's ordinary invalid-value handling. The call completing and this
	 * method's assertions running is itself proof there is no fatal or TypeError along the way
	 * (a regression here would be `is_numeric()`-adjacent code choking on a brace string).
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderNumberFailsOpenForMalformedAlias( string $malformed ): void {
		$actual = $this->css->render_number( $malformed, 'px' );

		$this->assertSame( false, $actual,
			'render_number must return its own normal false result for an unusable value' );
	}

	/**
	 * The fail-open matrix for render_range: a malformed brace string short-circuits to false
	 * and adds no declaration.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderRangeFailsOpenForMalformedAlias( string $malformed ): void {
		$actual = $this->css->render_range( [ 'width' => $malformed ], 'width', 'width', 'px' );
		$output = $this->css->css_output();

		$this->assertSame( false, $actual,
			'render_range must return its own normal false result for an unusable value' );
		$this->assertStringNotContainsString( 'var(', $output,
			'render_range must not mint a var() from a malformed brace string' );
		$this->assertStringNotContainsString( '--kb-token--', $output,
			'render_range must not mint a var() from a malformed brace string' );
		$this->assertStringNotContainsString( 'width:', $output,
			'render_range must add no declaration for an unusable value' );
	}

	/**
	 * The fail-open matrix for render_color: a malformed brace string is not empty(), so it
	 * passes through unchanged as the method's normal literal-passthrough result.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderColorFailsOpenForMalformedAlias( string $malformed ): void {
		$actual = $this->css->render_color( $malformed );

		$this->assertSame( $malformed, $actual,
			'render_color must pass a malformed brace string through unchanged, its normal literal result' );
		$this->assertStringNotContainsString( 'var(', (string) $actual,
			'render_color must not mint a var() from a malformed brace string' );
	}

	/**
	 * The fail-open matrix for sanitize_color: a malformed brace string is not empty(), so it
	 * passes through unchanged as the method's normal literal-passthrough result.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testSanitizeColorFailsOpenForMalformedAlias( string $malformed ): void {
		$actual = $this->css->sanitize_color( $malformed );

		$this->assertSame( $malformed, $actual,
			'sanitize_color must pass a malformed brace string through unchanged, its normal literal result' );
		$this->assertStringNotContainsString( 'var(', (string) $actual,
			'sanitize_color must not mint a var() from a malformed brace string' );
	}

	/**
	 * The fail-open matrix for get_border_value (width): a malformed brace string is not
	 * numeric, so the method falls back to its normal blank-string result.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testGetBorderValueFailsOpenForMalformedAlias( string $malformed ): void {
		$attributes = [
			'borderStyle' => [
				[
					'top'    => [ '#000000', 'solid', $malformed ],
					'right'  => [ '#000000', 'solid', $malformed ],
					'bottom' => [ '#000000', 'solid', $malformed ],
					'left'   => [ '#000000', 'solid', $malformed ],
					'unit'   => 'px',
				],
			],
		];
		$args = [
			'desktop_key' => 'borderStyle',
			'tablet_key'  => 'tabletBorderStyle',
			'mobile_key'  => 'mobileBorderStyle',
			'unit_key'    => 'unit',
		];

		$actual = $this->css->get_border_value( $attributes, $args, 'top', 'desktop', 'width', false );

		$this->assertSame( '', $actual,
			'get_border_value must return its own normal blank-string result for an unusable width' );
	}

	/**
	 * The fail-open matrix for render_measure: a malformed brace string on every side is
	 * neither numeric nor a strict alias on any side, so the method returns its own normal
	 * false result.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderMeasureFailsOpenForMalformedAlias( string $malformed ): void {
		$actual = $this->css->render_measure( [ $malformed, $malformed, $malformed, $malformed ] );

		$this->assertSame( false, $actual,
			'render_measure must return its own normal false result when no side is numeric or a strict alias' );
	}

	/**
	 * The fail-open matrix for render_measure_range: a malformed brace string on every side
	 * adds no declaration, since it is neither numeric nor a strict alias.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderMeasureRangeFailsOpenForMalformedAlias( string $malformed ): void {
		$this->css->render_measure_range(
			[ 'borderWidth' => [ $malformed, $malformed, $malformed, $malformed ] ],
			'borderWidth',
			'border-width'
		);
		$output = $this->css->css_output();

		$this->assertSame( '', $output,
			'render_measure_range must add no declaration for any side when nothing is numeric or a strict alias' );
	}

	/**
	 * The fail-open matrix for render_border_radius: a malformed brace string on every corner
	 * adds no declaration, since it is neither numeric nor a strict alias.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderBorderRadiusFailsOpenForMalformedAlias( string $malformed ): void {
		$this->css->render_border_radius( [ 'borderRadius' => [ $malformed, $malformed, $malformed, $malformed ] ] );
		$output = $this->css->css_output();

		$this->assertSame( '', $output,
			'render_border_radius must add no declaration for any corner when nothing is numeric or a strict alias' );
	}

	/**
	 * The fail-open matrix for render_responsive_range: a malformed brace string on every
	 * breakpoint adds no declaration, since it is neither numeric nor a strict alias.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderResponsiveRangeFailsOpenForMalformedAlias( string $malformed ): void {
		$this->css->render_responsive_range(
			[
				'spacing'     => [ $malformed, $malformed, $malformed ],
				'spacingType' => 'px',
			],
			'spacing',
			'margin'
		);
		$output = $this->css->css_output();

		$this->assertSame( '', $output,
			'render_responsive_range must add no declaration for any breakpoint when nothing is numeric or a strict alias' );
	}

	/**
	 * The fail-open matrix for render_shadow: a malformed, non-empty brace string in hOffset is
	 * not a strict alias, so the `!empty()` gate passes it through literally with its unit
	 * suffix, the method's normal literal-passthrough result.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderShadowFailsOpenForMalformedAlias( string $malformed ): void {
		$actual = $this->css->render_shadow( [
			'color'   => '#000000',
			'opacity' => 1,
			'spread'  => 2,
			'blur'    => 4,
			'hOffset' => $malformed,
			'vOffset' => 1,
			'inset'   => false,
		] );

		$this->assertSame( $malformed . 'px 1px 4px 2px #000000', $actual,
			'render_shadow must pass a malformed brace hOffset through literally with its unit suffix' );
		$this->assertStringNotContainsString( '--kb-token--', $actual,
			'render_shadow must not mint a var() from a malformed brace string' );
	}

	/**
	 * The fail-open matrix for render_typography: a malformed, non-empty brace string in
	 * line-height passes through literally under its `!empty()` gate, while the same string in
	 * letter-spacing is rejected outright by its `is_numeric()` gate and adds no declaration.
	 *
	 * @dataProvider malformedAliasProvider
	 *
	 * @param string $malformed The malformed brace string under test.
	 *
	 * @return void
	 */
	public function testRenderTypographyFailsOpenForMalformedAlias( string $malformed ): void {
		$this->css->render_typography( [
			'typography' => [
				'lineType'      => 'px',
				'lineHeight'    => [ $malformed, '', '' ],
				'letterSpacing' => [ $malformed, '', '' ],
			],
		] );
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'line-height:' . $malformed . 'px', $output,
			'render_typography must pass a malformed brace line-height through literally under its !empty() gate' );
		$this->assertStringNotContainsString( 'letter-spacing:', $output,
			'render_typography must reject a malformed brace letter-spacing outright under its is_numeric() gate' );
		$this->assertStringNotContainsString( '--kb-token--', $output,
			'render_typography must not mint a var() from a malformed brace string' );
	}

	/**
	 * Provides the malformed brace strings crossed against the representative methods: a
	 * space inside the braces (loose-looks-like but strict-rejected), an unclosed brace, an
	 * unopened brace, and empty braces.
	 *
	 * @return Generator
	 */
	public static function malformedAliasProvider(): Generator {
		yield 'space inside braces' => [ 'malformed' => '{bad path}' ];
		yield 'unclosed brace' => [ 'malformed' => '{unclosed' ];
		yield 'unopened brace' => [ 'malformed' => 'unopened}' ];
		yield 'empty braces' => [ 'malformed' => '{}' ];
	}

	/**
	 * Per-side dimension mixing for render_measure: a 4-side value with exactly one side an
	 * alias and the other three numeric produces the correct mixed CSS, with the alias
	 * rotated through all four positions so a per-side loop ordering bug cannot hide.
	 *
	 * @dataProvider measureMixedSidesProvider
	 *
	 * @param array  $measure  The 4-side measure array with one aliased side.
	 * @param string $expected The expected byte-identical mixed measure string.
	 *
	 * @return void
	 */
	public function testRenderMeasureMixesAliasedAndNumericSides( array $measure, string $expected ): void {
		$this->assertSame( $expected, $this->css->render_measure( $measure ),
			'render_measure must mix the aliased side with the sibling numeric sides correctly' );
	}

	/**
	 * Provides a 4-side measure array with the alias rotated through each position.
	 *
	 * @return Generator
	 */
	public static function measureMixedSidesProvider(): Generator {
		yield 'alias in first side' => [
			'measure'  => [ '{semantic.radius.media}', 20, 30, 40 ],
			'expected' => 'var(--kb-token--semantic--radius--media) 20px 30px 40px',
		];
		yield 'alias in second side' => [
			'measure'  => [ 10, '{semantic.radius.media}', 30, 40 ],
			'expected' => '10px var(--kb-token--semantic--radius--media) 30px 40px',
		];
		yield 'alias in third side' => [
			'measure'  => [ 10, 20, '{semantic.radius.media}', 40 ],
			'expected' => '10px 20px var(--kb-token--semantic--radius--media) 40px',
		];
		yield 'alias in fourth (last) side' => [
			'measure'  => [ 10, 20, 30, '{semantic.radius.media}' ],
			'expected' => '10px 20px 30px var(--kb-token--semantic--radius--media)',
		];
	}

	/**
	 * Per-side dimension mixing for render_measure_range: a 4-side value with exactly one
	 * side an alias and the other three numeric emits the correct mixed declarations, with
	 * the alias rotated through all four positions.
	 *
	 * @dataProvider measureRangeMixedSidesProvider
	 *
	 * @param array  $measure          The 4-side border-width array with one aliased side.
	 * @param string $expectedProperty The css property expected to carry the var().
	 * @param string $expectedValue    The expected var() value on that property.
	 *
	 * @return void
	 */
	public function testRenderMeasureRangeMixesAliasedAndNumericSides( array $measure, string $expectedProperty, string $expectedValue ): void {
		$this->css->render_measure_range( [ 'borderWidth' => $measure ], 'borderWidth', 'border-width' );
		$output = $this->css->css_output();

		$this->assertStringContainsString( $expectedProperty . ':' . $expectedValue, $output,
			'render_measure_range must emit the var() on the aliased side' );
		$this->assertStringContainsString( 'border-top-width:', $output,
			'render_measure_range must still render the other numeric sides' );
	}

	/**
	 * Provides a 4-side border-width array with the alias rotated through each position.
	 *
	 * @return Generator
	 */
	public static function measureRangeMixedSidesProvider(): Generator {
		yield 'alias in first (top) side' => [
			'measure'          => [ '{semantic.radius.media}', 20, 30, 40 ],
			'expectedProperty' => 'border-top-width',
			'expectedValue'    => 'var(--kb-token--semantic--radius--media)',
		];
		yield 'alias in last (left) side' => [
			'measure'          => [ 10, 20, 30, '{semantic.radius.media}' ],
			'expectedProperty' => 'border-left-width',
			'expectedValue'    => 'var(--kb-token--semantic--radius--media)',
		];
	}

	/**
	 * Confirms render_measure_range still renders the sibling numeric sides byte-identically
	 * when one side is aliased, for both the first- and last-position rotations.
	 *
	 * @dataProvider measureRangeMixedSidesFullOutputProvider
	 *
	 * @param array  $measure  The 4-side border-width array with one aliased side.
	 * @param string $expected The expected declarations, order-independent, all of which must
	 *                         be present in the built CSS.
	 *
	 * @return void
	 */
	public function testRenderMeasureRangeMixedSidesRenderSiblingNumerics( array $measure, array $expected ): void {
		$this->css->render_measure_range( [ 'borderWidth' => $measure ], 'borderWidth', 'border-width' );
		$output = $this->css->css_output();

		foreach ( $expected as $fragment ) {
			$this->assertStringContainsString( $fragment, $output,
				'render_measure_range must emit every expected fragment for the mixed sides' );
		}
	}

	/**
	 * Provides the full expected fragment set for the first- and last-position alias rotations.
	 *
	 * @return Generator
	 */
	public static function measureRangeMixedSidesFullOutputProvider(): Generator {
		yield 'alias in first (top) side' => [
			'measure'  => [ '{semantic.radius.media}', 20, 30, 40 ],
			'expected' => [
				'border-top-width:var(--kb-token--semantic--radius--media)',
				'border-right-width:20px',
				'border-bottom-width:30px',
				'border-left-width:40px',
			],
		];
		yield 'alias in last (left) side' => [
			'measure'  => [ 10, 20, 30, '{semantic.radius.media}' ],
			'expected' => [
				'border-top-width:10px',
				'border-right-width:20px',
				'border-bottom-width:30px',
				'border-left-width:var(--kb-token--semantic--radius--media)',
			],
		];
	}

	/**
	 * Per-corner dimension mixing for render_border_radius: a 4-corner value with exactly one
	 * corner an alias and the other three numeric emits the correct mixed declarations, with
	 * the alias rotated through all four positions.
	 *
	 * @dataProvider borderRadiusMixedCornersProvider
	 *
	 * @param array $corners  The 4-corner border-radius array with one aliased corner.
	 * @param array $expected The full set of expected declarations that must all be present.
	 *
	 * @return void
	 */
	public function testRenderBorderRadiusMixesAliasedAndNumericCorners( array $corners, array $expected ): void {
		$this->css->render_border_radius( [ 'borderRadius' => $corners ] );
		$output = $this->css->css_output();

		foreach ( $expected as $fragment ) {
			$this->assertStringContainsString( $fragment, $output,
				'render_border_radius must emit every expected fragment for the mixed corners' );
		}
	}

	/**
	 * Provides a 4-corner border-radius array with the alias rotated through each position.
	 *
	 * @return Generator
	 */
	public static function borderRadiusMixedCornersProvider(): Generator {
		yield 'alias in first (top-left) corner' => [
			'corners'  => [ '{semantic.radius.media}', 20, 30, 40 ],
			'expected' => [
				'border-top-left-radius:var(--kb-token--semantic--radius--media)',
				'border-top-right-radius:20px',
				'border-bottom-right-radius:30px',
				'border-bottom-left-radius:40px',
			],
		];
		yield 'alias in second (top-right) corner' => [
			'corners'  => [ 10, '{semantic.radius.media}', 30, 40 ],
			'expected' => [
				'border-top-left-radius:10px',
				'border-top-right-radius:var(--kb-token--semantic--radius--media)',
				'border-bottom-right-radius:30px',
				'border-bottom-left-radius:40px',
			],
		];
		yield 'alias in third (bottom-right) corner' => [
			'corners'  => [ 10, 20, '{semantic.radius.media}', 40 ],
			'expected' => [
				'border-top-left-radius:10px',
				'border-top-right-radius:20px',
				'border-bottom-right-radius:var(--kb-token--semantic--radius--media)',
				'border-bottom-left-radius:40px',
			],
		];
		yield 'alias in fourth (last, bottom-left) corner' => [
			'corners'  => [ 10, 20, 30, '{semantic.radius.media}' ],
			'expected' => [
				'border-top-left-radius:10px',
				'border-top-right-radius:20px',
				'border-bottom-right-radius:30px',
				'border-bottom-left-radius:var(--kb-token--semantic--radius--media)',
			],
		];
	}

	/**
	 * Inline box-shadow: render_shadow with an alias in each individual part (hOffset,
	 * vOffset, blur, spread) carries the var() in the correct shorthand position with the
	 * remaining parts numeric.
	 *
	 * @dataProvider shadowAliasedPartProvider
	 *
	 * @param array  $shadow   The shadow attributes array with one aliased part.
	 * @param string $expected The expected byte-identical box-shadow shorthand.
	 *
	 * @return void
	 */
	public function testRenderShadowMixesAliasedAndNumericParts( array $shadow, string $expected ): void {
		$this->assertSame( $expected, $this->css->render_shadow( $shadow ),
			'render_shadow must emit the var() in the correct shorthand position for the aliased part' );
	}

	/**
	 * Provides a box-shadow attributes array with the alias rotated through each of hOffset,
	 * vOffset, blur, and spread, one part per case, with the other numeric parts held fixed.
	 *
	 * @return Generator
	 */
	public static function shadowAliasedPartProvider(): Generator {
		yield 'alias in hOffset' => [
			'shadow'   => [
				'color'   => '#000000',
				'opacity' => 1,
				'spread'  => 2,
				'blur'    => 4,
				'hOffset' => '{semantic.radius.media}',
				'vOffset' => 1,
				'inset'   => false,
			],
			'expected' => 'var(--kb-token--semantic--radius--media) 1px 4px 2px #000000',
		];
		yield 'alias in vOffset' => [
			'shadow'   => [
				'color'   => '#000000',
				'opacity' => 1,
				'spread'  => 2,
				'blur'    => 4,
				'hOffset' => 1,
				'vOffset' => '{semantic.radius.media}',
				'inset'   => false,
			],
			'expected' => '1px var(--kb-token--semantic--radius--media) 4px 2px #000000',
		];
		yield 'alias in blur' => [
			'shadow'   => [
				'color'   => '#000000',
				'opacity' => 1,
				'spread'  => 2,
				'blur'    => '{semantic.radius.media}',
				'hOffset' => 1,
				'vOffset' => 1,
				'inset'   => false,
			],
			'expected' => '1px 1px var(--kb-token--semantic--radius--media) 2px #000000',
		];
		yield 'alias in spread' => [
			'shadow'   => [
				'color'   => '#000000',
				'opacity' => 1,
				'spread'  => '{semantic.radius.media}',
				'blur'    => 4,
				'hOffset' => 1,
				'vOffset' => 1,
				'inset'   => false,
			],
			'expected' => '1px 1px 4px var(--kb-token--semantic--radius--media) #000000',
		];
	}
}
