<?php declare( strict_types=1 );

namespace Tests\wpunit\CssBuilders\Bridge;

use BadMethodCallException;
use Generator;
use Kadence_Blocks_Css_Block_Bridge;
use Kadence_Blocks_Css_Block_Context;
use Tests\Support\Classes\TestCase;

/**
 * The bridge lets builders call the helpers of a block, whatever their visibility.
 */
final class BridgeTest extends TestCase {

	/**
	 * A helper is called with its arguments and its result comes back, for every visibility.
	 *
	 * @dataProvider helperProvider
	 *
	 * @param string  $member    The helper.
	 * @param mixed[] $arguments The arguments.
	 * @param string  $expected  The result.
	 *
	 * @return void
	 */
	public function testCallsHelpersOfEveryVisibility( string $member, array $arguments, string $expected ): void {
		$bridge = new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() );

		$this->assertSame( $expected, $bridge->call( $member, $arguments ) );
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
		$this->assertSame( 'protected a b', $context->call( 'protected_helper', 'a', 'b' ) );
		$this->assertSame( [ 'protected:ab' ], $block->log );
	}

	/**
	 * Asking for a helper the block does not have fails loudly instead of returning nothing.
	 *
	 * @return void
	 */
	public function testUnknownHelperThrows(): void {
		$this->expectException( BadMethodCallException::class );
		$this->expectExceptionMessage( 'Tests\wpunit\CssBuilders\Bridge\Fake_Block has no helper method or property named missing.' );

		( new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() ) )->call( 'missing' );
	}

	/**
	 * A property of the block is read when it has no helper method of that name, whatever its visibility.
	 *
	 * @return void
	 */
	public function testReadsProperties(): void {
		$bridge = new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() );

		$this->assertSame( [ 'one', 'two' ], $bridge->call( 'hidden_list' ) );
		$this->assertTrue( $bridge->has( 'hidden_list' ) );
	}

	/**
	 * The bridge tells which helpers the block has.
	 *
	 * @return void
	 */
	public function testHas(): void {
		$bridge = new Kadence_Blocks_Css_Block_Bridge( new Fake_Block() );

		$this->assertTrue( $bridge->has( 'private_helper' ) );
		$this->assertFalse( $bridge->has( 'missing' ) );
	}

	/**
	 * @return Generator
	 */
	public function helperProvider(): Generator {
		yield 'public' => [
			'member'    => 'public_helper',
			'arguments' => [ 'x' ],
			'expected'  => 'public x',
		];
		yield 'protected' => [
			'member'    => 'protected_helper',
			'arguments' => [ 'x', 'y' ],
			'expected'  => 'protected x y',
		];
		yield 'private' => [
			'member'    => 'private_helper',
			'arguments' => [],
			'expected'  => 'private',
		];
	}
}
