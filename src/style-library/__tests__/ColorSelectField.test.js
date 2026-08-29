/* eslint-env jest */
/**
 * External dependencies
 */
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

/**
 * Internal dependencies
 */
import {
	ColorSelectField,
	resolveLiteral,
	toControlValue,
	toStoredValue,
} from '../components/molecules/fields/ColorSelectField';
import { getDesignTokensFeed } from '../helpers/tokens';

const NAMESPACE = 'kb-design-tokens/v1';
const SLUG = 'default';

const LISTING = {
	defaultId: 'default',
	currentId: 'default',
	userCreated: [],
	palettes: [
		{
			id: 'default',
			label: 'Default',
			groups: [
				{
					id: 'accent',
					label: 'Accent',
					swatches: [{ token: 'semantic.color.accent.main', label: 'Main', $value: '#3182ce' }],
				},
			],
		},
		{
			id: 'sunset',
			label: 'Sunset',
			groups: [],
		},
	],
};

// A factory, not automock: `helpers/tokens.js` reaches the localized feed, and this test only
// cares about the namespace/slug the field hands the store selector.
jest.mock('../helpers/tokens', () => ({
	getDesignTokensFeed: jest.fn(),
}));

let capturedProps = null;

// Captures the props `ColorControl` receives rather than rendering the real control (already
// covered by `ColorControl.test.js`) — this test is only about the adapter's own bridging.
jest.mock('../../token-controls', () => ({
	ColorControl: (props) => {
		capturedProps = props;
		return null;
	},
	isTokenId: (value) =>
		typeof value === 'string' && (value.startsWith('primitive.') || value.startsWith('semantic.')),
	mapPaletteToColorControlGroups: (palette) =>
		palette
			? palette.groups.map((group) => ({
					id: group.id,
					label: group.label,
					swatches: group.swatches.map((swatch) => ({
						id: swatch.token,
						label: swatch.label,
						value: swatch.$value,
						alias: `{${swatch.token}}`,
					})),
				}))
			: [],
}));

const mockGetPaletteListing = jest.fn();

jest.mock('@wordpress/data', () => ({
	useSelect: (fn) => fn(() => ({ getPaletteListing: mockGetPaletteListing })),
}));

beforeEach(() => {
	jest.clearAllMocks();
	capturedProps = null;
	mockGetPaletteListing.mockReturnValue(LISTING);
	getDesignTokensFeed.mockReturnValue({ slug: SLUG, rest: { namespace: NAMESPACE } });
	global.IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
	delete global.IS_REACT_ACT_ENVIRONMENT;
});

/**
 * Render `ColorSelectField` with the given props.
 *
 * @param {Object} props The component props.
 *
 * @since TBD
 *
 * @return {void}
 */
function render(props = {}) {
	const container = document.createElement('div');
	document.body.appendChild(container);
	const root = createRoot(container);

	act(() =>
		root.render(
			createElement(ColorSelectField, {
				field: { label: 'Text' },
				value: '',
				onChange: jest.fn(),
				...props,
			})
		)
	);

	act(() => root.unmount());
	container.remove();
}

describe('toControlValue', () => {
	it('wraps a bare token id into the bracket alias ColorControl expects', () => {
		expect(toControlValue('semantic.color.accent.main')).toBe('{semantic.color.accent.main}');
		expect(toControlValue('primitive.color.brand.primary')).toBe('{primitive.color.brand.primary}');
	});

	it('passes a raw literal through unchanged', () => {
		expect(toControlValue('#3182ce')).toBe('#3182ce');
	});

	it('reads an unset value as unset', () => {
		expect(toControlValue('')).toBe('');
		expect(toControlValue(undefined)).toBe('');
	});
});

describe('toStoredValue', () => {
	it('unwraps a bracket alias back to the bare id this field stores', () => {
		expect(toStoredValue('{semantic.color.accent.main}')).toBe('semantic.color.accent.main');
	});
});

describe('resolveLiteral', () => {
	it("reads an entry's own resolved value with no CSS-variable lookup", () => {
		expect(resolveLiteral({ value: '#3182ce' })).toBe('#3182ce');
	});
});

describe('ColorSelectField', () => {
	/**
	 * The field reads the store's palette listing for the feed's namespace/slug and maps the row
	 * whose id matches `listing.currentId` — the site's active palette — never the row a sibling
	 * screen happens to be editing.
	 *
	 * @return {void}
	 */
	it("passes the active palette's groups, not any other row", () => {
		render();

		expect(capturedProps.groups).toEqual([
			{
				id: 'accent',
				label: 'Accent',
				swatches: [
					{
						id: 'semantic.color.accent.main',
						label: 'Main',
						value: '#3182ce',
						alias: '{semantic.color.accent.main}',
					},
				],
			},
		]);
	});

	/**
	 * A bare stored token id arrives at `ColorControl` as a bracket alias.
	 *
	 * @return {void}
	 */
	it('bridges a bare stored token id into a bracket alias', () => {
		render({ value: 'semantic.color.accent.main' });

		expect(capturedProps.value).toBe('{semantic.color.accent.main}');
	});

	/**
	 * A stored raw literal arrives at `ColorControl` unchanged.
	 *
	 * @return {void}
	 */
	it('passes a stored literal through unchanged', () => {
		render({ value: '#3182ce' });

		expect(capturedProps.value).toBe('#3182ce');
	});

	/**
	 * Picking a token writes the bare id back, not the bracket alias `ColorControl` hands it.
	 *
	 * @return {void}
	 */
	it('writes a picked alias back as a bare token id', () => {
		const onChange = jest.fn();

		render({ onChange });
		capturedProps.onPick('{semantic.color.accent.main}');

		expect(onChange).toHaveBeenCalledWith('semantic.color.accent.main');
	});

	/**
	 * A Custom-tab pick writes its literal straight through, with no id translation.
	 *
	 * @return {void}
	 */
	it('writes a custom literal through unchanged', () => {
		const onChange = jest.fn();

		render({ onChange });
		capturedProps.onCustom('#ff0000');

		expect(onChange).toHaveBeenCalledWith('#ff0000');
	});

	/**
	 * `field.readOnly` disables the control the same way it disables `TokenColorSelectField`.
	 *
	 * @return {void}
	 */
	it('disables the control when the field is read-only', () => {
		render({ field: { label: 'Text', readOnly: true } });

		expect(capturedProps.disabled).toBe(true);
	});
});
