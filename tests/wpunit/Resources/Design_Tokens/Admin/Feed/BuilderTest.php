<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Preset_Nav;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\TestCase;

final class BuilderTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'group'       => 'Brand',
				'projections' => [ 'kadence_slot' => 'palette1' ],
			]
		);
	}

	/**
	 * @return array{root: string, namespace: string, nonce: string}
	 */
	private function rest(): array {
		return [
			'root'      => 'https://example.test/wp-json/',
			'namespace' => 'kb-design-tokens/v1',
			'nonce'     => 'abc123',
		];
	}

	/**
	 * A builder wired to the test registry and its Preset_Nav collaborator.
	 *
	 * @return Builder
	 */
	private function builder(): Builder {
		return new Builder( $this->registry, new Preset_Nav( $this->registry ) );
	}

	/**
	 * An active registry passes through the given values, presets, REST descriptor and version,
	 * paired with the registry's own structure.
	 *
	 * @return void
	 */
	public function testActiveRegistryPassesStructureAndInputsThrough(): void {
		$values  = [ 'semantic.color.button-bg' => '#3182CE' ];
		$presets = [ 'kadence/advancedbtn' => [ 'default' => 'primary' ] ];

		$feed = $this->builder()->build( $values, true, $presets, $this->rest(), 'v7', 'default' );

		$this->assertTrue( $feed['active'] );
		$this->assertTrue( $feed['resolved'] );
		$this->assertSame( 'v7', $feed['version'] );
		$this->assertSame( 'default', $feed['slug'] );
		$this->assertSame( $this->registry->to_ui_schema(), $feed['schema'] );
		$this->assertSame( $values, $feed['values'] );
		$this->assertSame( $presets, $feed['presets'] );
		$this->assertSame( $this->rest(), $feed['rest'] );
	}

	/**
	 * A failed resolution keeps the registry's structure in the feed but reports empty values.
	 *
	 * @return void
	 */
	public function testResolvedFalseKeepsStructureButEmptyValues(): void {
		$feed = $this->builder()->build( [], false, [], $this->rest(), 'v7', 'default' );

		$this->assertTrue( $feed['active'] );
		$this->assertFalse( $feed['resolved'] );
		$this->assertSame( $this->registry->to_ui_schema(), $feed['schema'] );
		$this->assertSame( [], $feed['values'] );
	}

	/**
	 * A successful resolution with no values yet still reports resolved:true and an empty values map.
	 *
	 * @return void
	 */
	public function testResolvedTrueWithEmptyValuesPassesThroughUnchanged(): void {
		$feed = $this->builder()->build( [], true, [], $this->rest(), 'v7', 'default' );

		$this->assertTrue( $feed['active'] );
		$this->assertTrue( $feed['resolved'] );
		$this->assertSame( 'v7', $feed['version'] );
		$this->assertSame( [], $feed['values'] );
	}

	/**
	 * A deactivated registry yields an empty, inactive payload with structure, values, presets and
	 * presetNav all cleared, while the REST descriptor, version and slug still pass through.
	 *
	 * @return void
	 */
	public function testDeactivatedRegistryYieldsEmptyInactivePayload(): void {
		$this->registry->deactivate();

		$feed = $this->builder()->build(
			[ 'semantic.color.button-bg' => '#3182CE' ],
			true,
			[ 'kadence/advancedbtn' => [] ],
			$this->rest(),
			'v7',
			'default'
		);

		$this->assertFalse( $feed['active'] );
		$this->assertFalse( $feed['resolved'] );
		$this->assertSame( [ 'groups' => [] ], $feed['schema'] );
		$this->assertSame( [], $feed['values'] );
		$this->assertSame( [], $feed['presets'] );
		$this->assertSame( [], $feed['presetNav'] );
		// The REST descriptor, version and slug are still present so the React app can wire even when hidden.
		$this->assertSame( $this->rest(), $feed['rest'] );
		$this->assertSame( 'v7', $feed['version'] );
		$this->assertSame( 'default', $feed['slug'] );
	}

	/**
	 * The slug passes through the feed unchanged regardless of whether the registry is active.
	 *
	 * @return void
	 */
	public function testSlugPassesThroughRegardlessOfActiveState(): void {
		$feed = $this->builder()->build( [], true, [], $this->rest(), 'v7', 'brand-b' );

		$this->assertSame( 'brand-b', $feed['slug'] );
	}

	/**
	 * An active registry with a labeled preset-bindings set surfaces it in the feed's presetNav
	 * section, keyed as a nav entry rather than folded into the presets structure.
	 *
	 * @return void
	 */
	public function testActiveRegistryIncludesThePresetNavSection(): void {
		$this->registry->register_preset_bindings(
			[
				'block'         => 'kadence/singlebtn',
				'label'         => 'Style',
				'style_library' => [ 'label' => 'Button' ],
			]
		);

		$feed = $this->builder()->build( [], true, [], $this->rest(), 'v7', 'default' );

		$this->assertSame(
			[
				[
					'block' => 'kadence/singlebtn',
					'label' => 'Button',
				],
			],
			$feed['presetNav']
		);
	}
}
