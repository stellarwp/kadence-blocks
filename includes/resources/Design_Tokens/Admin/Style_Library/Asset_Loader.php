<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library;

use KadenceWP\KadenceBlocks\Asset\Asset;

/**
 * Enqueues the Style Library admin bundle on its screen.
 *
 * @since TBD
 */
final class Asset_Loader {

	/**
	 * The script handle for the Style Library bundle.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SCRIPT_HANDLE = 'admin-kadence-style-library';

	/**
	 * The webpack bundle path without extension.
	 *
	 * Compiled by wp-scripts; companion metadata lives at dist/admin-kadence-style-library.asset.php.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SCRIPT_PATH = 'dist/admin-kadence-style-library';

	/**
	 * Resolves plugin asset URLs and webpack metadata.
	 *
	 * @since TBD
	 *
	 * @var Asset
	 */
	private Asset $asset;

	/**
	 * @since TBD
	 *
	 * @param Asset $asset Resolves plugin asset URLs and webpack metadata.
	 */
	public function __construct( Asset $asset ) {
		$this->asset = $asset;
	}

	/**
	 * The script handle for the Style Library bundle.
	 *
	 * @since TBD
	 *
	 * @return string
	 */
	public static function get_script_handle(): string {
		return self::SCRIPT_HANDLE;
	}

	/**
	 * Enqueue the Style Library scripts and styles.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function enqueue(): void {
		wp_enqueue_style(
			'kadence-blocks-admin-css',
			$this->asset->get_url( 'includes/assets/css/admin-dashboard.min.css' ),
			[ 'wp-jquery-ui-dialog', 'wp-color-picker' ],
			KADENCE_BLOCKS_VERSION,
			'all'
		);

		$meta = $this->asset->get_meta( self::SCRIPT_PATH );

		wp_enqueue_script(
			self::SCRIPT_HANDLE,
			$this->asset->get_url( self::SCRIPT_PATH . '.js' ),
			$meta['dependencies'] ?? [],
			$meta['version'] ?? KADENCE_BLOCKS_VERSION,
			true
		);

		wp_enqueue_style(
			self::SCRIPT_HANDLE,
			$this->asset->get_url( self::SCRIPT_PATH . '.css' ),
			// 'dashicons' is declared explicitly — the breakpoint switcher's glyphs need it enqueued,
			// not just coincidentally present from elsewhere in wp-admin.
			[ 'wp-components', 'dashicons' ],
			$meta['version'] ?? KADENCE_BLOCKS_VERSION,
			'all'
		);

		wp_localize_script(
			self::SCRIPT_HANDLE,
			'kadenceStyleLibraryParams',
			[
				'pluginVersion' => KADENCE_BLOCKS_VERSION,
			]
		);

		wp_set_script_translations( self::SCRIPT_HANDLE, 'kadence-blocks' );
	}
}
