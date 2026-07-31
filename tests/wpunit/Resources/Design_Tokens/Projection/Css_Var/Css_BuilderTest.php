<?php declare( strict_types=1 );
// cspell:ignore palette Fghi redbodycolor xxs xxl xxxl .

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
	 * The active library's canonical resolved maps, exactly as Token_Resolver::resolve() yields them: canonical
	 * token-id => literal in by_id (the slot-bridge source), and the canonical css-var => value in the
	 * projected map (the `:root` definition source).
	 *
	 * @param array<string,string> $by_id     Canonical token-id => literal value.
	 * @param array<string,string> $projected Canonical css-var => projected value.
	 *
	 * @return Resolved_Tokens
	 */
	private function resolved( array $by_id, array $projected ): Resolved_Tokens {
		return new Resolved_Tokens( $by_id, [], $projected );
	}

	/**
	 * Render the active library — the single-library shape the collapsed builder emits.
	 *
	 * @param Resolved_Tokens $resolved The active library's canonical resolved maps.
	 *
	 * @return string
	 */
	private function css_active( Resolved_Tokens $resolved ): string {
		return $this->builder()->css( $resolved );
	}

	// ---- Canonical token layer ----------------------------------------------------------------------

	/**
	 * A token's literal value is emitted once, under its canonical css-var, at `:root`.
	 *
	 * @return void
	 */
	public function testItEmitsTheLiteralUnderTheCanonicalVar(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$css = $this->css_active( $this->resolved( [ $id => '#3182CE' ], [ $var => '#3182CE' ] ) );

		$this->assertStringContainsString( $var . ':#3182CE;', $css );
	}

	/**
	 * A reference-valued token reads its target's canonical var, so editing the referenced token updates
	 * every dependent token live; the leaf literal lives once.
	 *
	 * @return void
	 */
	public function testItChainsAReferenceToTheCanonicalTargetAndKeepsTheLiteralOnce(): void {
		$ref      = 'semantic.color.button-bg';
		$leaf     = 'primitive.color.brand.primary';
		$ref_var  = Css_Var::from_id( $ref );
		$leaf_var = Css_Var::from_id( $leaf );

		$css = $this->css_active(
			$this->resolved(
				[
					$ref  => '#3182CE',
					$leaf => '#3182CE',
				],
				[
					$ref_var  => 'var(' . $leaf_var . ')',
					$leaf_var => '#3182CE',
				]
			)
		);

		// The semantic points at the canonical primitive.
		$this->assertStringContainsString( $ref_var . ':var(' . $leaf_var . ');', $css );
		// The literal is emitted exactly once, at the leaf.
		$this->assertSame( 1, substr_count( $css, ':#3182CE;' ) );
	}

	/**
	 * A composite whose projected value embeds a canonical var() reference emits that var() inside the
	 * shorthand.
	 *
	 * @return void
	 */
	public function testItEmitsACompositeWithAnEmbeddedCanonicalVar(): void {
		$id        = 'semantic.shadow.card';
		$var       = Css_Var::from_id( $id );
		$color_var = Css_Var::from_id( 'primitive.color.ink' );
		$projected = '0px 2px 8px 0px var(' . $color_var . ')';

		$css = $this->css_active( $this->resolved( [ $id => '0px 2px 8px 0px #1A202C' ], [ $var => $projected ] ) );

		$this->assertStringContainsString( $var . ':' . $projected . ';', $css );
	}

	// ---- Single-library collapse (no namespaced / alias / switch layers) --------------------------------

	/**
	 * The collapsed builder emits no per-library namespaced `--kb-token--<library>--*` vars and no
	 * `[data-kb-token-set]` switch selectors — only the active library's canonical layer at `:root`.
	 *
	 * @return void
	 */
	public function testItEmitsNoNamespacedVarsOrSwitchSelectors(): void {
		$id = 'semantic.color.button-bg';

		$css = $this->css_active( $this->resolved( [ $id => '#3182CE' ], [ Css_Var::from_id( $id ) => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '--kb-token--default--', $css );
		$this->assertStringNotContainsString( '[data-kb-token-set', $css );
	}

	// ---- Scope / structure --------------------------------------------------------------------------

	/**
	 * The `:root` block is scoped to both the bare `:root` and the `:where(.kb-tokens)` selectors, with
	 * bare `:root` leading for editor-iframe coverage.
	 *
	 * @return void
	 */
	public function testItScopesTheRootBlockToBothSelectors(): void {
		$id  = 'semantic.color.button-bg';
		$css = $this->css_active( $this->resolved( [ $id => '#3182CE' ], [ Css_Var::from_id( $id ) => '#3182CE' ] ) );

		$this->assertStringContainsString( ':root,', $css );
		$this->assertStringContainsString( ':root:where(.kb-tokens)', $css );
		// Bare :root must lead for editor-iframe coverage.
		$this->assertStringStartsWith( ':root,', $css );
	}

	/**
	 * The scope selector matches the shared Scope::root() spec.
	 *
	 * @return void
	 */
	public function testScopeMatchesSpec(): void {
		$this->assertSame( ':root,:root:where(.kb-tokens)', Scope::root() );
	}

	/**
	 * The projected CSS never uses !important, so per-instance overrides win by ordinary cascade.
	 *
	 * @return void
	 */
	public function testItNeverEmitsImportant(): void {
		$id  = 'semantic.color.button-bg';
		$css = $this->css_active( $this->resolved( [ $id => '#3182CE' ], [ Css_Var::from_id( $id ) => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '!important', $css );
	}

	/**
	 * A library with no tokens produces no CSS.
	 *
	 * @return void
	 */
	public function testEmptyLibraryProducesNoCss(): void {
		$css = $this->css_active( $this->resolved( [], [] ) );

		$this->assertSame( '', $css );
	}

	// ---- Slot bridges -------------------------------------------------------------------------------

	/**
	 * A spacing token claiming a shipped slot redefines --global-kb-spacing-<slug> as the canonical token
	 * var, with the resolved length as a literal fallback.
	 *
	 * @return void
	 */
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

		$css = $this->css_active( $this->resolved( [ $id => '2rem' ], [ Css_Var::from_id( $id ) => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-spacing-lg:var(' . Css_Var::from_id( $id ) . ',2rem);', $css );
	}

	/**
	 * A spacing token claiming a slug KB does not ship emits no slot bridge.
	 *
	 * @return void
	 */
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

		$css = $this->css_active( $this->resolved( [ $id => '2rem' ], [ Css_Var::from_id( $id ) => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-spacing-', $css );
	}

	/**
	 * A spacing token with no resolved literal emits no slot bridge (it would resolve to nothing).
	 *
	 * @return void
	 */
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
		$css = $this->css_active( $this->resolved( [], [ Css_Var::from_id( $id ) => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-spacing-', $css );
	}

	/**
	 * A gap token claiming a shipped slot redefines --global-kb-gap-<slug> as the canonical token var.
	 *
	 * @return void
	 */
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

		$css = $this->css_active( $this->resolved( [ $id => '2rem' ], [ Css_Var::from_id( $id ) => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-gap-md:var(' . Css_Var::from_id( $id ) . ',2rem);', $css );
	}

	/**
	 * A gap token claiming an alias slug (not its own var) emits no slot bridge.
	 *
	 * @return void
	 */
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

		$css = $this->css_active( $this->resolved( [ $id => '2rem' ], [ Css_Var::from_id( $id ) => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-gap-', $css );
	}

	/**
	 * A font-size token that claims a shipped slug redefines --global-kb-font-size-<slug> as the canonical
	 * token var, with the resolved length as a literal fallback, so a block storing that named size follows it.
	 *
	 * @return void
	 */
	public function testItEmitsFontSizeOverrideForAClaimedSlot(): void {
		$id = 'semantic.font-size.lg';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'LG',
				'projections' => [ 'kb_font_size_slot' => 'lg' ],
			]
		);

		$css = $this->css_active( $this->resolved( [ $id => '2rem' ], [ Css_Var::from_id( $id ) => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-font-size-lg:var(' . Css_Var::from_id( $id ) . ',2rem);', $css );
	}

	/**
	 * The Kadence palette bridges (--global-palette*) are never emitted by the token backbone — the active
	 * :root palette stays owned by the legacy color filter (Legacy_Filter_Bridge).
	 *
	 * @return void
	 */
	public function testItNeverEmitsThePaletteBridges(): void {
		$id = 'primitive.color.brand.primary';

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Brand Primary',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);

		$css = $this->css_active( $this->resolved( [ $id => '#3182CE' ], [ Css_Var::from_id( $id ) => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '--global-palette', $css );
	}

	/**
	 * Built from the real registry and resolver, the shipped declarations emit a slot override for every
	 * spacing, gap and font-size step Kadence Blocks ships, so each --global-kb-spacing-* / --global-kb-gap-* /
	 * --global-kb-font-size-* slug follows its token.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitEverySpacingGapAndFontSizeSlot(): void {
		$registry = $this->container->get( Token_Registry::class );
		$resolved = $this->container->get( Token_Resolver::class )->resolve( 'default' );

		$css = ( new Css_Builder( $registry ) )->css( $resolved );

		foreach ( [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-spacing-' . $slug . ':var(', $css );
		}

		foreach ( [ 'none', 'xs', 'sm', 'md', 'lg' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-gap-' . $slug . ':var(', $css );
		}

		foreach ( [ 'sm', 'md', 'lg', 'xl', 'xxl', 'xxxl' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-font-size-' . $slug . ':var(', $css );
		}
	}

	// ---- sanitize_value -----------------------------------------------------------------------------

	/**
	 * The sanitizer strips characters that could break out of a declaration from the value portion.
	 *
	 * @return void
	 */
	public function testSanitizerStripsBreakoutCharacters(): void {
		$id  = 'semantic.color.bad';
		$var = Css_Var::from_id( $id );

		// Value containing characters that could break out of a declaration.
		$css = $this->css_active( $this->resolved( [ $id => 'red}body{color:blue' ], [ $var => 'red}body{color:blue' ] ) );

		// The structural braces of the blocks are fine; the injected chars inside the VALUE must be stripped.
		$this->assertStringNotContainsString( 'red}', $css );
		$this->assertStringNotContainsString( 'body{', $css );
		$this->assertStringContainsString( $var . ':redbodycolor:blue;', $css );
	}

	/**
	 * The sanitizer preserves a legitimate clamp() value.
	 *
	 * @return void
	 */
	public function testSanitizerPreservesLegitimateClampValue(): void {
		$id  = 'semantic.dimension.spacing-md';
		$var = Css_Var::from_id( $id );

		$clamp = 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)';
		$css   = $this->css_active( $this->resolved( [ $id => $clamp ], [ $var => $clamp ] ) );

		$this->assertStringContainsString( $clamp, $css );
	}

	/**
	 * The sanitizer preserves a legitimate font-family stack.
	 *
	 * @return void
	 */
	public function testSanitizerPreservesFontFamilyStack(): void {
		$id  = 'semantic.font-family.base';
		$var = Css_Var::from_id( $id );

		$stack = '"Inter", "Helvetica Neue", Arial, sans-serif';
		$css   = $this->css_active( $this->resolved( [ $id => $stack ], [ $var => $stack ] ) );

		$this->assertStringContainsString( $stack, $css );
	}

	/**
	 * The sanitizer strips control characters from the value portion.
	 *
	 * @return void
	 */
	public function testSanitizerStripsControlCharacters(): void {
		$id  = 'semantic.color.ctrl';
		$var = Css_Var::from_id( $id );

		$css = $this->css_active( $this->resolved( [ $id => "#abc\x00def\x1Fghi" ], [ $var => "#abc\x00def\x1Fghi" ] ) );

		$this->assertStringContainsString( '#abcdefghi', $css );
		$this->assertStringNotContainsString( "\x00", $css );
		$this->assertStringNotContainsString( "\x1F", $css );
	}

	// ---- Caching (css_for_version) ------------------------------------------------------------------

	/**
	 * The cached css_for_version() returns the same result as the uncached css().
	 *
	 * @return void
	 */
	public function testCssForVersionReturnsSameResultAsCss(): void {
		$id       = 'semantic.color.button-bg';
		$resolved = $this->resolved( [ $id => '#3182CE' ], [ Css_Var::from_id( $id ) => '#3182CE' ] );
		$builder  = $this->builder();

		$this->assertSame(
			$builder->css( $resolved ),
			$builder->css_for_version( $resolved, 'default', 'v1' )
		);
	}

	/**
	 * The `:root` block is served verbatim from the object cache when a cached entry is present.
	 *
	 * @return void
	 */
	public function testTheRootBlockIsServedFromObjectCache(): void {
		$id       = 'semantic.color.button-bg';
		$resolved = $this->resolved( [ $id => '#3182CE' ], [ Css_Var::from_id( $id ) => '#3182CE' ] );

		// Seed the root block cache with a sentinel so we can confirm it is served verbatim. The cache key
		// carries the breakpoint signature, "none" here because css_for_version() is called with no breakpoints.
		$cache_key = 'projected_css_root_' . KADENCE_BLOCKS_VERSION . '_default_v1_none';
		wp_cache_set( $cache_key, '--root-block-sentinel:1;', 'kb_design_tokens', DAY_IN_SECONDS );

		$css = $this->builder()->css_for_version( $resolved, 'default', 'v1' );

		$this->assertStringContainsString( '--root-block-sentinel:1;', $css );
	}

	/**
	 * A responsive library redeclares each affected `--kb-token--*` var inside the tablet and mobile media
	 * queries (at :root, tablet before mobile), on top of the base :root declaration, so a consuming block
	 * inherits the per-breakpoint value with no block change.
	 *
	 * @return void
	 */
	public function testItRedeclaresResponsiveVarsInsideMediaQueries(): void {
		$id  = 'semantic.font-size.control';
		$var = Css_Var::from_id( $id );

		$resolved = new Resolved_Tokens(
			[ $id => '1.125rem' ],
			[],
			[ $var => '1.125rem' ],
			[],
			[ $var => [ 'tablet' => '1rem', 'mobile' => '0.9rem' ] ]
		);

		$breakpoints = [
			'tablet' => '(max-width: 1024px)',
			'mobile' => '(max-width: 767px)',
		];

		$css = $this->builder()->css_for_version( $resolved, 'default', 'v1', $breakpoints );

		$this->assertStringContainsString( $var . ':1.125rem;', $css );
		$this->assertStringContainsString( '@media all and (max-width: 1024px){' . Scope::root() . '{' . $var . ':1rem;}}', $css );
		$this->assertStringContainsString( '@media all and (max-width: 767px){' . Scope::root() . '{' . $var . ':0.9rem;}}', $css );
		$this->assertLessThan(
			(int) strpos( $css, '(max-width: 767px)' ),
			(int) strpos( $css, '(max-width: 1024px)' ),
			'The tablet override must precede the mobile override so the narrower max-width wins by source order.'
		);
	}

	/**
	 * A flat library (no responsive overrides) emits no media queries, so responsive support never perturbs the
	 * projected CSS of a flat document.
	 *
	 * @return void
	 */
	public function testAFlatLibraryEmitsNoMediaQueries(): void {
		$id       = 'semantic.color.text';
		$resolved = $this->resolved( [ $id => '#111' ], [ Css_Var::from_id( $id ) => '#111' ] );

		$css = $this->builder()->css_for_version(
			$resolved,
			'default',
			'v1',
			[ 'tablet' => '(max-width: 1024px)', 'mobile' => '(max-width: 767px)' ]
		);

		$this->assertStringNotContainsString( '@media', $css );
	}
}
