<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

/**
 * Gives the editor scripts the site-level styles state, as
 * `window.kadenceSiteStyles`, before the early block filters run: the FSE
 * mode flag and, in FSE mode, the supported blocks' entries. The entries leave
 * out `selectors`: the editor gets them from core's server-side block
 * definitions, which Kadence's JS registration doesn't override.
 *
 * @since TBD
 */
final class Editor_Params {

	/**
	 * The script that registers the early `blocks.registerBlockType` filters.
	 */
	public const EARLY_FILTERS_HANDLE = 'kadence-blocks-early-filters-js';

	/**
	 * The editor plugins script, which hosts the Kadence panel. It runs before
	 * the early filters script.
	 */
	public const PLUGIN_HANDLE = 'kadence-blocks-plugin-js';

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Supported_Blocks $blocks ) {
		$this->blocks = $blocks;
	}

	/**
	 * Adds the data before each script that reads it, whichever runs first.
	 * Runs after the scripts are enqueued.
	 *
	 * @since TBD
	 */
	public function add_script_data(): void {
		$is_fse_mode = kadence_blocks_is_fse_mode();
		$blocks      = [];

		if ( $is_fse_mode ) {
			foreach ( $this->blocks->all() as $name => $block ) {
				$blocks[ $name ] = [
					'slug'          => $block->get_slug(),
					'exclude'       => $block->site_styles_excluded_attributes(),
					'attributesMap' => $block->site_styles_attributes_map(),
					'supports'      => $block->site_styles_supports(),
				];
			}
		}

		$data = wp_json_encode(
			[
				'isFseMode' => $is_fse_mode,
				// An object in JSON even when empty.
				'blocks'    => (object) $blocks,
			]
		);

		if ( false === $data ) {
			return;
		}

		foreach ( [ self::PLUGIN_HANDLE, self::EARLY_FILTERS_HANDLE ] as $handle ) {
			wp_add_inline_script( $handle, 'window.kadenceSiteStyles = window.kadenceSiteStyles || ' . $data . ';', 'before' );
		}
	}
}
