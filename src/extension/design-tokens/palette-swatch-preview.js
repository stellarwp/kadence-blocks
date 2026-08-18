/**
 * Preview the selected block's color-palette override in the inspector's color controls.
 *
 * A block pinned to a palette (its `kbPalette`) re-skins its own canvas subtree through the projector's
 * `[data-kb-palette]` switch layer, but the color-control swatches live in the top-document inspector, outside
 * that subtree, so they keep resolving `var(--kb-token--<id>)` against the editor `:root` — the library
 * `$current` — no matter which palette the block is pinned to.
 *
 * The switch-layer CSS is already loaded in the top document: it rides the `kadence-blocks-global-editor-styles`
 * handle, a dependency of `wp-block-library`. Reflecting the selected block's effective palette onto the
 * top-document `<html>` re-points the swatch vars (and the pop color popover, which portals to the body) through
 * the existing `[data-kb-palette="<id>"]` rules, and clears back to `$current` when nothing is pinned.
 *
 * Because a non-iframed editor canvas shares that same top-document root, the `<html>` override would otherwise
 * cascade into every canvas block that does NOT pin its own palette. To keep the canvas on the library `$current`,
 * the preview also re-declares `$current` on the canvas root (`.editor-styles-wrapper`) through the same switch
 * layer — the projector emits a `[data-kb-palette="<current>"]` rule too — so unpinned blocks stay put while
 * pinned blocks re-override through their own deeper wrapper attribute. In an iframed editor the canvas is a
 * separate document, so the shield selector matches nothing in the top document and only the iframe's own
 * per-block attributes apply. No new CSS and no per-palette value map: the projector's switch layer stays the
 * single source of truth.
 */
import { select, subscribe } from '@wordpress/data';

/**
 * The wrapper attribute the projector's palette switch layer keys on.
 *
 * @type {string}
 */
const SWITCH_ATTR = 'data-kb-palette';

/**
 * The editor canvas root. When the canvas is not iframed it shares the top-document `:root`, so it is re-declared
 * to the library `$current` while a preview is active to keep unpinned blocks off the previewed palette.
 *
 * @type {string}
 */
const CANVAS_SELECTOR = '.editor-styles-wrapper';

/**
 * The library `$current` palette id from the server-localized catalog, defaulting to 'default'. Used to hold the
 * canvas on the active palette while the inspector previews another.
 *
 * @since TBD
 *
 * @return {string} The current palette id.
 */
function currentPaletteId() {
	const catalog = (typeof window !== 'undefined' && window.kadenceDesignTokensPalettes) || {};

	return catalog.current || 'default';
}

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
 * Set or clear `data-kb-palette` on one element, skipping the write when it already matches.
 *
 * @param {Element} el The element to stamp.
 * @param {string}  id The palette id ('' removes the attribute).
 *
 * @since TBD
 *
 * @return {void}
 */
function reflect(el, id) {
	const current = el.getAttribute(SWITCH_ATTR) || '';

	if (id === current) {
		return;
	}

	if (id) {
		el.setAttribute(SWITCH_ATTR, id);
	} else {
		el.removeAttribute(SWITCH_ATTR);
	}
}

/**
 * Reflect an effective palette id onto the top-document `<html>` (so the inspector swatches and the pop color
 * popover preview it), and hold the editor canvas on the library `$current` so an un-iframed canvas does not
 * inherit the preview. A no-op on `<html>` when the value is unchanged, so the shared subscription never thrashes
 * the attribute.
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

	if ((root.getAttribute(SWITCH_ATTR) || '') === id) {
		return;
	}

	reflect(root, id);

	// Re-declare the current palette on the canvas root so unpinned blocks stay on $current while `<html>` carries
	// the preview; removing it when the preview clears. Matches nothing in the top document when the canvas is
	// iframed, which is the correct no-op there.
	const shield = id ? currentPaletteId() : '';

	document.querySelectorAll(CANVAS_SELECTOR).forEach((canvas) => reflect(canvas, shield));
}

/**
 * Keep the preview in sync with the selected block's effective palette, so the inspector's color-control swatches
 * preview that palette's colors through the projector's existing switch layer. Applies once immediately, then on
 * every block-editor store change. Returns the unsubscribe handle.
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
