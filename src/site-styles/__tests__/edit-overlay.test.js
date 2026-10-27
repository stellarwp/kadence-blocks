/* eslint-env jest */
/**
 * The editor overlay with a block that groups its site values: a group the instance sets itself shows no
 * site value, and a change that starts the instance setting a group stores the group as shown. Spacer's
 * own entry scopes its site values by divider style as well, and Section's and Row Layout's have older
 * attributes that stand in for their padding, margin and border groups, which their migrations replace. A
 * block that cascades them is different: an own value drops the site values it covers, and a change stores
 * the unit shown.
 */
import { act } from 'react';
import { createRoot } from 'react-dom/client';
import block from '../../blocks/spacer/block.json';
import sectionBlock from '../../blocks/column/block.json';
import rowBlock from '../../blocks/rowlayout/block.json';
import { runRowLayoutMigrations } from '../../blocks/rowlayout/migrations';
import entry from './fixtures/spacer-entry.json';
import sectionEntry from './fixtures/column-entry.json';
import rowEntry from './fixtures/rowlayout-entry.json';

const BLOCK = 'kadence/spacer';
const BUTTON = 'kadence/singlebtn';
const PADDING = ['padding', 'tabletPadding', 'mobilePadding', 'paddingUnit'];
const HEIGHT = ['spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits'];
const UNTOUCHED = { spacerHeight: 60, tabletSpacerHeight: '', mobileSpacerHeight: '', spacerHeightUnits: 'px' };
const DEFINITIONS = {
	spacerHeight: { default: 60 },
	tabletSpacerHeight: { default: '' },
	mobileSpacerHeight: { default: '' },
	spacerHeightUnits: { default: 'px' },
	dividerWidth: { default: 80 },
};

const BUTTON_DEFINITIONS = {
	padding: { default: ['', '', '', ''] },
	tabletPadding: { default: ['', '', '', ''] },
	mobilePadding: { default: ['', '', '', ''] },
	paddingUnit: { default: 'px' },
};

let mockRecord = {};
let mockDefinitions = DEFINITIONS;
// The block editor store's copy of the instance's attributes, which a write updates at once.
let mockStored = {};

jest.mock('@kadence/components', () => ({}));
jest.mock('@kadence/helpers', () => ({ KadenceColorOutput: (color) => color }));
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

const { withSiteCopiesHidden, withSiteStyles } = require('../edit-overlay');

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
	return renderWith(withSiteStyles, attributes, setAttributes, name);
}

/**
 * Renders an instance through an `editor.BlockEdit` filter.
 *
 * @param {Function} filter        The filter's higher-order component.
 * @param {Object}   attributes    The instance's stored attributes.
 * @param {Function} setAttributes The block editor's attribute setter.
 * @param {string}   name          Block name.
 *
 * @since TBD
 *
 * @return {Object} The props the block's edit component got.
 */
function renderWith(filter, attributes, setAttributes = () => {}, name = BLOCK) {
	let props;

	mockStored = attributes;
	const root = createRoot(document.createElement('div'));

	act(() => {
		const Edit = filter((given) => {
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
			metadata: { kbSiteCopies: { tabletSpacerHeight: [[]] } },
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
			metadata: { kbSiteCopies: { tabletSpacerHeight: [[]] } },
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
			metadata: { kbSiteCopies: { tabletSpacerHeight: [[]] } },
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
			metadata: expect.objectContaining({
				kbSiteCopies: { borderStyle: expect.any(Array), tabletBorderStyle: expect.any(Array) },
			}),
		});
	});
});

