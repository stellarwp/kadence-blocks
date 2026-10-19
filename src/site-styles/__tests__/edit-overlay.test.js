/* eslint-env jest */
/**
 * The editor overlay with a block that groups its site values: a group the instance sets itself shows no
 * site value, and a change that starts the instance setting a group stores the group as shown.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

const BLOCK = 'kadence/spacer';
const HEIGHT = ['spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits'];
const UNTOUCHED = { spacerHeight: 60, tabletSpacerHeight: '', mobileSpacerHeight: '', spacerHeightUnits: 'px' };

let mockRecord = {};
// The block editor store's copy of the instance's attributes, which a write updates at once.
let mockStored = {};

jest.mock('@kadence/components', () => ({}));
jest.mock('../use-global-styles-record', () => ({ useGlobalStylesRecord: () => mockRecord }));
jest.mock('../virtual-blocks', () => ({ isVirtualBlock: () => false }));
jest.mock('@wordpress/compose', () => ({ createHigherOrderComponent: (hoc) => hoc }), { virtual: true });
jest.mock(
	'@wordpress/data',
	() => ({
		useRegistry: () => ({ select: () => ({ getBlockAttributes: () => mockStored }) }),
		useSelect: () => ({}),
		select: () => ({}),
	}),
	{ virtual: true }
);
jest.mock(
	'@wordpress/blocks',
	() => ({
		getBlockType: () => ({
			attributes: {
				spacerHeight: { default: 60 },
				tabletSpacerHeight: { default: '' },
				mobileSpacerHeight: { default: '' },
				spacerHeightUnits: { default: 'px' },
				dividerWidth: { default: 80 },
			},
		}),
	}),
	{ virtual: true }
);

const { withSiteStyles } = require('../edit-overlay');

/**
 * Renders an instance through the overlay.
 *
 * @param {Object}   attributes    The instance's stored attributes.
 * @param {Function} setAttributes The block editor's attribute setter.
 *
 * @since TBD
 *
 * @return {Object} The props the block's edit component got.
 */
function render(attributes, setAttributes = () => {}) {
	let props;

	mockStored = attributes;
	const root = createRoot(document.createElement('div'));

	act(() => {
		const Edit = withSiteStyles((given) => {
			props = given;

			return null;
		});

		root.render(<Edit name={BLOCK} clientId="abc" attributes={attributes} setAttributes={setAttributes} />);
	});
	act(() => {
		root.unmount();
	});

	return props;
}

describe('editor overlay with groups', () => {
	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		window.kadenceSiteStyles = {
			isFseMode: true,
			blocks: {
				[BLOCK]: {
					slug: 'spacer',
					exclude: ['uniqueID'],
					overlay: [...HEIGHT, 'dividerWidth'],
					attributesMap: {},
					supports: {},
					groups: [HEIGHT],
				},
			},
		};
		mockRecord = {
			settings: {
				custom: { kadence: { spacer: { tabletSpacerHeight: 30, spacerHeightUnits: 'rem', dividerWidth: 50 } } },
			},
		};
	});

	afterEach(() => {
		delete window.kadenceSiteStyles;
	});

	/**
	 * An instance that sets nothing itself shows every site value.
	 *
	 * @return {void}
	 */
	it('shows an untouched instance every site value', () => {
		expect(render(UNTOUCHED).attributes).toEqual({
			...UNTOUCHED,
			tabletSpacerHeight: 30,
			spacerHeightUnits: 'rem',
			dividerWidth: 50,
		});
	});

	/**
	 * An instance with its own height shows its own unit and tablet height, and still takes the ungrouped
	 * site value.
	 *
	 * @return {void}
	 */
	it("shows a group the instance sets as the instance's own", () => {
		expect(render({ ...UNTOUCHED, spacerHeight: 120 }).attributes).toEqual({
			...UNTOUCHED,
			spacerHeight: 120,
			dividerWidth: 50,
		});
	});

	/**
	 * Changing the height of an untouched instance stores the unit and tablet height it showed, so the block
	 * keeps looking the same apart from the change.
	 *
	 * @return {void}
	 */
	it('stores the group as shown when a change starts the instance setting it', () => {
		const setAttributes = jest.fn();

		render(UNTOUCHED, setAttributes).setAttributes({ spacerHeight: 5 });

		expect(setAttributes).toHaveBeenCalledWith({
			spacerHeight: 5,
			tabletSpacerHeight: 30,
			spacerHeightUnits: 'rem',
		});
	});

	/**
	 * Two changes before a re-render: the second sees the first, so it stores only its own change instead of
	 * starting the group again from the values the first one replaced.
	 *
	 * @return {void}
	 */
	it('keeps the first of two changes made before a re-render', () => {
		mockRecord = {
			settings: {
				custom: {
					kadence: { spacer: { spacerHeight: 40, tabletSpacerHeight: 30, spacerHeightUnits: 'rem' } },
				},
			},
		};
		const setAttributes = jest.fn((kept) => {
			mockStored = { ...mockStored, ...kept };
		});
		const props = render(UNTOUCHED, setAttributes);

		props.setAttributes({ spacerHeight: 5 });
		props.setAttributes({ mobileSpacerHeight: 10 });

		expect(setAttributes).toHaveBeenLastCalledWith({ mobileSpacerHeight: 10 });
		expect(mockStored).toEqual({
			spacerHeight: 5,
			tabletSpacerHeight: 30,
			mobileSpacerHeight: 10,
			spacerHeightUnits: 'rem',
		});
	});
});
