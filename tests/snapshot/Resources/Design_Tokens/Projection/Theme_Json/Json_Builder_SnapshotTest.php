<?php declare( strict_types=1 );
// cspell:ignore fontfamilies spacingsizes .

namespace Tests\snapshot\Resources\Design_Tokens\Projection\Theme_Json;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Theme_Json\Json_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\SnapshotTestCase;

/**
 * Snapshot the exact theme.json payload of Json_Builder so any format change is an explicit,
 * reviewable diff — one token per supported bucket.
 *
 * @since TBD
 */
final class Json_Builder_SnapshotTest extends SnapshotTestCase {

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
			[ 'semantic.color.button-bg', 'color', 'Button Background', 'color', '#3182CE' ],
			[ 'semantic.font.body', 'fontFamily', 'Body Font', 'font-family', 'Inter, sans-serif' ],
			[ 'semantic.spacing.md', 'dimension', 'Medium', 'spacing', '1rem' ],
			[ 'semantic.shadow.card', 'shadow', 'Card', 'shadow', '0 1px 2px rgba(0,0,0,.1)' ],
		];

		$by_id  = [];
		$by_var = [];

		foreach ( $tokens as list( $id, $type, $label, $category, $value ) ) {
			$this->registry->register(
				[
					'id'          => $id,
					'type'        => $type,
					'label'       => $label,
					'projections' => [ 'wp_preset' => $category ],
				]
			);

			$by_id[ $id ]                    = $value;
			$by_var[ Css_Var::from_id( $id ) ] = $value;
		}

		$payload = ( new Json_Builder( $this->registry ) )->payload( new Resolved_Tokens( $by_id, $by_var ) );

		// Structural assertions that must always hold regardless of snapshot content.
		$this->assertSame( 2, $payload['version'] );
		$this->assertArrayHasKey( 'color', $payload['settings'] );
		$this->assertArrayHasKey( 'typography', $payload['settings'] );
		$this->assertArrayHasKey( 'spacing', $payload['settings'] );
		$this->assertArrayHasKey( 'shadow', $payload['settings'] );

		// Snapshot the exact payload so format changes are an explicit diff.
		$this->assertMatchesSnapshot( wp_json_encode( $payload, JSON_PRETTY_PRINT ) );
	}
}
