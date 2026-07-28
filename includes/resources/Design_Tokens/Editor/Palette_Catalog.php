<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Effective_Palettes;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Extensions;

/**
 * Builds the color-palette catalog the block editor reads to render the per-block palette selector and the
 * set-level palette switch: the active set's palettes as `{ id, label }`, plus which one is `current`.
 *
 * Shape: `{ active: <slug>, current: <palette-id>, palettes: [ { id, label } ] }`. Localized to
 * `window.kadenceDesignTokensPalettes` by {@see Localizer}, so a control can offer the set's palettes without
 * a REST round-trip; edits still write through the palette REST surface.
 *
 * @since TBD
 */
final class Palette_Catalog {

	/**
	 * The active-set pointer, so the catalog reports the set the editor renders by default.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * The effective-palettes reader, source of the active set's palettes and its `$current` pointer.
	 *
	 * @since TBD
	 *
	 * @var Effective_Palettes
	 */
	private Effective_Palettes $palettes;

	/**
	 * @since TBD
	 *
	 * @param Active_Token_Library_Store $active   The active-set pointer.
	 * @param Effective_Palettes         $palettes The effective-palettes reader.
	 */
	public function __construct( Active_Token_Library_Store $active, Effective_Palettes $palettes ) {
		$this->active   = $active;
		$this->palettes = $palettes;
	}

	/**
	 * The palette catalog for the active set: its palettes as `{ id, label }`, the `current` palette id, and
	 * the active set slug.
	 *
	 * @since TBD
	 *
	 * @return array{active: string, current: string, palettes: array<int, array{id: string, label: string}>}
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
		];
	}
}
