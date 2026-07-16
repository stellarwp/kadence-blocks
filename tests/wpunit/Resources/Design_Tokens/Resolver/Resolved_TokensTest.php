<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Resolver;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\TestCase;

final class Resolved_TokensTest extends TestCase {

	public function testItExposesBothFlatMaps(): void {
		$by_id  = [ 'semantic.color.button-bg' => '#3182CE' ];
		$by_var = [ '--kb-token--semantic--color--button-bg' => '#3182CE' ];

		$resolved = new Resolved_Tokens( $by_id, $by_var );

		$this->assertSame( $by_id, $resolved->by_id() );
		$this->assertSame( $by_var, $resolved->by_var() );
	}

	public function testValueReturnsTheResolvedValueForAKnownId(): void {
		$resolved = new Resolved_Tokens( [ 'semantic.color.button-bg' => '#3182CE' ], [] );

		$this->assertSame( '#3182CE', $resolved->value( 'semantic.color.button-bg' ) );
	}

	public function testValueReturnsNullForAnUnknownId(): void {
		$resolved = new Resolved_Tokens( [], [] );

		$this->assertNull( $resolved->value( 'nope.not.here' ) );
	}

	/**
	 * A two-argument construction (the common case) carries no alias targets, and the projection
	 * mirrors the literal var map unchanged.
	 *
	 * @return void
	 */
	public function testTargetsDefaultToEmptyAndProjectionMirrorsTheLiteralVarMap(): void {
		$by_var   = [ '--kb-token--semantic--color--button-bg' => '#3182CE' ];
		$resolved = new Resolved_Tokens( [ 'semantic.color.button-bg' => '#3182CE' ], $by_var );

		$this->assertSame( [], $resolved->target_ids() );
		$this->assertNull( $resolved->target( 'semantic.color.button-bg' ) );
		$this->assertSame( $by_var, $resolved->projected_vars() );
	}

	/**
	 * The projection and target maps round-trip, and target() reads the by-id target view.
	 *
	 * @return void
	 */
	public function testItExposesTheProjectionAndTargetMaps(): void {
		$by_var_projected = [ '--kb-token--semantic--color--button-bg' => 'var(--kb-token--primitive--color--brand-primary)' ];
		$by_id_target     = [ 'semantic.color.button-bg' => 'primitive.color.brand.primary' ];

		$resolved = new Resolved_Tokens(
			[ 'semantic.color.button-bg' => '#3182CE' ],
			[ '--kb-token--semantic--color--button-bg' => '#3182CE' ],
			$by_var_projected,
			$by_id_target
		);

		$this->assertSame( $by_var_projected, $resolved->projected_vars() );
		$this->assertSame( $by_id_target, $resolved->target_ids() );
		$this->assertSame( 'primitive.color.brand.primary', $resolved->target( 'semantic.color.button-bg' ) );
	}

	/**
	 * target() returns null for a token absent from the target map (a raw-valued token).
	 *
	 * @return void
	 */
	public function testTargetReturnsNullForANonReferenceId(): void {
		$resolved = new Resolved_Tokens(
			[ 'primitive.color.brand.primary' => '#3182CE' ],
			[ '--kb-token--primitive--color--brand-primary' => '#3182CE' ]
		);

		$this->assertNull( $resolved->target( 'primitive.color.brand.primary' ) );
	}

	/**
	 * The per-breakpoint maps round-trip: projected_responsive() exposes the css-var override map and
	 * value_at() reads the literal override for a token at a breakpoint.
	 *
	 * @return void
	 */
	public function testItExposesThePerBreakpointResponsiveMaps(): void {
		$by_var_responsive = [
			'--kb-token--semantic--font-size--control' => [
				'tablet' => '1rem',
				'mobile' => '0.9rem',
			],
		];
		$by_id_responsive  = [
			'semantic.font-size.control' => [
				'tablet' => '1rem',
				'mobile' => '0.9rem',
			],
		];

		$resolved = new Resolved_Tokens(
			[ 'semantic.font-size.control' => '1.125rem' ],
			[ '--kb-token--semantic--font-size--control' => '1.125rem' ],
			[],
			[],
			$by_var_responsive,
			$by_id_responsive
		);

		$this->assertSame( $by_var_responsive, $resolved->projected_responsive() );
		$this->assertSame( '1rem', $resolved->value_at( 'semantic.font-size.control', 'tablet' ) );
		$this->assertSame( '0.9rem', $resolved->value_at( 'semantic.font-size.control', 'mobile' ) );
	}

	/**
	 * A construction with no responsive maps exposes an empty projection and null value_at() everywhere, so a
	 * flat document behaves exactly as before.
	 *
	 * @return void
	 */
	public function testTheResponsiveMapsDefaultToEmpty(): void {
		$resolved = new Resolved_Tokens( [ 'semantic.font-size.control' => '1.125rem' ], [] );

		$this->assertSame( [], $resolved->projected_responsive() );
		$this->assertNull( $resolved->value_at( 'semantic.font-size.control', 'tablet' ) );
	}
}
