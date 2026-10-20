/* eslint-env jest */
/**
 * The editor overlay with a block that groups its site values: a group the instance sets itself shows no
 * site value, and a change that starts the instance setting a group stores the group as shown. Spacer's
 * own entry scopes its site values by divider style as well, and Section's has older attributes that stand
 * in for its padding and border groups.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import block from '../../blocks/spacer/block.json';
import sectionBlock from '../../blocks/column/block.json';
import entry from './fixtures/spacer-entry.json';
import sectionEntry from './fixtures/column-entry.json';

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
 * An instance as the block editor holds it: every registered default filled in.
 *
 * @param {Object} definitions The block's attribute definitions.
 *
 * @since TBD
 *
 * @return {Object} Attribute name => default.
 */
function registeredDefaults(definitions) {
	return Object.fromEntries(
		Object.entries(definitions)
			.filter(([, definition]) => 'default' in definition)
			.map(([name, definition]) => [name, definition.default])
	);
}

/**
 * Renders an instance through the overlay.
 *
 * @param {Object}   attributes    The instance's stored attributes.
 * @param {Function} setAttributes The block editor's attribute setter.
 * @param {string}   name          Block name.
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
	const DEFAULTS = registeredDefaults(block.attributes);

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

describe("editor overlay with Section's entry", () => {
	const SECTION = 'kadence/column';
	const BLANK = ['', '', '', ''];
	const border = (color) => [
		{
			top: [color, 'dashed', 3],
			right: [color, 'dashed', 3],
			bottom: [color, 'dashed', 3],
			left: [color, 'dashed', 3],
			unit: 'px',
		},
	];
	const SITE = {
		padding: [3, 3, 3, 3],
		paddingType: 'rem',
		background: '#fff3cd',
		borderStyle: border('#ff00ff'),
		tabletBorderStyle: border('#0000ff'),
		borderHoverStyle: border('#00aa00'),
	};
	const DEFAULTS = registeredDefaults(sectionBlock.attributes);
	// A Section from before the border arrays, with the border its migration writes in their place.
	const OLD_BORDER = { ...DEFAULTS, border: '#ff0000', borderWidth: [2, 2, 2, 2] };
	const OWN_BORDER = border('#ff0000');

	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		mockDefinitions = sectionBlock.attributes;
		window.kadenceSiteStyles = { isFseMode: true, blocks: { [SECTION]: sectionEntry } };
		mockRecord = { settings: { custom: { kadence: { column: SITE } } } };
	});

	afterEach(() => {
		mockDefinitions = DEFINITIONS;
		delete window.kadenceSiteStyles;
	});

	/**
	 * A Section the editor saved has blank old border widths, so it shows every site value.
	 *
	 * @return {void}
	 */
	it('shows a Section the editor saved every site value', () => {
		expect(render({ ...DEFAULTS, borderWidth: BLANK }, undefined, SECTION).attributes).toEqual({
			...DEFAULTS,
			...SITE,
			borderWidth: BLANK,
		});
	});

	/**
	 * A Section the editor never saved has the default zero border widths, which render as an old border, so
	 * it shows no site border or hover border.
	 *
	 * @return {void}
	 */
	it('shows a never-saved Section no site border', () => {
		expect(render(DEFAULTS, undefined, SECTION).attributes).toEqual({
			...DEFAULTS,
			padding: SITE.padding,
			paddingType: SITE.paddingType,
			background: SITE.background,
		});
	});

	/**
	 * An old Section with a tablet padding number and an old border color shows its own padding and border,
	 * and still takes the site background and hover border.
	 *
	 * @return {void}
	 */
	it('shows an old Section its own padding and border', () => {
		const old = { ...DEFAULTS, topPaddingT: 10, border: '#ff0000', borderWidth: BLANK };

		expect(render(old, undefined, SECTION).attributes).toEqual({
			...old,
			background: SITE.background,
			borderHoverStyle: SITE.borderHoverStyle,
		});
	});

	/**
	 * The old border migration written at once still sees the old attributes, so it stores only its own
	 * border.
	 *
	 * @return {void}
	 */
	it('stores no site border from an old border migration written at once', () => {
		const setAttributes = jest.fn((kept) => {
			mockStored = { ...mockStored, ...kept };
		});
		const migration = { border: '', borderWidth: BLANK, borderStyle: OWN_BORDER };

		render(OLD_BORDER, setAttributes, SECTION).setAttributes(migration);

		expect(setAttributes).toHaveBeenCalledWith(migration);
	});

	/**
	 * Clearing the old attributes first and writing the border after them starts the border group from what
	 * the Section then shows, which stores the site tablet border. That is why Section's migration writes
	 * once.
	 *
	 * @return {void}
	 */
	it('stores the site tablet border from an old border migration written in steps', () => {
		const setAttributes = jest.fn((kept) => {
			mockStored = { ...mockStored, ...kept };
		});
		const props = render(OLD_BORDER, setAttributes, SECTION);

		props.setAttributes({ border: '' });
		props.setAttributes({ borderWidth: BLANK });
		props.setAttributes({ borderStyle: OWN_BORDER });

		expect(setAttributes).toHaveBeenLastCalledWith({
			borderStyle: OWN_BORDER,
			tabletBorderStyle: SITE.tabletBorderStyle,
		});
	});
});
