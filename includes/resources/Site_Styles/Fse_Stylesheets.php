<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

/**
 * Loads, in FSE mode, the build's `*-fse-<keys>.css` copies of the stylesheets
 * with a block's default rule. In a copy, the properties of the core keys named
 * in its file name have the specificity of core's Global Styles rule for the
 * block and come before it, so the site's values win.
 *
 * On the front end the copy matches the core keys the site sets, so a property
 * the site leaves alone keeps its full strength, e.g. against a Section's link
 * color. The editor always gets every key, so a value set in the Styles screen
 * shows before it is saved. Classic mode keeps the original files.
 *
 * @since TBD
 */
final class Fse_Stylesheets {

	/**
	 * Stylesheets with an FSE copy, by file name in `dist/`, and the block whose
	 * default rule they hold. `style-*` files are the front end's.
	 *
	 * @var array<string, string>
	 */
	private const FILES = [
		'style-blocks-advancedbtn' => 'kadence/singlebtn',
		'blocks-advancedbtn'       => 'kadence/singlebtn',
		'blocks-advanced-form'     => 'kadence/singlebtn',
	];

	/**
	 * The site-level values.
	 *
	 * @var Store
	 */
	private Store $store;

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Store            $store  The site-level values.
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Store $store, Supported_Blocks $blocks ) {
		$this->store  = $store;
		$this->blocks = $blocks;
	}

	/**
	 * Points a stylesheet with an FSE copy to the copy it needs.
	 *
	 * @since TBD
	 *
	 * @param string|mixed $src The stylesheet URL.
	 *
	 * @return string|mixed The URL of the FSE copy, or the URL unchanged, also when the build has no copy.
	 */
	public function filter_src( $src ) {
		if (
			! is_string( $src )
			|| 0 !== strpos( $src, KADENCE_BLOCKS_URL . 'dist/' )
			|| ! preg_match( '#/dist/(' . implode( '|', array_keys( self::FILES ) ) . ')\.css#', $src, $match )
			|| ! kadence_blocks_is_fse_mode()
		) {
			return $src;
		}

		$block_name = self::FILES[ $match[1] ];
		$block      = $this->blocks->get( $block_name );
		$paths      = 0 === strpos( $match[1], 'style-' ) ? $this->store->core_paths( $block_name ) : array_values( $block ? $block->site_styles_attributes_map() : [] );

		if ( ! $paths ) {
			return $src;
		}

		$keys = array_map( static fn( string $path ): string => array_slice( explode( '.', $path ), -1 )[0], $paths );
		$copy = $match[1] . '-fse-' . implode( '-', $keys ) . '.css';

		// A build without the copies, e.g. `bun run build-wp` alone, keeps the original rather than a missing file.
		if ( ! file_exists( KADENCE_BLOCKS_PATH . 'dist/' . $copy ) ) {
			return $src;
		}

		return str_replace( '/dist/' . $match[1] . '.css', '/dist/' . $copy, $src );
	}
}
