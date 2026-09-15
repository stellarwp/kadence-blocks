<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Editor;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Token_Resolver;

/**
 * Builds the compact per-block attribute-default catalog the `blocks.registerBlockType` filter in
 * early-filters.js reads to seed a freshly inserted block's attribute default. Today it seeds one thing:
 * an EMPTY `size` on kadence/single-icon whenever the icon-size token resolves, replacing block.json's
 * hardcoded `50`, so a fresh icon holds no size of its own and its preview falls back to the selected
 * preset's size — the same state the preset picker writes when a preset is chosen.
 *
 * Seeding a pixel NUMBER here instead is the trap this replaces: the number lived in the block as a
 * per-instance value, so a Style Library edit to the Default preset's size never reached the canvas, and
 * the block read as "Edited" the moment it was inserted.
 *
 * The seed is gated on the token resolving, matching the front-end adapter and the block-default CSS
 * rule, so a site with no icon-size token keeps block.json's own default everywhere.
 *
 * Scoped to kadence/single-icon's `size` today. Not a general "any block, any attribute" registry:
 * extend the ENTRIES map only when a second real consumer needs it.
 *
 * @since TBD
 */
final class Attribute_Default_Catalog {

	/**
	 * Block => attribute => the resolved-token dot-path whose presence gates the seed.
	 *
	 * @since TBD
	 *
	 * @var array<string, array<string, string>>
	 */
	private const ENTRIES = [
		'kadence/single-icon' => [
			'size' => 'semantic.icon-size.default',
		],
	];

	/**
	 * @since TBD
	 *
	 * @var Token_Resolver
	 */
	private Token_Resolver $resolver;

	/**
	 * @since TBD
	 *
	 * @param Token_Resolver $resolver The token resolver.
	 */
	public function __construct( Token_Resolver $resolver ) {
		$this->resolver = $resolver;
	}

	/**
	 * The catalog, keyed by block name then attribute name, each value the empty default to seed. A
	 * block/attribute whose gating token does not resolve is omitted — the editor filter falls back to
	 * block.json's own default for it.
	 *
	 * @since TBD
	 *
	 * @return array<string, array<string, string>>
	 */
	public function all(): array {
		$resolved = $this->resolver->resolve();
		$out      = [];

		foreach ( self::ENTRIES as $block => $attributes ) {
			foreach ( $attributes as $attribute => $token_id ) {
				if ( $resolved->value( $token_id ) === null ) {
					continue;
				}

				$out[ $block ][ $attribute ] = '';
			}
		}

		return $out;
	}
}
