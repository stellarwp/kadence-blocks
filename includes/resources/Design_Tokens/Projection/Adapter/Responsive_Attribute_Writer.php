<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Adapter;

use KadenceWP\KadenceBlocks\Design_Tokens\Resolver\Resolved_Tokens;
use KadenceWP\KadenceBlocks\Design_Tokens\Schema\Vocabulary\Responsive;

/**
 * Fans a breakpoint-keyed resolved token value into the two block-attribute shapes Kadence Blocks renders
 * responsive values with, so a future per-block Adapter can seed a responsive token default into a block
 * whose attribute is a raw value (no CSS-var indirection):
 *
 *   - INDEXED [desktop, tablet, mobile] — what Kadence_Blocks_CSS::render_typography() reads for a
 *     typography sub-value (size / lineHeight / letterSpacing are each a 3-element array).
 *   - SUFFIXED siblings — `<attr>` / `tablet<Attr>` / `mobile<Attr>`, the shape render_measure_output()
 *     and similar sibling-attribute renderers read.
 *
 * A breakpoint with no override is left empty rather than back-filled with the desktop value, so the
 * block's own renderer skips it and the desktop value cascades — the same "absent = inherit base"
 * semantics the css-var projection uses.
 *
 * This is the write-back mechanism the discrete responsive tokens need for a block that consumes a raw
 * attribute instead of a css-var. No shipped block declares such a binding today — kadence/singlebtn
 * reads the `--kb-token--*` vars directly and is responsive through the per-media-query redeclaration
 * with no write-back — so this is intentionally not wired into any Adapter yet; it exists so the first
 * block that adopts a responsive raw-attribute binding has a tested seam to build on. Pure: no
 * WordPress calls, no globals.
 *
 * @since TBD
 */
final class Responsive_Attribute_Writer {

	/**
	 * The resolved token maps a value and its per-breakpoint overrides are read from.
	 *
	 * @since TBD
	 *
	 * @var Resolved_Tokens
	 */
	private Resolved_Tokens $resolved;

	/**
	 * @since TBD
	 *
	 * @param Resolved_Tokens $resolved The resolved token maps.
	 */
	public function __construct( Resolved_Tokens $resolved ) {
		$this->resolved = $resolved;
	}

	/**
	 * The indexed [desktop, tablet, mobile] array for a token, for a render_typography sub-value. An absent
	 * breakpoint override is an empty string so the block renderer inherits the desktop value there.
	 *
	 * @since TBD
	 *
	 * @param string $id The token id.
	 *
	 * @return array{0: string, 1: string, 2: string}
	 */
	public function indexed( string $id ): array {
		return [
			(string) ( $this->resolved->value( $id ) ?? '' ),
			(string) ( $this->resolved->value_at( $id, Responsive::get_tablet_key() ) ?? '' ),
			(string) ( $this->resolved->value_at( $id, Responsive::get_mobile_key() ) ?? '' ),
		];
	}

	/**
	 * The suffixed sibling attributes for a token: the desktop attribute plus its tablet / mobile siblings
	 * (`<attr>`, `tablet<Attr>`, `mobile<Attr>`). An absent breakpoint override is an empty string.
	 *
	 * @since TBD
	 *
	 * @param string $id        The token id.
	 * @param string $attribute The desktop attribute name (e.g. "padding").
	 *
	 * @return array<string,string> Attribute name => value, ready to array_merge into a block's attributes.
	 */
	public function siblings( string $id, string $attribute ): array {
		return [
			$attribute                        => (string) ( $this->resolved->value( $id ) ?? '' ),
			'tablet' . ucfirst( $attribute )  => (string) ( $this->resolved->value_at( $id, Responsive::get_tablet_key() ) ?? '' ),
			'mobile' . ucfirst( $attribute )  => (string) ( $this->resolved->value_at( $id, Responsive::get_mobile_key() ) ?? '' ),
		];
	}
}
