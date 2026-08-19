<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Palette;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Palette\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

/**
 * Covers the palette switch-layer projector: it emits a `[data-kb-palette="<id>"]` selector for each palette
 * the active library defines that differs from the baseline default, and is a no-op when the registry is
 * deactivated. The baseline ships only the `default` palette (whose graph equals the baseline, so it emits no
 * declarations on its own), so the per-palette cases seed a local non-default palette to switch to.
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
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );
		$this->store     = $this->container->get( Token_Store::class );
	}

	/**
	 * @return void
	 */
	protected function tearDown(): void {
		$this->registry->activate();

		parent::tearDown();
	}

	/**
	 * The projector emits a switch selector for each palette that differs from the baseline default, re-pointing
	 * the brand color vars to the palette's values (here a seeded "custom" palette).
	 *
	 * @return void
	 */
	public function testItEmitsASwitchSelectorForEachPalette(): void {
		$this->store->save_document( (string) wp_json_encode( $this->custom_palette_overrides() ) );

		$css = $this->projector->css();

		$this->assertStringContainsString( '[data-kb-palette="default"]{', $css );
		$this->assertStringContainsString( '[data-kb-palette="custom"]{', $css );

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
		$this->store->save_document( (string) wp_json_encode( $this->custom_palette_overrides() ) );

		$css = $this->projector->css();

		// Isolate just the custom selector's declarations (up to its closing brace).
		$start = strpos( $css, '[data-kb-palette="custom"]{' );
		$this->assertNotFalse( $start );
		$block = substr( $css, (int) $start, (int) strpos( $css, '}', (int) $start ) - (int) $start + 1 );

		// The custom palette's own button primitive delta is present.
		$this->assertStringContainsString( Css_Var::from_id( 'primitive.color.brand.button' ) . ':#DD6B20;', $block );

		// The semantic that aliases the re-tinted button primitive is resolved to the custom palette's color (not
		// just the primitive) — this is what makes a block reading the semantic re-skin, and what the button's
		// preset var chains to.
		$this->assertStringContainsString( Css_Var::from_id( 'semantic.color.button-primary-bg' ) . ':#DD6B20;', $block );
	}

	/**
	 * A shared attribute-presence `[data-kb-palette]` rule re-emits the canonical preset-var declarations, so a
	 * preset Button whose color aliases a palette-changed token re-resolves against the subtree's re-tinted
	 * semantics and follows the chosen palette.
	 *
	 * @return void
	 */
	public function testItReEmitsThePresetVarsUnderTheSharedPresenceRule(): void {
		$css = $this->projector->css();

		$start = strpos( $css, '[data-kb-palette]{' );
		$this->assertNotFalse( $start );
		$block = substr( $css, (int) $start, (int) strpos( $css, '}', (int) $start ) - (int) $start + 1 );

		// The Single Button's primary button-bg preset var chains to the button semantic, which the per-palette
		// selector re-declares — so on a palette subtree the preset follows the palette.
		$this->assertStringContainsString( 'kadence-singlebtn--primary--button-bg', $block );
		$this->assertStringContainsString(
			'var(' . Css_Var::from_id( 'semantic.color.button-primary-bg' ) . ')',
			$block
		);
	}

	/**
	 * Each slot-backed color re-declares its numbered --global-paletteN bridge to the palette's value, so content
	 * (and the redirected WordPress preset color classes) that reads the numbered bridge swaps with the palette.
	 *
	 * @return void
	 */
	public function testTheSwitchSelectorBridgesTheNumberedGlobalPalette(): void {
		$this->store->save_document( (string) wp_json_encode( $this->custom_palette_overrides() ) );

		$css = $this->projector->css();

		$start = strpos( $css, '[data-kb-palette="custom"]{' );
		$this->assertNotFalse( $start );
		$block = substr( $css, (int) $start, (int) strpos( $css, '}', (int) $start ) - (int) $start + 1 );

		// brand.primary backs slot palette1, brand.secondary backs slot palette2 (see declarations.php).
		$this->assertStringContainsString( '--global-palette1:#DD6B20;', $block );
		$this->assertStringContainsString( '--global-palette2:#C05621;', $block );
	}

	/**
	 * The projector emits scoped override rules pointing a Kadence block's WordPress preset color classes at the
	 * numbered --global-paletteN bridge (so they follow a per-block palette), scoped to `:root [class*="kadence-"]`
	 * — which matches both the front-end and editor DOM — so only our own blocks are affected while core blocks
	 * reading WordPress's global preset vars stay untouched. Covers the plugin's `palette-N` slug and the Kadence
	 * theme's `theme-palette-N` slug, both mapping to the same bridge.
	 *
	 * @return void
	 */
	public function testItRedirectsKadencePresetColorClassesToTheGlobalBridge(): void {
		$css = $this->projector->css();

		$this->assertStringContainsString(
			':root [class*="kadence-"].has-palette-1-color{color:var(--global-palette1) !important;}',
			$css
		);
		$this->assertStringContainsString(
			':root [class*="kadence-"].has-palette-2-background-color{background-color:var(--global-palette2) !important;}',
			$css
		);
		$this->assertStringContainsString(
			':root [class*="kadence-"].has-theme-palette-1-color{color:var(--global-palette1) !important;}',
			$css
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

	/**
	 * Seed a non-default "custom" palette (brand primary + button both re-tinted to #DD6B20) into the active
	 * library, so the projector has a palette that differs from the baseline default to emit a switch selector
	 * for. The baseline ships only the `default` palette, whose graph equals the baseline and so emits no
	 * `[data-kb-palette]` declarations on its own.
	 *
	 * @return void
	 */
	private function custom_palette_overrides(): array {
		return [
			'$extensions' => [
				'com.kadence.designTokens' => [
					'colorPalettes' => [
						'$current' => 'custom',
						'custom'   => [
							'label'  => 'Custom',
							'groups' => [
								[
									'id'       => 'accent',
									'label'    => 'Accent',
									'swatches' => [
										[
											'token'  => 'primitive.color.brand.primary',
											'label'  => 'Main 1',
											'$value' => '#DD6B20',
										],
										[
											'token'  => 'primitive.color.brand.secondary',
											'label'  => 'Main 2',
											'$value' => '#C05621',
										],
										[
											'token'  => 'primitive.color.brand.accent',
											'label'  => 'Main 3',
											'$value' => '#F6AD55',
										],
										[
											'token'  => 'primitive.color.brand.button',
											'label'  => 'Button',
											'$value' => '#DD6B20',
										],
										[
											'token'  => 'primitive.color.brand.button-hover',
											'label'  => 'Button Hover',
											'$value' => '#C05621',
										],
									],
								],
							],
						],
					],
				],
			],
		];
	}
}
