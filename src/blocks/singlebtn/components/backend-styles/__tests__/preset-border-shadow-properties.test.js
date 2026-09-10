/* eslint-env jest */

/**
 * `presetBorderProperties()`/`presetShadowProperties()` gate the editor-canvas preview's border and
 * box-shadow `var()` declarations to only the properties the button's active preset actually
 * resolves — the JS sibling of the front end's `render_preset_border()`/`render_preset_shadow()`.
 * Mirrors the mocking strategy the block's other preset-picker consumers use: `activePresetFor`/
 * `blockPresetValues` are mocked directly rather than exercised through the real token registry,
 * since this module only cares that the gate reads their return value correctly.
 */

/**
 * Internal dependencies
 */
import { activePresetFor, blockPresetValues } from '../../../../../extension/preset-picker';
import { presetBorderProperties, presetShadowProperties } from '../index';

// `backend-styles/index.js` imports the `@kadence/helpers` barrel, which eagerly pulls in a
// REST-fetch helper that has no `@wordpress/api-fetch` module to resolve under Jest (the same
// constraint documented in `EditorShadowControl.js`). None of `presetBorderProperties`/
// `presetShadowProperties` call into the helper library, so a bare stub is enough to let the module
// load without pulling that dependency in.
jest.mock('@kadence/helpers', () => ({
	KadenceBlocksCSS: jest.fn(),
	getPreviewSize: jest.fn(),
	KadenceColorOutput: jest.fn(),
	typographyStyle: jest.fn(),
	getBorderStyle: jest.fn(),
	getBorderColor: jest.fn(),
	getSpacingOptionOutput: jest.fn(),
}));

jest.mock('../../../../../extension/preset-picker', () => ({
	activePresetFor: jest.fn(),
	blockPresetValues: jest.fn(),
}));

/**
 * Reset the mocked preset-picker helpers before each test so a prior test's stubbed return values
 * cannot leak into the next one.
 *
 * @return {void}
 */
beforeEach(() => {
	activePresetFor.mockReset();
	blockPresetValues.mockReset();
});

describe('presetBorderProperties', () => {
	/**
	 * A preset that resolves all three border properties reports all three as present.
	 *
	 * @return {void}
	 */
	it('reports width, style, and color present when the active preset resolves all three', () => {
		activePresetFor.mockReturnValue('bold');
		blockPresetValues.mockReturnValue({
			bold: {
				'button-border-width': '2px',
				'button-border-style': 'solid',
				'button-border-color': '#171717',
			},
		});

		expect(presetBorderProperties({ kbPreset: 'bold' })).toEqual({
			width: true,
			style: true,
			color: true,
		});
	});

	/**
	 * A preset that resolves none of the border properties reports none as present, rather than
	 * defaulting a missing key to `true`.
	 *
	 * @return {void}
	 */
	it('reports nothing present when the active preset resolves no border property', () => {
		activePresetFor.mockReturnValue('$default');
		blockPresetValues.mockReturnValue({ $default: {} });

		expect(presetBorderProperties({ kbPreset: '' })).toEqual({
			width: false,
			style: false,
			color: false,
		});
	});

	/**
	 * A block whose active preset has no entry in the resolved-values map (an unmapped block or
	 * library) reports nothing present instead of throwing.
	 *
	 * @return {void}
	 */
	it('reports nothing present when the active preset has no entry in the resolved-values map', () => {
		activePresetFor.mockReturnValue('missing');
		blockPresetValues.mockReturnValue({});

		expect(presetBorderProperties({ kbPreset: 'missing' })).toEqual({
			width: false,
			style: false,
			color: false,
		});
	});
});

describe('presetShadowProperties', () => {
	/**
	 * A preset that resolves a box-shadow reports it present.
	 *
	 * @return {void}
	 */
	it('reports true when the active preset resolves a button-shadow', () => {
		activePresetFor.mockReturnValue('bold');
		blockPresetValues.mockReturnValue({
			bold: { 'button-shadow': '0px 2px 8px 0px #1717171f' },
		});

		expect(presetShadowProperties({ kbPreset: 'bold' })).toBe(true);
	});

	/**
	 * A preset that resolves no box-shadow reports false, rather than emitting a dangling `var()`.
	 *
	 * @return {void}
	 */
	it('reports false when the active preset resolves no button-shadow', () => {
		activePresetFor.mockReturnValue('$default');
		blockPresetValues.mockReturnValue({ $default: {} });

		expect(presetShadowProperties({ kbPreset: '' })).toBe(false);
	});
});
