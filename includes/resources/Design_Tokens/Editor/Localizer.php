<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Style_Library\Asset_Loader;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;

/**
 * Attaches the editor catalogs to the block editor's early-filters bundle, and the pickable-token
 * pool alone to whichever of the editor bundle or the Style Library admin bundle is on the page.
 *
 * {@see localize()} attaches the preset/palette/attribute-default/REST globals to the editor bundle
 * on enqueue_block_editor_assets. {@see localize_pickable()} attaches the pickable-token pool to
 * whichever bundle is enqueued on admin_head, so the settings panel reads the same pool the editor's
 * token picker does. Both no-op when the registry is fail-closed. Kept as separate hook targets so
 * they cannot double-attach on an editor screen.
 *
 * Emitted with wp_add_inline_script + wp_json_encode; the JSON_HEX_* flags make the payload safe to
 * inline inside a <script> without further escaping.
 *
 * @since TBD
 */
final class Localizer {

	/**
	 * The editor script handle the catalogs are attached to (enqueued in class-kadence-blocks-editor-assets).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const HANDLE = 'kadence-blocks-early-filters-js';

	/**
	 * The JS global the preset picker reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PRESETS_OBJECT = 'kadenceDesignTokensPresets';

	/**
	 * The JS global the per-block palette selector and library-level palette switch read.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PALETTES_OBJECT = 'kadenceDesignTokensPalettes';

	/**
	 * The JS global the block-registration preset-default filter reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const ATTRIBUTE_DEFAULTS_OBJECT = 'kadenceDesignTokensAttributeDefaults';

	/**
	 * The JS global the preset writes read for the REST root, namespace and nonce.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const REST_OBJECT = 'kadenceDesignTokensRest';

	/**
	 * The JS global the editor token picker's accessor reads (the pickable-token pool).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const PICKABLE_OBJECT = 'kadenceDesignTokensPickable';

	/**
	 * The JS global the editor's font-family picker reads (the active library's favorite families and
	 * the site's custom family names).
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const FONTS_OBJECT = 'kadenceDesignTokensFonts';

	/**
	 * The token registry, for the fail-closed gate.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The preset catalog builder.
	 *
	 * @since TBD
	 *
	 * @var Preset_Catalog
	 */
	private Preset_Catalog $preset_catalog;

	/**
	 * The per-block attribute-default catalog builder.
	 *
	 * @since TBD
	 *
	 * @var Attribute_Default_Catalog
	 */
	private Attribute_Default_Catalog $attribute_defaults;

	/**
	 * The pickable-token pool builder.
	 *
	 * @since TBD
	 *
	 * @var Pickable_Tokens_Catalog
	 */
	private Pickable_Tokens_Catalog $pickable;

	/**
	 * The color-palette catalog builder.
	 *
	 * @since TBD
	 *
	 * @var Palette_Catalog
	 */
	private Palette_Catalog $palette_catalog;

	/**
	 * The favorite-fonts catalog builder.
	 *
	 * @since TBD
	 *
	 * @var Favorite_Fonts_Catalog
	 */
	private Favorite_Fonts_Catalog $favorite_fonts;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry            $registry           The token registry.
	 * @param Preset_Catalog            $preset_catalog     The preset catalog builder.
	 * @param Attribute_Default_Catalog $attribute_defaults The per-block attribute-default catalog builder.
	 * @param Pickable_Tokens_Catalog   $pickable           The pickable-token pool builder.
	 * @param Palette_Catalog           $palette_catalog    The color-palette catalog builder.
	 * @param Favorite_Fonts_Catalog    $favorite_fonts     The favorite-fonts catalog builder.
	 */
	public function __construct(
		Token_Registry $registry,
		Preset_Catalog $preset_catalog,
		Attribute_Default_Catalog $attribute_defaults,
		Pickable_Tokens_Catalog $pickable,
		Palette_Catalog $palette_catalog,
		Favorite_Fonts_Catalog $favorite_fonts
	) {
		$this->registry           = $registry;
		$this->preset_catalog     = $preset_catalog;
		$this->attribute_defaults = $attribute_defaults;
		$this->pickable           = $pickable;
		$this->palette_catalog    = $palette_catalog;
		$this->favorite_fonts     = $favorite_fonts;
	}

