<?php declare( strict_types=1 );
// cspell:ignore palette Fghi redbodycolor .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Scope;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
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

	private function resolved( array $by_id = [], array $by_var = [] ): Resolved_Tokens {
		return new Resolved_Tokens( $by_id, $by_var );
	}

	// ---- Token block -------------------------------------------------------------------------------

	public function testItEmitsOneDeclarationPerVar(): void {
		$var = Css_Var::from_id( 'semantic.color.button-bg' );

		$css = $this->builder()->css( $this->resolved( [], [ $var => '#3182CE' ] ) );

		$this->assertStringContainsString( $var . ':#3182CE;', $css );
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