describe("editor overlay with Row Layout's entry", () => {
	const ROW = 'kadence/rowlayout';
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
		padding: [2, '', 2, ''],
		tabletPadding: [1, '', 1, ''],
		paddingUnit: 'vw',
		margin: ['', '', 3, ''],
		tabletMargin: ['', '', 2, ''],
		marginUnit: 'em',
		columnGutter: 'custom',
		customGutter: [3, '', ''],
		gutterType: 'rem',
		borderStyle: border('#ff00ff'),
		tabletBorderStyle: border('#0000ff'),
		mobileBorderStyle: border('#00ffff'),
		bgColor: '#ff0000',
	};
	const DEFAULTS = { ...registeredDefaults(rowBlock.attributes), kbVersion: 2 };

	/**
	 * Renders a row whose writes update the stored attributes, as the block editor does.
	 *
	 * @param {Object} attributes The row's stored attributes.
	 *
	 * @since TBD
	 *
	 * @return {Object} The props the row's edit component got.
	 */
	const renderRow = (attributes) =>
		render(
			attributes,
			(kept) => {
				mockStored = { ...mockStored, ...kept };
			},
			ROW
		);

	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		mockDefinitions = rowBlock.attributes;
		window.kadenceSiteStyles = { isFseMode: true, blocks: { [ROW]: rowEntry } };
		mockRecord = { settings: { custom: { kadence: { rowlayout: SITE } } } };
	});

	afterEach(() => {
		mockDefinitions = DEFINITIONS;
		delete window.kadenceSiteStyles;
	});

	/**
	 * An untouched row shows every site value.
	 *
	 * @return {void}
	 */
	it('shows an untouched row every site value', () => {
		expect(render(DEFAULTS, undefined, ROW).attributes).toEqual({ ...DEFAULTS, ...SITE });
	});

	/**
	 * An old row with a padding number, a tablet margin number and a tablet border width shows its own
	 * padding, margin and border, and still takes the site gutter and background.
	 *
	 * @return {void}
	 */
	it('shows an old row its own padding, margin and border', () => {
		const old = { ...DEFAULTS, topPadding: 10, topMarginT: 10, tabletBorderWidth: [2, '', '', ''] };

		expect(render(old, undefined, ROW).attributes).toEqual({
			...old,
			columnGutter: SITE.columnGutter,
			customGutter: SITE.customGutter,
			gutterType: SITE.gutterType,
			bgColor: SITE.bgColor,
		});
	});

	/**
	 * The migrations of an old row's padding, margin and borders store the row's own values and none of the
	 * site's.
	 *
	 * @return {void}
	 */
	it('migrates an old row without storing site values', () => {
		const old = {
			...DEFAULTS,
			kbVersion: '',
			topPadding: 10,
			rightPaddingM: 5,
			bottomMargin: 20,
			topMarginT: 15,
			border: '#ff0000',
			borderWidth: [2, 2, 2, 2],
		};
		const props = renderRow(old);

		runRowLayoutMigrations(props.attributes, props.setAttributes);

		expect(mockStored).toEqual({
			...old,
			kbVersion: 2,
			topPadding: '',
			rightPaddingM: '',
			bottomMargin: '',
			topMarginT: '',
			border: '',
			borderWidth: ['', '', '', ''],
			padding: [10, '', 25, ''],
			mobilePadding: ['', 5, '', ''],
			margin: ['', '', 20, ''],
			tabletMargin: [15, '', '', ''],
			borderStyle: [
				{
					top: ['#ff0000', '', 2],
					right: ['#ff0000', '', 2],
					bottom: ['#ff0000', '', 2],
					left: ['#ff0000', '', 2],
					unit: 'px',
				},
			],
		});
	});

	/**
	 * A row the editor parses with an old deprecation gets that schema's 25px top and bottom padding numbers:
	 * it shows and migrates them as its own padding, with no site padding stored.
	 *
	 * @return {void}
	 */
	it('migrates the padding numbers an old deprecation gives a row as its own', () => {
		const { padding, ...withoutPadding } = DEFAULTS;
		const props = renderRow({ ...withoutPadding, kbVersion: '', topPadding: 25, bottomPadding: 25 });

		expect(props.attributes.padding).toBeUndefined();
		expect(props.attributes.paddingUnit).toBe(DEFAULTS.paddingUnit);

		runRowLayoutMigrations(props.attributes, props.setAttributes);

		expect(mockStored.padding).toEqual([25, '', 25, '']);
		expect(mockStored.tabletPadding).toEqual(DEFAULTS.tabletPadding);
		expect(mockStored.paddingUnit).toBe(DEFAULTS.paddingUnit);
	});

	/**
	 * A tablet-only old border migrates to the tablet border alone: the desktop and mobile borders it never
	 * showed stay unset.
	 *
	 * @return {void}
	 */
	it('migrates a tablet-only old border without storing the site desktop or mobile border', () => {
		const props = renderRow({ ...DEFAULTS, tabletBorder: '#ff0000', tabletBorderWidth: [2, 2, 2, 2] });

		runRowLayoutMigrations(props.attributes, props.setAttributes);

		expect(mockStored.borderStyle).toEqual(DEFAULTS.borderStyle);
		expect(mockStored.mobileBorderStyle).toEqual(DEFAULTS.mobileBorderStyle);
		expect(mockStored.tabletBorderStyle[0].top).toEqual(['#ff0000', '', 2]);
	});

	/**
	 * An old named gutter migrates to its custom size and keeps the row's own unit against a site unit.
	 *
	 * @return {void}
	 */
	it('migrates an old named gutter with its own unit', () => {
		const props = renderRow({ ...DEFAULTS, columnGutter: 'wide' });

		runRowLayoutMigrations(props.attributes, props.setAttributes);

		expect(mockStored.columnGutter).toBe('custom');
		expect(mockStored.customGutter).toEqual([40, '', '']);
		expect(mockStored.gutterType).toBe('px');
	});

	/**
	 * The unique ID helper writes every shown attribute with a new ID. For a new row, and for an old row after
	 * its migrations, that stores no site value: the old row's write puts back the older padding number it
	 * showed before migrating, as it does in classic mode, so the row keeps its own padding.
	 *
	 * @return {void}
	 */
	it('stores no site value from the unique ID write of every shown attribute', () => {
		const fresh = renderRow({ ...DEFAULTS, uniqueID: '' });

		fresh.setAttributes({ ...fresh.attributes, uniqueID: '_new' });

		expect(mockStored).toEqual({ ...DEFAULTS, uniqueID: '_new' });

		const old = { ...DEFAULTS, uniqueID: '_old', topPadding: 10, border: '#ff0000', borderWidth: [2, 2, 2, 2] };
		const props = renderRow(old);

		runRowLayoutMigrations(props.attributes, props.setAttributes);
		props.setAttributes({ ...props.attributes, uniqueID: '_copy' });

		expect(mockStored.topPadding).toBe(10);
		expect(mockStored.tabletPadding).toEqual(DEFAULTS.tabletPadding);
		expect(mockStored.paddingUnit).toBe(DEFAULTS.paddingUnit);
		expect(mockStored.tabletBorderStyle).toEqual(DEFAULTS.tabletBorderStyle);
		expect(mockStored.mobileBorderStyle).toEqual(DEFAULTS.mobileBorderStyle);
	});
});

