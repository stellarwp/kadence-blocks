<?php declare( strict_types=1 );

namespace Tests\wpunit\Resources\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Abstract_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Adapter_Interface;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Projector;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use ReflectionClassConstant;
use RuntimeException;
use Tests\Support\Classes\TestCase;

final class ProjectorTest extends TestCase {

	/**
	 * Real kadence/image attributes for the case the framework exists for: the per-corner borderRadius is
	 * stored as raw numbers that render_measure_output() emits as literals, with no var() indirection for a
	 * token to own. borderRadiusUnit rides alongside and must be left untouched.
	 *
	 * @var array<string, mixed>
	 */
	private const IMAGE_ATTRIBUTES = [
		'borderRadius'     => [ '8', '8', '8', '8' ],
		'borderRadiusUnit' => 'px',
	];

	public function testItRunsTheRegisteredAdapterOverTheAttributes(): void {
		$adapter  = $this->image_radius_adapter();
		$registry = new Token_Registry();
		$registry->register_adapter( $adapter );

		$attributes = $this->projector( $registry )->apply( self::IMAGE_ATTRIBUTES, $this->declared_block( $adapter ) );

		// Each raw per-corner radius is rewritten to reference the radius token's CSS variable, so the
		// corner radius now follows the token instead of a baked-in literal.
		$radius = 'var(--kb-token--semantic--radius--md)';
		$this->assertSame( [ $radius, $radius, $radius, $radius ], $attributes['borderRadius'] );
		// A sibling attribute the adapter does not touch survives unchanged.
		$this->assertSame( 'px', $attributes['borderRadiusUnit'] );
	}

	public function testItIsANoopForABlockWithNoAdapter(): void {
		// An empty registry knows no adapter for the block, so its attributes pass through untouched.
		$attributes = $this->projector( new Token_Registry() )->apply(
			self::IMAGE_ATTRIBUTES,
			$this->declared_block( $this->image_radius_adapter() )
		);

		$this->assertSame( self::IMAGE_ATTRIBUTES, $attributes );
	}

	public function testItIsANoopWhenProjectionIsFailClosed(): void {
		// The baseline guard deactivates projection on a broken token set; the projector must then leave the
		// attributes as KB stored them even for a block that does have an adapter.
		$adapter  = $this->image_radius_adapter();
		$registry = new Token_Registry();
		$registry->register_adapter( $adapter );
		$registry->deactivate();

		$attributes = $this->projector( $registry )->apply( self::IMAGE_ATTRIBUTES, $this->declared_block( $adapter ) );

		$this->assertSame( self::IMAGE_ATTRIBUTES, $attributes );
	}

	public function testItFailsSoftWhenTheAdapterThrows(): void {
		// A faulty adapter must never fatal a render: the projector swallows the throwable and returns the
		// attributes untouched.
		$adapter  = $this->throwing_adapter();
		$registry = new Token_Registry();
		$registry->register_adapter( $adapter );

		$attributes = $this->projector( $registry )->apply( self::IMAGE_ATTRIBUTES, $this->declared_block( $adapter ) );

		$this->assertSame( self::IMAGE_ATTRIBUTES, $attributes );
	}

	public function testTheProjectorIsWiredIntoTheBlockAttributesFilter(): void {
		global $wp_filter;

		// The Projection\Adapter\Provider hooks the projector at priority 20 on boot, after the block-preset
		// overlay (priority 10), so it rewrites the assembled defaults.
		$callbacks = $wp_filter['kadence_blocks_block_default_attributes']->callbacks ?? [];

		$this->assertArrayHasKey( 20, $callbacks );
	}

	/**
	 * Build the projector with a given registry.
	 */
	private function projector( Token_Registry $registry ): Projector {
		return new Projector( $registry );
	}

	/**
	 * The block an adapter declares, read straight off its BLOCK const so the test never restates the
	 * literal that keys the registry.
	 */
	private function declared_block( Adapter_Interface $adapter ): string {
		return (string) ( new ReflectionClassConstant( $adapter, 'BLOCK' ) )->getValue();
	}

	/**
	 * A kadence/image adapter for the raw-numeric dimension case: it rewrites the block's raw per-corner
	 * borderRadius into the radius token's CSS variable (leaving empty corners empty), the shape a real
	 * SOFT-3404 wiring would take if the per-block mapping flags borderRadius as not mapping cleanly to a
	 * variable.
	 */
	private function image_radius_adapter(): Adapter_Interface {
		return new class() extends Abstract_Adapter {
			protected const BLOCK = 'kadence/image';

			public function apply( array $attributes ): array {
				if ( empty( $attributes['borderRadius'] ) || ! is_array( $attributes['borderRadius'] ) ) {
					return $attributes;
				}

				$attributes['borderRadius'] = array_map(
					static function ( $corner ): string {
						return $corner === '' ? '' : 'var(--kb-token--semantic--radius--md)';
					},
					$attributes['borderRadius']
				);

				return $attributes;
			}
		};
	}

	/**
	 * A kadence/image adapter whose transform throws, to prove the projector fails soft.
	 */
	private function throwing_adapter(): Adapter_Interface {
		return new class() extends Abstract_Adapter {
			protected const BLOCK = 'kadence/image';

			public function apply( array $attributes ): array {
				throw new RuntimeException( 'boom' );
			}
		};
	}
}
