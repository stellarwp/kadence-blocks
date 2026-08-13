<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Asset_Loader;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;

/**
 * Attaches the design-token schema feed to KB's admin dashboard bundle.
 *
 * On admin_head — after the dashboard's `admin_print_styles-{page}` enqueue has run, before the footer
 * where `admin-kadence-home` prints — it resolves the active library's slug and asks
 * {@see Feed_Assembler} to build the feed for it, then attaches the result to the existing
 * 'admin-kadence-home' handle as `window.kadenceDesignTokens`. Guarded on
 * wp_script_is( …, 'enqueued' ) so it runs ONLY where that bundle loads (the Kadence dashboard, and any
 * future screen using it), never plugin-wide.
 *
 * The assembly of values/presets/responsive/version/rest for a slug lives entirely in
 * {@see Feed_Assembler}, shared with the REST feed endpoint a client calls after switching
 * libraries in place — this class owns only the WordPress-specific parts: which script handle to
 * attach to, which library is active, and how to emit the inline script.
 *
 * The feed is emitted with wp_add_inline_script + wp_json_encode rather than wp_localize_script, which
 * would stringify the booleans, version and nested maps.
 *
 * Alongside the feed, this also emits the font catalog ({@see Font_Catalog}) as a SEPARATE inline
 * global, window.kadenceDesignTokensFontCatalog. It rides the same handle but is built once here,
 * never inside Feed_Assembler's payload: the feed re-fetches after every write (refreshFeed) and
 * on every library switch, while the catalog (~29KB of Google font names) is static and
 * library-independent — folding it into the feed would re-send it on every save.
 *
 * @since TBD
 */
final class Localizer {

	/**
	 * The dashboard script handle the feed is attached to (registered in class-kadence-blocks-settings).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const DASHBOARD_HANDLE = 'admin-kadence-home';

	/**
	 * Script handles that receive the design-token feed when enqueued on the current screen.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function handles(): array {
		return [
			self::DASHBOARD_HANDLE,
			Asset_Loader::get_script_handle(),
		];
	}

	/**
	 * The JS global the React app reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const OBJECT = 'kadenceDesignTokens';

	/**
	 * The JS global the font catalog is emitted under.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const CATALOG_OBJECT = 'kadenceDesignTokensFontCatalog';

	/**
	 * The active-library pointer — the same slug the registry's user primitives and every projector
	 * (CSS vars, theme.json, block presets, selectable presets) resolve against, so the dashboard edits the library that
	 * is actually live rather than always the default one.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The shared pipeline that builds a feed payload for a slug.
	 *
	 * @since TBD
	 *
	 * @var Feed_Assembler
	 */
	private Feed_Assembler $assembler;

	/**
	 * The font catalog reader, for the page-load-only catalog global.
	 *
	 * @since TBD
	 *
	 * @var Font_Catalog
	 */
	private Font_Catalog $catalog;

	/**
	 * @since TBD
	 *
	 * @param Active_Token_Library_Store $active    The active-library pointer.
	 * @param Feed_Assembler             $assembler The shared pipeline that builds a feed payload for a slug.
	 * @param Font_Catalog               $catalog   The font catalog reader.
	 */
	public function __construct( Active_Token_Library_Store $active, Feed_Assembler $assembler, Font_Catalog $catalog ) {
		$this->active    = $active;
		$this->assembler = $assembler;
		$this->catalog   = $catalog;
	}

	/**
	 * Attach the feed to the dashboard bundle, when that bundle is on the page.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function localize(): void {
		$handle = $this->resolve_handle();

		if ( $handle === null ) {
			return; // No supported admin bundle on this screen.
		}

		// The active library, not always Token_Store::default_slug() — the registry's user primitives and
		// every projector already resolve against whichever library is active, so the dashboard must read
		// (and, via the REST descriptor's slug, write) the same library or edits land in a document that
		// is not the one being displayed.
		$slug = $this->active->get();
		$feed = $this->assembler->for_slug( $slug );
		$json = wp_json_encode(
			$feed,
			JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
		);

		if ( $json === false ) {
			return; // Feed cannot be serialized — skip rather than inject malformed JS.
		}

		wp_add_inline_script(
			$handle,
			'window.' . self::OBJECT . ' = ' . $json . ';',
			'before'
		);

		$this->localize_catalog( $handle );
	}

	/**
	 * Attach the font catalog to the same handle, as its own inline global — built once per
	 * page load, never rebuilt when the feed refreshes after a write.
	 *
	 * @since TBD
	 *
	 * @param string $handle The script handle the feed was just attached to.
	 *
	 * @return void
	 */
	private function localize_catalog( string $handle ): void {
		$json = wp_json_encode(
			$this->catalog->all(),
			JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
		);

		if ( $json === false ) {
			return; // Catalog cannot be serialized — skip rather than inject malformed JS.
		}

		wp_add_inline_script(
			$handle,
			'window.' . self::CATALOG_OBJECT . ' = ' . $json . ';',
			'before'
		);
	}

	/**
	 * The first supported script handle enqueued on the current screen.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	private function resolve_handle(): ?string {
		foreach ( $this->handles() as $handle ) {
			if ( wp_script_is( $handle, 'enqueued' ) ) {
				return $handle;
			}
		}

		return null;
	}
}