describe('editor overlay with cascades', () => {
	const EMPTY = ['', '', '', ''];
	const BUTTON_ATTRIBUTES = { padding: EMPTY, tabletPadding: EMPTY, mobilePadding: EMPTY, paddingUnit: 'px' };

	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		mockDefinitions = BUTTON_DEFINITIONS;
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
		mockDefinitions = DEFINITIONS;
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
	 * Picking the block's default unit over the site's stores the whole box as shown, so the pick sticks
	 * even though the unit is the one the instance already stores.
	 *
	 * @return {void}
	 */
	it("stores the whole box when the user picks the default unit over the site's", () => {
		const setAttributes = jest.fn();

		render(BUTTON_ATTRIBUTES, setAttributes, BUTTON).setAttributes({ paddingUnit: 'px' });

		expect(setAttributes).toHaveBeenCalledWith({
			padding: [20, 40, 20, 40],
			mobilePadding: [6, 12, 6, 12],
			metadata: { kbSiteCopies: { padding: [[0], [1], [2], [3]], mobilePadding: [[0], [1], [2], [3]] } },
		});
	});

	/**
	 * Changing one side of the site's padding stores the whole box as shown: every side, every device and
	 * the unit, so the button keeps looking as it did apart from the change. The changed side holds for the
	 * narrower devices, as an own value does, so their copy leaves it out.
	 *
	 * @return {void}
	 */
	it('stores the whole box as shown when the user changes one side', () => {
		const setAttributes = jest.fn();

		render(BUTTON_ATTRIBUTES, setAttributes, BUTTON).setAttributes({ padding: [2, 40, 20, 40] });

		expect(setAttributes).toHaveBeenCalledWith({
			padding: [2, 40, 20, 40],
			mobilePadding: ['', 12, 6, 12],
			paddingUnit: 'em',
			metadata: { kbSiteCopies: { padding: [[1], [2], [3]], mobilePadding: [[1], [2], [3]] } },
		});
	});
});

