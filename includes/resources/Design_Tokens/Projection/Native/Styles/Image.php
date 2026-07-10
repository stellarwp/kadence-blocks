<?php declare( strict_types=1 );

namespace KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles;

use KadenceWP\KadenceBlocks\Design_Tokens\Projection\Native\Styles\Contracts\Styles;

/**
 * The companion stylesheet that makes a native core/image consume the design system's media tokens — the
 * core/image analogue of kadence/image's block-default CSS.
 *
 * kadence/image gets its radius / border / shadow defaults from the block-default-CSS projector on its own
 * `.wp-block-kadence-image img` markup. A native core/image has no such CSS, so these rules point
 * `.wp-block-image img` at the same media tokens (border-radius, border color + width, box-shadow).
 *
 * Unlike the native button — whose companion styles a color axis that depends on the theme palette, and so is
 * gated on `$owns_default` (the palette override) — every image media token is a design-system semantic
 * seeded to KB's own default (square, no border, no shadow), none of them a theme-palette color. So these
 * apply whenever the registry is active (the Projector's gate), not behind the palette gate — mirroring the
 * always-on radius the Kadence button reads from `--kb-token--semantic--radius--control`. `$owns_default` is
 * therefore unused here.
 *
 * Every value the block's own settings produce still wins, because these are ordinary single-class stylesheet
 * rules and nothing here is `!important`:
 *   - a custom radius / border width / border color / box-shadow set in the editor is written as an **inline
 *     style** on the `<img>`, which outranks any stylesheet;
 *   - a **preset** border color carries the `.has-border-color` class, so its declaration is guarded with
 *     `:not(.has-border-color)`;
 *   - the **`is-style-rounded`** block style rounds the image through a higher-specificity
 *     `.wp-block-image.is-style-rounded img` rule that beats this single-class rule for radius.
 *
 * @since TBD
 */
final class Image implements Styles {

	/**
	 * The rendered image element, relative to the block wrapper.
	 *
	 * @since TBD
	 *
	 * @var string
	 */
	private const IMG = '.wp-block-image img';

	/**
	 * @inheritDoc
	 *
	 * @since TBD
	 *
	 * @param bool $owns_default Whether the design system owns native defaults (the theme palette was
	 *                           replaced). Unused: the image media tokens are not theme-palette colors, so —
	 *                           like the button's always-on radius — they apply whenever the registry is active.
	 *
	 * @return string
	 */
	public function css( bool $owns_default ): string {
		// Radius, border width, and box-shadow follow the media tokens. A value the editor sets is an inline
		// style on the <img> and outranks this rule; is-style-rounded's higher-specificity rule still wins for
		// radius — so the block's own settings always override these defaults.
		$css = self::IMG . '{'
			. 'border-radius:var(--kb-token--semantic--radius--media);'
			. 'border-width:var(--kb-token--semantic--border-width--default);'
			. 'box-shadow:var(--kb-token--semantic--shadow--media);'
			. '}';

		// Border color follows the brand border token unless a preset border color added the .has-border-color
		// class; a custom border color is inline and wins regardless.
		$css .= self::IMG . ':not(.has-border-color){border-color:var(--kb-token--semantic--color--border);}';

		return $css;
	}
}
