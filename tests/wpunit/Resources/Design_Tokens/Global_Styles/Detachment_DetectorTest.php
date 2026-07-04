<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Global_Styles;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Detachment_Detector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Contracts\Baseline_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Covers Detachment_Detector's derivation of "detached from brand" against a synthetic baseline
 * for each transition, and against the real, shipped baseline for one real semantic token to
 * guard against the baseline changing shape under this test.
 */
final class Detachment_DetectorTest extends TestCase {

	/**
	 * A token whose baseline aliases a primitive, overridden with a literal, is detached.
	 *
	 * @return void
	 */
	public function testAliasOverriddenWithLiteralIsDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$this->assertTrue( $detector->is_detached( 'semantic.color.button-bg', $this->literal_override() ) );
	}

	/**
	 * An aliased token with no override at all is still aliased, so it is never detached.
	 *
	 * @return void
	 */
	public function testAliasWithNoOverrideIsNotDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$this->assertFalse( $detector->is_detached( 'semantic.color.button-bg', [] ) );
	}

	/**
	 * An aliased token re-pointed to a different alias is not detached — it is still an alias.
	 *
	 * @return void
	 */
	public function testAliasOverriddenWithADifferentAliasIsNotDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$overrides = [
			'semantic' => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '{primitive.color.brand.secondary}',
					],
				],
			],
		];

		$this->assertFalse( $detector->is_detached( 'semantic.color.button-bg', $overrides ) );
	}

	/**
	 * A RESET sentinel override falls back to the baseline alias, so the token is not detached.
	 *
	 * @return void
	 */
	public function testResetSentinelOverrideIsNotDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$overrides = [
			'semantic' => [
				'color' => [
					'button-bg' => [ '$value' => null ],
				],
			],
		];

		$this->assertFalse( $detector->is_detached( 'semantic.color.button-bg', $overrides ) );
	}

	/**
	 * A DISABLE sentinel override removes the token from the effective document entirely, so there
	 * is no effective leaf left to compare against the baseline alias — not detached.
	 *
	 * @return void
	 */
	public function testDisabledSentinelOverrideIsNotDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$overrides = [
			'semantic' => [
				'color' => [
					'button-bg' => [ '$disabled' => true ],
				],
			],
		];

		$this->assertFalse( $detector->is_detached( 'semantic.color.button-bg', $overrides ) );
	}

	/**
	 * A token whose baseline is already a literal has no alias relationship to lose, so overriding
	 * it with a different literal is an ordinary edit, not a detachment.
	 *
	 * @return void
	 */
	public function testLiteralBaselineOverriddenWithALiteralIsNotDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$overrides = [
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
		];

		$this->assertFalse( $detector->is_detached( 'primitive.color.brand.primary', $overrides ) );
	}

	/**
	 * An unknown token id has no baseline leaf to be aliased, so it is never detached.
	 *
	 * @return void
	 */
	public function testUnknownTokenIdIsNotDetached(): void {
		$detector = $this->detector_for( $this->baseline() );

		$this->assertFalse( $detector->is_detached( 'semantic.color.nonexistent', $this->literal_override() ) );
	}

	/**
	 * Detachment against the real shipped baseline for a real semantic token confirms the
	 * production data still has the alias relationship this class relies on.
	 *
	 * @dataProvider realBaselineProvider
	 *
	 * @param array<string, mixed> $overrides The decoded overrides document to test against.
	 * @param bool                 $expected  The expected is_detached() result.
	 *
	 * @return void
	 */
	public function testAgainstTheRealShippedBaseline( array $overrides, bool $expected ): void {
		$detector = new Detachment_Detector(
			$this->container->get( Baseline_Document::class ),
			$this->container->get( Effective_Document::class )
		);

		$this->assertSame( $expected, $detector->is_detached( 'semantic.color.button-bg', $overrides ) );
	}

	/**
	 * @return Generator
	 */
	public function realBaselineProvider(): Generator {
		yield 'no override, still aliased' => [
			'overrides' => [],
			'expected'  => false,
		];

		yield 'overridden with a literal, detached' => [
			'overrides' => [
				'semantic' => [
					'color' => [
						'button-bg' => [
							'$type'  => 'color',
							'$value' => '#3182CE',
						],
					],
				],
			],
			'expected'  => true,
		];
	}

	/**
	 * Build a Detachment_Detector wired to a Fake_Baseline_Document for the given decoded baseline.
	 *
	 * @param array<string, mixed> $baseline The decoded baseline document.
	 *
	 * @return Detachment_Detector
	 */
	private function detector_for( array $baseline ): Detachment_Detector {
		$document = new Fake_Baseline_Document( $baseline );

		return new Detachment_Detector( $document, new Effective_Document( $document ) );
	}

	/**
	 * A small synthetic baseline: a primitive literal and a semantic token aliasing it.
	 *
	 * @return array<string, mixed>
	 */
	private function baseline(): array {
		return [
			'primitive' => [
				'color' => [
					'brand' => [
						'primary'   => [
							'$type'  => 'color',
							'$value' => '#111111',
						],
						'secondary' => [
							'$type'  => 'color',
							'$value' => '#222222',
						],
					],
				],
			],
			'semantic'  => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '{primitive.color.brand.primary}',
					],
				],
			],
		];
	}

	/**
	 * An overrides document that replaces "semantic.color.button-bg" with a literal.
	 *
	 * @return array<string, mixed>
	 */
	private function literal_override(): array {
		return [
			'semantic' => [
				'color' => [
					'button-bg' => [
						'$type'  => 'color',
						'$value' => '#FF0000',
					],
				],
			],
		];
	}
}
