<?php declare( strict_types=1 );
// cspell:ignore palette Fghi redbodycolor xxs xxl .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use Tests\Support\Classes\TestCase;

final class Css_BuilderTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function builder(): Css_Builder {
		return new Css_Builder( $this->registry );
	}

	/**
	 * A namespaced set, exactly as Token_Resolver::resolve_namespaced() yields it: canonical token-id =>
	 * literal in by_id (drives the canonical alias / switch name layers), and the slug-namespaced css-var
	 * => value in the projected map (drives the namespaced definition block).
	 *
	 * @param array<string,string> $by_id     Canonical token-id => literal value.
	 * @param array<string,string> $projected Slug-namespaced css-var => projected value.
	 *
	 * @return Resolved_Tokens
	 */
	private function set( array $by_id, array $projected ): Resolved_Tokens {
		return new Resolved_Tokens( $by_id, [], $projected );
	}

	/**
	 * Render a single default set as the active set — the common single-palette shape.
	 *
	 * @param Resolved_Tokens $resolved The default set's namespaced resolved maps.
	 *
	 * @return string
	 */
	private function css_default( Resolved_Tokens $resolved ): string {
		return $this->builder()->css( [ 'default' => $resolved ], 'default' );
	}

	// ---- Namespaced definition block ----------------------------------------------------------------

	/**
	 * A token's literal value lives once, under its slug-namespaced css-var in the definition block.
	 *
	 * @return void
	 */
	public function testItEmitsTheLiteralUnderTheNamespacedVar(): void {
		$id  = 'semantic.color.button-bg';
		$ns  = Css_Var::from_id( $id, 'default' );

		$css = $this->css_default( $this->set( [ $id => '#3182CE' ], [ $ns => '#3182CE' ] ) );

		$this->assertStringContainsString( $ns . ':#3182CE;', $css );
	}

	/**
	 * A reference-valued token chains to its target's namespaced var, keeping the alias chain inside the
	 * set; the leaf literal lives once.
	 *
	 * @return void
	 */
	public function testItChainsAReferenceInsideTheSetAndKeepsTheLiteralOnce(): void {
		$ref      = 'semantic.color.button-bg';
		$leaf     = 'primitive.color.brand.primary';
		$ref_ns   = Css_Var::from_id( $ref, 'default' );
		$leaf_ns  = Css_Var::from_id( $leaf, 'default' );

		$css = $this->css_default(
			$this->set(
				[
					$ref  => '#3182CE',
					$leaf => '#3182CE',
				],
				[
					$ref_ns  => 'var(' . $leaf_ns . ')',
					$leaf_ns => '#3182CE',
				]
			)
		);

		// The semantic points at the namespaced primitive, not the canonical one.
		$this->assertStringContainsString( $ref_ns . ':var(' . $leaf_ns . ');', $css );
		// The literal is emitted exactly once, at the leaf.
		$this->assertSame( 1, substr_count( $css, ':#3182CE;' ) );
	}

	/**
	 * A composite whose projected value embeds a namespaced var() reference emits that var() inside the
	 * shorthand.
	 *
	 * @return void
	 */
	public function testItEmitsACompositeWithAnEmbeddedNamespacedVar(): void {
		$id        = 'semantic.shadow.card';
		$var       = Css_Var::from_id( $id, 'default' );
		$color_var = Css_Var::from_id( 'primitive.color.ink', 'default' );
		$projected = '0px 2px 8px 0px var(' . $color_var . ')';

		$css = $this->css_default( $this->set( [ $id => '0px 2px 8px 0px #1A202C' ], [ $var => $projected ] ) );

		$this->assertStringContainsString( $var . ':' . $projected . ';', $css );
	}

	// ---- Active-set alias layer ---------------------------------------------------------------------

	/**
	 * The canonical token var is pointed at the active set's namespaced var, and never carries the literal
	 * itself — block content references the canonical name and follows the active set.
	 *
	 * @return void
	 */
	public function testItPointsTheCanonicalVarAtTheActiveNamespacedVar(): void {
		$id        = 'semantic.color.button-bg';
		$canonical = Css_Var::from_id( $id );
		$ns        = Css_Var::from_id( $id, 'default' );

		$css = $this->css_default( $this->set( [ $id => '#3182CE' ], [ $ns => '#3182CE' ] ) );

		$this->assertStringContainsString( $canonical . ':var(' . $ns . ');', $css );
		$this->assertStringNotContainsString( $canonical . ':#3182CE;', $css );
	}

	// ---- Switch selectors ---------------------------------------------------------------------------

	/**
	 * Each set emits a `[data-kb-token-set="<set>"]` switch selector that re-points the canonical var at
	 * that set's namespaced var.
	 *
	 * @return void
	 */
	public function testItEmitsASwitchSelectorForTheSet(): void {
		$id = 'semantic.color.button-bg';

		$css = $this->css_default(
			$this->set( [ $id => '#3182CE' ], [ Css_Var::from_id( $id, 'default' ) => '#3182CE' ] )
		);

		$this->assertStringContainsString(
			'[data-kb-token-set="default"]{' . Css_Var::from_id( $id ) . ':var(' . Css_Var::from_id( $id, 'default' ) . ');}',
			$css
		);
	}

	/**
	 * The public switch-attribute accessor returns the same attribute name used in the emitted selector.
	 *
	 * @return void
	 */
	public function testTheSwitchAttributeAccessorMatchesTheEmittedSelector(): void {
		$this->assertSame( 'data-kb-token-set', Css_Builder::get_switch_attribute() );
	}

	// ---- Multiple sets ------------------------------------------------------------------------------

	/**
	 * With two sets emitted simultaneously, both namespaces are present, the canonical alias layer targets
	 * the active set, and each set has its own switch selector.
	 *
	 * @return void
	 */
	public function testItEmitsEverySetNamespacedWithTheAliasLayerOnTheActiveSet(): void {
		$id      = 'semantic.color.text';
		$default = $this->set( [ $id => '#111' ], [ Css_Var::from_id( $id, 'default' ) => '#111' ] );
		$dark    = $this->set( [ $id => '#eee' ], [ Css_Var::from_id( $id, 'dark' ) => '#eee' ] );

		$css = $this->builder()->css( [ 'default' => $default, 'dark' => $dark ], 'dark' );

		// Both sets emit their namespaced literals.
		$this->assertStringContainsString( Css_Var::from_id( $id, 'default' ) . ':#111;', $css );
		$this->assertStringContainsString( Css_Var::from_id( $id, 'dark' ) . ':#eee;', $css );

		// The canonical alias layer points at the ACTIVE set (dark), not the default.
		$this->assertStringContainsString( Css_Var::from_id( $id ) . ':var(' . Css_Var::from_id( $id, 'dark' ) . ');', $css );

		// Each set carries its own switch selector.
		$this->assertStringContainsString( '[data-kb-token-set="default"]{', $css );
		$this->assertStringContainsString( '[data-kb-token-set="dark"]{', $css );
	}

	// ---- Scope / structure --------------------------------------------------------------------------

	/**
	 * The namespaced and alias blocks are scoped to both the bare `:root` and the `:where(.kb-tokens)`
	 * selectors, with bare `:root` leading for editor-iframe coverage.
	 *
	 * @return void
	 */
	public function testItScopesNamespacedAndAliasBlocksToBothSelectors(): void {
		$id  = 'semantic.color.button-bg';
		$css = $this->css_default( $this->set( [ $id => '#3182CE' ], [ Css_Var::from_id( $id, 'default' ) => '#3182CE' ] ) );

		$this->assertStringContainsString( ':root,', $css );
		$this->assertStringContainsString( ':root:where(.kb-tokens)', $css );
		// Bare :root must lead for editor-iframe coverage.
		$this->assertStringStartsWith( ':root,', $css );
	}

	public function testScopeMatchesSpec(): void {
		$this->assertSame( ':root,:root:where(.kb-tokens)', Scope::root() );
	}

	public function testItNeverEmitsImportant(): void {
		$id  = 'semantic.color.button-bg';
		$css = $this->css_default( $this->set( [ $id => '#3182CE' ], [ Css_Var::from_id( $id, 'default' ) => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '!important', $css );
	}

	/**
	 * A set with no tokens produces no CSS.
	 *
	 * @return void
	 */
	public function testEmptySetProducesNoCss(): void {
		$css = $this->css_default( $this->set( [], [] ) );

		$this->assertSame( '', $css );
	}

	/**
	 * When the active slug is absent from the resolved sets, no CSS is produced.
	 *
	 * @return void
	 */
	public function testMissingActiveSetProducesNoCss(): void {
		$css = $this->builder()->css( [ 'dark' => $this->set( [], [] ) ], 'default' );

		$this->assertSame( '', $css );
	}

	// ---- Spacing override block ---------------------------------------------------------------------

	public function testItEmitsSpacingOverrideForAClaimedSlot(): void {
		$id = 'semantic.spacing.block';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => 'lg' ],
			]
		);

		// The slug variable is redefined as the CANONICAL token var, with the resolved length as a literal fallback.
		$css = $this->css_default( $this->set( [ $id => '2rem' ], [ Css_Var::from_id( $id, 'default' ) => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-spacing-lg:var(' . Css_Var::from_id( $id ) . ',2rem);', $css );
	}

	public function testItSkipsSpacingOverrideForAnUnknownSlot(): void {
		$id = 'semantic.spacing.block';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => 'enormous' ], // not a slug KB ships.
			]
		);

		$css = $this->css_default( $this->set( [ $id => '2rem' ], [ Css_Var::from_id( $id, 'default' ) => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-spacing-', $css );
	}

	public function testItSkipsSpacingOverrideWhenTokenHasNoResolvedValue(): void {
		$id = 'semantic.spacing.block';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => 'lg' ],
			]
		);

		// by_id is empty — no resolved value, so no override (it would resolve to nothing in the browser).
		$css = $this->css_default( $this->set( [], [ Css_Var::from_id( $id, 'default' ) => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-spacing-', $css );
	}

	public function testItEmitsGapOverrideForAClaimedSlot(): void {
		$id = 'semantic.gap.layout';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Layout gap',
				'projections' => [ 'kb_gap_slot' => 'md' ],
			]
		);

		// The gap variable is defined as the canonical token var, with the resolved length as a literal fallback.
		$css = $this->css_default( $this->set( [ $id => '2rem' ], [ Css_Var::from_id( $id, 'default' ) => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-gap-md:var(' . Css_Var::from_id( $id ) . ',2rem);', $css );
	}

	public function testItSkipsGapOverrideForAnAliasSlot(): void {
		$id = 'semantic.gap.layout';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Layout gap',
				'projections' => [ 'kb_gap_slot' => 'default' ], // an alias for --global-kb-gap-md, not its own var.
			]
		);

		$css = $this->css_default( $this->set( [ $id => '2rem' ], [ Css_Var::from_id( $id, 'default' ) => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-gap-', $css );
	}

	/**
	 * Built from the real registry and resolver, the shipped declarations emit a slot override for every
	 * spacing and gap step Kadence Blocks ships, so each --global-kb-spacing-* / --global-kb-gap-* slug
	 * follows its token. The default resolves from baseline (no overrides), so each override carries the
	 * canonical token var with KB's own length as the literal fallback.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitEverySpacingAndGapSlot(): void {
		$registry = $this->container->get( Token_Registry::class );
		$resolved = $this->container->get( Token_Resolver::class )->resolve_namespaced( 'default' );

		$css = ( new Css_Builder( $registry ) )->css( [ 'default' => $resolved ], 'default' );

		foreach ( [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-spacing-' . $slug . ':var(', $css );
		}

		foreach ( [ 'none', 'xs', 'sm', 'md', 'lg' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-gap-' . $slug . ':var(', $css );
		}
	}

	// ---- sanitize_value -------------------------------------------------------------------------------

	public function testSanitizerStripsBreakoutCharacters(): void {
		$id = 'semantic.color.bad';
		$ns = Css_Var::from_id( $id, 'default' );

		// Value containing characters that could break out of a declaration.
		$css = $this->css_default( $this->set( [ $id => 'red}body{color:blue' ], [ $ns => 'red}body{color:blue' ] ) );

		// The structural braces of the blocks are fine; the injected chars inside the VALUE must be stripped.
		$this->assertStringNotContainsString( 'red}', $css );
		$this->assertStringNotContainsString( 'body{', $css );
		$this->assertStringContainsString( $ns . ':redbodycolor:blue;', $css );
	}

	public function testSanitizerPreservesLegitimateClampValue(): void {
		$id = 'semantic.dimension.spacing-md';
		$ns = Css_Var::from_id( $id, 'default' );

		$clamp = 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)';
		$css   = $this->css_default( $this->set( [ $id => $clamp ], [ $ns => $clamp ] ) );

		$this->assertStringContainsString( $clamp, $css );
	}

	public function testSanitizerPreservesFontFamilyStack(): void {
		$id = 'semantic.font-family.base';
		$ns = Css_Var::from_id( $id, 'default' );

		$stack = '"Inter", "Helvetica Neue", Arial, sans-serif';
		$css   = $this->css_default( $this->set( [ $id => $stack ], [ $ns => $stack ] ) );

		$this->assertStringContainsString( $stack, $css );
	}

	public function testSanitizerStripsControlCharacters(): void {
		$id = 'semantic.color.ctrl';
		$ns = Css_Var::from_id( $id, 'default' );

		$css = $this->css_default( $this->set( [ $id => "#abc\x00def\x1Fghi" ], [ $ns => "#abc\x00def\x1Fghi" ] ) );

		$this->assertStringContainsString( '#abcdefghi', $css );
		$this->assertStringNotContainsString( "\x00", $css );
		$this->assertStringNotContainsString( "\x1F", $css );
	}

	// ---- Caching (css_for_version) ------------------------------------------------------------------

	public function testCssForVersionReturnsSameResultAsCss(): void {
		$id       = 'semantic.color.button-bg';
		$resolved = $this->set( [ $id => '#3182CE' ], [ Css_Var::from_id( $id, 'default' ) => '#3182CE' ] );
		$builder  = $this->builder();

		$this->assertSame(
			$builder->css( [ 'default' => $resolved ], 'default' ),
			$builder->css_for_version( [ 'default' => $resolved ], [ 'default' => 'v1' ], 'default' )
		);
	}

	/**
	 * The active fragment is served verbatim from the object cache when a cached entry is present.
	 *
	 * @return void
	 */
	public function testActiveFragmentIsServedFromObjectCache(): void {
		$id       = 'semantic.color.button-bg';
		$resolved = $this->set( [ $id => '#3182CE' ], [ Css_Var::from_id( $id, 'default' ) => '#3182CE' ] );

		// Seed the active fragment cache with a sentinel so we can confirm it is served verbatim.
		$cache_key = 'projected_css_active_' . KADENCE_BLOCKS_VERSION . '_default_v1';
		wp_cache_set( $cache_key, '--active-fragment-sentinel:1;', 'kb_design_tokens', DAY_IN_SECONDS );

		$css = $this->builder()->css_for_version( [ 'default' => $resolved ], [ 'default' => 'v1' ], 'default' );

		$this->assertStringContainsString( '--active-fragment-sentinel:1;', $css );
	}

	/**
	 * A per-set fragment is active-independent: its cache entry is reused unchanged whether or not that set
	 * is the active one, so switching the active set never rebuilds the other sets' definition blocks.
	 *
	 * @return void
	 */
	public function testPerSetFragmentIsReusedAcrossAChangeOfActiveSet(): void {
		$id      = 'semantic.color.text';
		$default = $this->set( [ $id => '#111' ], [ Css_Var::from_id( $id, 'default' ) => '#111' ] );
		$dark    = $this->set( [ $id => '#eee' ], [ Css_Var::from_id( $id, 'dark' ) => '#eee' ] );

		// Seed the dark per-set fragment with a sentinel.
		$dark_key = 'projected_css_set_' . KADENCE_BLOCKS_VERSION . '_dark_v1';
		wp_cache_set( $dark_key, '--dark-fragment-sentinel:1;', 'kb_design_tokens', DAY_IN_SECONDS );

		$builder  = $this->builder();
		$versions = [
			'default' => 'v0',
			'dark'    => 'v1',
		];

		// dark active, then default active — the dark per-set fragment is served from cache both times.
		$with_dark_active    = $builder->css_for_version( [ 'default' => $default, 'dark' => $dark ], $versions, 'dark' );
		$with_default_active = $builder->css_for_version( [ 'default' => $default, 'dark' => $dark ], $versions, 'default' );

		$this->assertStringContainsString( '--dark-fragment-sentinel:1;', $with_dark_active );
		$this->assertStringContainsString( '--dark-fragment-sentinel:1;', $with_default_active );
	}
}
