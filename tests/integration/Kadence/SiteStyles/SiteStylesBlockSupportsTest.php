<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles;

use Codeception\TestCase\WPTestCase;

/**
 * Covers the core supports Single Button gains in the Kadence theme's FSE mode.
 */
final class SiteStylesBlockSupportsTest extends WPTestCase {
	protected \IntegrationTester $tester;

	public function testFseModeAddsColorSupportAndTheButtonSelector(): void {
		$this->tester->enable_fse_mode();

		$metadata = $this->filtered_metadata( 'kadence/singlebtn' );

		$this->assertSame(
			[
				'background'                      => true,
				'text'                            => true,
				'gradients'                       => false,
				'__experimentalSkipSerialization' => true,
			],
			$metadata['supports']['color']
		);
		$this->assertSame( '.wp-block-kadence-singlebtn.kt-button.kb-btn-global-fill, .wp-block-kadence-singlebtn .kt-button.kb-btn-global-fill', $metadata['selectors']['root'] );
		$this->assertSame( 'kadence/advancedbtn', $metadata['supports']['existing'] );
	}

	public function testClassicModeLeavesTheMetadataAlone(): void {
		$metadata = $this->metadata( 'kadence/singlebtn' );

		$this->assertSame( $metadata, apply_filters( 'block_type_metadata', $metadata ) );
	}

	public function testOtherBlocksAreUntouched(): void {
		$this->tester->enable_fse_mode();
		$metadata = $this->metadata( 'kadence/infobox' );

		$this->assertSame( $metadata, apply_filters( 'block_type_metadata', $metadata ) );
	}

	/**
	 * @param string $name Block name.
	 *
	 * @return array<string, mixed> Minimal metadata with an existing support entry.
	 */
	private function metadata( string $name ): array {
		return [
			'name'     => $name,
			'supports' => [ 'existing' => 'kadence/advancedbtn' ],
		];
	}

	/**
	 * @param string $name Block name.
	 *
	 * @return array<string, mixed> The metadata after the filter.
	 */
	private function filtered_metadata( string $name ): array {
		return apply_filters( 'block_type_metadata', $this->metadata( $name ) );
	}
}
