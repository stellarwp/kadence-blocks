/* eslint-env jest */
/**
 * The editor overlay with a block that groups its site values: a group the instance sets itself shows no
 * site value, and a change that starts the instance setting a group stores the group as shown. Spacer's
 * own entry scopes its site values by divider style as well.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import block from '../../blocks/spacer/block.json';
import entry from './fixtures/spacer-entry.json';

const BLOCK = 'kadence/spacer';
const HEIGHT = ['spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits'];
const UNTOUCHED = { spacerHeight: 60, tabletSpacerHeight: '', mobileSpacerHeight: '', spacerHeightUnits: 'px' };
const DEFINITIONS = {
	spacerHeight: { default: 60 },
	tabletSpacerHeight: { default: '' },
	mobileSpacerHeight: { default: '' },
	spacerHeightUnits: { default: 'px' },
	dividerWidth: { default: 80 },
};

let mockRecord = {};
let mockDefinitions = DEFINITIONS;
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
		getBlockType: () => ({ attributes: mockDefinitions }),
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

describe("editor overlay with Spacer's entry", () => {
	const SITE = {
		spacerHeight: 40,
		tabletSpacerHeight: 30,
		spacerHeightUnits: 'rem',
		dividerHeight: 6,
		dividerColor: '#ff0000',
		dividerOpacity: 50,
		dividerWidth: 50,
	};
	// An instance as the block editor holds it: every registered default filled in.
	const DEFAULTS = Object.fromEntries(
		Object.entries(block.attributes)
			.filter(([, definition]) => 'default' in definition)
			.map(([name, definition]) => [name, definition.default])
	);

	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		mockDefinitions = block.attributes;
		window.kadenceSiteStyles = { isFseMode: true, blocks: { [BLOCK]: entry } };
		mockRecord = { settings: { custom: { kadence: { spacer: SITE } } } };
	});

	afterEach(() => {
		mockDefinitions = DEFINITIONS;
		delete window.kadenceSiteStyles;
	});

	/**
	 * A stripe shows the site height and divider width, but not the divider color, opacity or height its
	 * markup and band use.
	 *
	 * @return {void}
	 */
	it('shows a stripe only the height and divider width', () => {
		expect(render({ ...DEFAULTS, dividerStyle: 'stripe' }).attributes).toEqual({
			...DEFAULTS,
			dividerStyle: 'stripe',
			spacerHeight: 40,
			tabletSpacerHeight: 30,
			spacerHeightUnits: 'rem',
			dividerWidth: 50,
		});
	});

	/**
	 * A dashed divider isn't scoped, so it shows every site value.
	 *
	 * @return {void}
	 */
	it('shows a dashed divider every site value', () => {
		expect(render({ ...DEFAULTS, dividerStyle: 'dashed' }).attributes).toEqual({
			...DEFAULTS,
			...SITE,
			dividerStyle: 'dashed',
		});
	});

	/**
	 * A stripe with its own height keeps its group, so of the values its style takes it shows only the
	 * divider width.
	 *
	 * @return {void}
	 */
	it('applies the groups after the scope', () => {
		expect(render({ ...DEFAULTS, dividerStyle: 'stripe', spacerHeight: 120 }).attributes).toEqual({
			...DEFAULTS,
			dividerStyle: 'stripe',
			spacerHeight: 120,
			dividerWidth: 50,
		});
	});

	/**
	 * A dashed divider with its own color keeps its own opacity too, and still takes the other groups.
	 *
	 * @return {void}
	 */
	it('keeps a divider color with its opacity', () => {
		expect(render({ ...DEFAULTS, dividerStyle: 'dashed', dividerColor: '#00ff00' }).attributes).toEqual({
			...DEFAULTS,
			...SITE,
			dividerStyle: 'dashed',
			dividerColor: '#00ff00',
			dividerOpacity: 100,
		});
	});

	/**
	 * A change to a stripe stores a group as shown only for values its style takes: the height copies the site
	 * unit and tablet height, while a color change copies no site opacity, since a stripe never showed it.
	 *
	 * @return {void}
	 */
	it("stores a stripe's group as its style shows it", () => {
		const setAttributes = jest.fn();
		const props = render({ ...DEFAULTS, dividerStyle: 'stripe' }, setAttributes);

		props.setAttributes({ spacerHeight: 5 });
		props.setAttributes({ dividerColor: '#000000' });

		expect(setAttributes).toHaveBeenNthCalledWith(1, {
			spacerHeight: 5,
			tabletSpacerHeight: 30,
			spacerHeightUnits: 'rem',
		});
		expect(setAttributes).toHaveBeenNthCalledWith(2, { dividerColor: '#000000' });
	});
});
