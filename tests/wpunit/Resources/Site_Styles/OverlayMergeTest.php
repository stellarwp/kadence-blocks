<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Overlay;
use Tests\Support\Classes\TestCase;

/**
 * Covers merging a site-level value into an instance value, part by part.
 */
final class OverlayMergeTest extends TestCase {

	/**
	 * The cases shared with the editor's merge, in `src/site-styles/__tests__/fixtures/`.
	 *
	 * @return array<string, array{mixed, mixed, mixed, mixed}>
	 */
	public function conformanceProvider(): array {
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/merge-conformance.json' );
		$this->assertIsString( $json );

		$cases = [];
		foreach ( json_decode( $json, true ) as $case ) {
			$cases[ $case['name'] ] = [ $case['instance'], $case['site'], $case['default'], $case['expected'] ];
		}

		return $cases;
	}

	/**
	 * @dataProvider conformanceProvider
	 *
	 * @param mixed $instance The instance value.
	 * @param mixed $site     The site value.
	 * @param mixed $default  The block's default.
	 * @param mixed $expected The merged value.
	 */
	public function testMergesLikeTheEditor( $instance, $site, $default, $expected ): void {
		$this->assertSame( $expected, Overlay::merge( $instance, $site, $default ) );
	}
}
