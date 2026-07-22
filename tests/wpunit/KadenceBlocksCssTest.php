<?php

namespace Tests\wpunit;

use Codeception\TestCase\WPTestCase;
use Generator;
use Kadence_Blocks_CSS;

class KadenceBlocksCssTest extends WPTestCase {

	protected $css;

	public function testActionWasAdded() {
		$this->assertIsInt( has_action( 'wp_enqueue_scripts', [ $this->css, 'frontend_block_css' ] ) );
	}

	public function testGetSetMediaState() {
		$this->assertEquals( 'desktop', $this->css->get_media_state(), 'Desktop is default media state' );

		$this->css->set_media_state( 'tablet' );

		$this->assertEquals( 'tablet', $this->css->get_media_state(), 'Switching media state' );
	}

	public function testAddCssString() {
		$this->css->add_css_string( '.my-custom-css-string{color:blue}' );

		$this->assertStringContainsString( '.my-custom-css-string', $this->css->css_output(),
			'Custom CSS strings are appended' );
	}

	public function testGetMediaQueries() {
		$this->assertEmpty( $this->css->get_media_queries( 'does-not-exist' ),
			'Unset media queries return an empty value' );

		$this->assertEquals( '(min-width: 1025px)', $this->css->get_media_queries( 'desktop' ),
			'Desktop media query returns expected value' );
		$this->assertEquals( '(max-width: 1024px)', $this->css->get_media_queries( 'tablet' ),
			'Tablet media query returns expected value' );
		$this->assertEquals( '(max-width: 767px)', $this->css->get_media_queries( 'mobile' ),
			'Mobile media query returns expected value' );

		add_filter( 'kadence_desktop_media_query', function () {
			return '(min-width: 2050px)';
		} );
		add_filter( 'kadence_tablet_media_query', function () {
			return '(max-width: 999px)';
		} );
		add_filter( 'kadence_mobile_media_query', function () {
			return '(max-width: 711px)';
		} );

		$filtered_css = new Kadence_Blocks_CSS();
		$this->assertEquals( '(min-width: 2050px)', $filtered_css->get_media_queries( 'desktop' ),
			'Assert desktop media query is filterable' );
		$this->assertEquals( '(max-width: 999px)', $filtered_css->get_media_queries( 'tablet' ),
			'Assert tablet media query is filterable' );
		$this->assertEquals( '(max-width: 711px)', $filtered_css->get_media_queries( 'mobile' ),
			'Assert mobile media query is filterable' );
	}


