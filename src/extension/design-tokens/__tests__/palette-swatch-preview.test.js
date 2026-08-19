/* eslint-env jest */
/**
 * The color-control palette-preview sync.
 *
 * A block pinned to a palette re-skins its own canvas subtree, but the inspector's color-control swatches
 * live in the top-document sidebar and keep resolving `var(--kb-token--*)` against the library `$current`.
 * The projector's `[data-kb-palette]` switch layer is already loaded in the top document, so the sync mirrors
 * the selected block's effective palette onto `document.documentElement` (`<html>`) — where the swatches and the
 * portaled pop color popover pick it up — while re-declaring the current palette on the canvas root
 * (`.editor-styles-wrapper`) so an un-iframed canvas does not inherit the preview.
 *
 * These tests drive `effectivePalette` against a mocked block-editor store (own vs inherited vs none) and
 * assert `registerTokenSwatchPalettePreview` toggles `data-kb-palette` on `<html>` — and the canvas shield — as
 * the selection changes.
 */
import { effectivePalette, applyPalettePreview, registerTokenSwatchPalettePreview } from '../palette-swatch-preview';

let mockSubscriber;
const mockStore = {
	getSelectedBlockClientId: jest.fn(),
	getBlockAttributes: jest.fn(),
	getBlockParents: jest.fn(),
};

jest.mock(
	'@wordpress/data',
	() => ({
		select: jest.fn(() => mockStore),
		subscribe: jest.fn((listener) => {
			mockSubscriber = listener;
			return () => {
				mockSubscriber = undefined;
			};
		}),
	}),
	{ virtual: true }
);

/**
 * Point the mocked store at a selection with an attribute map per client id and a parent chain (outermost
 * first, matching getBlockParents).
 *
 * @param {?string}                     selected The selected block's client id, or null for no selection.
 * @param {Object<string, Object>}      attrs    A client-id -> attributes map.
 * @param {Array<string>}               parents  The selected block's ancestors, outermost first.
 *
 * @return {void}
 */
function setSelection(selected, attrs = {}, parents = []) {
	mockStore.getSelectedBlockClientId.mockReturnValue(selected);
	mockStore.getBlockAttributes.mockImplementation((id) => attrs[id] || {});
	mockStore.getBlockParents.mockReturnValue(parents);
}

describe('palette-swatch-preview', () => {
	let canvas;

	beforeEach(() => {
		jest.clearAllMocks();
		mockSubscriber = undefined;
		window.kadenceDesignTokensPalettes = { current: 'default' };
		document.documentElement.removeAttribute('data-kb-palette');
		canvas = document.createElement('div');
		canvas.className = 'editor-styles-wrapper';
		document.body.appendChild(canvas);
	});

	afterEach(() => {
		canvas.remove();
		document.documentElement.removeAttribute('data-kb-palette');
		delete window.kadenceDesignTokensPalettes;
	});

	/**
	 * With no block selected there is no override to preview.
	 *
	 * @return {void}
	 */
	it('resolves to an empty palette when nothing is selected', () => {
		setSelection(null);

		expect(effectivePalette()).toBe('');
	});

	/**
	 * A selected block with its own kbPalette resolves to that palette.
	 *
	 * @return {void}
	 */
	it('resolves to the selected block own palette', () => {
		setSelection('a', { a: { kbPalette: 'dark' } });

		expect(effectivePalette()).toBe('dark');
	});

	/**
	 * A selected block with no palette follows the nearest pinned ancestor.
	 *
	 * @return {void}
	 */
	it('resolves to the nearest ancestor palette when the block has none', () => {
		setSelection('c', { c: {}, b: { kbPalette: 'sunset' }, a: { kbPalette: 'dark' } }, ['a', 'b']);

		expect(effectivePalette()).toBe('sunset');
	});

	/**
	 * A selected block with no palette and no pinned ancestor resolves to empty.
	 *
	 * @return {void}
	 */
	it('resolves to empty when neither the block nor an ancestor is pinned', () => {
		setSelection('c', { c: {}, a: {} }, ['a']);

		expect(effectivePalette()).toBe('');
	});

	/**
	 * applyPalettePreview reflects the palette id onto the document root and holds the canvas on the current
	 * palette, then clears both for the empty id.
	 *
	 * @return {void}
	 */
	it('previews on the document root and shields the canvas with the current palette', () => {
		applyPalettePreview('dark');
		expect(document.documentElement.getAttribute('data-kb-palette')).toBe('dark');
		expect(canvas.getAttribute('data-kb-palette')).toBe('default');

		applyPalettePreview('');
		expect(document.documentElement.hasAttribute('data-kb-palette')).toBe(false);
		expect(canvas.hasAttribute('data-kb-palette')).toBe(false);
	});

	/**
	 * The canvas shield is reapplied when the canvas element is replaced while the same palette stays active, so a
	 * re-mounted non-iframed canvas does not inherit the inspector preview (the root already carrying the palette
	 * must not short-circuit the shield).
	 *
	 * @return {void}
	 */
	it('reshields a replaced canvas when the same palette is reapplied', () => {
		applyPalettePreview('dark');
		expect(canvas.getAttribute('data-kb-palette')).toBe('default');

		// Replace the canvas element (a re-mount); the fresh one starts with no shield.
		canvas.remove();
		canvas = document.createElement('div');
		canvas.className = 'editor-styles-wrapper';
		document.body.appendChild(canvas);
		expect(canvas.hasAttribute('data-kb-palette')).toBe(false);

		// Reapplying the SAME palette (root already 'dark') must still shield the new canvas.
		applyPalettePreview('dark');
		expect(canvas.getAttribute('data-kb-palette')).toBe('default');
	});

	/**
	 * Registering applies the current selection immediately, then follows selection changes through the
	 * store subscription, and clears the attribute on deselect.
	 *
	 * @return {void}
	 */
	it('syncs the attribute to the selection on register and on store changes', () => {
		setSelection('a', { a: { kbPalette: 'dark' } });
		registerTokenSwatchPalettePreview();
		expect(document.documentElement.getAttribute('data-kb-palette')).toBe('dark');
		expect(canvas.getAttribute('data-kb-palette')).toBe('default');

		setSelection('b', { b: { kbPalette: 'sunset' } });
		mockSubscriber();
		expect(document.documentElement.getAttribute('data-kb-palette')).toBe('sunset');

		setSelection(null);
		mockSubscriber();
		expect(document.documentElement.hasAttribute('data-kb-palette')).toBe(false);
		expect(canvas.hasAttribute('data-kb-palette')).toBe(false);
	});
});
