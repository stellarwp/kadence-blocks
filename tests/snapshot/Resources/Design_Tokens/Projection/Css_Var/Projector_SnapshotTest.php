<?php declare( strict_types=1 );

namespace Tests\snapshot\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\SnapshotTestCase;

/**
 * Snapshot the exact CSS output of Projector so any format change is an explicit, reviewable diff.
 *
 * @since TBD
 */
final class Projector_SnapshotTest extends SnapshotTestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function projector(): Projector {
		return new Projector( $this->registry );
	}

	/**
	 * @since TBD
	 */
	public function testFullOutputMatchesSnapshot(): void {
		$this->registry->register(
			[
				'id'          => 'semantic.color.button-bg',
				'type'        => 'color',
				'label'       => 'Button Background',
				'projections' => [ 'wp_preset' => 'color' ],
			]
		);

		$var      = Css_Var::from_id( 'semantic.color.button-bg' );
		$resolved = new Resolved_Tokens(
			[ 'semantic.color.button-bg' => '#3182CE' ],
			[ $var => '#3182CE' ]
		);

		$css = $this->projector()->css( $resolved );

		// Structural assertions that must always hold regardless of snapshot content.
		$this->assertStringContainsString( Projector::SCOPE, $css );
		$this->assertStringContainsString( '--kb-token--', $css );
		$this->assertStringContainsString( '--wp--preset--', $css );
		$this->assertStringNotContainsString( '!important', $css );

		// Snapshot the exact output so format changes are an explicit diff.
		$this->assertMatchesSnapshot( $css );
	}
}