	public function testRenderColor() {
		// Test empty color
		$this->assertFalse(
			$this->css->render_color(''),
			'Empty color should return false'
		);
		$this->assertFalse(
			$this->css->render_color(null),
			'Null color should return false'
		);

		// Test basic colors
		$this->assertEquals(
			'#123456',
			$this->css->render_color('#123456'),
			'Basic hex color should remain unchanged'
		);

		// Test transparent value
		$this->assertEquals(
			'transparent',
			$this->css->render_color('transparent'),
			'Transparent value should remain unchanged'
		);

		// Test all palette colors
		$palette_tests = [
			['palette1', '#3182CE'], // Default case
			['palette2', '#2B6CB0'],
			['palette3', '#1A202C'],
			['palette4', '#2D3748'],
			['palette5', '#4A5568'],
			['palette6', '#718096'],
			['palette7', '#EDF2F7'],
			['palette8', '#F7FAFC'],
			['palette9', '#ffffff'],
		];

		foreach ($palette_tests as [$palette, $fallback]) {
			$this->assertEquals(
				'var(--global-' . $palette . ', ' . $fallback . ')',
				$this->css->render_color($palette),
				$palette . ' should return correct variable with fallback'
			);
		}

		// Test opacity with various values
		$opacity_tests = [
			['#123456', 0, 'rgba(18, 52, 86, 0)'],
			['#123456', 0.5, 'rgba(18, 52, 86, 0.5)'],
			['#123456', 1, '#123456'], // Should not convert to rgba when opacity is 1
			['#123456', '0.7', 'rgba(18, 52, 86, 0.7)'],
			['#123456', 'invalid', '#123456'], // Non-numeric opacity should be ignored
		];

		foreach ($opacity_tests as [$color, $opacity, $expected]) {
			$this->assertEquals(
				$expected,
				$this->css->render_color($color, $opacity),
				"Color with opacity {$opacity} should return correct format"
			);
		}

		// Test array input
		$this->assertEquals(
			['color' => '#123456'],
			$this->css->render_color(['color' => '#123456']),
			'Array input should remain unchanged'
		);

		// Test with non-palette string starting with "palette"
		$this->assertStringContainsString(
			'--global-palette-custom',
			$this->css->render_color('palette-custom'),
			'Non-palette string starting with "palette" should remain unchanged'
		);

		// Test invalid palette number
		$this->assertEquals(
			'var(--global-palette99, #3182CE)',
			$this->css->render_color('palette99'),
			'Invalid palette number should return default fallback'
		);

		// Test edge cases for opacity
		$edge_opacity_tests = [
			['#123456', null, '#123456'], // Null opacity should be ignored
			['#123456', '', '#123456'],   // Empty string opacity should be ignored
			['#123456', '1', '#123456'],  // String "1" should be treated as 1
			['#123456', 1.0, '#123456'],  // Float 1.0 should be treated as 1
		];

		foreach ($edge_opacity_tests as [$color, $opacity, $expected]) {
			$this->assertEquals(
				$expected,
				$this->css->render_color($color, $opacity),
				"Color with edge case opacity {$opacity} should be handled correctly"
			);
		}

		// Test with various hex color formats
		$hex_tests = [
			['#fff', 0.5, 'rgba(255, 255, 255, 0.5)'], // 3-digit hex
			['#ffffff', 0.5, 'rgba(255, 255, 255, 0.5)'], // 6-digit hex
			['fff', 0.5, 'rgba(255, 255, 255, 0.5)'], // Without hash
			['ffffff', 0.5, 'rgba(255, 255, 255, 0.5)'], // Without hash
		];

		foreach ($hex_tests as [$color, $opacity, $expected]) {
			$this->assertEquals(
				$expected,
				$this->css->render_color($color, $opacity),
				"Different hex formats should be handled correctly"
			);
		}
	}

	public function testRenderResponsiveRange() {
		$attributes = [
			'spacing' => [10, 20, 30],
			'spacingType' => 'px'
		];

		// Test desktop
		$this->css->render_responsive_range($attributes, 'spacing', 'margin');
		$this->assertStringContainsString(
			'margin:10px',
			$this->css->css_output(),
			'Desktop spacing should be applied'
		);

		// Test tablet
		$this->css->set_media_state('tablet');
		$this->css->render_responsive_range($attributes, 'spacing', 'margin');
		$this->assertStringContainsString(
			'margin:20px',
			$this->css->css_output(),
			'Tablet spacing should be applied'
		);

		// Test mobile
		$this->css->set_media_state('mobile');
		$this->css->render_responsive_range($attributes, 'spacing', 'margin');
		$this->assertStringContainsString(
			'margin:30px',
			$this->css->css_output(),
			'Mobile spacing should be applied'
		);
	}

