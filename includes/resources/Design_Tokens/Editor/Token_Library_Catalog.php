<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;

/**
 * Builds the compact token-library catalog the block editor's per-block library-override picker reads.
 *
 * Only the data the picker needs — which library is active and the selectable libraries as { slug, label } —
 * so it carries no resolved token values and cannot raise the alias-cycle errors the projection must
 * guard. The listing is default-inclusive: the always-addressable default library appears even when it has
 * no stored row, mirroring the projection's library listing so the picker never offers a library the
 * projection cannot resolve, and never omits one it can.
 *
 * @since TBD
 */
final class Token_Library_Catalog {

	/**
	 * The token store, source of the stored libraries and their titles.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The active-library pointer, source of the active slug.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @since TBD
	 *
	 * @param Token_Store                $store  The token store.
	 * @param Active_Token_Library_Store $active The active-library pointer.
	 */
	public function __construct( Token_Store $store, Active_Token_Library_Store $active ) {
		$this->store  = $store;
		$this->active = $active;
	}

	/**
	 * The catalog: the active slug plus every selectable library as { slug, label }.
	 *
	 * The always-addressable default library is listed first, ahead of the stored libraries (which follow
	 * the store's slug order), and is synthesized from baseline when it has no row — so the picker can
	 * offer default as the first concrete option regardless of where its slug would otherwise sort.
	 *
	 * @since TBD
	 *
	 * @return array{active: string, sets: array<int, array{slug: string, label: string}>}
	 */
	public function all(): array {
		$sets = [];

		foreach ( $this->store->list_stores() as $row ) {
			$slug = $row['slug'];

			$sets[ $slug ] = [
				'slug'  => $slug,
				'label' => $this->label( $slug, $row['title'] ),
			];
		}

		$default = $sets[ Token_Store::default_slug() ] ?? [
			'slug'  => Token_Store::default_slug(),
			'label' => $this->label( Token_Store::default_slug(), '' ),
		];
		unset( $sets[ Token_Store::default_slug() ] );

		return [
			'active' => $this->active->get(),
			'sets'   => array_values( [ Token_Store::default_slug() => $default ] + $sets ),
		];
	}

	/**
	 * The display label for a library: its stored title when it has one, otherwise a friendly name for the
	 * default library and the bare slug for any other library with no title. Display-only — the slug is the
	 * value the picker writes to the block attribute.
	 *
	 * @since TBD
	 *
	 * @param string $slug  The library slug.
	 * @param string $title The stored title, possibly empty.
	 *
	 * @return string
	 */
	private function label( string $slug, string $title ): string {
		if ( $title !== '' ) {
			return $title;
		}

		if ( $slug === Token_Store::default_slug() ) {
			return __( 'Default', 'kadence-blocks' );
		}

		return $slug;
	}
}
