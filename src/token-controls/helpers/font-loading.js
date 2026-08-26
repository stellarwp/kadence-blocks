/**
 * Waiting for a web font to be usable before anything renders in it.
 *
 * Picking a font used to flash: the browser painted the fallback face immediately and swapped when
 * the file arrived (`display=swap`), so every first pick of a family showed the wrong font for a
 * moment. Loading the file earlier would only move the cost around — the fix is to keep showing what
 * is already on screen until the new face is actually usable, then switch once.
 *
 * Two waits, in order, and the order is the part worth knowing:
 *
 * 1. **The stylesheet.** `fonts.load()` resolves against the faces the document currently knows. A
 *    freshly injected `<link>` has not been parsed yet, so asking immediately resolves with no faces
 *    and reports success while the font is still missing. The link's own `load` event is what says
 *    the `@font-face` rules exist.
 * 2. **The face.** Only then does `fonts.load()` fetch the file and resolve when it can be painted.
 *
 * Every wait is bounded. A font that never arrives — offline, a blocked request, a family Google
 * does not serve — must not leave a caller waiting on a promise that never settles, because the
 * caller is holding the user's pick until it resolves.
 *
 * Host-agnostic by taking the target document: the block editor canvas is an iframe with its own
 * document and its own font set, and a stylesheet appended to the outer one styles nothing the user
 * can see. Callers pass the document they render into; nothing here knows which host is asking.
 */

/**
 * Injected stylesheet URLs, per document. A `WeakMap` rather than a module-level `Set` because the
 * editor canvas is replaced on device switches — the entry for a discarded document goes with it,
 * instead of claiming a stylesheet is present in a document that no longer exists.
 *
 * @since TBD
 *
 * @type {WeakMap<Document, Map<string, Promise<void>>>}
 */
const injected = new WeakMap();

/**
 * How long to wait on any single step before giving up and letting the caller proceed.
 *
 * @since TBD
 *
 * @type {number}
 */
export const FONT_LOAD_TIMEOUT = 3000;

/**
 * The Google Fonts stylesheet URL for a family, at its default weight.
 *
 * No axis is requested: both callers preview a family rather than a specific cut, and asking for a
 * weight the family does not publish returns a 400 for the whole request.
 *
 * @param {string} family The family name.
 *
 * @since TBD
 *
 * @return {string} The stylesheet URL.
 */
export function googleFontHref(family) {
	return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
}

/**
 * Resolve when `promise` settles, or after `timeout` ms, whichever comes first. Never rejects: a
 * font that fails to load is a font the caller renders without, not an error it has to handle.
 *
 * @param {Promise} promise The promise to bound.
 * @param {number}  timeout Milliseconds to wait.
 *
 * @since TBD
 *
 * @return {Promise<void>} Settles either way.
 */
function bounded(promise, timeout) {
	return Promise.race([
		Promise.resolve(promise).catch(() => undefined),
		new Promise((resolve) => setTimeout(resolve, timeout)),
	]).then(() => undefined);
}

/**
 * Inject a stylesheet into a document once, and resolve when it has been parsed.
 *
 * Repeat calls for the same URL in the same document share the first call's injection, so two
 * controls asking for the same family never inject twice. Each still bounds the wait itself, so one
 * caller giving up says nothing about whether the stylesheet has parsed.
 *
 * @param {string}   href      The stylesheet URL.
 * @param {Document} doc       The document to inject into.
 * @param {number}   [timeout] Milliseconds to wait for the load event.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves once the stylesheet is parsed, or on timeout.
 */
export function ensureStylesheet(href, doc = document, timeout = FONT_LOAD_TIMEOUT) {
	if (!doc?.head) {
		return Promise.resolve();
	}

	if (!injected.has(doc)) {
		injected.set(doc, new Map());
	}

	const sheets = injected.get(doc);

	// What is cached is the link's own completion, never a bounded wait on it. Caching the bounded
	// one would let a single caller's timeout stand in for the stylesheet having parsed: every later
	// caller would get an already-resolved promise and go straight to `fonts.load()` against faces
	// that still do not exist — the flash this module exists to prevent, on exactly the slow
	// connection where it is most likely. Each caller bounds the shared promise for itself.
	if (sheets.has(href)) {
		return bounded(sheets.get(href), timeout);
	}

	const loaded = new Promise((resolve) => {
		const link = doc.createElement('link');
		link.rel = 'stylesheet';
		link.href = href;
		link.onload = resolve;
		link.onerror = resolve;
		doc.head.appendChild(link);
	});

	sheets.set(href, loaded);

	return bounded(loaded, timeout);
}

/**
 * Resolve when a family is usable in a document: its stylesheet parsed and its face fetched.
 *
 * Resolves immediately for an empty family, and for a document with no font set (older browsers, and
 * the jsdom the tests run in) — in both cases there is nothing to wait for, and blocking a pick on a
 * capability the browser lacks would be worse than the flash this exists to prevent.
 *
 * @param {string}    family            The family name.
 * @param {Object}    [options]
 * @param {Document}  [options.doc]     The document that will render the font.
 * @param {?string}   [options.href]    A stylesheet to inject first; omit for a family the document
 *                                      already has (a system face, or one the site loads itself).
 * @param {number}    [options.timeout] Milliseconds to wait for each step.
 *
 * @since TBD
 *
 * @return {Promise<void>} Resolves when the font is usable, or when waiting has gone on long enough.
 */
export async function loadFontFamily(family, { doc = document, href = null, timeout = FONT_LOAD_TIMEOUT } = {}) {
	if (!family) {
		return;
	}

	if (href) {
		await ensureStylesheet(href, doc, timeout);
	}

	if (!doc?.fonts?.load) {
		return;
	}

	// Quoted, so a multi-word family parses as one font-family rather than a list.
	await bounded(doc.fonts.load(`1em "${family}"`), timeout);
}
