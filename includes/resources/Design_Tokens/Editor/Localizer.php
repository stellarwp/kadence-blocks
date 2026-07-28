<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;

/**
 * Attaches the editor catalogs to the block editor's early-filters bundle.
 *
 * On enqueue_block_editor_assets (after the editor-assets class has enqueued the script) it attaches five
 * globals to the existing 'kadence-blocks-early-filters-js' handle: window.kadenceDesignTokensPresets (the
 * per-library preset catalog the preset picker and the "save as new preset" form read),
 * window.kadenceDesignTokensPalettes (the active library's color palettes the per-block palette selector reads),
 * window.kadenceDesignTokensAttributeDefaults (the per-block attribute-default catalog the block-registration
 * filter reads), window.kadenceDesignTokensRest (the REST descriptor the preset writes POST to), and
 * window.kadenceDesignTokensPickable (the pickable-token pool the editor token picker's accessor reads).
 * Guarded on wp_script_is( …, 'enqueued' ) so it runs only where that bundle loads, and skipped entirely
 * when the registry is fail-closed (a deactivated registry projects nothing, so the pickers offer nothing).
 *
 * Emitted with wp_add_inline_script + wp_json_encode; the JSON_HEX_* flags make the payload safe to
 * inline inside a <script> (no </script> breakout, no & ambiguity) without further escaping.
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
	private Attribute_Default_Catalog $preset_defaults;

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
	 * @since TBD
	 *
	 * @param Token_Registry             $registry        The token registry.
	 * @param Preset_Catalog             $preset_catalog  The preset catalog builder.
	 * @param Attribute_Default_Catalog  $preset_defaults The per-block attribute-default catalog builder.
	 * @param Pickable_Tokens_Catalog    $pickable        The pickable-token pool builder.
	 * @param Palette_Catalog            $palette_catalog The color-palette catalog builder.
	 */
	public function __construct(
		Token_Registry $registry,
		Preset_Catalog $preset_catalog,
		Attribute_Default_Catalog $preset_defaults,
		Pickable_Tokens_Catalog $pickable,
		Palette_Catalog $palette_catalog
	) {
		$this->registry         = $registry;
		$this->preset_catalog   = $preset_catalog;
		$this->preset_defaults  = $preset_defaults;
		$this->pickable         = $pickable;
		$this->palette_catalog  = $palette_catalog;
	}

	/**
	 * Attach the catalogs to the editor bundle, when that bundle is on the page and the registry is active.
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

		$this->attach( self::PRESETS_OBJECT, $this->preset_catalog->all() );
		$this->attach( self::PALETTES_OBJECT, $this->palette_catalog->all() );
		$this->attach( self::ATTRIBUTE_DEFAULTS_OBJECT, $this->preset_defaults->all() );
		$this->attach( self::REST_OBJECT, $this->rest() );
		$this->attach( self::PICKABLE_OBJECT, $this->pickable->all() );
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
	 * Encode a catalog and attach it to the editor bundle as a window global. A catalog that cannot be
	 * serialized is skipped rather than injected as malformed JS.
	 *
	 * @since TBD
	 *
	 * @param string              $global_name The window global name to assign.
	 * @param array<string,mixed> $catalog     The catalog payload to encode.
	 *
	 * @return void
	 */
	private function attach( string $global_name, array $catalog ): void {
		$json = wp_json_encode(
			$catalog,
			JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
		);

		if ( $json === false ) {
			return; // Catalog cannot be serialized — skip rather than inject malformed JS.
		}

		wp_add_inline_script(
			self::HANDLE,
			'window.' . $global_name . ' = ' . $json . ';',
			'before'
		);
	}
}