	public function testRenderMeasure() {
		// Test valid measure array with padding
		$this->css->set_selector('.test-element');
		$this->css->render_measure_output(
			['padding' => [10, 20, 30, 40]],
			'padding',
			'padding'
		);

		$output = $this->css->css_output();
		$this->assertStringContainsString(
			'padding-top:10px',
			$output,
			'Top padding should be applied correctly'
		);
		$this->assertStringContainsString(
			'padding-right:20px',
			$output,
			'Right padding should be applied correctly'
		);
		$this->assertStringContainsString(
			'padding-bottom:30px',
			$output,
			'Bottom padding should be applied correctly'
		);
		$this->assertStringContainsString(
			'padding-left:40px',
			$output,
			'Left padding should be applied correctly'
		);


		// Test incomplete measure array
		$this->css->set_selector('.test-element');
		$this->css->render_measure_output(
			['padding' => [10]],
			'padding',
			'padding'
		);

		$output = $this->css->css_output();
		$this->assertStringContainsString(
			'padding-top:10px',
			$output,
			'Single value should be applied to top padding'
		);
		$this->assertStringNotContainsString(
			'padding-right:0px',
			$output,
			'Missing right value should default to 0'
		);
		$this->assertStringNotContainsString(
			'padding-bottom:0px',
			$output,
			'Missing bottom value should default to 0'
		);
		$this->assertStringNotContainsString(
			'padding-left:0px',
			$output,
			'Missing left value should default to 0'
		);

		// Test with different units
		$this->css->set_selector('.test-element');
		$this->css->render_measure_output(
			[
				'margin' => [10, 20, 30, 40],
				'marginType' => 'rem'
			],
			'margin',
			'margin'
		);

		$output = $this->css->css_output();
		$this->assertStringContainsString(
			'margin-top:10rem',
			$output,
			'Top margin should use rem unit'
		);
		$this->assertStringContainsString(
			'margin-right:20rem',
			$output,
			'Right margin should use rem unit'
		);
		$this->assertStringContainsString(
			'margin-bottom:30rem',
			$output,
			'Bottom margin should use rem unit'
		);
		$this->assertStringContainsString(
			'margin-left:40rem',
			$output,
			'Left margin should use rem unit'
		);


		// Test with variable values
		$this->css->set_selector('.test-element');
		$this->css->render_measure_output(
			[
				'padding' => ['xxs', 'xs', 'sm', 'md'],
			],
			'padding',
			'padding'
		);

		$output = $this->css->css_output();
		$this->assertStringContainsString(
			'padding-top:var(--global-kb-spacing-xxs, 0.5rem)',
			$output,
			'Variable padding value should be correctly applied to top'
		);
		$this->assertStringContainsString(
			'padding-right:var(--global-kb-spacing-xs, 1rem)',
			$output,
			'Variable padding value should be correctly applied to right'
		);
		$this->assertStringContainsString(
			'padding-bottom:var(--global-kb-spacing-sm, 1.5rem)',
			$output,
			'Variable padding value should be correctly applied to bottom'
		);
		$this->assertStringContainsString(
			'padding-left:var(--global-kb-spacing-md, 2rem)',
			$output,
			'Variable padding value should be correctly applied to left'
		);
	}

	public function testRenderBorderStyles() {
		$attributes = [
			'borderStyle' => [
				[
					'top' => ['#000000', 'solid', 1],
					'right' => ['#000000', 'solid', 1],
					'bottom' => ['#000000', 'solid', 1],
					'left' => ['#000000', 'solid', 1],
					'unit' => 'px'
				]
			]
		];

		$this->css->render_border_styles($attributes);
		$output = $this->css->css_output();

		$this->assertStringContainsString('border-top:1px solid #000000', $output);
		$this->assertStringContainsString('border-right:1px solid #000000', $output);
		$this->assertStringContainsString('border-bottom:1px solid #000000', $output);
		$this->assertStringContainsString('border-left:1px solid #000000', $output);
	}

	public function testRenderShadow() {
		$shadow = [
			'color' => '#000000',
			'opacity' => 0.5,
			'spread' => 2,
			'blur' => 4,
			'hOffset' => 1,
			'vOffset' => 1,
			'inset' => false
		];

		$this->assertEquals(
			'1px 1px 4px 2px rgba(0, 0, 0, 0.5)',
			$this->css->render_shadow($shadow),
			'Should render proper box shadow string'
		);

		// Test inset shadow
		$shadow['inset'] = true;
		$this->assertEquals(
			'inset 1px 1px 4px 2px rgba(0, 0, 0, 0.5)',
			$this->css->render_shadow($shadow),
			'Should render proper inset box shadow string'
		);
	}

