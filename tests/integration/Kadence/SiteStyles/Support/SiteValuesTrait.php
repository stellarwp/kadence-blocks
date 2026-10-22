<?php

declare( strict_types=1 );

namespace Tests\integration\Kadence\SiteStyles\Support;

use Kadence_Blocks_Abstract_Block;
use ReflectionProperty;
use WP_Block_Type;
use WP_Block_Type_Registry;
use WP_Theme_JSON;

/**
 * Helpers for tests that store Kadence-only site values for one block and read
 * back what the block renders with. The test class provides `$tester`.
 */
trait SiteValuesTrait {

	/**
	 * The block type a test registered again, to restore.
	 *
	 * @since TBD
	 *
	 * @var WP_Block_Type|null
	 */
	private ?WP_Block_Type $registered = null;

	/**
	 * Stores Kadence-only site values for one block.
	 *
	 * @param string                                                                               $slug   The block's key under `settings.custom.kadence`.
	 * @param array<string, bool|float|int|string|list<bool|float|int|string|array<string, bool>>> $values The site values.
	 *
	 * @return void
	 */
	private function store_site_values( string $slug, array $values ): void {
		$this->tester->store_user_global_styles( [ 'settings' => [ 'custom' => [ 'kadence' => [ $slug => $values ] ] ] ] );
	}

	/**
	 * Runs a block's render-attributes filter, as the block does before it builds its markup and CSS.
	 *
	 * @param string                                                                              $filter_slug The block slug in the filter name, e.g. `tableofcontents`.
	 * @param array<string, bool|int|string|list<bool|int|string|array<string, string|list<string>>>> $attributes  The instance's own attributes.
	 *
	 * @return array<string, int|string|list<int|string>> The attributes the block renders with.
	 */
	private function render_attributes( string $filter_slug, array $attributes ): array {
		return apply_filters( 'kadence_blocks_' . $filter_slug . '_render_block_attributes', $attributes );
	}

	/**
	 * Gives a value another one of the same shape, leaf by leaf.
	 *
	 * @param mixed $value The default, null when the attribute has none.
	 *
	 * @return mixed The different value.
	 */
	private function differing_value( $value ) {
		if ( is_array( $value ) ) {
			return array_map( [ $this, 'differing_value' ], $value );
		}

		if ( is_bool( $value ) ) {
			return ! $value;
		}

		return is_int( $value ) || is_float( $value ) ? $value + 7 : 'site';
	}

	/**
	 * Registers a block again, so it gets the supports of the current mode.
	 *
	 * @param Kadence_Blocks_Abstract_Block $block The block.
	 *
	 * @return void
	 */
	private function reregister_block( Kadence_Blocks_Abstract_Block $block ): void {
		$unregistered     = WP_Block_Type_Registry::get_instance()->unregister( $block->get_name() );
		$this->registered = $unregistered instanceof WP_Block_Type ? $unregistered : null;

		$block->on_init();
		$this->forget_core_block_metadata();
	}

	/**
	 * Puts back the block type a test registered again.
	 *
	 * @return void
	 */
	private function restore_reregistered_block(): void {
		if ( null === $this->registered ) {
			return;
		}

		WP_Block_Type_Registry::get_instance()->unregister( $this->registered->name );
		WP_Block_Type_Registry::get_instance()->register( $this->registered );
		$this->registered = null;
		$this->forget_core_block_metadata();
	}

	/**
	 * Empties the block metadata core keeps per request, which a block registered again would not refresh.
	 *
	 * @return void
	 */
	private function forget_core_block_metadata(): void {
		$metadata = new ReflectionProperty( WP_Theme_JSON::class, 'blocks_metadata' );
		$metadata->setAccessible( true );
		$metadata->setValue( null, [] );
	}
}
