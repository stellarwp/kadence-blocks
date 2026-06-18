<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;

/**
 * Attaches the variant catalog to the block editor's early-filters bundle.
 *
 * On enqueue_block_editor_assets (after the editor-assets class has enqueued the script) it attaches
 * the catalog to the existing 'kadence-blocks-early-filters-js' handle as
 * window.kadenceDesignTokensVariants, which the variant picker reads. Guarded on
 * wp_script_is( …, 'enqueued' ) so it runs only where that bundle loads, and skipped entirely when the
 * registry is fail-closed (a deactivated registry projects nothing, so the picker offers no variants).
 *
 * Emitted with wp_add_inline_script + wp_json_encode; the JSON_HEX_* flags make the payload safe to
 * inline inside a <script> (no </script> breakout, no & ambiguity) without further escaping.
 *
 * @since TBD
 */
final class Localizer {

	/**
	 * The editor script handle the catalog is attached to (enqueued in class-kadence-blocks-editor-assets).
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
	private const OBJECT = 'kadenceDesignTokensVariants';

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
	 * @since TBD
	 *
	 * @param Token_Registry  $registry        The token registry.
	 * @param Variant_Catalog $variant_catalog The variant catalog builder.
	 */
	public function __construct( Token_Registry $registry, Variant_Catalog $variant_catalog ) {
		$this->registry        = $registry;
		$this->variant_catalog = $variant_catalog;
	}

	/**
	 * Attach the catalog to the editor bundle, when that bundle is on the page and the registry is active.
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
			return; // Fail-closed: no projection, so offer no variants.
		}

		$json = wp_json_encode(
			$this->variant_catalog->all(),
			JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT
		);

		if ( $json === false ) {
			return; // Catalog cannot be serialized — skip rather than inject malformed JS.
		}

		wp_add_inline_script(
			self::HANDLE,
			'window.' . self::OBJECT . ' = ' . $json . ';',
			'before'
		);
	}
}
