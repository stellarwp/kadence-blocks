/**
 * `kadence/singlebtn`'s host-specific `resolveLiteral` for `ColorControl`'s Custom tab.
 *
 * Kept as its own file (rather than a `token-controls` export) because the design scoped
 * host-adapter logic as per-block, not shared — `token-controls` never imports from a host
 * block, only the reverse.
 */

/**
 * Internal dependencies
 */
import { tokenCssVar } from '../../token-controls/helpers/token-css-var';

/**
 * Resolve a token entry's current literal color from the top-document `<html>`.
 *
 * `palette-swatch-preview.js`'s `applyPalettePreview()` stamps the selected block's effective
 * `data-kb-palette` onto `document.documentElement` while the block is selected, so reading the
 * token's CSS variable there (rather than from any DOM node local to this control) returns the
 * value under the block's own pinned palette, not the site's default palette.
 *
 * @param {Object} entry The token entry (`{ id, label, value, alias }`) to resolve.
 *
 * @since TBD
 *
 * @return {string} The resolved CSS color literal, or '' when there is no document to read from.
 */
export function resolveColorLiteral(entry) {
	if (typeof document === 'undefined' || !document.documentElement) {
		return '';
	}

	const id = entry.alias ? entry.alias.slice(1, -1) : entry.id;

	return getComputedStyle(document.documentElement).getPropertyValue(tokenCssVar(id)).trim();
}
