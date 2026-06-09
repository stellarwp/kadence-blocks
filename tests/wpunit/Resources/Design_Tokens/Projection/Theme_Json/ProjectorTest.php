<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json\Json_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;
use ReflectionProperty;
use Tests\Support\Classes\TestCase;
use WP_Theme_JSON_Data;

final class ProjectorTest extends TestCase {

	private Projector $projector;
	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		// Projector and registry were registered as singletons during module bootstrap. The shipped
		// declarations include color tokens (button-bg, button-text) with a wp_preset projection.
		$this->projector = $this->container->get( Projector::class );
		$this->registry  = $this->container->get( Token_Registry::class );
	}

	protected function tearDown(): void {
		$this->registry->activate();

		// Clear the resolver memo so values resolved here do not leak into later test classes.
		$resolver = $this->container->get( Token_Resolver::class );
		$memo     = new ReflectionProperty( Token_Resolver::class, 'memo' );
		$memo->setAccessible( true );
		$memo->setValue( $resolver, [] );

		parent::tearDown();
	}

	private function theme_json( array $data = [] ): WP_Theme_JSON_Data {
		return new WP_Theme_JSON_Data(
			array_merge( [ 'version' => 2 ], $data ),
			'theme'
		);
	}

	private function palette( WP_Theme_JSON_Data $theme_json ): array {
		$data = $theme_json->get_data();

		return $data['settings']['color']['palette']['theme'] ?? [];
	}

	public function testInjectAddsTokenColorPresetsWithVarValues(): void {
		$result = $this->projector->inject( $this->theme_json() );

		$slugs = array_column( $this->palette( $result ), 'slug', 'slug' );
		$this->assertArrayHasKey( 'button-bg', $slugs );

		$by_slug = array_column( $this->palette( $result ), null, 'slug' );
		$this->assertSame( 'var(--kb-token--semantic--color--button-bg)', $by_slug['button-bg']['color'] );
	}

	public function testInactiveRegistryLeavesThemeJsonUntouched(): void {
		$this->registry->deactivate();

		$result = $this->projector->inject( $this->theme_json() );

		$this->assertSame( [], $this->palette( $result ) );
	}

	public function testEarlyBailWhenNoPresetTokens(): void {
		// A fresh projector over an empty registry must not touch theme.json.
		$empty_registry = new Token_Registry();
		$projector      = new Projector(
			$empty_registry,
			$this->container->get( Token_Resolver::class ),
			$this->container->get( Token_Store::class ),
			new Json_Builder( $empty_registry )
		);

		$result = $projector->inject( $this->theme_json() );

		$this->assertSame( [], $this->palette( $result ) );
	}

	public function testMergePreservesExistingPaletteEntries(): void {
		$existing = $this->theme_json(
			[
				'settings' => [
					'color' => [
						'palette' => [
							'theme' => [
								[
									'slug'  => 'theme-accent',
									'name'  => 'Theme Accent',
									'color' => '#ff0000',
								],
							],
						],
					],
				],
			]
		);

		$result = $this->projector->inject( $existing );
		$slugs  = array_column( $this->palette( $result ), 'slug' );

		$this->assertContains( 'theme-accent', $slugs );
		$this->assertContains( 'button-bg', $slugs );
	}

	public function testSlugCollisionKeepsExistingEntry(): void {
		$existing = $this->theme_json(
			[
				'settings' => [
					'color' => [
						'palette' => [
							'theme' => [
								[
									'slug'  => 'button-bg',
									'name'  => 'Pre-existing',
									'color' => '#abcdef',
								],
							],
						],
					],
				],
			]
		);

		$result = $this->projector->inject( $existing );
		$by_slug = array_column( $this->palette( $result ), null, 'slug' );

		// The existing entry wins on a slug collision; the token var does not overwrite it.
		$this->assertSame( '#abcdef', $by_slug['button-bg']['color'] );
		// And it appears exactly once.
		$this->assertCount( 1, array_filter( $this->palette( $result ), static fn( $e ) => $e['slug'] === 'button-bg' ) );
	}

	public function testBothThemeJsonFiltersHaveTheInjectCallback(): void {
		$this->assertNotFalse( has_filter( 'wp_theme_json_data_default' ) );
		$this->assertNotFalse( has_filter( 'wp_theme_json_data_theme' ) );
	}
}
