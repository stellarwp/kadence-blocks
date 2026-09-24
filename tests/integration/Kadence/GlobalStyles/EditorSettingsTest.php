<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\GlobalStyles;

use Codeception\TestCase\WPTestCase;
use KadenceWP\KadenceBlocks\Editor_Assets;

/**
 * Covers the Kadence theme settings the block editor receives: the `isKadenceT`
 * flag and the Customizer font weights. Global Styles has no replacement for
 * them, so the editor receives them in both modes.
 */
final class EditorSettingsTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testClassicKadenceSendsTheCustomizerWeights(): void {
		$params = $this->editor_params();

		// wp_localize_script() sends booleans as '1' and ''.
		$this->assertSame( '1', $params['isKadenceT'] );
		$this->assertSame( Editor_Assets::get_instance()->get_headings_weights(), $params['headingWeights'] );
		$this->assertSame( Editor_Assets::get_instance()->get_body_weights(), $params['bodyWeights'] );
		$this->assertSame( Editor_Assets::get_instance()->get_button_weights(), $params['buttonWeights'] );
	}

	public function testFseModeSendsTheCustomizerWeights(): void {
		$this->tester->enable_fse_mode();

		$params = $this->editor_params();

		$this->assertSame( '1', $params['isKadenceT'] );
		$this->assertSame( Editor_Assets::get_instance()->get_headings_weights(), $params['headingWeights'] );
		$this->assertSame( Editor_Assets::get_instance()->get_body_weights(), $params['bodyWeights'] );
		$this->assertSame( Editor_Assets::get_instance()->get_button_weights(), $params['buttonWeights'] );
	}

	/**
	 * The `kadence_blocks_params` the editor script receives.
	 *
	 * @return array<string, mixed>
	 */
	private function editor_params(): array {
		wp_register_script( 'kadence-blocks-js', false, [], null, false );

		Editor_Assets::get_instance()->editor_assets_variables();

		$data = wp_scripts()->get_data( 'kadence-blocks-js', 'data' );
		wp_deregister_script( 'kadence-blocks-js' );

		$this->assertIsString( $data );
		$this->assertSame( 1, preg_match( '/var kadence_blocks_params = (\{[^\n]*\});/', $data, $matches ) );

		return json_decode( $matches[1], true );
	}
}
