<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Builder;
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
				'projections' => [ 'wp_preset' => 'color' ],
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

	public function testActiveRegistryPassesStructureAndInputsThrough(): void {
		$values   = [ 'semantic.color.button-bg' => '#3182CE' ];
		$variants = [ 'kadence/advancedbtn' => [ 'default' => 'primary' ] ];

		$feed = ( new Builder( $this->registry ) )->build( $values, true, $variants, $this->rest(), 7 );

		$this->assertTrue( $feed['active'] );
		$this->assertTrue( $feed['resolved'] );
		$this->assertSame( 7, $feed['version'] );
		$this->assertSame( $this->registry->to_ui_schema(), $feed['schema'] );
		$this->assertSame( $values, $feed['values'] );
		$this->assertSame( $variants, $feed['variants'] );
		$this->assertSame( $this->rest(), $feed['rest'] );
	}

	public function testResolvedFalseKeepsStructureButEmptyValues(): void {
		$feed = ( new Builder( $this->registry ) )->build( [], false, [], $this->rest(), 7 );

		$this->assertTrue( $feed['active'] );
		$this->assertFalse( $feed['resolved'] );
		$this->assertSame( $this->registry->to_ui_schema(), $feed['schema'] );
		$this->assertSame( [], $feed['values'] );
	}

	public function testResolvedTrueWithEmptyValuesPassesThroughUnchanged(): void {
		$feed = ( new Builder( $this->registry ) )->build( [], true, [], $this->rest(), 7 );

		$this->assertTrue( $feed['active'] );
		$this->assertTrue( $feed['resolved'] );
		$this->assertSame( [], $feed['values'] );
	}

	public function testDeactivatedRegistryYieldsEmptyInactivePayload(): void {
		$this->registry->deactivate();

		$feed = ( new Builder( $this->registry ) )->build(
			[ 'semantic.color.button-bg' => '#3182CE' ],
			true,
			[ 'kadence/advancedbtn' => [] ],
			$this->rest(),
			7
		);

		$this->assertFalse( $feed['active'] );
		$this->assertFalse( $feed['resolved'] );
		$this->assertSame( [ 'groups' => [] ], $feed['schema'] );
		$this->assertSame( [], $feed['values'] );
		$this->assertSame( [], $feed['variants'] );
		// The REST descriptor and version are still present so the React app can wire even when hidden.
		$this->assertSame( $this->rest(), $feed['rest'] );
		$this->assertSame( 7, $feed['version'] );
	}
}
