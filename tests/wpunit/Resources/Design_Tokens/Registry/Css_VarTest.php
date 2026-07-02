<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Css_Var;
use Tests\Support\Classes\TestCase;

final class Css_VarTest extends TestCase {

	/**
	 * The worked example from the derivation rule: a dot-path id gains the prefix and each dot becomes a
	 * double hyphen.
	 *
	 * @return void
	 */
	public function testItMatchesTheWorkedExample(): void {
		$this->assertSame(
			'--kb-token--semantic--color--button-bg',
			Css_Var::from_id( 'semantic.color.button-bg' )
		);
	}

	/**
	 * A single-segment id (no dots) is simply prefixed, with nothing to replace.
	 *
	 * @return void
	 */
	public function testItPrefixesASingleSegmentId(): void {
		$this->assertSame( '--kb-token--brand', Css_Var::from_id( 'brand' ) );
	}

	/**
	 * Every dot in an arbitrarily deep id is replaced, so the rule is not limited to a fixed segment count.
	 *
	 * @return void
	 */
	public function testItHandlesArbitraryDepth(): void {
		$this->assertSame(
			'--kb-token--a--b--c--d--e',
			Css_Var::from_id( 'a.b.c.d.e' )
		);
	}

	/**
	 * The same id always derives the same name, since the rule is pure with no hidden state.
	 *
	 * @return void
	 */
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

	/**
	 * A namespace is reduced to a CSS-identifier-safe segment so it cannot break out of the variable name;
	 * unsafe characters collapse to a single hyphen.
	 *
	 * @return void
	 */
	public function testItSanitizesTheNamespaceSegment(): void {
		$this->assertSame(
			'--kb-token--dark-theme--semantic--color--button-bg',
			Css_Var::from_id( 'semantic.color.button-bg', 'dark/theme' )
		);
	}
}
