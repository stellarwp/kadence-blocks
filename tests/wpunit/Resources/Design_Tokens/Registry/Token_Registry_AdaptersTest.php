<?php declare( strict_types=1 );
// cspell:ignore advancedheading advancedbtn .

namespace Tests\wpunit\Resources\Design_Tokens\Registry;

use InvalidArgumentException;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Abstract_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Adapter_Interface;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use ReflectionClassConstant;
use Tests\Support\Classes\TestCase;

final class Token_Registry_AdaptersTest extends TestCase {

	private Token_Registry $registry;

	protected function setUp(): void {
		parent::setUp();

		$this->registry = new Token_Registry();
	}

	public function testRegisterAndLookupByBlock(): void {
		$adapter = $this->heading_adapter();
		$block   = $this->declared_block( $adapter );

		$this->assertNull( $this->registry->adapter_for_block( $block ) );

		$this->registry->register_adapter( $adapter );

		$this->assertSame( $adapter, $this->registry->adapter_for_block( $block ) );
	}

	public function testLookupReturnsNullForAnUnregisteredBlock(): void {
		$this->registry->register_adapter( $this->heading_adapter() );

		$this->assertNull( $this->registry->adapter_for_block( $this->declared_block( $this->button_adapter() ) ) );
	}

	public function testAdaptersReturnsMapKeyedByBlock(): void {
		$adapter = $this->heading_adapter();
		$this->registry->register_adapter( $adapter );

		$this->assertSame( [ $this->declared_block( $adapter ) => $adapter ], $this->registry->adapters() );
	}

	public function testReRegisteringTheSameBlockReplacesTheAdapter(): void {
		$first  = $this->heading_adapter();
		$second = $this->heading_adapter();

		$this->registry->register_adapter( $first );
		$this->registry->register_adapter( $second );

		$this->assertCount( 1, $this->registry->adapters() );
		$this->assertSame( $second, $this->registry->adapter_for_block( $this->declared_block( $second ) ) );
	}

	public function testAbstractAdapterExposesItsDeclaredBlockThroughTheAccessor(): void {
		$adapter = $this->heading_adapter();

		// The accessor must return exactly the BLOCK const the subclass declares.
		$this->assertSame( $this->declared_block( $adapter ), $adapter->get_block() );
	}

	public function testRegisteringAnAdapterThatDeclaresNoBlockThrows(): void {
		// An adapter that does not override BLOCK reports an empty block; registering it would store it under
		// the empty key where it could never match, so the registry rejects it loudly.
		$this->expectException( InvalidArgumentException::class );

		$this->registry->register_adapter(
			new class() extends Abstract_Adapter {
				public function apply( array $attributes ): array {
					return $attributes;
				}
			}
		);
	}

	/**
	 * The block an adapter declares, read straight off its BLOCK const so assertions never restate the
	 * literal and stay independent of the get_block() accessor they may be checking.
	 */
	private function declared_block( Adapter_Interface $adapter ): string {
		return (string) ( new ReflectionClassConstant( $adapter, 'BLOCK' ) )->getValue();
	}

	private function heading_adapter(): Adapter_Interface {
		return new class() extends Abstract_Adapter {
			protected const BLOCK = 'kadence/advancedheading';

			public function apply( array $attributes ): array {
				return $attributes;
			}
		};
	}

	private function button_adapter(): Adapter_Interface {
		return new class() extends Abstract_Adapter {
			protected const BLOCK = 'kadence/advancedbtn';

			public function apply( array $attributes ): array {
				return $attributes;
			}
		};
	}
}
