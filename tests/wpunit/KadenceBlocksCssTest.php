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

	protected function _before() {
		$this->css = new Kadence_Blocks_CSS();
	}

	protected function _after() {
	}
}
