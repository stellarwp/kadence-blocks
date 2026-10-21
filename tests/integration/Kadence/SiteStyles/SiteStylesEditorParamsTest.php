<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\App;
use KadenceWP\KadenceBlocks\Editor_Assets;
use KadenceWP\KadenceBlocks\Site_Styles\Editor_Params;

/**
 * Covers the FSE mode flag and the supported blocks the editor scripts receive.
 */
final class SiteStylesEditorParamsTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testBothEditorScriptsGetTheFlagAsABoolean(): void {
		$this->tester->enable_fse_mode();

		$this->assertTrue( $this->site_styles( Editor_Params::EARLY_FILTERS_HANDLE )['isFseMode'] );
		$this->assertTrue( $this->site_styles( Editor_Params::PLUGIN_HANDLE )['isFseMode'] );
	}

	/**
	 * In FSE mode the editor scripts get the supported blocks, and Single Button's, Spacer's, Show More's, Section's, Row Layout's,
	 * Count Up's and Info Box's entries match the fixtures the JS tests read.
	 *
	 * @return void
	 */
	public function testFseModeGivesTheSupportedBlocksAsTheJsTestsSeeThem(): void {
		$this->tester->enable_fse_mode();
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/singlebtn-entry.json' );
		$this->assertIsString( $json );

		$blocks = $this->site_styles( Editor_Params::EARLY_FILTERS_HANDLE )['blocks'];

		$this->assertEqualsCanonicalizing( [ 'kadence/advancedbtn', 'kadence/singlebtn', 'kadence/icon', 'kadence/single-icon', 'kadence/spacer', 'kadence/show-more', 'kadence/column', 'kadence/rowlayout', 'kadence/countup', 'kadence/infobox' ], array_keys( $blocks ) );
		$this->assertEquals( json_decode( $json, true ), $blocks['kadence/singlebtn'] );

		$spacer = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/spacer-entry.json' );
		$this->assertIsString( $spacer );
		$this->assertEquals( json_decode( $spacer, true ), $blocks['kadence/spacer'] );

		$show_more = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/show-more-entry.json' );
		$this->assertIsString( $show_more );
		$this->assertEquals( json_decode( $show_more, true ), $blocks['kadence/show-more'] );

		$section = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/column-entry.json' );
		$this->assertIsString( $section );
		$this->assertEquals( json_decode( $section, true ), $blocks['kadence/column'] );

		$row = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/rowlayout-entry.json' );
		$this->assertIsString( $row );
		$this->assertEquals( json_decode( $row, true ), $blocks['kadence/rowlayout'] );

		$count_up = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/countup-entry.json' );
		$this->assertIsString( $count_up );
		$this->assertEquals( json_decode( $count_up, true ), $blocks['kadence/countup'] );

		$info_box = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/infobox-entry.json' );
		$this->assertIsString( $info_box );
		$this->assertEquals( json_decode( $info_box, true ), $blocks['kadence/infobox'] );
	}

	public function testClassicModeGivesFalseAndNoBlocks(): void {
		$this->assertStringContainsString( 'window.kadenceSiteStyles = window.kadenceSiteStyles || {"isFseMode":false,"blocks":{}};', $this->script_data( Editor_Params::EARLY_FILTERS_HANDLE ) );
	}

	/**
	 * The editor params carry the FSE mode flag and the names of the supported blocks.
	 *
	 * @return void
	 */
	public function testTheEditorParamsCarryTheFlag(): void {
		$this->tester->enable_fse_mode();
		wp_register_script( 'kadence-blocks-js', false, [], null, false );

		Editor_Assets::get_instance()->editor_assets_variables();

		$data = wp_scripts()->get_data( 'kadence-blocks-js', 'data' );
		wp_deregister_script( 'kadence-blocks-js' );

		$this->assertIsString( $data );
		$this->assertSame( 1, preg_match( '/var kadence_blocks_params = (\{[^\n]*\});/', $data, $matches ) );
		$params = json_decode( $matches[1], true );

		// wp_localize_script() turns booleans into strings, like every flag in kadence_blocks_params.
		$this->assertSame( '1', $params['isFseMode'] );
		$this->assertEqualsCanonicalizing( [ 'kadence/advancedbtn', 'kadence/singlebtn', 'kadence/icon', 'kadence/single-icon', 'kadence/spacer', 'kadence/show-more', 'kadence/column', 'kadence/rowlayout', 'kadence/countup', 'kadence/infobox' ], $params['siteStylesBlocks'] );
	}

	/**
	 * @param string $handle Script handle.
	 *
	 * @return array<string, mixed> The decoded `window.kadenceSiteStyles` added before the script.
	 */
	private function site_styles( string $handle ): array {
		$this->assertSame( 1, preg_match( '/window\.kadenceSiteStyles = window\.kadenceSiteStyles \|\| (\{.*\});/', $this->script_data( $handle ), $matches ) );
		$data = json_decode( $matches[1], true );
		$this->assertIsArray( $data );

		return $data;
	}

	/**
	 * @param string $handle Script handle.
	 *
	 * @return string The inline script added before the script.
	 */
	private function script_data( string $handle ): string {
		foreach ( [ Editor_Params::PLUGIN_HANDLE, Editor_Params::EARLY_FILTERS_HANDLE ] as $registered ) {
			wp_register_script( $registered, false, [], null, true );
		}

		App::instance()->container()->get( Editor_Params::class )->add_script_data();

		$before = wp_scripts()->get_data( $handle, 'before' );

		foreach ( [ Editor_Params::PLUGIN_HANDLE, Editor_Params::EARLY_FILTERS_HANDLE ] as $registered ) {
			wp_deregister_script( $registered );
		}

		$this->assertIsArray( $before );

		return implode( "\n", $before );
	}
}
