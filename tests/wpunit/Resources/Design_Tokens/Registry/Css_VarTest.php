<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use Tests\Support\Classes\TestCase;

final class Css_VarTest extends TestCase {

	public function testItMatchesTheWorkedExample(): void {
		$this->assertSame(
			'--kb-token--semantic--color--button-bg',
			Css_Var::from_id( 'semantic.color.button-bg' )
		);
	}

	public function testItPrefixesASingleSegmentId(): void {
		$this->assertSame( '--kb-token--brand', Css_Var::from_id( 'brand' ) );
	}

	public function testItHandlesArbitraryDepth(): void {
		$this->assertSame(
			'--kb-token--a--b--c--d--e',
			Css_Var::from_id( 'a.b.c.d.e' )
		);
	}

	public function testItIsDeterministicAcrossCalls(): void {
		$this->assertSame(
			Css_Var::from_id( 'semantic.color.button-bg' ),
			Css_Var::from_id( 'semantic.color.button-bg' )
		);
	}

	/**
	 * A non-empty namespace is inserted as a leading segment after the prefix, so each set's tokens get
	 * their own --kb-token--<set>--* namespace.
	 *
	 * @return void
	 */
	public function testItNamespacesUnderASet(): void {
		$this->assertSame(
			'--kb-token--dark--semantic--color--button-bg',
			Css_Var::from_id( 'semantic.color.button-bg', 'dark' )
		);
	}

	/**
	 * An empty namespace yields the canonical name, identical to the single-argument call.
	 *
	 * @return void
	 */
	public function testAnEmptyNamespaceYieldsTheCanonicalName(): void {
		$this->assertSame(
			Css_Var::from_id( 'semantic.color.button-bg' ),
			Css_Var::from_id( 'semantic.color.button-bg', '' )
		);
	}
}
