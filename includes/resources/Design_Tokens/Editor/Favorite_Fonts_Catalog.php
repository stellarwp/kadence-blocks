<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Admin\Feed\Font_Catalog;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Database\Token_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Document\Favorite_Font_Index;

/**
 * Builds the font list the block editor's font-family picker reads: the ACTIVE library's favorite
 * families, plus the site-registered custom family names.
 *
 * Deliberately NOT the Google names. The editor already carries all ~1,900 of them on every screen
 * as `kadence_blocks_params.g_font_names` (see class-kadence-blocks-editor-assets.php), so shipping
 * a second copy here would add ~29KB to every editor load to say the same thing twice. The custom
 * names ARE shipped, because the editor's own `c_fonts` is an associative shape keyed by a font name
 * or by a whole font-stack expression — normalizing that is exactly what {@see Font_Catalog} already
 * does for the Style Library, and duplicating its `family_of()` rule in JS is how the two screens
 * would start disagreeing about what a font is called.
 *
 * Favorites are read from the active library because that is the library the editor renders by
 * default — the same pointer {@see Pickable_Tokens_Catalog} honors for its sort order.
 *
 * @since TBD
 */
final class Favorite_Fonts_Catalog {

	/**
	 * The sole gateway to the stored token libraries.
	 *
	 * @since TBD
	 *
	 * @var Token_Store
	 */
	private Token_Store $store;

	/**
	 * The active-library pointer, naming the library whose favorites the editor lists.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * Reads the favoriteFonts list out of a stored document.
	 *
	 * @since TBD
	 *
	 * @var Favorite_Font_Index
	 */
	private Favorite_Font_Index $favorites;

	/**
	 * The site's font catalog, for the normalized custom-family names.
	 *
	 * @since TBD
	 *
	 * @var Font_Catalog
	 */
	private Font_Catalog $catalog;

	/**
	 * @since TBD
	 *
	 * @param Token_Store                $store     The token store.
	 * @param Active_Token_Library_Store $active    The active-library pointer.
	 * @param Favorite_Font_Index        $favorites Reads the favoriteFonts list.
	 * @param Font_Catalog               $catalog   The site's font catalog.
	 */
	public function __construct(
		Token_Store $store,
		Active_Token_Library_Store $active,
		Favorite_Font_Index $favorites,
		Font_Catalog $catalog
	) {
		$this->store     = $store;
		$this->active    = $active;
		$this->favorites = $favorites;
		$this->catalog   = $catalog;
	}

	/**
	 * The editor's font list: the active library's favorites in stored order, and the site's custom
	 * family names.
	 *
	 * @since TBD
	 *
	 * @return array{favorites: list<string>, custom: string[]}
	 */
	public function all(): array {
		return [
			'favorites' => $this->favorites->all( $this->store->get_decoded_document( $this->active->get() ) ),
			'custom'    => $this->catalog->all()['custom'],
		];
	}
}
