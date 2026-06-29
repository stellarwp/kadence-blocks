<?php declare( strict_types=1 );
// cspell:ignore singlebtn .

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Contracts\Styles;

/**
 * The companion stylesheet that makes a native core/button consume the Kadence button slots — the
 * core/button analogue of the Kadence button's SCSS.
 *
 * The core/button block reuses the Kadence button's exact variant mechanism: the shared Variant\Css_Builder
 * retargets --global-palette-btn-* per selected variant, and these rules make the native button link read those slots
 * for the Fill and Outline shapes, resting and on :hover/:focus — mirroring src/blocks/advancedbtn/style.scss
 * for .kb-button. The only difference is the selector: the Kadence button styles ".kb-button", this styles
 * ".wp-block-button__link".
 *
 * The scope depends on $owns_default (see {@see Styles::css()}):
 *
 *   - true (the theme palette was replaced, so the theme's native button color is gone): the design system
 *     owns EVERY core/button's default — the rules target ".wp-block-button", and the class-less $default
 *     the Variant\Css_Builder emits gives an untouched button the Primary look.
 *   - false (the default): the rules target only a button carrying a selected variant
 *     (".wp-block-button[class*='kb-variant--']"), so an untouched core/button keeps its native theme button
 *     and the design system never changes a button the author did not opt into.
 *
 * Either way the variant class is additive (not a register_block_style() block style), so a button can carry
 * "is-style-outline" and "kb-variant--<name>" at once; the Outline rules read the background slot as the
 * border + text color. Every declaration is guarded with :not(.has-background) / :not(.has-text-color) /
 * :not(.has-border-color), so a color the editor sets on a specific button still wins.
 *
 * @since TBD
 */
final class Button implements Styles {

	/**
	 * The link element, relative to the block wrapper.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const LINK = '> .wp-block-button__link';

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param bool $owns_default Whether the design system owns the button default (the theme palette was
	 *                           replaced), so the rules apply to every core/button rather than only those
	 *                           carrying a selected variant.
	 *
	 * @return string
	 */
	public function css( bool $owns_default ): string {
		$button = $owns_default ? '.wp-block-button' : '.wp-block-button[class*="kb-variant--"]';

		$fill    = $button . ':not(.is-style-outline) ' . self::LINK;
		$outline = $button . '.is-style-outline ' . self::LINK;

		// Fill: background + text from the button slots, resting and on hover/focus.
		$css  = $fill . ':not(.has-background){background-color:var(--global-palette-btn-bg);}';
		$css .= $fill . ':not(.has-text-color){color:var(--global-palette-btn);}';
		$css .= $fill . ':not(.has-background):hover,' . $fill . ':not(.has-background):focus{background-color:var(--global-palette-btn-bg-hover);}';
		$css .= $fill . ':not(.has-text-color):hover,' . $fill . ':not(.has-text-color):focus{color:var(--global-palette-btn-hover);}';

		// Outline: no fill, so the background slot becomes the border + text color.
		$css .= $outline . ':not(.has-text-color){color:var(--global-palette-btn-bg);}';
		$css .= $outline . ':not(.has-border-color){border-color:var(--global-palette-btn-bg);}';
		$css .= $outline . ':not(.has-text-color):hover,' . $outline . ':not(.has-text-color):focus{color:var(--global-palette-btn-bg-hover);}';
		$css .= $outline . ':not(.has-border-color):hover,' . $outline . ':not(.has-border-color):focus{border-color:var(--global-palette-btn-bg-hover);}';

		return $css;
	}
}
