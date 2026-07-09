<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Global_Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Global_Styles\Site_Editor_Preset_Locator;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class Site_Editor_Preset_LocatorTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function locator(): Site_Editor_Preset_Locator {
		return new Site_Editor_Preset_Locator( $this->registry );
	}

	/**
	 * Returns a Preset_Target for a token with wp_preset and site_editor projections.
	 *
	 * @return void
	 */
	public function testLocateReturnsSyncableToken(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [
					'wp_preset'   => 'color',
					'site_editor' => true,
				],
			]
		);

		$targets = $this->locator()->locate();

		$this->assertCount( 1, $targets );
		$this->assertSame( 'color', $targets[0]->category );
		$this->assertSame( 'button-bg', $targets[0]->slug );
		$this->assertSame( [ 'color', 'palette', 'theme' ], $targets[0]->path );
		$this->assertSame( 'color', $targets[0]->value_key );
	}

	/**
	 * Skips a token with wp_preset but no site_editor projection.
	 *
	 * @return void
	 */
	public function testLocateSkipsTokenWithoutSiteEditorProjection(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [
					'wp_preset' => 'color',
				],
			]
		);

		$targets = $this->locator()->locate();

		$this->assertCount( 0, $targets );
	}

	/**
	 * Skips a token with site_editor but no wp_preset projection.
	 *
	 * @return void
	 */
	public function testLocateSkipsTokenWithoutWpPresetProjection(): void {
		$this->registry->register(
			[
				'id'          => 'primitive.color.blue-500',
				'type'        => 'color',
				'label'       => 'Blue 500',
				'projections' => [
					'site_editor' => true,
				],
			]
		);

		$targets = $this->locator()->locate();

		$this->assertCount( 0, $targets );
	}

	/**
	 * Skips a token with site_editor set to false.
	 *
	 * @return void
	 */
	public function testLocateSkipsTokenWithSiteEditorFalse(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [
					'wp_preset'   => 'color',
					'site_editor' => false,
				],
			]
		);

		$targets = $this->locator()->locate();

		$this->assertCount( 0, $targets );
	}

	/**
	 * Skips a token with an unmapped wp_preset category.
	 *
	 * @return void
	 */
	public function testLocateSkipsUnmappedWpPresetCategory(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.radius.card',
				'type'        => 'dimension',
				'label'       => 'Card Radius',
				'projections' => [
					'wp_preset'   => 'radius',
					'site_editor' => true,
				],
			]
		);

		$targets = $this->locator()->locate();

		$this->assertCount( 0, $targets );
	}

	/**
	 * Against real shipped registry, returns color tokens with site_editor opt-in.
	 *
	 * @return void
	 */
	public function testLocateReturnsSemanticsColorButtonBgAndButtonText(): void {
		$registry = $this->container->get( Token_Registry::class );

		$locator = new Site_Editor_Preset_Locator( $registry );
		$targets = $locator->locate();

		$target_slugs = array_map(
			static fn( $target ) => $target->slug,
			array_filter(
				$targets,
				static fn( $target ) => $target->category === 'color'
			)
		);

		$this->assertContains( 'button-bg', $target_slugs );
		$this->assertContains( 'button-text', $target_slugs );
	}
}