	public function testRenderGap() {
		// Test with empty attributes
		$result = $this->css->render_gap([], 'gap', 'gap', 'gapUnit');
		$this->assertFalse($result, 'Should return false when attributes are empty.');

		// Test with non-array attributes
		$result = $this->css->render_gap('not-an-array', 'gap', 'gap', 'gapUnit');
		$this->assertFalse($result, 'Should return false when attributes is not an array.');

		// Test with valid attributes and default unit
		$attributes = [
			'gap' => [10, 20, 30],
		];
		$this->css->render_gap($attributes, 'gap', 'gap', 'gapUnit');

		$output = $this->css->css_output();
		$this->assertStringContainsString('10px', $output, 'Should contain the correct gap for desktop.');
		$this->assertStringContainsString('20px', $output, 'Should contain the correct gap for tablet.');
		$this->assertStringContainsString('30px', $output, 'Should contain the correct gap for mobile.');

		// Test with a different unit
		$attributes = [
			'gap' => [10, 20, 30],
			'gapUnit' => 'em',
		];
		$this->css->render_gap($attributes, 'gap', 'gap', 'gapUnit');

		$output = $this->css->css_output();
		$this->assertStringContainsString('10em', $output, 'Should contain the correct gap for desktop with unit.');
		$this->assertStringContainsString('20em', $output, 'Should contain the correct gap for tablet with unit.');
		$this->assertStringContainsString('30em', $output, 'Should contain the correct gap for mobile with unit.');

		// Test with args overriding the default name
		$attributes = [
			'customGap' => [15, 25, 35],
		];
		$args = [
			'desktop_key' => 'customGap',
			'tablet_key'  => 'customGap',
			'mobile_key'  => 'customGap',
		];
		$this->css->render_gap($attributes, 'gap', 'gap', 'gapUnit', $args);

		$output = $this->css->css_output();
		$this->assertStringContainsString('15px', $output, 'Should contain the correct gap for desktop using custom key.');
		$this->assertStringContainsString('25px', $output, 'Should contain the correct gap for tablet using custom key.');
		$this->assertStringContainsString('35px', $output, 'Should contain the correct gap for mobile using custom key.');

		// Test with missing middle value
		$attributes = [
			'gap' => [10, '', 30],
			'gapUnit' => 'rem',
		];
		$this->css->render_gap($attributes, 'gap', 'gap', 'gapUnit');

		$output = $this->css->css_output();
		$this->assertStringContainsString('10rem', $output, 'Should contain the correct gap for desktop with unit.');
		$this->assertStringContainsString('30rem', $output, 'Should contain the correct gap for mobile with unit.');
		$this->assertStringNotContainsString('20rem', $output, 'Should not contain a gap for tablet when it is empty.');

		// Test with attributes that are not arrays (e.g., direct values for keys)
		$attributes = [
			'desktopGap' => '15',
			'tabletGap'  => '25',
			'mobileGap'  => '35',
			'gapUnit'    => 'px',
		];
		$args = [
			'desktop_key' => 'desktopGap',
			'tablet_key'  => 'tabletGap',
			'mobile_key'  => 'mobileGap',
		];
		$this->css->render_gap($attributes, 'gap', 'gap', 'gapUnit', $args);

		$output = $this->css->css_output();
		$this->assertStringContainsString('15px', $output, 'Should contain the correct gap for desktop from individual attributes.');
		$this->assertStringContainsString('25px', $output, 'Should contain the correct gap for tablet from individual attributes.');
		$this->assertStringContainsString('35px', $output, 'Should contain the correct gap for mobile from individual attributes.');
	}

	public function testInheritedValues() {
		// Test desktop value inheritance
		$result = $this->css->get_inherited_value('desktop', 'tablet', 'mobile', 'Desktop');
		$this->assertEquals('desktop', $result, 'Desktop should return desktop value');

		// Test tablet value inheritance
		$result = $this->css->get_inherited_value('desktop', 'tablet', 'mobile', 'Tablet');
		$this->assertEquals('tablet', $result, 'Tablet should return tablet value');

		// Test mobile value inheritance with empty mobile value
		$result = $this->css->get_inherited_value('desktop', 'tablet', '', 'Mobile');
		$this->assertEquals('tablet', $result, 'Mobile should inherit from tablet when mobile is empty');

		// Test mobile value inheritance with empty tablet and mobile values
		$result = $this->css->get_inherited_value('desktop', '', '', 'Mobile');
		$this->assertEquals('desktop', $result, 'Mobile should inherit from desktop when tablet and mobile are empty');
	}

	public function testMediaQueries() {
		// Test desktop media query
		$this->assertEquals(
			'(min-width: 1025px)',
			$this->css->get_media_queries('desktop'),
			'Desktop media query should match expected value'
		);

		// Test tablet media query
		$this->assertEquals(
			'(max-width: 1024px)',
			$this->css->get_media_queries('tablet'),
			'Tablet media query should match expected value'
		);

		// Test mobile media query
		$this->assertEquals(
			'(max-width: 767px)',
			$this->css->get_media_queries('mobile'),
			'Mobile media query should match expected value'
		);
	}

