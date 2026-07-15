<?php declare( strict_types=1 );
// cspell:ignore singlebtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Singlebtn_Typography_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Singlebtn_Typography_AdapterTest extends TestCase {

	/**
	 * Build the adapter over an active registry and a resolver whose `semantic.typography.control` leaf
	 * holds the given composite `$value`.
	 *
	 * @param array<string, mixed> $value The control token's `$value` (its sub-field map).
	 *
	 * @return Singlebtn_Typography_Adapter
	 */
	private function adapter_with_control( array $value ): Singlebtn_Typography_Adapter {
		return new Singlebtn_Typography_Adapter(
			new Token_Registry(),
			$this->resolver_for(
				[
					'semantic' => [
						'typography' => [
							'control' => [
								'$type'  => 'typography',
								'$value' => $value,
							],
						],
					],
				]
			)
		);
	}

	/**
	 * Build a resolver over a fully-controlled baseline.
	 *
	 * @param array<string, mixed> $baseline The baseline document.
	 *
	 * @return Token_Resolver
	 */
	private function resolver_for( array $baseline ): Token_Resolver {
		return new Token_Resolver(
			$this->container->get( Token_Store::class ),
			new Effective_Document( new Fake_Baseline_Document( $baseline ) ),
			new Css_Renderer()
		);
	}

	/**
	 * A button with no typography set has its family filled from the control token's font-family stack,
	 * joined into the string the `family` attribute stores.
	 *
	 * @return void
	 */
	public function testAMissingFamilyIsFilledFromTheToken(): void {
		$adapter = $this->adapter_with_control( [ 'fontFamily' => [ 'Inter', 'system-ui', 'sans-serif' ] ] );

		$attributes = $adapter->apply( [ 'typography' => [ [ 'family' => '' ] ] ] );

		$this->assertSame( 'Inter, system-ui, sans-serif', $attributes['typography'][0]['family'] );
	}

	/**
	 * A family stack whose members contain spaces is quoted once, and a member that already carries
	 * surrounding quotes is not double-wrapped into a broken `""Segoe UI""`.
	 *
	 * @return void
	 */
	public function testAFamilyStackIsQuotedOnceWithoutDoubleWrapping(): void {
		$adapter = $this->adapter_with_control(
			[ 'fontFamily' => [ '-apple-system', '"Segoe UI"', 'Helvetica Neue', 'sans-serif' ] ]
		);

		$attributes = $adapter->apply( [ 'typography' => [ [ 'family' => '' ] ] ] );

		$this->assertSame(
			'-apple-system, "Segoe UI", "Helvetica Neue", sans-serif',
			$attributes['typography'][0]['family']
		);
	}

	/**
	 * A family the instance already set wins over the token — the adapter fills only blank fields.
	 *
	 * @return void
	 */
	public function testALocallySetFamilyWins(): void {
		$adapter = $this->adapter_with_control( [ 'fontFamily' => [ 'Inter', 'sans-serif' ] ] );

		$attributes = $adapter->apply( [ 'typography' => [ [ 'family' => 'Georgia' ] ] ] );

		$this->assertSame( 'Georgia', $attributes['typography'][0]['family'] );
	}

	/**
	 * Local-wins is field-level: an instance that set only its weight keeps that weight and still picks up
	 * the token family and size.
	 *
	 * @return void
	 */
	public function testFillIsFieldLevelSoASetFieldSurvivesWhileBlanksFill(): void {
		$adapter = $this->adapter_with_control(
			[
				'fontFamily' => [ 'Inter', 'sans-serif' ],
				'fontWeight' => 400,
				'fontSize'   => '1rem',
			]
		);

		$attributes = $adapter->apply( [ 'typography' => [ [ 'family' => '', 'weight' => '700', 'size' => [ '', '', '' ] ] ] ] );

		$typography = $attributes['typography'][0];
		$this->assertSame( '700', $typography['weight'] );
		$this->assertSame( 'Inter, sans-serif', $typography['family'] );
		$this->assertSame( [ '1', '', '' ], $typography['size'] );
		$this->assertSame( 'rem', $typography['sizeType'] );
	}

	/**
	 * A resolved dimension with no unit (a "0" letter-spacing) fills the desktop slot and leaves the unit
	 * key untouched.
	 *
	 * @return void
	 */
	public function testAUnitlessLengthFillsTheValueWithoutAUnit(): void {
		$adapter = $this->adapter_with_control(
			[
				'fontFamily'    => [ 'Inter' ],
				'letterSpacing' => '0',
			]
		);

		$attributes = $adapter->apply( [ 'typography' => [ [ 'family' => '' ] ] ] );

		$this->assertSame( [ '0', '', '' ], $attributes['typography'][0]['letterSpacing'] );
		$this->assertArrayNotHasKey( 'letterType', $attributes['typography'][0] );
	}

	/**
	 * When projection is fail-closed the adapter is a no-op, leaving the attributes exactly as KB stored
	 * them.
	 *
	 * @return void
	 */
	public function testAnInactiveRegistryLeavesAttributesUnchanged(): void {
		$registry = new Token_Registry();
		$registry->deactivate();

		$adapter    = new Singlebtn_Typography_Adapter(
			$registry,
			$this->resolver_for(
				[
					'semantic' => [
						'typography' => [
							'control' => [
								'$type'  => 'typography',
								'$value' => [ 'fontFamily' => [ 'Inter' ] ],
							],
						],
					],
				]
			)
		);
		$attributes = [ 'typography' => [ [ 'family' => '' ] ] ];

		$this->assertSame( $attributes, $adapter->apply( $attributes ) );
	}

	/**
	 * With no `semantic.typography.control` leaf in the baseline the token is absent, so the adapter leaves
	 * the attributes untouched.
	 *
	 * @return void
	 */
	public function testAnAbsentTokenLeavesAttributesUnchanged(): void {
		$adapter    = new Singlebtn_Typography_Adapter( new Token_Registry(), $this->resolver_for( [] ) );
		$attributes = [ 'typography' => [ [ 'family' => '' ] ] ];

		$this->assertSame( $attributes, $adapter->apply( $attributes ) );
	}

	/**
	 * The adapter is registered on the real `kadence_blocks_singlebtn_render_block_attributes` filter and
	 * fills a blank family from the shipped baseline's `semantic.typography.control` (the sans stack),
	 * proving the wiring in `Adapter\Provider`, not just the adapter class in isolation.
	 *
	 * @return void
	 */
	public function testTheRegisteredAdapterFillsFamilyThroughTheRealFilterChain(): void {
		$attributes = apply_filters(
			'kadence_blocks_singlebtn_render_block_attributes',
			[ 'typography' => [ [ 'family' => '' ] ] ],
			null
		);

		$this->assertSame( 'Inter, system-ui, sans-serif', $attributes['typography'][0]['family'] );
	}
}
