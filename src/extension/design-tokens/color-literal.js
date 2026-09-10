/**
 * The block editor's `resolveLiteral` for `ColorControl`'s Custom tab.
 *
 * Lives in the editor extension rather than in `token-controls` because it reads the DOM: the
 * control library stays host-agnostic and takes this as a prop, so the direction of the dependency
 * is host -> library and never the reverse. It sits beside `useColorGroups`, which supplies the
 * other half of a `ColorControl`'s data, so a block wiring one reaches for both from the same place.
 *
 * Nothing here is block-specific — every editor host resolves a token the same way, off the same
 * document — so this is shared by every block that mounts a `ColorControl`.
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
