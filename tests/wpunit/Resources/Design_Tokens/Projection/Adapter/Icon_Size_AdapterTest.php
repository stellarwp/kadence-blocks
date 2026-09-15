<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Adapter;

use Generator;
use Kadence_Blocks_CSS;
use Kadence_Blocks_Single_Icon_Block;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Icon_Size_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Css_Renderer;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Mutator;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Document;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\helpers\CSSTestHelper;
use Tests\Support\Classes\Fake_Baseline_Document;
use Tests\Support\Classes\TestCase;

final class Icon_Size_AdapterTest extends TestCase {

	/**
	 * The adapter runs on the block's registration defaults, so block.json's hardcoded `50` is replaced
	 * with an empty size whenever the icon-size token resolves — the block then renders no size of its
	 * own and the preset CSS chain answers. `merge_attributes_with_defaults()` still lets a genuinely
	 * customized instance value win afterward.
	 *
	 * @return void
	 */
	public function testAResolvedTokenBlanksTheRegistrationDefault(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( '1.5rem' ) );

		$this->assertSame( [ 'size' => '' ], $adapter->apply( [ 'size' => 50 ] ) );
	}

	/**
	 * A missing `size` is blanked the same way; the unit of the resolved token does not matter because
	 * nothing is converted any more.
	 *
	 * @dataProvider resolvedLengthProvider
	 *
	 * @param string $length The resolved token value.
	 *
	 * @return void
	 */
	public function testAResolvedTokenOfAnyUnitBlanksAMissingSize( string $length ): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_resolving_to( $length ) );

		$this->assertSame( [ 'size' => '' ], $adapter->apply( [] ) );
	}

	/**
	 * @return Generator
	 */
	public function resolvedLengthProvider(): Generator {
		yield 'rem' => [ 'length' => '1.5rem' ];
		yield 'px' => [ 'length' => '24px' ];
		yield 'vw' => [ 'length' => '2vw' ];
	}

	/**
	 * An unresolved token (no `semantic.icon-size.default` leaf in the baseline) leaves the attributes
	 * untouched, so block.json's own default keeps rendering on a site with no icon-size token — the same
	 * condition under which the block-default CSS emits no `font-size` rule.
	 *
	 * @return void
	 */
	public function testUnresolvedTokenLeavesAttributesUnchanged(): void {
		$adapter = new Icon_Size_Adapter( $this->resolver_with_no_icon_size_token() );

		$this->assertSame( [], $adapter->apply( [] ) );
	}

	/**
	 * `Icon_Size_Adapter` is registered against the real Token Registry on boot, so the real
	 * `Adapter\Projector` finds it for `kadence/single-icon` and blanks `size` from the shipped baseline —
	 * proving the wiring in `Adapter\Provider::ADAPTERS`, not just the adapter class in isolation.
	 *
	 * @return void
	 */
	public function testTheRegisteredAdapterBlanksSizeThroughTheRealProjector(): void {
		/** @var Token_Registry $registry */
		$registry = $this->container->get( Token_Registry::class );

		$this->assertSame( [ 'size' => '' ], ( new Projector( $registry ) )->apply( [], 'kadence/single-icon' ) );
	}

	/**
	 * The same blank happens through the real `kadence_blocks_block_default_attributes` filter chain,
	 * overwriting block.json's `50`, proving `Adapter\Provider::register()` wired the projector into that
	 * hook.
	 *
	 * @return void
	 */
	public function testTheRealFilterChainBlanksTheBlockJsonDefault(): void {
		$attributes = apply_filters( 'kadence_blocks_block_default_attributes', [ 'size' => 50 ], 'kadence/single-icon' );

		$this->assertSame( [ 'size' => '' ], $attributes );
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
	 * An instance with no stored `size` emits NO per-instance `font-size` rule when a real
	 * `kadence/single-icon` block renders through `render_css()` — so the low-specificity block-default
	 * rule, and through it the selected preset's `--kb-icon-size`, is what sizes the icon. A per-instance
	 * rule here is the bug: it outranks the preset chain, so a Style Library edit to the preset's size
	 * never reaches the page.
	 *
	 * Reads `Kadence_Blocks_CSS::$styles` rather than the returned content; see the note on the previous
	 * test for why.
	 *
	 * @return void
	 */
	public function testAMissingInstanceSizeEmitsNoPerInstanceFontSizeThroughTheRealRenderPath(): void {
		$block     = new Kadence_Blocks_Single_Icon_Block();
		$unique_id = 'icon-size-adapter-missing';

		$block->render_css( [ 'uniqueID' => $unique_id ], '<span class="kb-svg-icon-wrap"></span>', null );

		$css = Kadence_Blocks_CSS::$styles[ 'kb-single-icon' . $unique_id ] ?? '';

		$this->assertStringNotContainsString( 'font-size', $css );
	}

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
			new Css_Renderer(),
			$this->container->get( Effective_Palettes::class ),
			$this->container->get( Mutator::class )
		);
	}
}
