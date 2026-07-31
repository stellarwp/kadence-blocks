<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Kadence_Palette_Slot;
use KadenceWP\KadenceBlocks\Design_Tokens\Registry\Token_Registry;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Alias;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Builds the color-palette catalog the block editor reads to render the per-block palette selector and the
 * library-level palette switch: the active library's palettes as `{ id, label }`, plus which one is `current`,
 * plus a `slots` map of each global-palette slot to the token alias it is bound to.
 *
 * Shape: `{ active: <slug>, current: <palette-id>, palettes: [ { id, label } ], slots: { <slug>: <alias> } }`.
 * Localized to `window.kadenceDesignTokensPalettes` by {@see Localizer}, so a control can offer the library's
 * palettes and resolve a palette slot to its token reference without a REST round-trip; edits still write through
 * the palette REST surface. The `slots` map is the editor's single source for the slot -> alias binding, mirroring
 * the projection declared in `declarations.php`.
 *
 * @since TBD
 */
final class Palette_Catalog {

	/**
	 * The active-library pointer, so the catalog reports the library the editor renders by default.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The effective-palettes reader, source of the active library's palettes and its `$current` pointer.
	 *
	 * @since TBD
	 *
	 * @var Effective_Palettes
	 */
	private Effective_Palettes $palettes;

	/**
	 * The token registry, source of the palette-slot -> token bindings the `slots` map exposes.
	 *
	 * @since TBD
	 *
	 * @var Token_Registry
	 */
	private Token_Registry $registry;

	/**
	 * @since TBD
	 *
	 * @param Active_Token_Library_Store $active   The active-library pointer.
	 * @param Effective_Palettes         $palettes The effective-palettes reader.
	 * @param Token_Registry             $registry The token registry.
	 */
	public function __construct( Active_Token_Library_Store $active, Effective_Palettes $palettes, Token_Registry $registry ) {
		$this->active   = $active;
		$this->palettes = $palettes;
		$this->registry = $registry;
	}

	/**
	 * The palette catalog for the active library: its palettes as `{ id, label }`, the `current` palette id, and
	 * the active library slug.
	 *
	 * @since TBD
	 *
	 * @return array{active: string, current: string, palettes: array<int, array{id: string, label: string}>, slots: array<string, string>}
	 */
	public function all(): array {
		$slug    = $this->active->get();
		$section = $this->palettes->section( $slug );

		$palettes = [];

		foreach ( $this->palettes->palette_ids( $slug ) as $id ) {
			$node  = $section[ $id ] ?? [];
			$label = is_array( $node ) ? ( $node[ Extensions::get_label_key() ] ?? $id ) : $id;

			$palettes[] = [
				'id'    => $id,
				'label' => is_string( $label ) && $label !== '' ? $label : $id,
			];
		}

		return [
			'active'   => $slug,
			'current'  => $this->palettes->current( $slug ),
			'palettes' => $palettes,
			'slots'    => $this->slots(),
		];
	}

	/**
	 * The global-palette slot -> token-alias map: each token that claims a Kadence palette slot
	 * (`palette1`…`palette9`) keyed by its slug, valued by the `{dot.alias}` a control stores to reference
	 * it. Resolved through {@see Kadence_Palette_Slot} so the slot set can never drift from the projection,
	 * making `declarations.php` the single source of truth.
	 *
	 * @since TBD
	 *
	 * @return array<string, string> slug => `{alias}`.
	 */
	private function slots(): array {
		$slots = [];

		foreach ( $this->registry->all() as $token ) {
			$slot = Kadence_Palette_Slot::from_token( $token );

			if ( $slot !== null ) {
				$slots[ $slot->slug ] = Alias::wrap( $token->id );
			}
		}

		return $slots;
	}
}
