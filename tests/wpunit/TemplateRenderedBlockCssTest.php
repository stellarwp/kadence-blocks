<?php

namespace Tests\wpunit;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Google_Fonts;

/**
 * Regression tests for per-instance block CSS of blocks rendered inside block
 * templates and template parts on a block theme.
 *
 * On a block theme, core renders the whole template HTML before `wp_head()`
 * (see wp-includes/template-canvas.php), so every block render callback runs
 * before `Kadence_Blocks_CSS::frontend_block_css()` prints the collected
 * styles once during `wp_enqueue_scripts` (priority 180). `render_css()`
 * builds the per-instance CSS into the static styles store even on block
 * themes — only the mid-body inline output is gated by
 * `! wp_is_block_theme()` — so that single print delivers template-rendered
 * block CSS in the head handle `kadence_blocks_css`. These tests pin that
 * contract.
 */
final class TemplateRenderedBlockCssTest extends KadenceBlocksTestCase {

	protected function setUp(): void {
		parent::setUp();
		$this->reset_css_static_state();

		if ( ! wp_is_block_theme() ) {
			$this->markTestSkipped( 'These regression tests require a block theme.' );
		}
	}

	protected function tearDown(): void {
		$this->reset_css_static_state();
		parent::tearDown();
	}

	/**
	 * Reset the plugin's static CSS/fonts stores and the styles registry so
	 * every test starts from a clean state where no styles have been printed.
	 */
	private function reset_css_static_state(): void {
		Kadence_Blocks_CSS::$styles        = [];
		Kadence_Blocks_CSS::$head_styles   = [];
		Kadence_Blocks_CSS::$custom_styles = [];

		// Resets the collected fonts and the builder's in-progress state.
		Kadence_Blocks_CSS::get_instance()->clear();

		Kadence_Blocks_Google_Fonts::$gfonts        = [];
		Kadence_Blocks_Google_Fonts::$footer_gfonts = [];

		// The styles registry is not reset by the test framework, and these
		// tests enqueue inline CSS on it; drop it so each test gets a fresh one.
		$GLOBALS['wp_styles'] = null;
	}

	/**
	 * Serialized markup for a styled Advanced Button, as saved inside a block
	 * template part (e.g. the FSE header).
	 *
	 * @param string $btn_unique_id The single button uniqueID.
	 * @param array  $btn_attrs     Extra singlebtn attributes.
	 */
	private function template_part_button_markup( $btn_unique_id, $btn_attrs = [] ): string {
		$btn_attrs = array_merge(
			[
				'uniqueID' => $btn_unique_id,
				'text'     => 'Header CTA',
				'color'    => '#ff0000',
			],
			$btn_attrs
		);

		return '<!-- wp:kadence/advancedbtn {"uniqueID":"f4aa10-bb"} -->' .
			'<!-- wp:kadence/singlebtn ' . wp_json_encode( $btn_attrs ) . ' /-->' .
			'<!-- /wp:kadence/advancedbtn -->';
	}

	public function testCssPrintHookRunsAfterTemplateRender(): void {
		// Template HTML is rendered before `wp_head()` fires `wp_enqueue_scripts`,
		// so frontend_block_css() runs after every template block's render
		// callback. If it moves to a hook that fires earlier than template
		// render, template blocks lose their CSS.
		$this->assertSame(
			180,
			has_action( 'wp_enqueue_scripts', [ Kadence_Blocks_CSS::get_instance(), 'frontend_block_css' ] ),
			'The single CSS print stays on wp_enqueue_scripts at priority 180'
		);
	}

	public function testTemplatePartRenderBuildsCssWithoutMidBodyStyleTag(): void {
		$html = do_blocks( $this->template_part_button_markup( 'f4cc20-dd' ) );

		$this->assertStringNotContainsString(
			'<style',
			$html,
			'Block themes never get mid-body <style> tags (invariant since f8a418b7d)'
		);

		$css_class = Kadence_Blocks_CSS::get_instance();
		$this->assertTrue(
			$css_class->has_styles( 'kb-singlebtnf4cc20-dd' ),
			'Rendering on a block theme still builds per-instance CSS into the store'
		);
	}

