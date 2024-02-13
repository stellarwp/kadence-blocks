<?php

class KadenceBlocksCssTest extends \Codeception\Test\Unit
{
	/**
	 * @var \WpunitTester
	 */
	protected $tester;

	protected $css;

	protected function _before()
	{
		$this->css = new Kadence_Blocks_CSS();
	}

	protected function _after()
	{
	}

	public function testActionWasAdded()
	{
		$this->assertIsInt( has_action( 'wp_enqueue_scripts', array( $this->css, 'frontend_block_css' ) ) );
	}

	public function testGetSetMediaState()
	{
		$this->assertEquals( 'desktop', $this->css->get_media_state(), 'Desktop is default media state' );

		$this->css->set_media_state( 'tablet' );

		$this->assertEquals( 'tablet', $this->css->get_media_state(), 'Switching media state' );

	}

	public function testAddCssString() {
		$this->css->add_css_string( '.my-custom-css-string{color:blue}');

		$this->assertStringContainsString('.my-custom-css-string', $this->css->css_output(), 'Custom CSS strings are appended' );
	}

	public function testGetMediaQueries () {
		$this->assertEmpty( $this->css->get_media_queries( 'does-not-exist'), 'Unset media queries return an empty value' );

		$this->assertEquals( '(min-width: 1025px)', $this->css->get_media_queries( 'desktop'), 'Desktop media query returns expected value' );
		$this->assertEquals( '(max-width: 1024px)', $this->css->get_media_queries( 'tablet'), 'Tablet media query returns expected value' );
		$this->assertEquals( '(max-width: 767px)', $this->css->get_media_queries( 'mobile'), 'Mobile media query returns expected value' );

		add_filter('kadence_desktop_media_query', function() { return '(min-width: 2050px)'; } );
		add_filter('kadence_tablet_media_query', function() { return '(max-width: 999px)'; } );
		add_filter('kadence_mobile_media_query', function() { return '(max-width: 711px)'; } );

		$filtered_css = new Kadence_Blocks_CSS();
		$this->assertEquals( '(min-width: 2050px)', $filtered_css->get_media_queries( 'desktop'), 'Assert desktop media query is filterable' );
		$this->assertEquals( '(max-width: 999px)', $filtered_css->get_media_queries( 'tablet'), 'Assert tablet media query is filterable' );
		$this->assertEquals( '(max-width: 711px)', $filtered_css->get_media_queries( 'mobile'), 'Assert mobile media query is filterable' );
	}
}
