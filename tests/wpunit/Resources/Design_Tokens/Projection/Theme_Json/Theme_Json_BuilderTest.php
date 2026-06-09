<?php declare( strict_types=1 );
// cspell:ignore fontfamilies fontfamily spacingsizes .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json\Theme_Json_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\TestCase;

final class Theme_Json_BuilderTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function builder(): Theme_Json_Builder {
		return new Theme_Json_Builder( $this->registry );
	}

	/**
	 * Register a token and return a Resolved_Tokens carrying its value, so the builder treats it as
	 * resolvable.
	 *
	 * @param array<string, mixed> $definition Token declaration.
	 * @param string               $value      Resolved value (empty string => unresolved).
	 */
	private function resolved_for( array $definition, string $value = '#3182CE' ): Resolved_Tokens {
		$this->registry->register( $definition );

		$id  = (string) $definition['id'];
		$var = Css_Var::from_id( $id );

		return new Resolved_Tokens( [ $id => $value ], [ $var => $value ] );
	}

	public function testHasPresetsIsFalseWithNoPresetTokens(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);

		$this->assertFalse( $this->builder()->has_presets() );
	}

	public function testHasPresetsIsTrueWhenAWpPresetTokenExists(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$this->assertTrue( $this->builder()->has_presets() );
	}

	public function testColorTokenLandsInPaletteThemeWithVarValue(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$payload = $this->builder()->payload( $resolved );

		$entry = $payload['settings']['color']['palette']['theme'][0];

		$this->assertSame( 'button-bg', $entry['slug'] );
		$this->assertSame( 'Button Background', $entry['name'] );
		$this->assertSame( 'var(--kb-token--semantic--color--button-bg)', $entry['color'] );
	}

	public function testFontFamilyTokenLandsInFontFamiliesTheme(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.font.body',
				'type'        => 'fontFamily',
				'label'       => 'Body Font',
				'projections' => [ 'wp_preset' => 'font-family' ],
			],
			'Inter, sans-serif'
		);

		$entry = $this->builder()->payload( $resolved )['settings']['typography']['fontFamilies']['theme'][0];

		$this->assertSame( 'body', $entry['slug'] );
		$this->assertSame( 'var(--kb-token--semantic--font--body)', $entry['fontFamily'] );
	}

	public function testSpacingTokenLandsInFlatSpacingSizes(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.spacing.md',
				'type'        => 'dimension',
				'label'       => 'Medium',
				'projections' => [ 'wp_preset' => 'spacing' ],
			],
			'1rem'
		);

		$settings = $this->builder()->payload( $resolved )['settings'];

		// Spacing sizes are a flat list, not nested under a "theme" origin key.
		$this->assertArrayNotHasKey( 'theme', $settings['spacing']['spacingSizes'] );

		$entry = $settings['spacing']['spacingSizes'][0];
		$this->assertSame( 'md', $entry['slug'] );
		$this->assertSame( 'var(--kb-token--semantic--spacing--md)', $entry['size'] );
	}

	public function testShadowTokenLandsInFlatShadowPresets(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.shadow.card',
				'type'        => 'shadow',
				'label'       => 'Card',
				'projections' => [ 'wp_preset' => 'shadow' ],
			],
			'0 1px 2px rgba(0,0,0,.1)'
		);

		$entry = $this->builder()->payload( $resolved )['settings']['shadow']['presets'][0];

		$this->assertSame( 'card', $entry['slug'] );
		$this->assertSame( 'var(--kb-token--semantic--shadow--card)', $entry['shadow'] );
	}

	public function testUnmappedCategoryIsOmitted(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.radius.card',
				'type'        => 'dimension',
				'label'       => 'Card Radius',
				'projections' => [ 'wp_preset' => 'radius' ],
			],
			'8px'
		);

		// "radius" has no native theme.json preset bucket, so nothing is projected.
		$this->assertSame( [], $this->builder()->payload( $resolved ) );
	}

	public function testTokenWithEmptyResolvedValueIsOmitted(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			],
			''
		);

		$this->assertSame( [], $this->builder()->payload( $resolved ) );
	}

	public function testExplicitSlugIsHonored(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [
					'wp_preset' => [
						'category' => 'color',
						'slug'     => 'btn',
					],
				],
			]
		);

		$var      = Css_Var::from_id( 'semantic.color.button-bg' );
		$resolved = new Resolved_Tokens(
			[ 'semantic.color.button-bg' => '#3182CE' ],
			[ $var => '#3182CE' ]
		);

		$entry = $this->builder()->payload( $resolved )['settings']['color']['palette']['theme'][0];

		$this->assertSame( 'btn', $entry['slug'] );
	}

	public function testPayloadIsEmptyWhenNothingProjects(): void {
		$this->assertSame( [], $this->builder()->payload( new Resolved_Tokens( [], [] ) ) );
	}

	public function testPayloadWrapsSettingsInVersionTwo(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$payload = $this->builder()->payload( $resolved );

		$this->assertSame( 2, $payload['version'] );
		$this->assertArrayHasKey( 'settings', $payload );
	}

	public function testMultipleColorTokensShareOnePaletteList(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => 'Button Text',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$resolved = new Resolved_Tokens(
			[
				'semantic.color.button-bg'   => '#3182CE',
				'semantic.color.button-text' => '#FFFFFF',
			],
			[
				Css_Var::from_id( 'semantic.color.button-bg' )   => '#3182CE',
				Css_Var::from_id( 'semantic.color.button-text' ) => '#FFFFFF',
			]
		);

		$palette = $this->builder()->payload( $resolved )['settings']['color']['palette']['theme'];

		$this->assertCount( 2, $palette );
	}

	public function testPayloadForVersionServesFromObjectCacheOnSecondCall(): void {
		$resolved = $this->resolved_for(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$builder = $this->builder();
		$first   = $builder->payload_for_version( $resolved, 'v1' );

		// A fresh builder shares the object cache but not the per-request memo, so a cache hit on the
		// same version returns the identical payload without rebuilding from the (here empty) registry.
		$cold   = new Theme_Json_Builder( new Token_Registry() );
		$second = $cold->payload_for_version( new Resolved_Tokens( [], [] ), 'v1' );

		$this->assertSame( $first, $second );
	}
}
