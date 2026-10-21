<?php

declare( strict_types=1 );

namespace Tests\wpunit\Resources\Site_Styles;

use Generator;
use KadenceWP\KadenceBlocks\Site_Styles\Overlay;
use Tests\Support\Classes\TestCase;

/**
 * Covers merging a site-level value into an instance value, part by part,
 * scoping site values by the instance's style, and keeping the site values
 * of a group the instance sets itself out.
 */
final class OverlayMergeTest extends TestCase {

	/**
	 * The cases shared with the editor's merge, in `src/site-styles/__tests__/fixtures/`.
	 *
	 * @return array<string, array{mixed, mixed, mixed, mixed}>
	 */
	public function conformanceProvider(): array {
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/merge-conformance.json' );
		$this->assertIsString( $json );

		$cases = [];
		foreach ( json_decode( $json, true ) as $case ) {
			$cases[ $case['name'] ] = [ $case['instance'], $case['site'], $case['default'], $case['expected'] ];
		}

		return $cases;
	}

	/**
	 * @dataProvider conformanceProvider
	 *
	 * @param mixed $instance The instance value.
	 * @param mixed $site     The site value.
	 * @param mixed $default  The block's default.
	 * @param mixed $expected The merged value.
	 */
	public function testMergesLikeTheEditor( $instance, $site, $default, $expected ): void {
		$this->assertSame( $expected, Overlay::merge( $instance, $site, $default ) );
	}

	/**
	 * The scoping cases shared with the editor, in `src/site-styles/__tests__/fixtures/`.
	 *
	 * @return array<string, array{array<string, mixed>, array<string, mixed>, array{attribute: string, attributes: array<string, list<string>>}, mixed, array<string, mixed>}>
	 */
	public function scopeProvider(): array {
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/scope-conformance.json' );
		$this->assertIsString( $json );

		$cases = [];
		foreach ( json_decode( $json, true ) as $case ) {
			$cases[ $case['name'] ] = [ $case['site'], $case['instance'], $case['scope'], $case['defaultStyle'], $case['expected'] ];
		}

		return $cases;
	}

	/**
	 * @dataProvider scopeProvider
	 *
	 * @param array<string, mixed>                                              $site          The site values.
	 * @param array<string, mixed>                                              $instance      The instance's attributes.
	 * @param array{attribute: string, attributes: array<string, list<string>>} $scope         The block's scope.
	 * @param mixed                                                             $default_style The scope attribute's default.
	 * @param array<string, mixed>                                              $expected      The site values the instance takes.
	 */
	public function testScopesLikeTheEditor( array $site, array $instance, array $scope, $default_style, array $expected ): void {
		$this->assertSame( $expected, Overlay::scope( $site, $instance, $scope, $default_style ) );
	}

	/**
	 * Drops a group's site values like the editor does, for the cases shared with it.
	 *
	 * @dataProvider groupProvider
	 *
	 * @param array<string, mixed> $site     The site values.
	 * @param array<string, mixed> $instance The instance's attributes.
	 * @param list<list<string>>          $groups   The block's groups.
	 * @param array<string, mixed>        $defaults Attribute name => the block's default.
	 * @param array<string, mixed>        $expected The site values the instance takes.
	 * @param array<string, list<string>> $legacy   First attribute of a group => older attributes that stand in for it.
	 *
	 * @return void
	 */
	public function testGroupsLikeTheEditor( array $site, array $instance, array $groups, array $defaults, array $expected, array $legacy ): void {
		$this->assertSame( $expected, Overlay::group( $site, $instance, $groups, $defaults, $legacy ) );
	}

	/**
	 * The grouping cases shared with the editor, in `src/site-styles/__tests__/fixtures/`.
	 *
	 * @return Generator
	 */
	public function groupProvider(): Generator {
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/group-conformance.json' );
		$this->assertIsString( $json );

		foreach ( json_decode( $json, true ) as $case ) {
			yield $case['name'] => [
				'site'     => $case['site'],
				'instance' => $case['instance'],
				'groups'   => $case['groups'],
				'defaults' => $case['defaults'],
				'expected' => $case['expected'],
				'legacy'   => $case['legacy'] ?? [],
			];
		}
	}

	/**
	 * The cascade cases shared with the editor, in `src/site-styles/__tests__/fixtures/`.
	 *
	 * @return Generator
	 */
	public function cascadeProvider(): Generator {
		$json = file_get_contents( KADENCE_BLOCKS_PATH . 'src/site-styles/__tests__/fixtures/cascade-conformance.json' );
		$this->assertIsString( $json );

		$fixture = json_decode( $json, true );

		foreach ( $fixture['cases'] as $case ) {
			yield $case['name'] => [
				'site'     => $case['site'],
				'instance' => $case['instance'],
				'defaults' => $fixture['defaults'],
				'cascades' => $fixture['cascades'],
				'expected' => $case['expected'],
			];
		}
	}

	/**
	 * The site values an own value of the instance covers are dropped, like the editor does: a site value in another unit than the own value's, and the narrower devices after an own value.
	 *
	 * @dataProvider cascadeProvider
	 *
	 * @param array<string, mixed>                                   $site     The site values.
	 * @param array<string, mixed>                                   $instance The instance's attributes.
	 * @param array<string, mixed>                                   $defaults The attributes' defaults.
	 * @param array<int, array{unit?: string, values: list<string>}> $cascades The attribute cascades.
	 * @param array<string, mixed>                                   $expected The site values left.
	 *
	 * @return void
	 */
	public function testCascadesLikeTheEditor( array $site, array $instance, array $defaults, array $cascades, array $expected ): void {
		$this->assertSame( $expected, Overlay::without_overridden( $site, $instance, $defaults, $cascades ) );
	}
}
