<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Database\Active_Token_Library_Store;
use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter\Contracts\Abstract_Adapter;
use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Blanks kadence/single-icon's `size` registration default (block.json hardcodes `50`) whenever the
 * `semantic.icon-size.default` token resolves, so an icon with no size of its own renders none and the
 * preset CSS chain sizes it: the preset projector sets `--kb-icon-size` per preset on the block root, and
 * the block-default projector reads it on `.kb-svg-icon-wrap`. This runs on
 * `kadence_blocks_block_default_attributes`, which fires with the block's *registration* defaults, not
 * its stored instance attributes, so `Kadence_Blocks_Abstract_Block::merge_attributes_with_defaults()`
 * still lets a genuinely customized instance value win afterward.
 *
 * Seeding a NUMBER here instead (the token converted to px) is the trap this replaces. A number renders
 * as a per-instance `font-size` rule that outranks the preset chain, so a Style Library edit to the
 * Default preset's size never reached the page, while the preset chain quietly carried the right value.
 *
 * The blank is gated on the token resolving IN THE ACTIVE LIBRARY, because the block-default CSS rule is
 * gated the same way and built from that same library: a library that disables the icon-size token gets
 * no rule to fall through to, so block.json's `50` must stay there. Resolving the default library instead
 * would blank the size on a library the CSS never sizes.
 *
 * Because `size` has no `source` key, the block serializer omits it from saved content whenever it equals
 * the registration default, so this also covers every published icon block that never customized its
 * size — it follows the Default preset from now on, exactly as a cleared size already did.
 *
 * @since TBD
 */
final class Icon_Size_Adapter extends Abstract_Adapter {

	/**
	 * @since TBD
	 *
	 * @var string
	 */
	protected const BLOCK = 'kadence/single-icon';

	/**
	 * The resolved-token dot-path whose presence gates the blank.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const TOKEN = 'semantic.icon-size.default';

	/**
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * The active-library pointer, so the gate reads the library the block-default CSS is built from.
	 *
	 * @since TBD
	 *
	 * @var Active_Token_Library_Store
	 */
	private Active_Token_Library_Store $active;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver             $resolver The token resolver.
	 * @param Active_Token_Library_Store $active   The active-library pointer.
	 */
	public function __construct( Token_Resolver $resolver, Active_Token_Library_Store $active ) {
		$this->resolver = $resolver;
		$this->active   = $active;
	}

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param array<string, mixed> $attributes The block's registration default attributes.
	 *
	 * @return array<string, mixed> The transformed default attributes.
	 */
	public function apply( array $attributes ): array {
		if ( $this->resolver->resolve( $this->active->get() )->value( self::TOKEN ) === null ) {
			return $attributes;
		}

		$attributes['size'] = '';

		return $attributes;
	}
}
