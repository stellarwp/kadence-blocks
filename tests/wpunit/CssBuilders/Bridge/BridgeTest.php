<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Bridge;

use BadMethodCallException;
use Generator;
use Kadence_Blocks_Css_Block_Bridge;
use Kadence_Blocks_Css_Block_Context;
use Tests\Support\Classes\TestCase;

/**
 * The bridge lets builders call the public helpers of a block and refuses everything else.
 */
final class BridgeTest extends TestCase {

	/**
	 * A public helper is called with its arguments and its result comes back.
	 *
	 * @return void
	 */
	public function testCallsPublicHelpers(): void {
		$bridge = new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() );

		$this->assertSame( 'public x', $bridge->call( 'public_helper', [ 'x' ] ) );
	}

	/**
	 * The bridge is a callable, so a context can use it where it used a closure.
	 *
	 * @return void
	 */
	public function testIsCallable(): void {
		$block   = new Fake_Block();
		$context = new Kadence_Blocks_Css_Block_Context( 'fake', new Kadence_Blocks_Css_Block_Bridge( $block ) );

		$this->assertTrue( is_callable( new Kadence_Blocks_Css_Block_Bridge( $block ) ) );
		$this->assertSame( 'public a', $context->call( 'public_helper', 'a' ) );
	}

	/**
	 * Asking for a helper the block does not have, or does not expose publicly, fails loudly instead of returning nothing.
	 *
	 * @dataProvider unavailableProvider
	 *
	 * @param string $member The helper.
	 *
	 * @return void
	 */
	public function testUnavailableHelperThrows( string $member ): void {
		$this->expectException( BadMethodCallException::class );
		$this->expectExceptionMessage( 'Tests\wpunit\CssBuilders\Bridge\Fake_Block has no public helper method named ' . $member . '.' );

		( new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() ) )->call( $member );
	}

	/**
	 * The bridge tells which public helpers the block has.
	 *
	 * @return void
	 */
	public function testHas(): void {
		$bridge = new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() );

		$this->assertTrue( $bridge->has( 'public_helper' ) );
		$this->assertFalse( $bridge->has( 'protected_helper' ) );
		$this->assertFalse( $bridge->has( 'private_helper' ) );
		$this->assertFalse( $bridge->has( 'hidden_list' ) );
		$this->assertFalse( $bridge->has( 'missing' ) );
	}

	/**
	 * @return Generator
	 */
	public function unavailableProvider(): Generator {
		yield 'missing' => [ 'member' => 'missing' ];
		yield 'protected' => [ 'member' => 'protected_helper' ];
		yield 'private' => [ 'member' => 'private_helper' ];
		yield 'property' => [ 'member' => 'hidden_list' ];
	}
}
