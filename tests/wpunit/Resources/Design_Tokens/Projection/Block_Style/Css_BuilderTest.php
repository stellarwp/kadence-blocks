<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Block_Style;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Block_Style\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;

/**
 * Covers the native block-style CSS builder against the shipped core/button variants: the per
 * (block, variant) scoped --wp--preset re-targeting and the variant-var indirection.
 */
final class Css_BuilderTest extends TestCase {

	private Css_Builder $builder;

	protected function setUp(): void {
		parent::setUp();

		$this->builder = $this->container->get( Css_Builder::class );
	}

	protected function tearDown(): void {
		// Clear the shared Token_Resolver memo so values resolved here do not leak into later test classes.
		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		parent::tearDown();
	}

	public function testItEmitsScopedWpPresetOverridesForNativeVariants(): void {
		$css = $this->builder->css();

		// core/button's primary resolves to the brand button colors, surfaced as variant vars...
		$this->assertStringContainsString( '--kb-token--variant--core-button--primary--button-bg:#3182CE;', $css );
		$this->assertStringContainsString( '--kb-token--variant--core-button--primary--button-text:#ffffff;', $css );
		// ...and the scoped rule re-targets the WordPress preset vars the block consumes at its $default.
		$this->assertStringContainsString( '.wp-block-button.is-style-kb-primary{', $css );
		$this->assertStringContainsString(
			'--wp--preset--color--button-bg:var(--kb-token--variant--core-button--primary--button-bg);',
			$css
		);
		$this->assertStringContainsString(
			'--wp--preset--color--button-text:var(--kb-token--variant--core-button--primary--button-text);',
			$css
		);
	}

	public function testItPassesLiteralValuesThroughAndScopesPerVariant(): void {
		$css = $this->builder->css();

		// ghost's button-bg is the literal "transparent" in the baseline.
		$this->assertStringContainsString( '--kb-token--variant--core-button--ghost--button-bg:transparent;', $css );
		$this->assertStringContainsString( '.wp-block-button.is-style-kb-ghost{', $css );
		$this->assertStringContainsString( '.wp-block-button.is-style-kb-secondary{', $css );
	}

	public function testItExcludesKadenceBlocks(): void {
		// Kadence blocks reach their variants through the kbVariant class path, not register_block_style.
		$css = $this->builder->css();

		$this->assertStringNotContainsString( 'advancedbtn', $css );
		$this->assertStringNotContainsString( 'kb-variant--', $css );
	}
}
