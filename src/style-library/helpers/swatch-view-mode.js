/**
 * The Color Palette swatch view choice (card grid or compact list) and its `localStorage` copy.
 * Every storage access is guarded: storage can be blocked, full, or missing, and none of that may
 * stop the toggle from working for the session.
 */

/**
 * The view modes the Color Palette screen offers.
 *
 * @since TBD
 *
 * @type {ReadonlyArray<string>}
 */
export const SWATCH_VIEW_MODES = Object.freeze(['grid', 'list']);

/**
 * The mode used when nothing valid is stored.
 *
 * @since TBD
 *
 * @type {string}
 */
export const DEFAULT_SWATCH_VIEW_MODE = 'grid';

/**
 * The `localStorage` key holding the chosen mode.
 *
 * @since TBD
 *
 * @type {string}
 */
export const SWATCH_VIEW_MODE_STORAGE_KEY = 'kadence-blocks:style-library:swatch-view-mode';

/**
 * The browser's `localStorage`, or null when it cannot be reached. Reading the property itself can
 * throw (blocked site data), so the access sits inside the try.
 *
 * @since TBD
 *
 * @return {?Storage} The storage, or null.
 */
function defaultStorage() {
	try {
		return window.localStorage;
	} catch (error) {
		return null;
	}
}

/**
 * Whether a value is one of the known view modes.
 *
 * @param {*} value The value to check.
 *
 * @since TBD
 *
 * @return {boolean} True for `'grid'` and `'list'`.
 */
export function isSwatchViewMode(value) {
	return SWATCH_VIEW_MODES.includes(value);
}

/**
 * Read the saved mode, falling back to the default when storage is missing, throws, or holds
 * something that is not a mode.
 *
 * @param {?Storage} [storage] The store to read; defaults to `window.localStorage`.
 *
 * @since TBD
 *
 * @return {string} The mode.
 */
export function readSwatchViewMode(storage = defaultStorage()) {
	try {
		const stored = storage?.getItem(SWATCH_VIEW_MODE_STORAGE_KEY);

		return isSwatchViewMode(stored) ? stored : DEFAULT_SWATCH_VIEW_MODE;
	} catch (error) {
		return DEFAULT_SWATCH_VIEW_MODE;
	}
}

/**
 * Save the mode. Does nothing for an invalid mode, a missing store, or a store that throws.
 *
 * @param {string}   mode      The mode to save.
 * @param {?Storage} [storage] The store to write; defaults to `window.localStorage`.
 *
 * @since TBD
 *
 * @return {void}
 */
export function writeSwatchViewMode(mode, storage = defaultStorage()) {
	if (!isSwatchViewMode(mode)) {
		return;
	}

	try {
		storage?.setItem(SWATCH_VIEW_MODE_STORAGE_KEY, mode);
	} catch (error) {
		// Nothing to do: the choice still holds for this session in component state.
	}
}