	/**
	 * Attach the editor-only catalogs to the editor bundle, when that bundle is on the page and the
	 * registry is active.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function localize(): void {
		if ( ! wp_script_is( self::HANDLE, 'enqueued' ) ) {
			return; // Not an editor screen with the bundle — nothing to attach to.
		}

		if ( ! $this->registry->is_active() ) {
			return; // Fail-closed: no projection, so offer nothing.
		}

		$this->attach( self::HANDLE, self::PRESETS_OBJECT, $this->preset_catalog->all() );
		$this->attach( self::HANDLE, self::PALETTES_OBJECT, $this->palette_catalog->all() );
		$this->attach( self::HANDLE, self::ATTRIBUTE_DEFAULTS_OBJECT, $this->attribute_defaults->all() );
		$this->attach( self::HANDLE, self::REST_OBJECT, $this->rest() );
		$this->attach( self::HANDLE, self::FONTS_OBJECT, $this->favorite_fonts->all() );
	}

	/**
	 * Attach the pickable-token pool alone to whichever of {@see pickable_handles()} is enqueued,
	 * when the registry is active.
	 *
	 * @since TBD
	 *
	 * @return void
	 */
	public function localize_pickable(): void {
		if ( ! $this->registry->is_active() ) {
			return; // Fail-closed: no projection, so offer nothing.
		}

		$handle = $this->resolve_pickable_handle();

		if ( $handle === null ) {
			return; // Neither bundle is on this screen.
		}

		$this->attach( $handle, self::PICKABLE_OBJECT, $this->pickable->all() );
	}

	/**
	 * The first {@see pickable_handles()} entry enqueued on the current screen.
	 *
	 * @since TBD
	 *
	 * @return string|null
	 */
	private function resolve_pickable_handle(): ?string {
		foreach ( $this->pickable_handles() as $handle ) {
			if ( wp_script_is( $handle, 'enqueued' ) ) {
				return $handle;
			}
		}

		return null;
	}

	/**
	 * Script handles that receive the pickable-token pool, in resolution order: the editor bundle,
	 * then the Style Library admin bundle. Only the first found enqueued is used.
	 *
	 * @since TBD
	 *
	 * @return string[]
	 */
	private function pickable_handles(): array {
		return [
			self::HANDLE,
			Asset_Loader::get_script_handle(),
		];
	}

	/**
	 * The REST descriptor the editor's preset writes POST to: the wp-json root, the v1 namespace, and a
	 * nonce. Mirrors the admin feed's descriptor so the editor's presets client reuses the same middleware.
	 *
	 * @since TBD
	 *
	 * @return array{root: string, namespace: string, nonce: string}
	 */
	private function rest(): array {
		return [
			'root'      => esc_url_raw( rest_url() ),
			'namespace' => Controller::namespace(),
			'nonce'     => wp_create_nonce( 'wp_rest' ),
		];
	}

	/**
	 * Encode a catalog and attach it to a script handle as a window global. A catalog that cannot be
	 * serialized is skipped rather than injected as malformed JS.
	 *
	 * @since TBD
	 *
	 * @param string              $handle      The script handle to attach the inline script to.
	 * @param string              $global_name The window global name to assign.
	 * @param array<string,mixed> $catalog     The catalog payload to encode.
	 *
	 * @return void
	 */
	private function attach( string $handle, string $global_name, array $catalog ): void {
		$json = wp_json_encode(
			$catalog,
			JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
		);

		if ( $json === false ) {
			return; // Catalog cannot be serialized — skip rather than inject malformed JS.
		}

		wp_add_inline_script(
			$handle,
			'window.' . $global_name . ' = ' . $json . ';',
			'before'
		);
	}
}