	/**
	 * A strict {dot.alias} value resolves to a bare var(--kb-token--<id>) with no
	 * fallback literal, and every non-alias value (including a malformed brace-string)
	 * returns null so the caller falls through to its existing numeric/palette handling.
	 *
	 * @dataProvider tokenReferenceProvider
	 *
	 * @param mixed       $value    The raw attribute value.
	 * @param string|null $expected The expected resolved reference, or null.
	 *
	 * @return void
	 */
	public function testGetTokenReference( $value, ?string $expected ): void {
		$this->assertSame( $expected, $this->css->get_token_reference( $value ),
			'Alias recognizer must match the JS resolveTokenAlias output byte-for-byte' );

		if ( null !== $expected ) {
			$this->assertStringNotContainsString( ',', $expected,
				'A resolved token reference is a bare var() with no fallback literal' );
		}
	}

	/**
	 * Provides alias and non-alias values for the recognizer, mirroring the shared
	 * token-alias conformance cases the JS side asserts.
	 *
	 * @return Generator
	 */
	public static function tokenReferenceProvider(): Generator {
		yield 'semantic radius alias' => [
			'value'    => '{semantic.radius.media}',
			'expected' => 'var(--kb-token--semantic--radius--media)',
		];
		yield 'single segment alias' => [
			'value'    => '{a}',
			'expected' => 'var(--kb-token--a)',
		];
		yield 'namespaced path alias' => [
			'value'    => '{dark.primitive.color.brand.primary}',
			'expected' => 'var(--kb-token--dark--primitive--color--brand--primary)',
		];
		yield 'palette slug is not an alias' => [
			'value'    => 'palette1',
			'expected' => null,
		];
		yield 'hex is not an alias' => [
			'value'    => '#3182CE',
			'expected' => null,
		];
		yield 'literal shorthand is not an alias' => [
			'value'    => '1px solid red',
			'expected' => null,
		];
		yield 'partial interpolation is not an alias' => [
			'value'    => '1px solid {semantic.color.brand}',
			'expected' => null,
		];
		yield 'malformed alias with a space fails open' => [
			'value'    => '{bad path}',
			'expected' => null,
		];
		yield 'unclosed brace fails open' => [
			'value'    => '{unclosed',
			'expected' => null,
		];
		yield 'empty braces fail open' => [
			'value'    => '{}',
			'expected' => null,
		];
		yield 'pixel literal is not an alias' => [
			'value'    => '16px',
			'expected' => null,
		];
		yield 'bare number string is not an alias' => [
			'value'    => '10',
			'expected' => null,
		];
		yield 'empty string is not an alias' => [
			'value'    => '',
			'expected' => null,
		];
		yield 'integer is not an alias' => [
			'value'    => 10,
			'expected' => null,
		];
		yield 'null is not an alias' => [
			'value'    => null,
			'expected' => null,
		];
		yield 'array is not an alias' => [
			'value'    => [ '{semantic.radius.media}' ],
			'expected' => null,
		];
	}

	/**
	 * render_color emits the token var for an alias, leaves a malformed brace-string
	 * untouched (fail open), and renders literals and palette slugs exactly as before.
	 *
	 * @return void
	 */
	public function testRenderColorResolvesTokenAlias(): void {
		$this->assertSame(
			'var(--kb-token--dark--primitive--color--brand--primary)',
			$this->css->render_color( '{dark.primitive.color.brand.primary}' ),
			'A color alias resolves to the bare token var'
		);
		$this->assertSame(
			'var(--kb-token--dark--primitive--color--brand--primary)',
			$this->css->sanitize_color( '{dark.primitive.color.brand.primary}' ),
			'sanitize_color resolves a color alias the same way'
		);
		$this->assertSame(
			'{bad path}',
			$this->css->render_color( '{bad path}' ),
			'A malformed alias fails open and is left untouched'
		);
		$this->assertSame(
			'#123456',
			$this->css->render_color( '#123456' ),
			'A literal hex color is unchanged'
		);
		$this->assertSame(
			'var(--global-palette1, #3182CE)',
			$this->css->render_color( 'palette1' ),
			'A palette slug still resolves to the global palette var'
		);
	}

