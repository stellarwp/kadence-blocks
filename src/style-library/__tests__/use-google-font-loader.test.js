/* eslint-env jest */
// cspell:ignore Abril Fatface .
/**
 * External dependencies
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import { useGoogleFontLoader } from '../hooks/use-google-font-loader';
import * as tokenControls from '../../token-controls';
import * as typography from '../helpers/typography';

// A factory rather than bare automocking: the barrel pulls in every control's JSX and `.scss`
// chain, and this hook only reaches two pure functions inside it.
jest.mock('../../token-controls', () => ({
	googleFontHref: jest.fn((family) => `https://fonts.googleapis.com/css2?family=${family}`),
	loadFontFamily: jest.fn(() => Promise.resolve()),
}));

jest.mock('../helpers/typography', () => ({
	getFontCatalog: jest.fn(() => ({ google: [], custom: [] })),
}));

let container;
let root;

beforeEach(() => {
	jest.clearAllMocks();
	tokenControls.loadFontFamily.mockImplementation(() => Promise.resolve());
	typography.getFontCatalog.mockImplementation(() => ({ google: ['Inter', 'Abril Fatface'], custom: ['My Font'] }));
	global.IS_REACT_ACT_ENVIRONMENT = true;
	container = document.createElement('div');
	document.body.appendChild(container);
	root = createRoot(container);
});

afterEach(() => {
	act(() => root.unmount());
	container.remove();
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Mount the hook behind a probe, so each render's return value can be read directly.
 *
 * @since TBD
 *
 * @return {{render: Function, latest: Function}} The probe's renderer and its last result.
 */
function mountProbe() {
	let latest = null;

	function Probe({ familyName }) {
		latest = useGoogleFontLoader(familyName);
		return null;
	}

	return {
		render: async (familyName) => {
			await act(async () => root.render(<Probe familyName={familyName} />));
		},
		latest: () => latest,
	};
}

describe('useGoogleFontLoader', () => {
	// The sample renders from what this returns, not from the selection, so reporting a family before
	// its file is usable is what would put the fallback face on screen -- the flash the hook exists to
	// prevent.
	it('reports no ready family until the font has loaded', async () => {
		let settle;
		tokenControls.loadFontFamily.mockImplementation(() => new Promise((resolve) => (settle = resolve)));

		const probe = mountProbe();
		await probe.render('Inter');

		expect(probe.latest().readyFamily).toBe('');
		expect(probe.latest().isLoading).toBe(true);

		await act(async () => settle());

		expect(probe.latest().readyFamily).toBe('Inter');
		expect(probe.latest().isLoading).toBe(false);
	});

	it('asks Google for a catalog family', async () => {
		const probe = mountProbe();
		await probe.render('Abril Fatface');

		expect(tokenControls.googleFontHref).toHaveBeenCalledWith('Abril Fatface');
		expect(tokenControls.loadFontFamily).toHaveBeenCalledWith('Abril Fatface', {
			href: 'https://fonts.googleapis.com/css2?family=Abril Fatface',
		});
	});

	// A system face and a site custom font are already in the document; asking Google for either
	// returns a 400 for a font the browser could have painted all along.
	it.each(['Georgia', 'My Font'])('does not ask Google for %p', async (family) => {
		const probe = mountProbe();
		await probe.render(family);

		expect(tokenControls.googleFontHref).not.toHaveBeenCalled();
		expect(tokenControls.loadFontFamily).toHaveBeenCalledWith(family, { href: null });
	});

	// Nothing selected is not a font to wait for, so the screen must not read as loading forever.
	it('reports nothing ready and nothing loading with no selection', async () => {
		const probe = mountProbe();
		await probe.render('');

		expect(probe.latest()).toEqual({ readyFamily: '', isLoading: false });
		expect(tokenControls.loadFontFamily).not.toHaveBeenCalled();
	});

	it('clears the ready family when the selection is cleared', async () => {
		const probe = mountProbe();
		await probe.render('Inter');

		expect(probe.latest().readyFamily).toBe('Inter');

		await probe.render('');

		expect(probe.latest().readyFamily).toBe('');
	});

	// The whole point of holding the preview: while the next font loads, the sample keeps painting in
	// the one already on screen rather than dropping to the fallback.
	it('holds the previous family while the next one loads', async () => {
		const probe = mountProbe();
		await probe.render('Inter');

		let settle;
		tokenControls.loadFontFamily.mockImplementation(() => new Promise((resolve) => (settle = resolve)));

		await probe.render('Abril Fatface');

		expect(probe.latest().readyFamily).toBe('Inter');
		expect(probe.latest().isLoading).toBe(true);

		await act(async () => settle());

		expect(probe.latest().readyFamily).toBe('Abril Fatface');
	});

	// A faster switch made while a slower one is still in flight already owns the preview; the late
	// resolver must not drag it back to the font the user has moved off.
	it('ignores a pick that settles after a later one', async () => {
		const settlers = {};
		tokenControls.loadFontFamily.mockImplementation(
			(family) => new Promise((resolve) => (settlers[family] = resolve))
		);

		const probe = mountProbe();
		await probe.render('Inter');
		await probe.render('Abril Fatface');

		await act(async () => settlers['Abril Fatface']());

		expect(probe.latest().readyFamily).toBe('Abril Fatface');

		await act(async () => settlers.Inter());

		expect(probe.latest().readyFamily).toBe('Abril Fatface');
	});
});
