<?php declare( strict_types=1 );
// cspell:ignore advancedbtn .

namespace Tests\snapshot\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Preset_Nav;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Order_Index;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Token_Sorter;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use Tests\Support\Classes\SnapshotTestCase;

/**
 * Snapshot the exact admin UI feed payload so any format change is an explicit, reviewable diff — the
 * regression guard that "register a token => it reaches the feed" stays true.
 *
 * @since TBD
 */
final class Builder_SnapshotTest extends SnapshotTestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	/**
	 * @since TBD
	 */
	public function testFullPayloadMatchesSnapshot(): void {
		$tokens = [
			[ 'semantic.color.button-bg', 'color', 'Button Background', 'Brand', [ 'kadence_slot' => 'palette1' ] ],
			[ 'semantic.color.button-text', 'color', 'Button Text', 'Brand', [] ],
			[ 'semantic.spacing.md', 'dimension', 'Medium', 'Layout', [] ],
		];

		$values = [];

		foreach ( $tokens as list( $id, $type, $label, $group, $projections ) ) {
			$this->registry->register(
				[
					'id'          => $id,
					'type'        => $type,
					'label'       => $label,
					'group'       => $group,
					'projections' => $projections,
				]
			);

			$values[ $id ] = '#000000';
		}

		$presets = [
			'kadence/advancedbtn' => [
				'bindings'   => [
					'button-bg' => [
						'token'       => 'semantic.color.button-bg',
						'projections' => [],
					],
				],
				'default'    => 'primary',
				'names'      => [ 'primary', 'ghost' ],
				'properties' => [ 'button-bg' ],
				'values'     => [
					'primary' => [ 'button-bg' => '#3182CE' ],
					'ghost'   => [ 'button-bg' => 'transparent' ],
				],
			],
		];

		$rest = [
			'root'      => 'https://example.test/wp-json/',
			'namespace' => 'kb-design-tokens/v1',
			'nonce'     => 'test-nonce',
		];

		$builder = new Builder( $this->registry, new Preset_Nav( $this->registry ), new Token_Sorter( new Token_Order_Index() ) );

		$feed = $builder->build( $values, true, $presets, $rest, 'v7', 'default' );

		// Structural assertions that must always hold regardless of snapshot content.
		$this->assertTrue( $feed['active'] );
		$this->assertArrayHasKey( 'groups', $feed['schema'] );
		$this->assertArrayHasKey( 'presets', $feed );
		$this->assertArrayHasKey( 'rest', $feed );

		$this->assertMatchesSnapshot( wp_json_encode( $feed, JSON_PRETTY_PRINT ) );
	}
}
