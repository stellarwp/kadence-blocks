<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Adapter;

use Kadence_Blocks_CSS;
use Kadence_Blocks_Single_Icon_Block;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Icon_Size_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\helpers\CSSTestHelper;
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
	 * The adapter runs on the block's registration defaults, not its stored instance attributes, so
	 * a `size` already present in the given array (e.g. block.json's own hardcoded `50`) is
	 * overwritten with the resolved token — `Kadence_Blocks_Abstract_Block::merge_attributes_with_defaults()`
	 * is what lets a genuinely customized instance value win afterward, not a guard in this adapter.
	 *
	 * @return void
	 */
	public function testAnExistingDefaultIsOverwrittenWithTheResolvedToken(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( '1.5rem' ) );

		$attributes = $adapter->apply( [ 'size' => 50 ] );

		$this->assertSame( [ 'size' => 24.0 ], $attributes );
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
	 * The real filter chain overwrites `kadence/single-icon`'s registration default (block.json's
	 * hardcoded `50`) with the resolved token, confirming the fix for the bug that let the adapter's
	 * own registration default mask the token end-to-end, not just in the isolated unit test above.
	 *
	 * @return void
	 */
	public function testTheRealFilterChainOverwritesTheBlockJsonDefaultWithTheResolvedToken(): void {
		$attributes = apply_filters( 'kadence_blocks_block_default_attributes', [ 'size' => 50 ], 'kadence/single-icon' );

		$this->assertSame( [ 'size' => 24.0 ], $attributes );
	}

	/**
	 * A genuinely customized instance `size` still wins over the token-resolved default when a real
	 * `kadence/single-icon` block renders through `render_css()` itself — the block's registered
	 * `render_callback`, and the only entry point that actually gates `get_attributes_with_defaults()`
	 * behind `Kadence_Blocks_Abstract_Block::$supports_merged_defaults`. Calling
	 * `get_attributes_with_defaults()` directly (as the isolated tests above do) would pass even with
	 * `single-icon` missing from that allowlist, since the gate lives in the caller, not the method.
	 *
	 * `render_css()` only inline-embeds its built CSS into the returned content for a classic theme (a block
	 * theme's per-block CSS reaches the page through a separate, unrelated mechanism, and the wpunit
	 * suite runs on a block theme), so this reads the CSS `build_css()` registered into
	 * `Kadence_Blocks_CSS::$styles` — a side effect of `render_css()` that happens regardless of the
	 * active theme — rather than the returned `$content`.
	 *
	 * @return void
	 */
	public function testACustomizedInstanceSizeWinsThroughTheRealRenderPath(): void {
		$block      = new Kadence_Blocks_Single_Icon_Block();
		$unique_id  = 'icon-size-adapter-customized';
		$attributes = [
			'size'     => 80,
			'uniqueID' => $unique_id,
		];

		$block->render_css( $attributes, '<span class="kb-svg-icon-wrap"></span>', null );

		$css_helper = new CSSTestHelper( Kadence_Blocks_CSS::$styles[ 'kb-single-icon' . $unique_id ] ?? '' );

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kt-svg-item-' . $unique_id . ' .kb-svg-icon-wrap, .kt-svg-style-stacked.kt-svg-item-' . $unique_id . ' .kb-svg-icon-wrap',
				[ 'font-size' => '80px' ]
			)
		);
	}

	/**
	 * An instance with no stored `size` renders with the token-resolved size when a real
	 * `kadence/single-icon` block renders through `render_css()` itself — the block's registered
	 * `render_callback` (see `Kadence_Blocks_Abstract_Block::on_init()`), which is the only entry
	 * point that actually gates `get_attributes_with_defaults()` behind
	 * `$supports_merged_defaults`. This is the path a real page render uses, and it is only reachable
	 * because `single-icon` is registered in that allowlist.
	 *
	 * Reads `Kadence_Blocks_CSS::$styles` rather than the returned content; see the note on the
	 * previous test for why.
	 *
	 * @return void
	 */
	public function testAMissingInstanceSizeIsFilledWithTheResolvedTokenThroughTheRealRenderPath(): void {
		$block      = new Kadence_Blocks_Single_Icon_Block();
		$unique_id  = 'icon-size-adapter-missing';
		$attributes = [
			'uniqueID' => $unique_id,
		];

		$block->render_css( $attributes, '<span class="kb-svg-icon-wrap"></span>', null );

		$css_helper = new CSSTestHelper( Kadence_Blocks_CSS::$styles[ 'kb-single-icon' . $unique_id ] ?? '' );

		$this->assertTrue(
			$css_helper->assertCSSPropertiesEqual(
				'.kt-svg-item-' . $unique_id . ' .kb-svg-icon-wrap, .kt-svg-style-stacked.kt-svg-item-' . $unique_id . ' .kb-svg-icon-wrap',
				[ 'font-size' => '24px' ]
			)
		);
	}
}
