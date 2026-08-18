/**
 * Preview the selected block's color-palette override in the inspector's color controls.
 *
 * A block pinned to a palette (its `kbPalette`) re-skins its own canvas subtree through the projector's
 * `[data-kb-palette]` switch layer, but the color-control swatches live in the top-document sidebar, outside
 * that subtree, so they keep resolving `var(--kb-token--<id>)` against the editor `:root` — the library
 * `$current` — no matter which palette the block is pinned to.
 *
 * The same switch-layer CSS is already loaded in the top document: it rides the
 * `kadence-blocks-global-editor-styles` handle, a dependency of `wp-block-library`, alongside the base token
 * vars. So the whole fix is to reflect the selected block's effective palette onto the top-document `<html>` —
 * the existing `[data-kb-palette="<id>"]` rules then re-point the swatch vars (and the picker's computed
 * value, read from `document.documentElement`) to that palette, and clear back to `$current` when nothing is
 * pinned. No new CSS and no per-palette value map: the projector's switch layer stays the single source of
 * truth.
 */
import { select, subscribe } from '@wordpress/data';

/**
 * The wrapper attribute the projector's palette switch layer keys on, mirrored onto the top-document `<html>`.
 *
 * @type {string}
 */
const SWITCH_ATTR = 'data-kb-palette';

/**
 * The selected block's effective palette id: its own `kbPalette`, else the nearest ancestor's — mirroring the
 * projector's `[data-kb-palette]` cascade to descendants — else '' when no block is selected or none is pinned.
 *
 * @since TBD
 *
 * @return {string} The effective palette id, or '' when there is no override to preview.
 */
export function effectivePalette() {
	const editor = select('core/block-editor');
	const clientId = editor && editor.getSelectedBlockClientId && editor.getSelectedBlockClientId();

	if (!clientId) {
		return '';
	}

	const own = editor.getBlockAttributes(clientId)?.kbPalette;

	if (own) {
		return own;
	}

	// Walk from the nearest ancestor outward, so a child follows the closest pinned ancestor.
	const parents = editor.getBlockParents(clientId) || [];

	for (let i = parents.length - 1; i >= 0; i--) {
		const inherited = editor.getBlockAttributes(parents[i])?.kbPalette;

		if (inherited) {
			return inherited;
		}
	}

	return '';
}

/**
 * Reflect an effective palette id onto the top-document `<html>` via `data-kb-palette`, or remove the attribute
 * when empty. A no-op when the value is unchanged, so the shared subscription never thrashes the attribute.
 *
 * @param {string} id The effective palette id ('' clears the override so swatches follow the set `$current`).
 *
 * @since TBD
 *
 * @return {void}
 */
export function applyPalettePreview(id) {
	if (typeof document === 'undefined' || !document.documentElement) {
		return;
	}

	const root = document.documentElement;
	const current = root.getAttribute(SWITCH_ATTR) || '';

	if (id === current) {
		return;
	}

	if (id) {
		root.setAttribute(SWITCH_ATTR, id);
	} else {
		root.removeAttribute(SWITCH_ATTR);
	}
}

/**
 * Keep the top-document `<html>` `data-kb-palette` in sync with the selected block's effective palette, so the
 * inspector's color-control swatches preview that palette's colors through the projector's existing switch
 * layer. Applies once immediately, then on every block-editor store change. Returns the unsubscribe handle.
 *
 * @since TBD
 *
 * @return {Function} The unsubscribe function.
 */
export function registerTokenSwatchPalettePreview() {
	applyPalettePreview(effectivePalette());

	return subscribe(() => {
		applyPalettePreview(effectivePalette());
	}, 'core/block-editor');
}
