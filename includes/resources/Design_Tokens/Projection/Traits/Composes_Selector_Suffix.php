<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Traits;

/**
 * Shared composer for the selector suffix a binding appends after a block's `.wp-block-*` class, used by
 * every projector that emits a real CSS declaration rather than a custom property.
 *
 * @since TBD
 */
trait Composes_Selector_Suffix {

	/**
	 * Compose a binding's optional selector suffix into the string appended after the block's `.wp-block-*`
	 * class. A bare selector (e.g. `img`) is treated as a descendant and gets the combinator space inserted
	 * for it, so the declaration never has to carry a load-bearing leading space. A suffix that already
	 * opens with a combinator or attachment character (`>`, `+`, `~`, `.`, `:`, `#`, `[`, `&`) is used
	 * verbatim, so child combinators (`> img`), compound selectors (`.is-style-rounded`) and state
	 * selectors (`:hover .kb-svg-icon-wrap`) stay expressible. A descendant whose own selector opens with
	 * one of those characters asks for the space with a leading `*`, which adds no specificity of its own.
	 * Empty when the binding names none — the rule targets the block root.
	 *
	 * @since TBD
	 *
	 * @param string|null $selector The binding's raw `css_selector` / `css_state`, or null when it names none.
	 *
	 * @return string The selector suffix, ready to concatenate after the block class.
	 */
	private function selector_suffix( ?string $selector ): string {
		$selector = trim( (string) $selector );

		if ( $selector === '' ) {
			return '';
		}

		return strpbrk( $selector[0], '>+~.:#[&' ) === false ? ' ' . $selector : $selector;
	}
}
