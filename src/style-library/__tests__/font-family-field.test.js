/* eslint-env jest */
// cspell:ignore Fatface -- a Google font family named as a concrete example.
/**
 * `FontFamilyField` is the Style Library's adapter for the shared `FontFamilySelector` — the same
 * tabbed picker the block editor mounts. The selector itself has its own suite, so this covers only
 * what the adapter contributes: the option list it builds from this page's globals, and the rule that
 * a pick waits for its web font before writing.
 */

/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

// Stubs, not the real components: the selector renders a popover tree that has nothing to do with what
// this suite asserts, and the loader would reach for the network.
let latestSelectorProps;

jest.mock('../../token-controls', () => ({
	FontFamilySelector: (props) => {
		latestSelectorProps = props;

		return null;
	},
	googleFontHref: (family) => `https://fonts.example/${family}`,
	loadFontFamily: jest.fn(() => Promise.resolve()),
}));

jest.mock('../hooks/use-google-font-loader', () => ({
	useGoogleFontLoader: jest.fn(() => ({ readyFamily: '', isLoading: false })),
}));

/**
 * Internal dependencies
 */
// eslint-disable-next-line import/first -- must follow the jest.mock calls above.
import { FontFamilyField } from '../components/molecules/fields/FontFamilyField';
// eslint-disable-next-line import/first -- must follow the jest.mock calls above.
import { loadFontFamily } from '../../token-controls';

describe('FontFamilyField', () => {
	let container;
	let root;

	beforeEach(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;

		container = document.createElement('div');
		document.body.appendChild(container);
		root = createRoot(container);

		window.kadenceDesignTokens = { favoriteFonts: ['Inter'] };
		window.kadenceDesignTokensFontCatalog = {
			google: ['Abel', 'Inter'],
			custom: ['My Font'],
			weights: {},
		};
	});

	afterEach(() => {
		act(() => root.unmount());
		container.remove();
		latestSelectorProps = undefined;
		loadFontFamily.mockClear();
		delete window.kadenceDesignTokens;
		delete window.kadenceDesignTokensFontCatalog;
	});

	/**
	 * Render the field with a given stored value.
	 *
	 * @param {string}   value    The stored family.
	 * @param {Function} onChange The write callback.
	 * @param {Object}   [field]  Extra field-definition keys.
	 *
	 * @since TBD
	 *
	 * @return {void}
	 */
	function renderField(value, onChange, field = {}) {
		act(() => {
			root.render(
				createElement(FontFamilyField, {
					field: { label: 'Font Family', ...field },
					value,
					onChange,
				})
			);
		});
	}

	/**
	 * The favorites are pinned above the full catalog, so the faces a site has kept sit at the top of a
	 * list otherwise nearly two thousand names long.
	 *
	 * @return {void}
	 */
	it('pins the library favorites above the full catalog', () => {
		renderField('', jest.fn());

		expect(latestSelectorProps.favorites).toEqual(['Inter']);
		expect(latestSelectorProps.catalogOptions.map((option) => option.value)).toEqual(['Inter', 'Abel', 'My Font']);
	});

	/**
	 * A pick waits for its web font before writing, matching the editor's listener: the preview switches
	 * straight from the old face to the new one instead of flashing a fallback in between.
	 *
	 * @return {void}
	 */
	it('waits for the web font before writing the pick', async () => {
		const onChange = jest.fn();
		let release;

		loadFontFamily.mockImplementationOnce(
			() =>
				new Promise((resolve) => {
					release = resolve;
				})
		);

		renderField('', onChange);

		let picked;

		await act(async () => {
			picked = latestSelectorProps.onPick('Abel');
		});

		// Still in flight: nothing has been written yet.
		expect(loadFontFamily).toHaveBeenCalledWith('Abel', { href: 'https://fonts.example/Abel' });
		expect(onChange).not.toHaveBeenCalled();

		await act(async () => {
			release();
			await picked;
		});

		expect(onChange).toHaveBeenCalledWith('Abel');
	});

	/**
	 * A family the catalog does not serve needs no stylesheet — a system face and a site-registered
	 * custom font are already in the document, and asking Google for either returns a 400 for a font the
	 * browser could have painted all along.
	 *
	 * @return {void}
	 */
	it('fetches no stylesheet for a family Google does not serve', async () => {
		const onChange = jest.fn();

		renderField('', onChange);

		await act(async () => {
			await latestSelectorProps.onPick('My Font');
		});

		expect(loadFontFamily).toHaveBeenCalledWith('My Font', { href: null });
		expect(onChange).toHaveBeenCalledWith('My Font');
	});

	/**
	 * Clearing writes immediately: there is no face to fetch when falling back to the theme's font.
	 *
	 * @return {void}
	 */
	it('clears without waiting on a font', () => {
		const onChange = jest.fn();

		renderField('Abel', onChange);

		act(() => latestSelectorProps.onClear());

		expect(onChange).toHaveBeenCalledWith('');
		expect(loadFontFamily).not.toHaveBeenCalled();
	});

	/**
	 * A read-only field neither fetches nor writes. Guarding only the write would still hit the network
	 * for a pick the field was never going to keep.
	 *
	 * @return {void}
	 */
	it('neither fetches nor writes when read-only', async () => {
		const onChange = jest.fn();

		renderField('', onChange, { readOnly: true });

		await act(async () => {
			await latestSelectorProps.onPick('Abel');
		});

		expect(loadFontFamily).not.toHaveBeenCalled();
		expect(onChange).not.toHaveBeenCalled();
		expect(latestSelectorProps.disabled).toBe(true);
	});
});
