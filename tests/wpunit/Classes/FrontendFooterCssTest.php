<?php

namespace Tests\wpunit\Classes;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Footer_CSS;
use Tests\wpunit\KadenceBlocksTestCase;

class FrontendFooterCssTest extends KadenceBlocksTestCase {

	protected function setUp(): void {
		parent::setUp();
		Kadence_Blocks_CSS::$styles        = [];
		Kadence_Blocks_CSS::$head_styles   = [];
		Kadence_Blocks_CSS::$custom_styles = [];
		Kadence_Blocks_Footer_CSS::get_instance()->capture_head_custom_styles();
	}

	protected function tearDown(): void {
		Kadence_Blocks_CSS::$styles        = [];
		Kadence_Blocks_CSS::$head_styles   = [];
		Kadence_Blocks_CSS::$custom_styles = [];
		Kadence_Blocks_Footer_CSS::get_instance()->capture_head_custom_styles();
		wp_deregister_style( 'kadence_blocks_footer_css' );
		wp_deregister_style( 'kadence_blocks_footer_custom_css' );
		remove_all_filters( 'kadence_blocks_render_footer_css' );
		parent::tearDown();
	}

	/**
	 * Body-rendered block CSS (collected after the head print) is flushed to the
	 * footer, while CSS already printed in the head is not duplicated.
	 */
	public function test_footer_outputs_only_post_head_delta() {
		add_filter( 'kadence_blocks_render_footer_css', '__return_true' );

		Kadence_Blocks_CSS::$head_styles = [ 'kb-advancedbtnHEAD' => '.kb-head{color:red}' ];
		Kadence_Blocks_CSS::$styles      = [
			'kb-advancedbtnHEAD' => '.kb-head{color:red}',
			'kb-advancedbtnBODY' => '.kb-body{background:blue}',
		];

		ob_start();
		Kadence_Blocks_Footer_CSS::get_instance()->render_footer_block_css();
		$output = ob_get_clean();

		$this->assertStringContainsString( '.kb-body{background:blue}', $output, 'Body-rendered block CSS is flushed to the footer.' );
		$this->assertStringNotContainsString( '.kb-head{color:red}', $output, 'Head-captured CSS is not duplicated in the footer.' );
	}

	/**
	 * Body-rendered block Custom CSS (collected after the head print) is flushed
	 * to the footer, while Custom CSS already printed in the head is not duplicated.
	 */
	public function test_footer_outputs_custom_css_post_head_delta() {
		add_filter( 'kadence_blocks_render_footer_css', '__return_true' );

		Kadence_Blocks_CSS::$custom_styles = [ 'kb-customHEAD' => '.kb-custom-head{margin:0}' ];
		Kadence_Blocks_Footer_CSS::get_instance()->capture_head_custom_styles();

		Kadence_Blocks_CSS::$custom_styles['kb-customBODY'] = '.kb-custom-body{padding:10px}';

		ob_start();
		Kadence_Blocks_Footer_CSS::get_instance()->render_footer_block_css();
		$output = ob_get_clean();

		$this->assertStringContainsString( '.kb-custom-body{padding:10px}', $output, 'Body-rendered Custom CSS is flushed to the footer.' );
		$this->assertStringNotContainsString( '.kb-custom-head{margin:0}', $output, 'Head-captured Custom CSS is not duplicated in the footer.' );
	}

	/**
	 * When footer rendering is disabled (the classic-theme default), nothing is printed.
	 */
	public function test_footer_outputs_nothing_when_disabled() {
		add_filter( 'kadence_blocks_render_footer_css', '__return_false' );

		Kadence_Blocks_CSS::$styles        = [ 'kb-advancedbtnBODY' => '.kb-body{background:blue}' ];
		Kadence_Blocks_CSS::$custom_styles = [ 'kb-customBODY' => '.kb-custom-body{padding:10px}' ];

		ob_start();
		Kadence_Blocks_Footer_CSS::get_instance()->render_footer_block_css();
		$output = ob_get_clean();

		$this->assertSame( '', trim( $output ), 'Nothing is printed when footer rendering is disabled.' );
	}
}
