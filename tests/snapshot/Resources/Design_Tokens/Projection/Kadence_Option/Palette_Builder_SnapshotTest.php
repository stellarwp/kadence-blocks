<?php declare( strict_types=1 );
// cspell:ignore palette .

namespace Tests\snapshot\Resources\Design_Tokens\Projection\Kadence_Option;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Option\Palette_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\SnapshotTestCase;

/**
 * Snapshot the exact merged kadence_blocks_colors payload of Palette_Builder so any format change is
 * an explicit, reviewable diff.
 *
 * @since TBD
 */
final class Palette_Builder_SnapshotTest extends SnapshotTestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	public function testMergedKbColorsPayloadMatchesSnapshot(): void {
		$tokens = [
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'kadence_slot' => 'palette1' ],
				'value'       => '#3182CE',
			],
			[
				'id'          => 'semantic.color.button-text',
				'type'        => 'color',
				'label'       => 'Button Text',
				'projections' => [ 'kadence_slot' => 'palette2' ],
				'value'       => '#FFFFFF',
			],
		];

		$by_id  = [];
		$by_var = [];

		foreach ( $tokens as $token ) {
			$this->registry->register(
				[
					'id'          => $token['id'],
					'type'        => $token['type'],
					'label'       => $token['label'],
					'projections' => $token['projections'],
				]
			);
			$by_id[ $token['id'] ]                      = $token['value'];
			$by_var[ Css_Var::from_id( $token['id'] ) ] = $token['value'];
		}

		$resolved = new Resolved_Tokens( $by_id, $by_var );
		$builder  = new Palette_Builder( $this->registry );

		$existing = [
			'palette'  => [
				[
					'color' => '#old-palette1',
					'name'  => 'Old Name 1',
					'slug'  => 'palette1',
				],
				[
					'color' => '#aabbcc',
					'name'  => 'Custom Entry',
					'slug'  => 'palette5',
				],
			],
			'override' => false,
		];

		$entries = $builder->entries( $resolved );
		$merged  = $builder->merge_kadence_blocks_colors( $existing, $entries );

		$this->assertMatchesSnapshot( wp_json_encode( $merged, JSON_PRETTY_PRINT ) );
	}
}
