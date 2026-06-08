<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Foundation_Presets;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Table;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Exception\Unknown_Preset_Exception;
use KadenceWP\KadenceBlocks\Design_Tokens\Foundation_Presets\Selector;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use KadenceWP\KadenceBlocks\StellarWP\DB\DB;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

/**
 * Exercises the full write path against the real baseline + a real kb_design_tokens row, then resolves
 * the stored overrides back through the Token_Resolver to prove the seeded primitives render as expected.
 */
final class SelectorTest extends TestCase {

	private Selector $selector;

	private Token_Store $store;

	protected function setUp(): void {
		parent::setUp();

		$this->selector = $this->container->get( Selector::class );
		$this->store    = $this->container->get( Token_Store::class );
	}

	public function testApplyingATypeScaleWritesFullyTypedOverrideLeaves(): void {
		$this->selector->apply( 'typeScale', 'goldenRatio' );

		$overrides = $this->stored_overrides();

		// The $type is sourced from the baseline (fontSize primitives are dimensions), not invented.
		$this->assertSame(
			[
				'$type'  => 'dimension',
				'$value' => '6.854rem',
			],
			$overrides['primitive']['fontSize']['3xl']
		);
		$this->assertSame(
			[
				'$type'  => 'dimension',
				'$value' => '1rem',
			],
			$overrides['primitive']['fontSize']['md']
		);
	}

	public function testApplyingAColorPaletteWritesTypedColorLeaves(): void {
		$this->selector->apply( 'colorPalette', 'sunset' );

		$overrides = $this->stored_overrides();

		$this->assertSame(
			[
				'$type'  => 'color',
				'$value' => '#DD6B20',
			],
			$overrides['primitive']['color']['brand']['primary']
		);
	}

	public function testTheSeededOverridesResolveToThePresetValues(): void {
		$this->selector->apply( 'typeScale', 'goldenRatio' );

		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		$by_id    = $resolver->resolve_overrides( $this->stored_overrides() )->by_id();

		$this->assertSame( '6.854rem', $by_id['primitive.fontSize.3xl'] );
	}

	public function testSeedingAPaletteCascadesThroughSemanticAliases(): void {
		// The point of seeding primitives: every semantic token aliasing a brand color follows it. The
		// baseline aliases semantic.color.link -> {primitive.color.brand.primary}, so picking "sunset"
		// must rebrand the link color without that path ever being written.
		$this->selector->apply( 'colorPalette', 'sunset' );

		$overrides = $this->stored_overrides();
		$this->assertArrayNotHasKey( 'semantic', $overrides, 'Only primitives are seeded; semantics cascade.' );

		/** @var Token_Resolver $resolver */
		$resolver = $this->container->get( Token_Resolver::class );
		$by_id    = $resolver->resolve_overrides( $overrides )->by_id();

		$this->assertSame( '#DD6B20', $by_id['primitive.color.brand.primary'] );
		$this->assertSame( '#DD6B20', $by_id['semantic.color.link'] );
	}

	public function testApplyingLeavesPathsOutsideTheGroupFootprintIntact(): void {
		// A pre-existing override the user already authored, outside the typeScale footprint.
		$this->store->save_document(
			(string) wp_json_encode(
				[
					'semantic' => [
						'color' => [
							'link' => [
								'$type'  => 'color',
								'$value' => '#123456',
							],
						],
					],
				]
			)
		);

		$this->selector->apply( 'typeScale', 'goldenRatio' );

		$overrides = $this->stored_overrides();

		// The seeded type scale is present...
		$this->assertSame( '6.854rem', $overrides['primitive']['fontSize']['3xl']['$value'] );
		// ...and the override outside the group footprint is untouched (the clean swap only clears the
		// group's own paths).
		$this->assertSame( '#123456', $overrides['semantic']['color']['link']['$value'] );
	}

