<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;

/**
 * The blocks that take site-level styles, keyed by block name. Each block's
 * class describes its site styles through `Supports_Site_Styles`.
 *
 * @since TBD
 */
final class Supported_Blocks {

	/**
	 * Attributes no site-level value may set, whatever the block.
	 */
	private const ALWAYS_EXCLUDED = [ 'uniqueID', 'inQueryBlock', 'anchor', 'noCustomDefaults' ];

	/**
	 * Block name => block.
	 *
	 * @var array<string, Supports_Site_Styles>
	 */
	private array $blocks = [];

	/**
	 * @since TBD
	 *
	 * @param Supports_Site_Styles[] $blocks The supported blocks.
	 */
	public function __construct( array $blocks ) {
		foreach ( $blocks as $block ) {
			$this->blocks[ $block->get_name() ] = $block;
		}
	}

	/**
	 * @since TBD
	 *
	 * @return array<string, Supports_Site_Styles> Block name => block.
	 */
	public function all(): array {
		return $this->blocks;
	}

	/**
	 * @since TBD
	 *
	 * @param string $block_name Block name, e.g. `kadence/singlebtn`.
	 *
	 * @return Supports_Site_Styles|null The block, null when it isn't supported.
	 */
	public function get( string $block_name ): ?Supports_Site_Styles {
		return $this->blocks[ $block_name ] ?? null;
	}

	/**
	 * The attributes a block's site-level values never set: its content
	 * attributes and the ones excluded for every block.
	 *
	 * @since TBD
	 *
	 * @param Supports_Site_Styles $block The block.
	 *
	 * @return list<string> Attribute names.
	 */
	public static function excluded_attributes( Supports_Site_Styles $block ): array {
		return array_merge( self::ALWAYS_EXCLUDED, $block->site_styles_excluded_attributes() );
	}
}
