<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Effective_DocumentTest extends TestCase {

	/**
	 * A small two-layer baseline used across the merge cases.
	 *
	 * @return array<string, mixed>
	 */
	private function baseline(): array {
		return [
			'primitive'   => [
				'color' => [
					'brand' => [
						'primary'   => [
							'$type'  => 'color',
							'$value' => '#3182CE',
						],
						'secondary' => [
							'$type'  => 'color',
							'$value' => '#2C5282',
						],
					],
				],
			],
			'semantic'    => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '{primitive.color.brand.primary}',
					],
				],
			],
			// Excluded layer: must never appear in the effective document.
			'$extensions' => [
				'com.kadence.designTokens' => [ 'foundationPresets' => [ 'x' => 1 ] ],
			],
		];
	}

	private function effective(): Effective_Document {
		return new Effective_Document( new Fake_Baseline_Document( $this->baseline() ) );
	}

	public function testEmptyOverridesYieldTheBaselineLayersOnly(): void {
		$document = $this->effective()->build( [] );

		$this->assertSame( $this->baseline()['primitive'], $document['primitive'] );
		$this->assertSame( $this->baseline()['semantic'], $document['semantic'] );
	}

	public function testItNeverIncludesTheExtensionsLayer(): void {
		$document = $this->effective()->build( [] );

		$this->assertArrayNotHasKey( '$extensions', $document );
	}

	public function testAnOverrideLeafReplacesTheBaselineLeafWholesale(): void {
		$document = $this->effective()->build(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#000000',
							],
						],
					],
				],
			]
		);

		$this->assertSame( '#000000', $document['primitive']['color']['brand']['primary']['$value'] );
		// Untouched siblings survive the merge.
		$this->assertSame( '#2C5282', $document['primitive']['color']['brand']['secondary']['$value'] );
	}

	public function testATokenAbsentFromOverridesFallsBackToBaseline(): void {
		$document = $this->effective()->build(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#000000',
							],
						],
					],
				],
			]
		);

		// button-bg was not in the overrides, so it keeps its baseline alias value.
		$this->assertSame(
			'{primitive.color.brand.primary}',
			$document['semantic']['color']['button-bg']['$value']
		);
	}

	public function testANullValueSentinelRemovesTheBaselineEntry(): void {
		$document = $this->effective()->build(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'secondary' => [ '$value' => null ],
						],
					],
				],
			]
		);

		$this->assertArrayNotHasKey( 'secondary', $document['primitive']['color']['brand'] );
		$this->assertArrayHasKey( 'primary', $document['primitive']['color']['brand'] );
	}

	public function testADisabledSentinelRemovesTheBaselineEntry(): void {
		$document = $this->effective()->build(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'secondary' => [ '$disabled' => true ],
						],
					],
				],
			]
		);

		$this->assertArrayNotHasKey( 'secondary', $document['primitive']['color']['brand'] );
	}

	public function testAnOverrideCanIntroduceANewBranch(): void {
		$document = $this->effective()->build(
			[
				'semantic' => [
					'color' => [
						'link' => [
							'$type'  => 'color',
							'$value' => '#0000EE',
						],
					],
				],
			]
		);

		$this->assertSame( '#0000EE', $document['semantic']['color']['link']['$value'] );
		// The baseline sibling is preserved alongside the new branch.
		$this->assertArrayHasKey( 'button-bg', $document['semantic']['color'] );
	}

	public function testAnEmptyBaselineWithOverridesStillBuildsFromOverrides(): void {
		$effective = new Effective_Document( new Fake_Baseline_Document( [] ) );

		$document = $effective->build(
			[
				'primitive' => [
					'color' => [
						'brand' => [
							'primary' => [
								'$type'  => 'color',
								'$value' => '#abcdef',
							],
						],
					],
				],
			]
		);

		$this->assertSame( '#abcdef', $document['primitive']['color']['brand']['primary']['$value'] );
	}
}
