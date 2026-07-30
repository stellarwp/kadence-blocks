<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Registers the block-editor catalogs: binds the preset, attribute-default and pickable-token catalog
 * builders and the localizer as singletons, then hooks the localizer onto enqueue_block_editor_assets so
 * the early-filters bundle receives window.kadenceDesignTokensPresets (preset picker),
 * window.kadenceDesignTokensAttributeDefaults (block-registration attribute-default filter) and
 * window.kadenceDesignTokensPickable (the editor token picker's accessor).
 *
 * @since TBD
 */
final class Provider extends Provider_Contract {

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 */
	public function register(): void {
		$this->container->singleton( Preset_Catalog::class );
		$this->container->singleton( Palette_Catalog::class );
		$this->container->singleton( Attribute_Default_Catalog::class );
		$this->container->singleton( Pickable_Tokens_Catalog::class );
		$this->container->singleton( Localizer::class );

		/**
		 * The editor-assets class enqueues kadence-blocks-early-filters-js on enqueue_block_editor_assets at
		 * the default priority (10). The Localizer attaches its inline script to that handle, so it must run
		 * strictly LATER — a higher priority guarantees the handle exists, where matching 10 would leave the
		 * order registration-dependent. 20 sits clear of that default with headroom for others to slot
		 * between. The Localizer also guards on wp_script_is( …, 'enqueued' ), so a missing handle no-ops
		 * rather than triggering a fatal error.
		 */
		add_action( 'enqueue_block_editor_assets', $this->container->callback( Localizer::class, 'localize' ), 20 );
	}
}
