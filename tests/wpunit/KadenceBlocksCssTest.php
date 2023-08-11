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
		$this->assertArrayHasKey( 'wp_enqueue_scripts', $GLOBALS['wp_filter'] );
		$this->assertIsInt( has_action( 'wp_enqueue_scripts', array( $this->css, 'frontend_block_css' ) ) );
	}
}
