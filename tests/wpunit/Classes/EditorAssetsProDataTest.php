<?php

namespace Tests\wpunit\Classes;

use KadenceWP\KadenceBlocks\Editor_Assets;
use Tests\wpunit\KadenceBlocksTestCase;

/**
 * Verifies the editor `proData` bundle only carries the derived license state
 * the client needs; the license key itself is used via the server-side REST API.
 */
class EditorAssetsProDataTest extends KadenceBlocksTestCase {

	/**
	 * Keys that belong to the server side and should not appear in the bundle.
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
				sprintf( 'proData should only contain derived license state, not "%s".', $forbidden )
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
