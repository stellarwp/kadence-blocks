<?php

namespace Tests\wpunit\Classes;

use KadenceWP\KadenceBlocks\Editor_Assets;
use Tests\wpunit\KadenceBlocksTestCase;

/**
 * Ensures the block-editor `proData` bundle never exposes raw license credentials.
 *
 * Regression test for the Contributor+ Sensitive Information Exposure where
 * `kadence_blocks_params.proData` leaked key/api_key/email/api_email/domain to
 * any user who could open the block editor.
 */
class EditorAssetsProDataTest extends KadenceBlocksTestCase {

	/**
	 * Credential keys that must never be present in the client bundle.
	 *
	 * @var string[]
	 */
	private $forbidden_keys = [ 'key', 'api_key', 'email', 'api_email', 'domain', 'ithemes_key' ];

	public function testProDataExcludesCredentials() {
		$pro_data = Editor_Assets::get_instance()->get_pro_data();

		$this->assertIsArray( $pro_data );
		foreach ( $this->forbidden_keys as $forbidden ) {
			$this->assertArrayNotHasKey(
				$forbidden,
				$pro_data,
				sprintf( 'proData must not expose the "%s" credential to the client.', $forbidden )
			);
		}
	}

	public function testProDataOnlyContainsDerivedState() {
		$pro_data = Editor_Assets::get_instance()->get_pro_data();

		$keys = array_keys( $pro_data );
		sort( $keys );

		$this->assertSame( [ 'env', 'hasApiKey', 'product' ], $keys );
		$this->assertIsBool( $pro_data['hasApiKey'] );
	}
}
