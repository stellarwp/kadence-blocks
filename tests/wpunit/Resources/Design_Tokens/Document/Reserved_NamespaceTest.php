<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Document;

use Generator;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Reserved_Namespace;
use Tests\Support\Classes\TestCase;

/**
 * Covers the single source of truth for the user-primitive reserved namespace: primitive.color.custom.*.
 */
final class Reserved_NamespaceTest extends TestCase {

	// -------------------------------------------------------------------------
	// is_reserved_id()
	// -------------------------------------------------------------------------

	/**
	 * @dataProvider reservedIdProvider
	 *
	 * @param string $id       The canonical dot-path id under test.
	 * @param bool   $expected Whether $id should be recognized as reserved.
	 *
	 * @return void
	 */
	public function testIsReservedId( string $id, bool $expected ): void {
		$this->assertSame( $expected, Reserved_Namespace::is_reserved_id( $id ) );
	}

	/**
	 * @return Generator
	 */
	public function reservedIdProvider(): Generator {
		yield 'a color custom leaf' => [
			'id'       => 'primitive.color.custom.blue',
			'expected' => true,
		];

		yield 'a hyphenated slug' => [
			'id'       => 'primitive.color.custom.brand-accent',
			'expected' => true,
		];

		yield 'a non custom color primitive' => [
			'id'       => 'primitive.color.brand.accent',
			'expected' => false,
		];

		yield 'a custom segment under a different type' => [
			'id'       => 'primitive.spacing.custom.foo',
			'expected' => false,
		];

		yield 'a semantic layer path' => [
			'id'       => 'semantic.color.custom.foo',
			'expected' => false,
		];

		yield 'a path deeper than a single leaf' => [
			'id'       => 'primitive.color.custom.blue.extra',
			'expected' => false,
		];

		yield 'the bucket itself with no slug' => [
			'id'       => 'primitive.color.custom',
			'expected' => false,
		];
	}

	// -------------------------------------------------------------------------
	// contains_reserved_path()
	// -------------------------------------------------------------------------

	/**
	 * @dataProvider reservedPathProvider
	 *
	 * @param string $path     The dot-path under test.
	 * @param bool   $expected Whether $path should be recognized as reserved.
	 *
	 * @return void
	 */
	public function testContainsReservedPath( string $path, bool $expected ): void {
		$this->assertSame( $expected, Reserved_Namespace::contains_reserved_path( $path ) );
	}

	/**
	 * @return Generator
	 */
	public function reservedPathProvider(): Generator {
		yield 'the bucket root' => [
			'path'     => 'primitive.color.custom',
			'expected' => true,
		];

		yield 'a leaf under the bucket' => [
			'path'     => 'primitive.color.custom.blue',
			'expected' => true,
		];

		yield 'a sub-field of a composite value' => [
			'path'     => 'primitive.color.custom.blue.$value.h',
			'expected' => true,
		];

		yield 'a non custom color primitive' => [
			'path'     => 'primitive.color.brand.accent',
			'expected' => false,
		];

		yield 'a custom segment under a different type' => [
			'path'     => 'primitive.spacing.custom.foo',
			'expected' => false,
		];

		yield 'too short to reach the custom segment' => [
			'path'     => 'primitive.color',
			'expected' => false,
		];
	}

	// -------------------------------------------------------------------------
	// find_in()
	// -------------------------------------------------------------------------

	/**
	 * @return void
	 */
	public function testFindInReturnsEmptyWhenNothingIsReserved(): void {
		$node = [
			'color' => [
				'brand' => [
					'accent' => [
						'$type'  => 'color',
						'$value' => '#3182CE',
					],
				],
			],
		];

		$this->assertSame( [], Reserved_Namespace::find_in( $node, 'primitive' ) );
	}

	/**
	 * @return void
	 */
	public function testFindInReportsTheBucketRootRatherThanEveryLeafBeneathIt(): void {
		$node = [
			'color' => [
				'custom' => [
					'blue'  => [
						'$type'  => 'color',
						'$value' => '#0000ff',
					],
					'green' => [
						'$type'  => 'color',
						'$value' => '#00ff00',
					],
				],
			],
		];

		$this->assertSame( [ 'primitive.color.custom' ], Reserved_Namespace::find_in( $node, 'primitive' ) );
	}

	/**
	 * @return void
	 */
	public function testFindInIgnoresACustomSegmentUnderADifferentType(): void {
		$node = [
			'spacing' => [
				'custom' => [
					'foo' => [
						'$type'  => 'dimension',
						'$value' => '4px',
					],
				],
			],
		];

		$this->assertSame( [], Reserved_Namespace::find_in( $node, 'primitive' ) );
	}

	/**
	 * @return void
	 */
	public function testFindInSkipsDollarPrefixedKeys(): void {
		$node = [
			'color' => [
				'$description' => 'ignored',
			],
		];

		$this->assertSame( [], Reserved_Namespace::find_in( $node, 'primitive' ) );
	}
}