describe('copied site values', () => {
	const EMPTY = ['', '', '', ''];
	const COPIES = { padding: [[1], [2], [3]], mobilePadding: [[1], [2], [3]] };
	const EDITED = {
		padding: [30, 40, 20, 40],
		tabletPadding: EMPTY,
		mobilePadding: ['', 12, 6, 12],
		paddingUnit: 'px',
		metadata: { name: 'Hero', kbSiteCopies: COPIES },
	};

	beforeAll(() => {
		global.IS_REACT_ACT_ENVIRONMENT = true;
	});

	beforeEach(() => {
		mockDefinitions = BUTTON_DEFINITIONS;
		window.kadenceSiteStyles = {
			isFseMode: true,
			blocks: {
				[BUTTON]: {
					slug: 'singlebtn',
					exclude: ['uniqueID', 'metadata'],
					overlay: PADDING,
					attributesMap: {},
					supports: {},
					cascades: [{ unit: 'paddingUnit', values: ['padding', 'tabletPadding', 'mobilePadding'] }],
				},
			},
		};
		mockRecord = {
			settings: {
				custom: { kadence: { singlebtn: { padding: [20, 40, 20, 40], mobilePadding: [6, 12, 6, 12] } } },
			},
		};
	});

	afterEach(() => {
		mockDefinitions = DEFINITIONS;
		delete window.kadenceSiteStyles;
	});

	/**
	 * The first change lists the site's sides it copies in the block's metadata, next to what is there.
	 *
	 * @return {void}
	 */
	it('lists the copied sides in the metadata, next to its name', () => {
		const setAttributes = jest.fn();
		const untouched = { padding: EMPTY, tabletPadding: EMPTY, mobilePadding: EMPTY, paddingUnit: 'px' };

		renderWith(withSiteStyles, { ...untouched, metadata: { name: 'Hero' } }, setAttributes, BUTTON).setAttributes({
			padding: [30, 40, 20, 40],
		});

		expect(setAttributes).toHaveBeenCalledWith({
			padding: [30, 40, 20, 40],
			mobilePadding: ['', 12, 6, 12],
			metadata: { name: 'Hero', kbSiteCopies: COPIES },
		});
	});

	/**
	 * A copied side the user changes in FSE mode becomes their own, even when the site has no values left.
	 *
	 * @return {void}
	 */
	it('drops a changed side from the list when the site has no values', () => {
		const setAttributes = jest.fn();

		mockRecord = {};
		renderWith(withSiteStyles, EDITED, setAttributes, BUTTON).setAttributes({ padding: [30, 50, 20, 40] });

		expect(setAttributes).toHaveBeenCalledWith({
			padding: [30, 50, 20, 40],
			metadata: { name: 'Hero', kbSiteCopies: { padding: [[2], [3]], mobilePadding: [[1], [2], [3]] } },
		});
	});

	/**
	 * With FSE mode off, the block shows its own values, with the copied ones at the block's defaults.
	 *
	 * @return {void}
	 */
	it('shows the defaults for the copied sides with FSE mode off', () => {
		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };

		expect(renderWith(withSiteCopiesHidden, EDITED, () => {}, BUTTON).attributes).toEqual({
			...EDITED,
			padding: [30, '', '', ''],
			mobilePadding: EMPTY,
		});
	});

	/**
	 * With FSE mode off, a write keeps the copied sides the user leaves alone and makes the changed one theirs.
	 *
	 * @return {void}
	 */
	it('keeps the untouched copies when the user changes a side with FSE mode off', () => {
		const setAttributes = jest.fn();

		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };
		renderWith(withSiteCopiesHidden, EDITED, setAttributes, BUTTON).setAttributes({ padding: [30, 50, '', ''] });

		expect(setAttributes).toHaveBeenCalledWith({
			padding: [30, 50, 20, 40],
			metadata: { name: 'Hero', kbSiteCopies: { padding: [[2], [3]], mobilePadding: [[1], [2], [3]] } },
		});
	});

	/**
	 * In FSE mode the copies are the block's values, so the filter leaves the block alone.
	 *
	 * @return {void}
	 */
	it('leaves the block alone in FSE mode', () => {
		const setAttributes = jest.fn();
		const props = renderWith(withSiteCopiesHidden, EDITED, setAttributes, BUTTON);

		expect(props.attributes).toBe(EDITED);
		expect(props.setAttributes).toBe(setAttributes);
	});

	/**
	 * A block without copies is left alone with FSE mode off.
	 *
	 * @return {void}
	 */
	it('leaves a block without copies alone with FSE mode off', () => {
		const setAttributes = jest.fn();
		const own = { padding: [2, 10, 2, 10], metadata: { name: '' } };

		window.kadenceSiteStyles = { isFseMode: false, blocks: {} };
		const props = renderWith(withSiteCopiesHidden, own, setAttributes, BUTTON);

		expect(props.attributes).toBe(own);
		expect(props.setAttributes).toBe(setAttributes);
	});
});