	public function testTemplatePartBlockCssIsPrintedToHeadHandle(): void {
		// Template-canvas order: blocks render first…
		do_blocks( $this->template_part_button_markup( 'f4cc20-dd' ) );
		// …then wp_head fires wp_enqueue_scripts, which prints the collected styles.
		Kadence_Blocks_CSS::get_instance()->frontend_block_css();

		$this->assertTrue(
			wp_style_is( 'kadence_blocks_css', 'enqueued' ),
			'The head CSS handle is enqueued by frontend_block_css()'
		);

		$inline = implode( '', (array) wp_styles()->get_data( 'kadence_blocks_css', 'after' ) );
		$this->assertStringContainsString( '.kb-btnf4cc20-dd', $inline, 'The template block per-instance selector reaches the head handle' );
		// The group contains the selector more than once by design (e.g. the
		// `ul.menu` width reset), so count the styled rule itself.
		$this->assertSame(
			1,
			substr_count( $inline, '.kb-btnf4cc20-dd.kb-button{color:#ff0000' ),
			'The per-instance rule is printed exactly once'
		);
	}

	public function testRepeatedRenderOfSameInstanceAddsNoDuplicateCss(): void {
		// A template part can render the same saved block more than once
		// (e.g. header reused on a 404 template preview).
		do_blocks( $this->template_part_button_markup( 'f4cc20-dd' ) );
		$styles_after_first = Kadence_Blocks_CSS::$styles;

		$html = do_blocks( $this->template_part_button_markup( 'f4cc20-dd' ) );

		$this->assertSame(
			$styles_after_first,
			Kadence_Blocks_CSS::$styles,
			'Re-rendering the same uniqueID leaves the styles store unchanged'
		);
		$this->assertStringNotContainsString( '<style', $html );

		Kadence_Blocks_CSS::get_instance()->frontend_block_css();
		$inline = implode( '', (array) wp_styles()->get_data( 'kadence_blocks_css', 'after' ) );
		$this->assertSame(
			1,
			substr_count( $inline, '.kb-btnf4cc20-dd.kb-button{color:#ff0000' ),
			'The printed output holds one rule per unique style group'
		);
	}

	public function testTemplateRenderedBlockGoogleFontIsCollectedBeforeWpHead(): void {
		$this->assertSame( 0, did_action( 'wp_body_open' ) );

		do_blocks(
			$this->template_part_button_markup(
				'f4ee30-ff',
				[
					'typography' => [
						[
							'family' => 'Lobster',
							'google' => true,
						],
					],
				]
			)
		);

		$this->assertArrayHasKey(
			'Lobster',
			Kadence_Blocks_Google_Fonts::$gfonts,
			'Fonts of template-rendered blocks are collected into the head fonts list (font collection runs inside build_css and is not gated on block themes)'
		);
		$this->assertSame(
			[],
			Kadence_Blocks_Google_Fonts::$footer_gfonts,
			'No duplicate request is queued for the footer'
		);
	}

	public function testRenderAfterStylesPrintedBuildsCssButPrintsNothing(): void {
		// Known, accepted limitation: frontend_block_css() prints the styles
		// store only once, so a block rendered after that — REST/AJAX
		// fragments or third parties calling do_blocks() past wp_head — gets
		// no printed CSS on a block theme. Its CSS is still built into the
		// store, so a future late-print fallback has it available. If this
		// test starts failing because CSS is now printed late, that is an
		// improvement: update the assertions.
		Kadence_Blocks_CSS::get_instance()->frontend_block_css();

		$html = do_blocks( $this->template_part_button_markup( 'f40040-11' ) );

		$this->assertStringNotContainsString( '<style', $html );
		$this->assertTrue(
			Kadence_Blocks_CSS::get_instance()->has_styles( 'kb-singlebtnf40040-11' ),
			'CSS built after the styles were printed is retained in the store'
		);

		$inline = implode( '', (array) wp_styles()->get_data( 'kadence_blocks_css', 'after' ) );
		$this->assertStringNotContainsString(
			'.kb-btnf40040-11',
			$inline,
			'Nothing re-prints the store once frontend_block_css() has run'
		);
	}
}
