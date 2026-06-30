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

	private function resolved( array $by_id = [], array $by_var = [], array $by_id_target = [], array $by_var_target = [] ): Resolved_Tokens {
		return new Resolved_Tokens( $by_id, $by_var, $by_id_target, $by_var_target );
	}

	// ---- Token block -------------------------------------------------------------------------------

	public function testItEmitsOneDeclarationPerVar(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );

		$css = $this->builder()->css( $this->resolved( [], [ $var => '#3182CE' ] ) );

		$this->assertStringContainsString( $var . ':#3182CE;', $css );
	}

	/**
	 * A reference-valued token points its variable at the target's variable rather than the literal, so
	 * the alias indirection survives into CSS and dependents follow live.
	 *
	 * @return void
	 */
	public function testItEmitsAVarChainForAReferenceValuedToken(): void {
		$var    = Css_Var::from_id( 'semantic.color.button-bg' );
		$target = Css_Var::from_id( 'primitive.color.brand.primary' );

		$css = $this->builder()->css(
			$this->resolved(
				[ 'semantic.color.button-bg' => '#3182CE' ],
				[ $var => '#3182CE' ],
				[ $var => 'var(' . $target . ')' ],
				[ 'semantic.color.button-bg' => 'primitive.color.brand.primary' ]
			)
		);

		$this->assertStringContainsString( $var . ':var(' . $target . ');', $css );
		// The literal must NOT be emitted for the reference token's own declaration.
		$this->assertStringNotContainsString( $var . ':#3182CE;', $css );
	}

	/**
	 * A raw-valued token (no target) still emits its literal even when other tokens in the same set are
	 * references.
	 *
	 * @return void
	 */
	public function testItEmitsTheLiteralForARawValuedTokenAlongsideAReference(): void {
		$ref_var    = Css_Var::from_id( 'semantic.color.button-bg' );
		$target_var = Css_Var::from_id( 'primitive.color.brand.primary' );

		$css = $this->builder()->css(
			$this->resolved(
				[
					'semantic.color.button-bg'      => '#3182CE',
					'primitive.color.brand.primary' => '#3182CE',
				],
				[
					$ref_var    => '#3182CE',
					$target_var => '#3182CE',
				],
				[
					$ref_var    => 'var(' . $target_var . ')',
					$target_var => '#3182CE',
				],
				[ 'semantic.color.button-bg' => 'primitive.color.brand.primary' ]
			)
		);

		// The reference chains, the leaf primitive carries the literal.
		$this->assertStringContainsString( $ref_var . ':var(' . $target_var . ');', $css );
		$this->assertStringContainsString( $target_var . ':#3182CE;', $css );
	}

	/**
	 * A composite whose projected value embeds a var() reference (a shadow with an aliased color field)
	 * emits that var() inside the token declaration's shorthand.
	 *
	 * @return void
	 */
	public function testItEmitsACompositeWithAnEmbeddedVarReference(): void {
		$var       = Css_Var::from_id( 'semantic.shadow.card' );
		$color_var = Css_Var::from_id( 'primitive.color.ink' );
		$projected = '0px 2px 8px 0px var(' . $color_var . ')';

		$css = $this->builder()->css(
			$this->resolved(
				[ 'semantic.shadow.card' => '0px 2px 8px 0px #1A202C' ],
				[ $var => '0px 2px 8px 0px #1A202C' ],
				[ $var => $projected ]
			)
		);

		$this->assertStringContainsString( $var . ':' . $projected . ';', $css );
	}

	public function testItScopesToBothSelectors(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );
		$css = $this->builder()->css( $this->resolved( [], [ $var => '#3182CE' ] ) );

		$this->assertStringContainsString( ':root,', $css );
		$this->assertStringContainsString( ':root:where(.kb-tokens)', $css );
		// Bare :root must be present for editor-iframe coverage.
		$this->assertStringStartsWith( ':root,', $css );
	}

	public function testScopeMatchesSpec(): void {
		$this->assertSame( ':root,:root:where(.kb-tokens)', Scope::root() );
	}

	public function testItNeverEmitsImportant(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );
		$css = $this->builder()->css( $this->resolved( [], [ $var => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '!important', $css );
	}

	public function testEmptyByVarProducesNoTokenBlock(): void {
		$css = $this->builder()->css( $this->resolved() );

		$this->assertSame( '', $css );
	}

	// ---- Preset block -------------------------------------------------------------------------------

	public function testItEmitsWpPresetBridgeForBareStringCategory(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$css = $this->builder()->css( $this->resolved( [ $id => '#3182CE' ], [ $var => '#3182CE' ] ) );

		$this->assertStringContainsString( '--wp--preset--color--button-bg:var(' . $var . ');', $css );
	}

	public function testItHonorsExplicitCategoryAndSlug(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => [ 'category' => 'color', 'slug' => 'btn' ] ],
			]
		);

		$css = $this->builder()->css( $this->resolved( [ $id => '#3182CE' ], [ $var => '#3182CE' ] ) );

		$this->assertStringContainsString( '--wp--preset--color--btn:var(' . $var . ');', $css );
	}

	public function testItSkipsPresetWhenTokenHasNoResolvedValue(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		// by_id is empty — no resolved value for this id.
		$css = $this->builder()->css( $this->resolved( [], [ $var => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '--wp--preset--', $css );
	}

	public function testItSkipsPresetWhenTokenHasEmptyStringResolvedValue(): void {
		$id  = 'semantic.color.button-bg';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		// by_id has the key but with an empty value (e.g. an unrecognized $type rendered to '').
		$css = $this->builder()->css( $this->resolved( [ $id => '' ], [ $var => '' ] ) );

		$this->assertStringNotContainsString( '--wp--preset--', $css );
	}

	public function testNoPresetTokensProducesNoPresetBlock(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );
		$css = $this->builder()->css( $this->resolved( [], [ $var => '#3182CE' ] ) );

		$this->assertStringNotContainsString( '--wp--preset--', $css );
	}

	public function testBothBlocksEmptyWhenNothingResolved(): void {
		$css = $this->builder()->css( $this->resolved() );

		$this->assertSame( '', $css );
	}

	// ---- Spacing override block ---------------------------------------------------------------------

	public function testItEmitsSpacingOverrideForAClaimedSlot(): void {
		$id  = 'semantic.spacing.block';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => 'lg' ],
			]
		);

		// The slug variable is redefined as the token var, with the resolved length as a literal fallback.
		$css = $this->builder()->css( $this->resolved( [ $id => '2rem' ], [ $var => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-spacing-lg:var(' . $var . ',2rem);', $css );
	}

	public function testItSkipsSpacingOverrideForAnUnknownSlot(): void {
		$id  = 'semantic.spacing.block';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => 'enormous' ], // not a slug KB ships.
			]
		);

		$css = $this->builder()->css( $this->resolved( [ $id => '2rem' ], [ $var => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-spacing-', $css );
	}

	public function testItSkipsSpacingOverrideWhenTokenHasNoResolvedValue(): void {
		$id  = 'semantic.spacing.block';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Block spacing',
				'projections' => [ 'kb_spacing_slot' => 'lg' ],
			]
		);

		// by_id is empty — no resolved value, so no override (it would resolve to nothing in the browser).
		$css = $this->builder()->css( $this->resolved( [], [ $var => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-spacing-', $css );
	}

	public function testItEmitsGapOverrideForAClaimedSlot(): void {
		$id  = 'semantic.gap.layout';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Layout gap',
				'projections' => [ 'kb_gap_slot' => 'md' ],
			]
		);

		// The gap variable is defined as the token var, with the resolved length as a literal fallback.
		$css = $this->builder()->css( $this->resolved( [ $id => '2rem' ], [ $var => '2rem' ] ) );

		$this->assertStringContainsString( '--global-kb-gap-md:var(' . $var . ',2rem);', $css );
	}

	public function testItSkipsGapOverrideForAnAliasSlot(): void {
		$id  = 'semantic.gap.layout';
		$var = Css_Var::from_id( $id );

		$this->registry->register(
			[
				'id'          => $id,
				'type'        => 'dimension',
				'label'       => 'Layout gap',
				'projections' => [ 'kb_gap_slot' => 'default' ], // an alias for --global-kb-gap-md, not its own var.
			]
		);

		$css = $this->builder()->css( $this->resolved( [ $id => '2rem' ], [ $var => '2rem' ] ) );

		$this->assertStringNotContainsString( '--global-kb-gap-', $css );
	}

	/**
	 * Built from the real registry and resolver, the shipped declarations emit a slot override for every
	 * spacing and gap step Kadence Blocks ships, so each --global-kb-spacing-* / --global-kb-gap-* slug
	 * follows its token. The default resolves from baseline (no overrides), so each override carries the
	 * token var with KB's own length as the literal fallback.
	 *
	 * @return void
	 */
	public function testTheShippedDeclarationsEmitEverySpacingAndGapSlot(): void {
		$registry = $this->container->get( Token_Registry::class );
		$resolved = $this->container->get( Token_Resolver::class )->resolve();

		$css = ( new Css_Builder( $registry ) )->css( $resolved );

		foreach ( [ 'xxs', 'xs', 'sm', 'md', 'lg', 'xl', 'xxl', '3xl', '4xl', '5xl' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-spacing-' . $slug . ':var(', $css );
		}

		foreach ( [ 'none', 'xs', 'sm', 'md', 'lg' ] as $slug ) {
			$this->assertStringContainsString( '--global-kb-gap-' . $slug . ':var(', $css );
		}
	}

	// ---- sanitize_value -------------------------------------------------------------------------------

	public function testSanitizerStripsBreakoutCharacters(): void {
		$id  = 'semantic.color.bad';
		$var = Css_Var::from_id( $id );

		// Value containing characters that could break out of a declaration.
		$css = $this->builder()->css( $this->resolved( [], [ $var => 'red}body{color:blue' ] ) );

		// The structural braces of the :root{} block are fine; the injected chars inside the VALUE
		// must be stripped. Check the rendered declaration contains no unstripped breakout pattern.
		$this->assertStringNotContainsString( 'red}', $css );
		$this->assertStringNotContainsString( 'body{', $css );
		$this->assertStringContainsString( $var . ':redbodycolor:blue;', $css );
	}

	public function testSanitizerPreservesLegitimateClampValue(): void {
		$id  = 'semantic.dimension.spacing-md';
		$var = Css_Var::from_id( $id );

		$clamp = 'clamp(1.1rem, 0.995rem + 0.326vw, 1.25rem)';
		$css   = $this->builder()->css( $this->resolved( [], [ $var => $clamp ] ) );

		$this->assertStringContainsString( $clamp, $css );
	}

	public function testSanitizerPreservesFontFamilyStack(): void {
		$id  = 'semantic.font-family.base';
		$var = Css_Var::from_id( $id );

		$stack = '"Inter", "Helvetica Neue", Arial, sans-serif';
		$css   = $this->builder()->css( $this->resolved( [], [ $var => $stack ] ) );

		$this->assertStringContainsString( $stack, $css );
	}

	public function testSanitizerStripsControlCharacters(): void {
		$id  = 'semantic.color.ctrl';
		$var = Css_Var::from_id( $id );

		$css = $this->builder()->css( $this->resolved( [], [ $var => "#abc\x00def\x1Fghi" ] ) );

		$this->assertStringContainsString( '#abcdefghi', $css );
		$this->assertStringNotContainsString( "\x00", $css );
		$this->assertStringNotContainsString( "\x1F", $css );
	}

	// ---- Caching (css_for_version) ------------------------------------------------------------------

	public function testCssForVersionReturnsSameResultAsCss(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );

		$resolved = $this->resolved( [], [ $var => '#3182CE' ] );
		$builder  = $this->builder();

		$this->assertSame(
			$builder->css( $resolved ),
			$builder->css_for_version( $resolved, 'v1' )
		);
	}

	public function testCssForVersionServesFromObjectCacheOnSecondCall(): void {
		$var      = Css_Var::from_id( 'semantic.color.button-bg' );
		$resolved = $this->resolved( [], [ $var => '#3182CE' ] );
		$version  = 'test-version-cache';

		// Seed the cache with a sentinel so we can confirm it is served.
		$cache_key = 'projected_css_' . KADENCE_BLOCKS_VERSION . '_' . $version;
		wp_cache_set( $cache_key, 'SENTINEL', 'kb_design_tokens', DAY_IN_SECONDS );

		$result = $this->builder()->css_for_version( $resolved, $version );

		$this->assertSame( 'SENTINEL', $result );
	}

	public function testCssForVersionProducesDifferentCacheKeyOnVersionBump(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );

		$resolved = $this->resolved( [], [ $var => '#3182CE' ] );
		$builder  = $this->builder();

		$v1 = $builder->css_for_version( $resolved, 'version-a' );
		// Seed an old value under version-b.
		wp_cache_set( 'projected_css_' . KADENCE_BLOCKS_VERSION . '_version-b', 'OLD', 'kb_design_tokens', 1 );

		$v2 = $builder->css_for_version( $resolved, 'version-b' );

		// version-b served from cache seeded above.
		$this->assertSame( 'OLD', $v2 );
		// version-a was NOT the sentinel.
		$this->assertNotSame( 'OLD', $v1 );
	}
}
