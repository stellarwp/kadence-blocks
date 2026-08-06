<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use Generator;
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
		$this->assertSame( $this->with_no_overrides( $this->registry->to_ui_schema() ), $feed['schema'] );
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
		$this->assertSame( $this->with_no_overrides( $this->registry->to_ui_schema() ), $feed['schema'] );
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

	/**
	 * A label override rewrites `label` and sets `labelOverridden` only on the matching row;
	 * every other row still carries the declared label and `labelOverridden: false`.
	 *
	 * @return void
	 */
	public function testOverridesRewriteLabelAndFlagOnlyMatchingIds(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => 'Button Text',
				'group'       => 'Brand',
				'projections' => [],
			]
		);

		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[ 'semantic.color.button-bg' => 'Cozy' ]
		);

		$rows = [];
		foreach ( $feed['schema']['groups'] as $group_rows ) {
			foreach ( $group_rows as $row ) {
				$rows[ $row['id'] ] = $row;
			}
		}

		$this->assertSame( 'Cozy', $rows['semantic.color.button-bg']['label'] );
		$this->assertTrue( $rows['semantic.color.button-bg']['labelOverridden'] );
		$this->assertSame( 'Button Text', $rows['semantic.color.button-text']['label'] );
		$this->assertFalse( $rows['semantic.color.button-text']['labelOverridden'] );
	}

	/**
	 * An override for an id the schema does not contain is ignored — no row gains it, and no
	 * error is raised.
	 *
	 * @return void
	 */
	public function testAnOverrideForAnUnknownIdIsIgnored(): void {
		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[ 'semantic.color.does-not-exist' => 'Ghost' ]
		);

		$this->assertSame( $this->with_no_overrides( $this->registry->to_ui_schema() ), $feed['schema'] );
	}

	/**
	 * An inactive registry still yields an empty schema regardless of overrides passed in.
	 *
	 * @return void
	 */
	public function testAnInactiveRegistryYieldsEmptySchemaRegardlessOfOverrides(): void {
		$this->registry->deactivate();

		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[ 'semantic.color.button-bg' => 'Cozy' ]
		);

		$this->assertSame( [ 'groups' => [] ], $feed['schema'] );
	}

	/**
	 * A stored order permutes a group's rows: ordered ids come first in stored sequence, and every
	 * remaining row from the registry follows in declaration order.
	 *
	 * @return void
	 */
	public function testOrderPermutesAGroupAndAppendsTheRestInDeclarationOrder(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => 'Button Text',
				'group'       => 'Brand',
				'projections' => [],
			]
		);
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-border',
				'type'        => 'color',
				'label'       => 'Button Border',
				'group'       => 'Brand',
				'projections' => [],
			]
		);

		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[],
			[ 'Brand' => [ 'semantic.color.button-text', 'semantic.color.button-bg' ] ]
		);

		$this->assertSame(
			[ 'semantic.color.button-text', 'semantic.color.button-bg', 'semantic.color.button-border' ],
			array_column( $feed['schema']['groups']['Brand'], 'id' )
		);
	}

	/**
	 * A stale id in the stored order (naming no row in the group) is skipped, never surfaced as a
	 * ghost row.
	 *
	 * @return void
	 */
	public function testOrderSkipsStaleIdsThatNameNoRowInTheGroup(): void {
		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[],
			[ 'Brand' => [ 'semantic.color.does-not-exist', 'semantic.color.button-bg' ] ]
		);

		$this->assertSame(
			[ 'semantic.color.button-bg' ],
			array_column( $feed['schema']['groups']['Brand'], 'id' )
		);
	}

	/**
	 * A group with no stored order is returned untouched — declaration order.
	 *
	 * @return void
	 */
	public function testAGroupWithNoStoredOrderIsUntouched(): void {
		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[],
			[ 'Spacing' => [ 'spacing.sm' ] ]
		);

		$this->assertSame(
			array_column( $this->registry->to_ui_schema()['groups']['Brand'], 'id' ),
			array_column( $feed['schema']['groups']['Brand'], 'id' )
		);
	}

	/**
	 * An empty order map is the identity transform — every group's row set and sequence is
	 * unchanged, exactly the declaration order the registry emits. This is the property the
	 * Builder payload snapshot pins: a snapshot regenerated for this ticket would hide a bug here.
	 *
	 * @return void
	 */
	public function testAnEmptyOrderMapIsTheIdentityTransform(): void {
		$feed = $this->builder()->build( [], true, [], $this->rest(), 'v7', 'default', [], '', [], [] );

		$this->assertSame( $this->with_no_overrides( $this->registry->to_ui_schema() ), $feed['schema'] );
	}

	/**
	 * Every fixture above preserves the full registered row set for the ordered group — a reorder
	 * permutes but never hides a token, regardless of which malformed or partial order is applied.
	 *
	 * @dataProvider orderFixtureProvider
	 *
	 * @param array<string, list<string>> $order The stored order to apply.
	 *
	 * @return void
	 */
	public function testOrderNeverChangesTheRegisteredRowSet( array $order ): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => 'Button Text',
				'group'       => 'Brand',
				'projections' => [],
			]
		);

		$feed = $this->builder()->build( [], true, [], $this->rest(), 'v7', 'default', [], '', [], $order );

		$this->assertEqualsCanonicalizing(
			[ 'semantic.color.button-bg', 'semantic.color.button-text' ],
			array_column( $feed['schema']['groups']['Brand'], 'id' )
		);
	}

	/**
	 * Order fixtures that must all preserve the full row set: a partial order, an order full of
	 * stale ids, a duplicated id, and an empty group order.
	 *
	 * @return Generator
	 */
	public function orderFixtureProvider(): Generator {
		yield 'partial order' => [
			'order' => [ 'Brand' => [ 'semantic.color.button-text' ] ],
		];

		yield 'order full of stale ids' => [
			'order' => [ 'Brand' => [ 'semantic.color.does-not-exist', 'semantic.color.also-missing' ] ],
		];

		yield 'duplicated id' => [
			'order' => [ 'Brand' => [ 'semantic.color.button-bg', 'semantic.color.button-bg' ] ],
		];

		yield 'empty group order' => [
			'order' => [ 'Brand' => [] ],
		];
	}

	/**
	 * A label override rides its row to the row's new position when both labels and order are
	 * applied together.
	 *
	 * @return void
	 */
	public function testLabelsAndOrderTogetherKeepTheOverriddenLabelOnItsRow(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => 'Button Text',
				'group'       => 'Brand',
				'projections' => [],
			]
		);

		$feed = $this->builder()->build(
			[],
			true,
			[],
			$this->rest(),
			'v7',
			'default',
			[],
			'',
			[ 'semantic.color.button-bg' => 'Cozy' ],
			[ 'Brand' => [ 'semantic.color.button-text', 'semantic.color.button-bg' ] ]
		);

		$rows = $feed['schema']['groups']['Brand'];

		$this->assertSame( 'semantic.color.button-text', $rows[0]['id'] );
		$this->assertSame( 'semantic.color.button-bg', $rows[1]['id'] );
		$this->assertSame( 'Cozy', $rows[1]['label'] );
		$this->assertTrue( $rows[1]['labelOverridden'] );
	}

	/**
	 * Overlay every row of a raw registry schema with `labelOverridden: false`, matching what the
	 * Builder does when no override map is passed. Used to keep the existing structural
	 * assertions comparing against the raw registry schema meaningful now that the Builder always
	 * augments its rows.
	 *
	 * @param array{groups: array<string, array<int, array<string, mixed>>>} $schema
	 *
	 * @return array{groups: array<string, array<int, array<string, mixed>>>}
	 */
	private function with_no_overrides( array $schema ): array {
		foreach ( $schema['groups'] as $group => $rows ) {
			foreach ( $rows as $i => $row ) {
				$schema['groups'][ $group ][ $i ]['labelOverridden'] = false;
			}
		}

		return $schema;
	}
}
