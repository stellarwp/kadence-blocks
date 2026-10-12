<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Site_Styles;

use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Scopes_Site_Styles;
use KadenceWP\KadenceBlocks\Site_Styles\Contracts\Supports_Site_Styles;
use WP_Block_Type_Registry;

/**
 * The blocks that take site-level styles, keyed by block name. Each block's
 * class describes its site styles through `Supports_Site_Styles`.
 *
 * @since TBD
 */
final class Supported_Blocks {

	/**
	 * Identifiers and per-instance data no site-level value may set, whatever
	 * the block. `kadenceDynamic` holds Kadence Blocks Pro's dynamic-content
	 * bindings, which it adds to blocks outside their `block.json`.
	 */
	private const ALWAYS_EXCLUDED = [ 'uniqueID', 'anchor', 'inQueryBlock', 'noCustomDefaults', 'metadata', 'lock', 'className', 'kadenceDynamic' ];

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
	 * The attributes a block's site-level values never set: the ones excluded
	 * for every block, the attributes its `block.json` marks as content, and
	 * its scope attribute when it scopes its site styles.
	 *
	 * @since TBD
	 *
	 * @param Supports_Site_Styles $block The block.
	 *
	 * @return list<string> Attribute names.
	 */
	public static function excluded_attributes( Supports_Site_Styles $block ): array {
		$excluded   = self::ALWAYS_EXCLUDED;
		$block_type = WP_Block_Type_Registry::get_instance()->get_registered( $block->get_name() );
		$attributes = $block_type && is_array( $block_type->attributes ) ? $block_type->attributes : [];

		foreach ( $attributes as $name => $definition ) {
			if ( ! is_array( $definition ) ) {
				continue;
			}

			$role = $definition['role'] ?? $definition['__experimentalRole'] ?? null;

			if ( 'content' === $role && ! in_array( $name, $excluded, true ) ) {
				$excluded[] = $name;
			}
		}

		if ( $block instanceof Scopes_Site_Styles ) {
			$excluded[] = $block->site_styles_scope_attribute();
		}

		return $excluded;
	}
}
