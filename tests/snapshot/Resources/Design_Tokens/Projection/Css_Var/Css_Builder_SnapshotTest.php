<?php declare( strict_types=1 );

namespace Tests\snapshot\Resources\Design_Tokens\Projection\Css_Var;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Css_Var\Css_Builder;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use Tests\Support\Classes\SnapshotTestCase;

/**
 * Snapshot the exact CSS output of Css_Builder so any format change is an explicit, reviewable diff.
 *
 * @since TBD
 */
final class Css_Builder_SnapshotTest extends SnapshotTestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	private function builder(): Css_Builder {
		return new Css_Builder( $this->registry );
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

		$css = $this->builder()->css( $resolved );

		// Structural assertions that must always hold regardless of snapshot content.
		$this->assertStringContainsString( Css_Builder::SCOPE, $css );
		$this->assertStringContainsString( '--kb-token--', $css );
		$this->assertStringContainsString( '--wp--preset--', $css );
		$this->assertStringNotContainsString( '!important', $css );

		// Snapshot the exact output so format changes are an explicit diff.
		$this->assertMatchesSnapshot( $css );
	}
}