	public function testSelectingAPresetClearsAnotherPresetsExclusivePaths(): void {
		// A hand-built group whose two presets touch DISJOINT paths, which the shipped presets never do.
		// Proves a clean swap: switching usesA -> usesB removes usesA's exclusive path rather than layering.
		$baseline = new Fake_Baseline_Document(
			[
				'primitive'   => [
					'fontSize' => [
						'a' => [
							'$type'  => 'dimension',
							'$value' => '1rem',
						],
						'b' => [
							'$type'  => 'dimension',
							'$value' => '1rem',
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'foundationPresets' => [
							'typeScale' => [
								'$default' => 'usesA',
								'usesA'    => [
									'label'  => 'Uses A',
									'tokens' => [ 'primitive.fontSize.a' => '2rem' ],
								],
								'usesB'    => [
									'label'  => 'Uses B',
									'tokens' => [ 'primitive.fontSize.b' => '3rem' ],
								],
							],
						],
					],
				],
			]
		);

		$selector = new Selector( new Catalog( $baseline ), $baseline, $this->store );

		$selector->apply( 'typeScale', 'usesA' );
		$this->assertArrayHasKey( 'a', $this->stored_overrides()['primitive']['fontSize'] );

		$selector->apply( 'typeScale', 'usesB' );
		$fontsize = $this->stored_overrides()['primitive']['fontSize'];

		$this->assertArrayNotHasKey( 'a', $fontsize, 'usesA\'s exclusive path should be cleared on swap.' );
		$this->assertSame( '3rem', $fontsize['b']['$value'] );
	}

	public function testReselectingTheCurrentPresetIsANoOp(): void {
		$this->selector->apply( 'typeScale', 'goldenRatio' );
		$version_after_first = $this->store->get_version();

		$fired = 0;
		add_action(
			Token_Store::changed_action(),
			static function () use ( &$fired ): void {
				++$fired;
			}
		);

		// Same selection again: nets no change, so it must not write (no version bump, no changed action).
		$this->selector->apply( 'typeScale', 'goldenRatio' );

		$this->assertSame( 0, $fired );
		$this->assertSame( $version_after_first, $this->store->get_version() );
	}

	public function testApplyingFiresTheChangedAction(): void {
		$fired = [];
		add_action(
			Token_Store::changed_action(),
			static function ( $slug ) use ( &$fired ): void {
				$fired[] = $slug;
			}
		);

		$this->selector->apply( 'typeScale', 'goldenRatio' );

		$this->assertSame( [ Token_Store::default_slug() ], $fired );
	}

	public function testAnUnknownChoiceThrowsAndWritesNothing(): void {
		$caught = null;

		try {
			$this->selector->apply( 'typeScale', 'noSuchScale' );
		} catch ( Unknown_Preset_Exception $e ) {
			$caught = $e;
		}

		$this->assertInstanceOf( Unknown_Preset_Exception::class, $caught );
		// Resolution throws before the store is touched, so no row is created.
		$this->assertSame( 0, $this->count_rows() );
	}

	public function testItThrowsWhenAPresetTokenHasNoBaselineType(): void {
		// A hand-built baseline whose preset references a primitive it never declares a $type for. This
		// can't arise from the shipped baseline, but proves the selector refuses to write a leaf with no
		// $type (which would survive the Resolver's wholesale-leaf merge and break the per-$type renderer).
		$baseline = new Fake_Baseline_Document(
			[
				'primitive'   => [
					'fontSize' => [
						'md' => [
							'$type'  => 'dimension',
							'$value' => '1rem',
						],
					],
				],
				'$extensions' => [
					'com.kadence.designTokens' => [
						'foundationPresets' => [
							'typeScale' => [
								'$default' => 'broken',
								'broken'   => [
									'label'  => 'Broken',
									'tokens' => [
										// No primitive.fontSize.nope leaf exists, so no $type can be sourced.
										'primitive.fontSize.nope' => '2rem',
									],
								],
							],
						],
					],
				],
			]
		);

		$selector = new Selector( new Catalog( $baseline ), $baseline, $this->store );

		$this->expectException( Unknown_Preset_Exception::class );

		$selector->apply( 'typeScale', 'broken' );
	}

	/**
	 * Decode the single default set's stored overrides document.
	 *
	 * @return array<string, mixed>
	 */
	private function stored_overrides(): array {
		$decoded = json_decode( $this->store->get_document(), true );

		return is_array( $decoded ) ? $decoded : [];
	}

	private function count_rows(): int {
		return (int) DB::table( Token_Table::table_name( false ) )->count();
	}
}
