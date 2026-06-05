<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use KadenceWP\KadenceBlocks\Design_Tokens\Document\Document_Mutator;
use Tests\Support\Classes\TestCase;

/**
 * Covers the pure merge / set / remove transforms the REST write layer uses to assemble a candidate
 * overrides document.
 */
final class Document_MutatorTest extends TestCase {

	/**
	 * @var Document_Mutator
	 */
	private Document_Mutator $mutator;

	/**
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->mutator = new Document_Mutator();
	}

	/**
	 * @return void
	 */
	public function testMergeDeepMergesGroupsKeepingUntouchedPaths(): void {
		$current = [
			'primitive' => [
				'color' => [
					'a' => [ '$type' => 'color', '$value' => '#aaaaaa' ],
				],
			],
		];

		$merged = $this->mutator->merge(
			$current,
			[
				'primitive' => [
					'color' => [
						'b' => [ '$type' => 'color', '$value' => '#bbbbbb' ],
					],
				],
			]
		);

		$this->assertSame( '#aaaaaa', $merged['primitive']['color']['a']['$value'] );
		$this->assertSame( '#bbbbbb', $merged['primitive']['color']['b']['$value'] );
	}

	/**
	 * @return void
	 */
	public function testMergeReplacesALeafWholesaleRatherThanFieldMerging(): void {
		$current = [
			'primitive' => [
				'color' => [
					'a' => [ '$type' => 'color', '$value' => '#aaaaaa', '$description' => 'keep?' ],
				],
			],
		];

		$merged = $this->mutator->merge(
			$current,
			[
				'primitive' => [
					'color' => [
						'a' => [ '$type' => 'color', '$value' => '#000000' ],
					],
				],
			]
		);

		// The whole leaf is replaced: the new value lands and the old $description does not linger.
		$this->assertSame( '#000000', $merged['primitive']['color']['a']['$value'] );
		$this->assertArrayNotHasKey( '$description', $merged['primitive']['color']['a'] );
	}

	/**
	 * @return void
	 */
	public function testMergeStoresSentinelsWholesale(): void {
		$current = [
			'primitive' => [
				'color' => [
					'a' => [ '$type' => 'color', '$value' => '#aaaaaa' ],
				],
			],
		];

		$merged = $this->mutator->merge(
			$current,
			[
				'primitive' => [
					'color' => [
						'a' => [ '$value' => null ],
					],
				],
			]
		);

		// The reset sentinel is stored verbatim for the Resolver to interpret, not applied here.
		$this->assertSame( [ '$value' => null ], $merged['primitive']['color']['a'] );
	}

	/**
	 * @return void
	 */
	public function testMergePreservesTheExtensionsLayer(): void {
		$current = [
			'primitive'   => [
				'color' => [
					'a' => [ '$type' => 'color', '$value' => '#aaaaaa' ],
				],
			],
			'$extensions' => [
				'com.kadence.designTokens' => [ 'variants' => [ 'core/button' => [ '$default' => 'solid' ] ] ],
			],
		];

		$merged = $this->mutator->merge(
			$current,
			[
				'primitive' => [
					'color' => [
						'a' => [ '$type' => 'color', '$value' => '#000000' ],
					],
				],
			]
		);

		$this->assertSame( $current['$extensions'], $merged['$extensions'] );
	}

	/**
	 * @return void
	 */
	public function testSetCreatesIntermediateGroups(): void {
		$document = $this->mutator->set( [], 'primitive.color.brand', [ '$type' => 'color', '$value' => '#3182CE' ] );

		$this->assertSame( '#3182CE', $document['primitive']['color']['brand']['$value'] );
	}

	/**
	 * @return void
	 */
	public function testSetReplacesAnExistingLeaf(): void {
		$document = $this->mutator->set(
			[ 'primitive' => [ 'color' => [ 'brand' => [ '$type' => 'color', '$value' => '#000000' ] ] ] ],
			'primitive.color.brand',
			[ '$type' => 'color', '$value' => '#3182CE' ]
		);

		$this->assertSame( '#3182CE', $document['primitive']['color']['brand']['$value'] );
	}

	/**
	 * @return void
	 */
	public function testSetReplacesALeafInThePathWithAGroup(): void {
		// "primitive.color" starts as a leaf; setting a token below it must replace it with a group.
		$document = $this->mutator->set(
			[ 'primitive' => [ 'color' => [ '$type' => 'color', '$value' => '#000000' ] ] ],
			'primitive.color.brand',
			[ '$type' => 'color', '$value' => '#3182CE' ]
		);

		$this->assertSame( '#3182CE', $document['primitive']['color']['brand']['$value'] );
		$this->assertArrayNotHasKey( '$value', $document['primitive']['color'] );
	}

	/**
	 * @return void
	 */
	public function testRemoveDeletesTheLeafAndPrunesEmptyAncestors(): void {
		$document = $this->mutator->remove(
			[ 'primitive' => [ 'color' => [ 'brand' => [ '$type' => 'color', '$value' => '#3182CE' ] ] ] ],
			'primitive.color.brand'
		);

		// The whole now-empty chain is pruned, leaving an empty document.
		$this->assertSame( [], $document );
	}

	/**
	 * @return void
	 */
	public function testRemoveKeepsSiblingsWhilePruning(): void {
		$document = $this->mutator->remove(
			[
				'primitive' => [
					'color' => [
						'brand' => [ '$type' => 'color', '$value' => '#3182CE' ],
						'accent' => [ '$type' => 'color', '$value' => '#dd0000' ],
					],
				],
			],
			'primitive.color.brand'
		);

		$this->assertArrayNotHasKey( 'brand', $document['primitive']['color'] );
		$this->assertSame( '#dd0000', $document['primitive']['color']['accent']['$value'] );
	}

	/**
	 * @return void
	 */
	public function testRemoveIsANoOpWhenThePathIsAbsent(): void {
		$current = [ 'primitive' => [ 'color' => [ 'brand' => [ '$type' => 'color', '$value' => '#3182CE' ] ] ] ];

		$document = $this->mutator->remove( $current, 'primitive.color.missing' );

		$this->assertSame( $current, $document );
	}
}
