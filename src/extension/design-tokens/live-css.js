/**
 * Live re-injection of the design-token editor CSS into the block-editor canvas.
 *
 * The projectors emit the token/variant CSS server-side only at page load, so a change made in the editor
 * (creating/editing/deleting a variant, or a future token-value edit) is not reflected until a reload. These
 * helpers fetch the combined projected CSS and write it into a dedicated `<style>` in the canvas document, so
 * the change applies immediately. Generic on purpose — any design-token change can call `refreshProjectedCss`.
 */
import apiFetch from '@wordpress/api-fetch';
import { designTokensNamespace } from './rest';

/**
 * The id of the runtime `<style>` element, so it is found-and-replaced rather than duplicated.
 */
const STYLE_ID = 'kadence-blocks-design-tokens-live';

/**
 * Fetch the combined design-token editor CSS for live re-injection into the canvas.
 *
 * @return {Promise<{ css: string }>} The projected CSS payload.
 */
export function fetchProjectedCss() {
	return apiFetch({ path: `/${designTokensNamespace()}/projected-css` });
}

/**
 * The block-editor canvas document. Modern Gutenberg puts the canvas in an iframe; the `|| document`
 * fallback covers the case where it is not.
 *
 * @return {Document} The canvas document, or the top document when the canvas is not in an iframe.
 */
function canvasDocument() {
	return document.querySelector('iframe[name="editor-canvas"]')?.contentWindow?.document || document;
}

/**
 * Write the given CSS into the canvas's dedicated runtime `<style>`, creating it on first use. A full replace
 * keeps it idempotent, so it reflects the latest state for create, edit, and delete alike.
 *
 * @param {string} css The design-token editor CSS to apply.
 * @return {void}
 */
export function applyProjectedCss(css) {
	const doc = canvasDocument();

	if (!doc?.head) {
		return;
	}

	let style = doc.getElementById(STYLE_ID);

	if (!style) {
		style = doc.createElement('style');
		style.id = STYLE_ID;
		doc.head.appendChild(style);
	}

	style.textContent = css || '';
}

/**
 * Fetch the current projected CSS and apply it to the canvas. Fetch failures are swallowed — the change is
 * already saved server-side, so the worst case is that it shows after a reload.
 *
 * @return {Promise<void>}
 */
export function refreshProjectedCss() {
	return fetchProjectedCss()
		.then((payload) => applyProjectedCss(payload?.css || ''))
		.catch(() => {});
}
