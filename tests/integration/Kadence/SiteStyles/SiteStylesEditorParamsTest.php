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

	public function testFseModeGivesTheSupportedBlocksAsTheJsTestsSeeThem(): void {
		$this->tester->enable_fse_mode();
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/singlebtn-entry.json' );
		$this->assertIsString( $json );

		$blocks = $this->site_styles( Editor_Params::EARLY_FILTERS_HANDLE )['blocks'];

		$this->assertSame( [ 'kadence/singlebtn' ], array_keys( $blocks ) );
		$this->assertEquals( json_decode( $json, true ), $blocks['kadence/singlebtn'] );
	}

	public function testClassicModeGivesFalseAndNoBlocks(): void {
		$this->assertStringContainsString( 'window.kadenceSiteStyles = window.kadenceSiteStyles || {"isFseMode":false,"blocks":{}};', $this->script_data( Editor_Params::EARLY_FILTERS_HANDLE ) );
	}

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
		$this->assertSame( [ 'kadence/singlebtn' ], $params['siteStylesBlocks'] );
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