	/**
	 * render_border_radius emits a token var (with no unit) for an aliased corner,
	 * emits nothing for a malformed alias, and keeps numeric corners byte-identical.
	 *
	 * @return void
	 */
	public function testRenderBorderRadiusResolvesTokenAlias(): void {
		$this->css->render_border_radius( [ 'borderRadius' => [ '{semantic.radius.media}', 10, '{bad path}', '' ] ] );
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'border-top-left-radius:var(--kb-token--semantic--radius--media)', $output,
			'An aliased corner emits the token var with no unit' );
		$this->assertStringContainsString( 'border-top-right-radius:10px', $output,
			'A numeric corner is still rendered with its unit' );
		$this->assertStringNotContainsString( 'border-bottom-right-radius', $output,
			'A malformed alias corner fails open and emits nothing' );
	}

	/**
	 * render_measure_range (border-width) emits a token var without a unit for an
	 * aliased side while leaving numeric sides unchanged.
	 *
	 * @return void
	 */
	public function testRenderMeasureRangeResolvesTokenAlias(): void {
		$this->css->render_measure_range(
			[ 'borderWidth' => [ '{semantic.border.width}', 2, 2, 2 ] ],
			'borderWidth',
			'border-width'
		);
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'border-top-width:var(--kb-token--semantic--border--width)', $output,
			'An aliased side emits the token var with no unit' );
		$this->assertStringContainsString( 'border-right-width:2px', $output,
			'A numeric side is still rendered with its unit' );
	}

	/**
	 * render_range emits a token var without a unit for an aliased value and keeps a
	 * numeric value byte-identical.
	 *
	 * @return void
	 */
	public function testRenderRangeResolvesTokenAlias(): void {
		$this->css->render_range( [ 'width' => '{semantic.size.width}' ], 'width', 'width' );
		$this->assertStringContainsString( 'width:var(--kb-token--semantic--size--width)', $this->css->css_output(),
			'An aliased range value emits the token var with no unit' );

		$numeric = new Kadence_Blocks_CSS();
		$numeric->render_range( [ 'width' => 10 ], 'width', 'width' );
		$this->assertStringContainsString( 'width:10px', $numeric->css_output(),
			'A numeric range value is still rendered with its unit' );
	}

	/**
	 * render_responsive_range emits a token var per breakpoint for aliased values and
	 * keeps numeric breakpoints byte-identical.
	 *
	 * @return void
	 */
	public function testRenderResponsiveRangeResolvesTokenAlias(): void {
		$this->css->render_responsive_range(
			[ 'spacing' => [ '{semantic.space.md}', 20, '{semantic.space.sm}' ], 'spacingType' => 'px' ],
			'spacing',
			'margin'
		);
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'margin:var(--kb-token--semantic--space--md)', $output,
			'An aliased desktop value emits the token var with no unit' );
		$this->assertStringContainsString( 'margin:20px', $output,
			'A numeric tablet value is still rendered with its unit' );
		$this->assertStringContainsString( 'margin:var(--kb-token--semantic--space--sm)', $output,
			'An aliased mobile value emits the token var with no unit' );
	}

	/**
	 * render_responsive_size resolves an aliased value to the token var without a unit
	 * even though its gate is an empty-string check rather than is_numeric.
	 *
	 * @return void
	 */
	public function testRenderResponsiveSizeResolvesTokenAlias(): void {
		$this->css->render_responsive_size(
			[ 'width' => '{semantic.size.width}', 'tabletWidth' => '20', 'mobileWidth' => '' ],
			[ 'width', 'tabletWidth', 'mobileWidth' ],
			'width'
		);
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'width:var(--kb-token--semantic--size--width)', $output,
			'An aliased desktop value emits the token var with no unit' );
		$this->assertStringContainsString( 'width:20px', $output,
			'A literal tablet value is still rendered with its unit' );
	}

	/**
	 * render_measure resolves an aliased side to the token var (no unit) within the
	 * shorthand while numeric sides keep their unit.
	 *
	 * @return void
	 */
	public function testRenderMeasureResolvesTokenAlias(): void {
		$this->assertSame(
			'var(--kb-token--semantic--space--md) 20px 0px 40px',
			$this->css->render_measure( [ '{semantic.space.md}', 20, '', 40 ] ),
			'An aliased side is a bare var and non-numeric siblings fall back to 0 with the unit'
		);
		$this->assertSame(
			'10px 20px 30px 40px',
			$this->css->render_measure( [ 10, 20, 30, 40 ] ),
			'A fully numeric measure is byte-identical to the pre-alias output'
		);
	}

	/**
	 * render_number returns the token var for an alias, keeps numeric values unchanged,
	 * and returns false for a malformed brace-string.
	 *
	 * @return void
	 */
	public function testRenderNumberResolvesTokenAlias(): void {
		$this->assertSame(
			'var(--kb-token--semantic--size--icon)',
			$this->css->render_number( '{semantic.size.icon}', 'px' ),
			'An alias returns the bare token var with no unit'
		);
		$this->assertSame(
			'10px',
			$this->css->render_number( 10, 'px' ),
			'A numeric value is still rendered with its unit'
		);
		$this->assertFalse(
			$this->css->render_number( '{bad path}', 'px' ),
			'A malformed alias fails open and returns false'
		);
	}

	/**
	 * render_shadow resolves an aliased offset to the token var while numeric pieces
	 * keep their unit, and a fully numeric shadow stays byte-identical.
	 *
	 * @return void
	 */
	public function testRenderShadowResolvesTokenAlias(): void {
		$this->assertSame(
			'var(--kb-token--semantic--shadow--x) 1px 4px 2px rgba(0, 0, 0, 0.5)',
			$this->css->render_shadow( [
				'color'   => '#000000',
				'opacity' => 0.5,
				'spread'  => 2,
				'blur'    => 4,
				'hOffset' => '{semantic.shadow.x}',
				'vOffset' => 1,
				'inset'   => false,
			] ),
			'An aliased offset is a bare var while numeric pieces keep their px unit'
		);
		$this->assertSame(
			'1px 1px 4px 2px rgba(0, 0, 0, 0.5)',
			$this->css->render_shadow( [
				'color'   => '#000000',
				'opacity' => 0.5,
				'spread'  => 2,
				'blur'    => 4,
				'hOffset' => 1,
				'vOffset' => 1,
				'inset'   => false,
			] ),
			'A fully numeric shadow is byte-identical to the pre-alias output'
		);
	}

	/**
	 * render_border_styles emits a token var for an aliased width so the width branch
	 * still fires, while numeric widths remain byte-identical.
	 *
	 * @return void
	 */
	public function testRenderBorderStylesResolvesTokenWidth(): void {
		$this->css->render_border_styles( [
			'borderStyle' => [
				[
					'top'    => [ '#000000', 'solid', '{semantic.border.width}' ],
					'right'  => [ '#000000', 'solid', 1 ],
					'bottom' => [ '#000000', 'solid', 1 ],
					'left'   => [ '#000000', 'solid', 1 ],
					'unit'   => 'px',
				],
			],
		] );
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'border-top:var(--kb-token--semantic--border--width) solid #000000', $output,
			'An aliased width resolves to the token var and the width branch still fires' );
		$this->assertStringContainsString( 'border-right:1px solid #000000', $output,
			'A numeric width is still rendered with its unit' );
	}

	/**
	 * render_typography resolves aliased line-height and letter-spacing values to token
	 * vars (no unit), and keeps numeric typography values byte-identical.
	 *
	 * @return void
	 */
	public function testRenderTypographyResolvesTokenAlias(): void {
		$this->css->render_typography( [
			'typography' => [
				'lineHeight'    => [ '{semantic.line-height.tight}', '', '' ],
				'letterSpacing' => [ '{semantic.letter-spacing.wide}', '', '' ],
			],
		] );
		$output = $this->css->css_output();

		$this->assertStringContainsString( 'line-height:var(--kb-token--semantic--line-height--tight)', $output,
			'An aliased line-height resolves to the token var with no unit' );
		$this->assertStringContainsString( 'letter-spacing:var(--kb-token--semantic--letter-spacing--wide)', $output,
			'An aliased letter-spacing resolves to the token var with no unit' );

		$numeric = new Kadence_Blocks_CSS();
		$numeric->render_typography( [
			'typography' => [
				'lineType'      => 'px',
				'lineHeight'    => [ 1.5, '', '' ],
				'letterSpacing' => [ 2, '', '' ],
			],
		] );
		$numeric_output = $numeric->css_output();

		$this->assertStringContainsString( 'line-height:1.5px', $numeric_output,
			'A numeric line-height is still rendered with its unit' );
		$this->assertStringContainsString( 'letter-spacing:2px', $numeric_output,
			'A numeric letter-spacing is still rendered with its unit' );
	}

	protected function _before() {
		$this->css = new Kadence_Blocks_CSS();
	}

	protected function _after() {
	}
}
