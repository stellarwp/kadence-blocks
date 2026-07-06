<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Icon_Size_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Icon_Size_AdapterTest extends TestCase {

	/**
	 * A baseline whose `semantic.icon-size.default` resolves to the given dimension value, mirroring
	 * Icon_Size_ResolutionTest's own helper so the resolver behind this adapter is built the same way
	 * every other icon-size test already builds it.
	 *
	 * @param string $value The `$value` the `semantic.icon-size.default` leaf resolves to.
	 *
	 * @return Token_Resolver
	 */
	private function resolver_resolving_to( string $value ): Token_Resolver {
		return $this->resolver_for(
			[
				'semantic' => [
					'icon-size' => [
						'default' => [
							'$type'  => 'dimension',
							'$value' => $value,
						],
					],
				],
			]
		);
	}

	/**
	 * A resolver over a baseline with no `semantic.icon-size.default` leaf at all, so the token is
	 * genuinely unresolved rather than resolved to an unrecognized value.
	 *
	 * @return Token_Resolver
	 */
	private function resolver_with_no_icon_size_token(): Token_Resolver {
		return $this->resolver_for( [] );
	}

	/**
	 * Build a resolver over a fully-controlled baseline.
	 *
	 * @param array<string, mixed> $baseline
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
	 * A stored `size` of any value, including `0`, always wins over the token-resolved default.
	 *
	 * @return void
	 */
	public function testStoredSizeIsNeverOverwritten(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( '1.5rem' ) );

		$attributes = $adapter->apply( [ 'size' => 0 ] );

		$this->assertSame( [ 'size' => 0 ], $attributes );
	}

	/**
	 * A missing `size` is filled from a `rem` token value, converted to px on the 16px root-size
	 * assumption.
	 *
	 * @return void
	 */
	public function testMissingSizeIsFilledFromARemToken(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( '1.5rem' ) );

		$attributes = $adapter->apply( [] );

		$this->assertSame( [ 'size' => 24.0 ], $attributes );
	}

	/**
	 * A missing `size` is filled from a `px` token value, passed through as a bare number.
	 *
	 * @return void
	 */
	public function testMissingSizeIsFilledFromAPxToken(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( '24px' ) );

		$attributes = $adapter->apply( [] );

		$this->assertSame( [ 'size' => 24.0 ], $attributes );
	}

	/**
	 * A token value in a unit this adapter cannot safely convert leaves the attributes untouched
	 * rather than guessing.
	 *
	 * @return void
	 */
	public function testUnrecognizedUnitLeavesAttributesUnchanged(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( '2vw' ) );

		$attributes = $adapter->apply( [] );

		$this->assertSame( [], $attributes );
	}

	/**
	 * An unresolved token (no `semantic.icon-size.default` leaf in the baseline) leaves the
	 * attributes untouched rather than guessing.
	 *
	 * @return void
	 */
	public function testUnresolvedTokenLeavesAttributesUnchanged(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_with_no_icon_size_token() );

		$attributes = $adapter->apply( [] );

		$this->assertSame( [], $attributes );
	}

	/**
	 * `Icon_Size_Adapter` is registered against the real Token Registry on boot, so the real
	 * `Adapter\Projector` finds it for `kadence/single-icon` and fills a missing `size` with the
	 * shipped baseline's `semantic.icon-size.default` (1.5rem, i.e. 24px) — proving the wiring in
	 * `Adapter\Provider::ADAPTERS`, not just the adapter class in isolation.
	 *
	 * @return void
	 */
	public function testTheRegisteredAdapterFillsSizeThroughTheRealProjector(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$attributes = ( new Projector( $registry ) )->apply( [], 'kadence/single-icon' );

		$this->assertSame( [ 'size' => 24.0 ], $attributes );
	}

	/**
	 * The same fill happens through the real `kadence_blocks_block_default_attributes` filter chain,
	 * proving `Adapter\Provider::register()` wired the projector into that hook, not just that the
	 * standalone `Projector` object works.
	 *
	 * @return void
	 */
	public function testTheRegisteredAdapterFillsSizeThroughTheRealFilterChain(): void {
		$attributes = apply_filters( 'kadence_blocks_block_default_attributes', [], 'kadence/single-icon' );

		$this->assertSame( [ 'size' => 24.0 ], $attributes );
	}

	/**
	 * A stored `size` survives the real filter chain untouched, confirming the adapter's "never
	 * overwrite a stored value" guarantee holds end-to-end, not just in the isolated unit tests above.
	 *
	 * @return void
	 */
	public function testAStoredSizeSurvivesTheRealFilterChain(): void {
		$attributes = apply_filters( 'kadence_blocks_block_default_attributes', [ 'size' => 12 ], 'kadence/single-icon' );

		$this->assertSame( [ 'size' => 12 ], $attributes );
	}
}
