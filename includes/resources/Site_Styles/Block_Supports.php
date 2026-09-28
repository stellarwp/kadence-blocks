<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

/**
 * Adds core supports and selectors to the supported blocks' metadata in the
 * Kadence theme's FSE mode, so core's Styles > Blocks screen lists them with
 * the matching controls. The static `block.json` files stay unchanged, so
 * blocks-only sites and other themes see nothing new.
 *
 * @since TBD
 */
final class Block_Supports {

	/**
	 * The supported blocks.
	 *
	 * @var Supported_Blocks
	 */
	private Supported_Blocks $blocks;

	/**
	 * @since TBD
	 *
	 * @param Supported_Blocks $blocks The supported blocks.
	 */
	public function __construct( Supported_Blocks $blocks ) {
		$this->blocks = $blocks;
	}

	/**
	 * @since TBD
	 *
	 * @param mixed $metadata Block metadata read from `block.json`.
	 *
	 * @return mixed The metadata, with the FSE-only supports and selectors for a supported block.
	 */
	public function filter_metadata( $metadata ) {
		if ( ! is_array( $metadata ) || ! isset( $metadata['name'] ) || ! is_string( $metadata['name'] ) ) {
			return $metadata;
		}

		$block = $this->blocks->get( $metadata['name'] );

		if ( null === $block || ! kadence_blocks_is_fse_mode() ) {
			return $metadata;
		}

		$metadata['supports']  = array_merge( $metadata['supports'] ?? [], $block->site_styles_supports() );
		$metadata['selectors'] = array_merge( $metadata['selectors'] ?? [], $block->site_styles_selectors() );

		return $metadata;
	}
}
