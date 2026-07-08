<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Rest\V1\Contracts\Controller;

/**
 * Attaches the editor catalogs to the block editor's early-filters bundle.
 *
 * On enqueue_block_editor_assets (after the editor-assets class has enqueued the script) it attaches three
 * globals to the existing 'kadence-blocks-early-filters-js' handle: window.kadenceDesignTokensVariants (the
 * per-set variant catalog the variant picker and the "save as new variant" form read),
 * window.kadenceDesignTokensSets (the token-set catalog the per-block set-override picker reads), and
 * window.kadenceDesignTokensRest (the REST descriptor the variant writes POST to). Guarded on
 * wp_script_is( …, 'enqueued' ) so it runs only where that bundle loads, and skipped entirely when the
 * registry is fail-closed (a deactivated registry projects nothing, so the pickers offer nothing).
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
	 * The JS global the variant picker reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const VARIANTS_OBJECT = 'kadenceDesignTokensVariants';

	/**
	 * The JS global the per-block set-override picker reads.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const SETS_OBJECT = 'kadenceDesignTokensSets';

	/**
	 * The JS global the variant writes read for the REST root, namespace and nonce.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const REST_OBJECT = 'kadenceDesignTokensRest';

	/**
	 * The token registry, for the fail-closed gate.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * The variant catalog builder.
	 *
	 * @since TBD
	 *
	 * @var Variant_Catalog
	 */
	private Variant_Catalog $variant_catalog;

	/**
	 * The token-set catalog builder.
	 *
	 * @since TBD
	 *
	 * @var Set_Catalog
	 */
	private Set_Catalog $set_catalog;

	/**
	 * @since TBD
	 *
	 * @param Token_Registry  $registry        The token registry.
	 * @param Variant_Catalog $variant_catalog The variant catalog builder.
	 * @param Set_Catalog     $set_catalog     The token-set catalog builder.
	 */
	public function __construct( Token_Registry $registry, Variant_Catalog $variant_catalog, Set_Catalog $set_catalog ) {
		$this->registry        = $registry;
		$this->variant_catalog = $variant_catalog;
		$this->set_catalog     = $set_catalog;
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

		$this->attach( self::VARIANTS_OBJECT, $this->variant_catalog->all() );
		$this->attach( self::SETS_OBJECT, $this->set_catalog->all() );
		$this->attach( self::REST_OBJECT, $this->rest() );
	}

	/**
	 * The REST descriptor the editor's variant writes POST to: the wp-json root, the v1 namespace, and a
	 * nonce. Mirrors the admin feed's descriptor so the editor's variants client reuses the same middleware.
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
