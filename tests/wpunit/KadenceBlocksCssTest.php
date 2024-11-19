<?php

namespace Tests\wpunit;

use Codeception\TestCase\WPTestCase;
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

	protected function _before() {
		$this->css = new Kadence_Blocks_CSS();
	}

	protected function _after() {
	}
}
