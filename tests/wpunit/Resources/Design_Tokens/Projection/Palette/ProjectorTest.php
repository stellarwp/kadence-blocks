<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

/**
 * Covers the palette switch-layer projector: it emits a `[data-kb-palette="<id>"]` selector for each of the
 * active set's shipped palettes, and is a no-op when the registry is deactivated.
 */
final class ProjectorTest extends TestCase {

	/**
	 * @var Projector
	 */
	private Projector $projector;

	/**
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		$this->registry->activate();

		parent::tearDown();
	}

	/**
	 * The projector emits a switch selector for each shipped palette, re-pointing the brand color vars to the
	 * palette's values (here the "sunset" starter palette).
	 *
	 * @return void
	 */
	public function testItEmitsASwitchSelectorForEachShippedPalette(): void {
		$css = $this->projector->css();

		$this->assertStringContainsString( '[data-kb-palette="default"]{', $css );
		$this->assertStringContainsString( '[data-kb-palette="sunset"]{', $css );
		$this->assertStringContainsString( '[data-kb-palette="forest"]{', $css );

		$this->assertStringContainsString(
			Css_Var::from_id( 'primitive.color.brand.primary' ) . ':#DD6B20;',
			$css
		);
	}

	/**
	 * A palette's switch selector carries its fully-resolved color graph, not just the primitives it re-tints:
	 * the primitive delta AND every semantic that aliases it resolve to the palette's color, so a per-block
	 * override re-skins direct-token consumers (a heading reading a semantic) across its subtree.
	 *
	 * @return void
	 */
	public function testTheSwitchSelectorCarriesTheResolvedColorGraph(): void {
		$css = $this->projector->css();

		// Isolate just the sunset selector's declarations (up to its closing brace).
		$start = strpos( $css, '[data-kb-palette="sunset"]{' );
		$this->assertNotFalse( $start );
		$block = substr( $css, (int) $start, (int) strpos( $css, '}', (int) $start ) - (int) $start + 1 );

		// Sunset's own button primitive delta is present.
		$this->assertStringContainsString( Css_Var::from_id( 'primitive.color.brand.button' ) . ':#DD6B20;', $block );

		// The semantic that aliases the re-tinted button primitive is resolved to sunset's color (not just the
		// primitive) — this is what makes a block reading the semantic re-skin, and what the button's variant
		// var chains to.
		$this->assertStringContainsString( Css_Var::from_id( 'semantic.color.button-primary-bg' ) . ':#DD6B20;', $block );
	}

	/**
	 * A shared attribute-presence `[data-kb-palette]` rule re-emits the canonical variant-var declarations, so a
	 * variant Button whose color aliases a palette-changed token re-resolves against the subtree's re-tinted
	 * semantics and follows the chosen palette.
	 *
	 * @return void
	 */
	public function testItReEmitsTheVariantVarsUnderTheSharedPresenceRule(): void {
		$css = $this->projector->css();

		$start = strpos( $css, '[data-kb-palette]{' );
		$this->assertNotFalse( $start );
		$block = substr( $css, (int) $start, (int) strpos( $css, '}', (int) $start ) - (int) $start + 1 );

		// The Single Button's primary button-bg variant var chains to the button semantic, which the per-palette
		// selector re-declares — so on a palette subtree the variant follows the palette.
		$this->assertStringContainsString( 'kadence-singlebtn--primary--button-bg', $block );
		$this->assertStringContainsString(
			'var(' . Css_Var::from_id( 'semantic.color.button-primary-bg' ) . ')',
			$block
		);
	}

	/**
	 * A deactivated registry projects nothing, so a fail-closed registry leaves KB's behavior untouched.
	 *
	 * @return void
	 */
	public function testItEmitsNothingWhenTheRegistryIsDeactivated(): void {
		$this->registry->deactivate();

		wp_deregister_style( 'kadence-blocks-global-variables' );
		wp_register_style( 'kadence-blocks-global-variables', false ); // phpcs:ignore WordPress.WP.EnqueuedResourceParameters.MissingVersion

		$this->projector->enqueue_front_end();

		$this->assertEmpty( wp_styles()->get_data( 'kadence-blocks-global-variables', 'after' ) );
	}
}
