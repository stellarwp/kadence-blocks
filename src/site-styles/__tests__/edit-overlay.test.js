/* eslint-env jest */
/**
 * The editor overlay with a block that groups its site values: a group the instance sets itself shows no
 * site value, and a change that starts the instance setting a group stores the group as shown. And with a
 * block that cascades them: an own value drops the site values it covers, and a change stores the unit shown.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';

const BLOCK = 'kadence/spacer';
const BUTTON = 'kadence/singlebtn';
const PADDING = ['padding', 'tabletPadding', 'mobilePadding', 'paddingUnit'];
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
				padding: { default: ['', '', '', ''] },
				tabletPadding: { default: ['', '', '', ''] },
				mobilePadding: { default: ['', '', '', ''] },
				paddingUnit: { default: 'px' },
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
 * @param {string}   name          The block's name.
 *
 * @since TBD
 *
 * @return {Object} The props the block's edit component got.
 */
function render(attributes, setAttributes = () => {}, name = BLOCK) {
	let props;

	mockStored = attributes;
	const root = createRoot(document.createElement('div'));

	act(() => {
		const Edit = withSiteStyles((given) => {
			props = given;

			return null;
		});

		root.render(<Edit name={name} clientId="abc" attributes={attributes} setAttributes={setAttributes} />);
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

describe('editor overlay with cascades', () => {
	const EMPTY = ['', '', '', ''];
	const BUTTON_ATTRIBUTES = { padding: EMPTY, tabletPadding: EMPTY, mobilePadding: EMPTY, paddingUnit: 'px' };

	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		window.kadenceSiteStyles = {
			isFseMode: true,
			blocks: {
				[BUTTON]: {
					slug: 'singlebtn',
					exclude: ['uniqueID'],
					overlay: PADDING,
					attributesMap: {},
					supports: {},
					cascades: [{ unit: 'paddingUnit', values: ['padding', 'tabletPadding', 'mobilePadding'] }],
				},
			},
		};
		mockRecord = {
			settings: {
				custom: {
					kadence: {
						singlebtn: {
							padding: [20, 40, 20, 40],
							mobilePadding: [6, 12, 6, 12],
							paddingUnit: 'em',
						},
					},
				},
			},
		};
	});

	afterEach(() => {
		delete window.kadenceSiteStyles;
	});

	/**
	 * An instance that sets nothing itself shows every site value, in the site's unit.
	 *
	 * @return {void}
	 */
	it('shows an untouched instance every site value', () => {
		expect(render(BUTTON_ATTRIBUTES, () => {}, BUTTON).attributes).toEqual({
			padding: [20, 40, 20, 40],
			tabletPadding: EMPTY,
			mobilePadding: [6, 12, 6, 12],
			paddingUnit: 'em',
		});
	});

	/**
	 * An own padding in another unit than the site's shows as it is: no site value is converted to its unit.
	 *
	 * @return {void}
	 */
	it("shows an own padding in another unit than the site's as it is", () => {
		const own = { ...BUTTON_ATTRIBUTES, padding: [2, 10, 2, 10] };

		expect(render(own, () => {}, BUTTON).attributes).toEqual(own);
	});

	/**
	 * An own desktop padding holds for the narrower devices, so the site's mobile padding isn't shown.
	 *
	 * @return {void}
	 */
	it("drops the site's narrower devices after an own value in the site's unit", () => {
		mockRecord.settings.custom.kadence.singlebtn.paddingUnit = 'px';
		const own = { ...BUTTON_ATTRIBUTES, padding: [2, 10, 2, 10] };

		expect(render(own, () => {}, BUTTON).attributes).toEqual(own);
	});

	/**
	 * Changing one side of the site's padding stores the unit it was shown in, so the other sides stay in it.
	 *
	 * @return {void}
	 */
	it('stores the unit shown with a value the user changes', () => {
		const setAttributes = jest.fn();

		render(BUTTON_ATTRIBUTES, setAttributes, BUTTON).setAttributes({ padding: [2, 40, 20, 40] });

		expect(setAttributes).toHaveBeenCalledWith({ padding: [2, '', '', ''], paddingUnit: 'em' });
	});
});
