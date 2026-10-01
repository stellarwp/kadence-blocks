<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide;

use KadenceWP\KadenceBlocks\Design_Tokens\Theme_Style_Guide\Contracts\Style_Guide_Source;
use KadenceWP\KadenceBlocks\StellarWP\ProphecyMonorepo\Container\Contracts\Provider as Provider_Contract;

/**
 * Wires the theme Style Guide layer: the Kadence reader as the source, the pure mapper, and the
 * per-request overlay the baseline decorator and cache versioning read.
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
		$this->container->singleton( Style_Guide_Source::class, Style_Guide_Reader::class );
		$this->container->singleton( Style_Guide_Mapper::class );
		$this->container->singleton( Style_Guide_Overlay::class );

		// The overlay memoizes for the request, and the Kadence_Option boot pass reads it on init:20.
		// WordPress installs the Customizer's pre_option_* preview filters later, on wp_loaded, so
		// without this the overlay is pinned to the SAVED palette before the previewed value exists and
		// the preview shows no change at all. Priority 0: before anything renders.
		add_action( 'customize_preview_init', $this->container->callback( Style_Guide_Overlay::class, 'flush' ), 0 );

		// A palette write inside this request must not leave it answering from values read before the
		// write. All three hooks matter: a site that never opened the Customizer has no option at all, so
		// its first publish is an add_option, not an update_option.
		$flush = $this->container->callback( Style_Guide_Overlay::class, 'flush' );

		foreach ( [ 'add_option_', 'update_option_', 'delete_option_' ] as $prefix ) {
			add_action( $prefix . Style_Guide_Reader::get_palette_option_key(), $flush, 10 );
		}
	}
}
