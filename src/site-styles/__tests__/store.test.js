/* eslint-env jest */
import {
	groupSiteAttributes,
	guardWrite,
	merge,
	mergeAttributes,
	panelAttributes,
	scopeSiteAttributes,
	siteAttributes,
	toCoreColor,
	toKadenceColor,
	toStoredForm,
	unmerge,
	withStoredForm,
} from '../store';
import conformance from './fixtures/merge-conformance.json';
import groupConformance from './fixtures/group-conformance.json';
import scopeConformance from './fixtures/scope-conformance.json';
import singleButton from './fixtures/singlebtn-entry.json';

const BLOCK = 'kadence/singlebtn';
const UNSCOPED = 'kadence/show-more';

/**
 * A block entry without a scope: only its overlay attributes and its attributes map can be site values.
 */
const unscopedEntry = {
	slug: 'show-more',
	exclude: ['uniqueID', 'showHideMore'],
	overlay: ['heightDesktop', 'paddingDesktop'],
	attributesMap: { textColor: 'color.text' },
	supports: {},
};

/**
 * A scoped block entry without site rules: like a block without a scope, only its overlay attributes and its
 * attributes map can be site values.
 */
const scopedEntry = {
	slug: 'spacer',
	exclude: ['uniqueID', 'dividerStyle', 'hAlign'],
	overlay: ['spacerHeight'],
	attributesMap: {},
	supports: {},
	scope: { attribute: 'dividerStyle', attributes: { stripe: ['spacerHeight'] } },
};

beforeEach(() => {
	window.kadenceSiteStyles = { isFseMode: true, blocks: { 'kadence/singlebtn': singleButton } };
});

afterEach(() => {
	delete window.kadenceSiteStyles;
});

describe('merge', () => {
	it.each(conformance.map((c) => [c.name, c]))('%s', (name, c) => {
		expect(merge(c.instance, c.site, c.default)).toEqual(c.expected);
	});
});

describe('scopeSiteAttributes', () => {
	it.each(scopeConformance.map((c) => [c.name, c]))('%s', (name, c) => {
		expect(scopeSiteAttributes(c.site, c.instance, c.scope, c.defaultStyle)).toEqual(c.expected);
	});
});

describe('groupSiteAttributes', () => {
	it.each(groupConformance.map((c) => [c.name, c]))('%s', (name, c) => {
		const definitions = Object.fromEntries(
			Object.entries(c.defaults).map(([key, value]) => [key, { default: value }])
		);

		expect(groupSiteAttributes(c.site, c.instance, c.groups, definitions)).toEqual(c.expected);
	});
});

describe('toKadenceColor', () => {
	it.each([
		['var:preset|color|theme-palette1', 'palette1'],
		['var(--wp--preset--color--theme-palette13)', 'palette13'],
		['var:preset|color|vivid-red', 'var(--wp--preset--color--vivid-red)'],
		['var:preset|color|accent2', 'var(--wp--preset--color--accent-2)'],
		['#cc0000', '#cc0000'],
	])('%s → %s', (stored, expected) => {
		expect(toKadenceColor(stored)).toBe(expected);
	});

	it('round-trips a palette color with toCoreColor', () => {
		expect(toKadenceColor(toCoreColor('palette7'))).toBe('palette7');
		expect(toCoreColor('#cc0000')).toBe('#cc0000');
	});

	it('reads a design token variable back as its token reference', () => {
		expect(toKadenceColor('var(--kb-token--primitive--color--notice--error)')).toBe(
			'{primitive.color.notice.error}'
		);
		expect(toKadenceColor('var(--kb-token--semantic--color--brand-accent)')).toBe('{semantic.color.brand-accent}');
		expect(toKadenceColor('var(--kb-token--Primitive--color)')).toBe('var(--kb-token--Primitive--color)');
	});
});

describe('toCoreColor', () => {
	it('stores a design token reference as its CSS variable, which core can print', () => {
		expect(toCoreColor('{primitive.color.notice.error}')).toBe('var(--kb-token--primitive--color--notice--error)');
	});

	it('round-trips a design token reference with toKadenceColor', () => {
		expect(toKadenceColor(toCoreColor('{semantic.color.brand-accent}'))).toBe('{semantic.color.brand-accent}');
	});
});

describe('siteAttributes', () => {
	it('reads the custom values and the core colors', () => {
		const record = {
			settings: { custom: { kadence: { singlebtn: { borderRadius: [20, 20, 20, 20] } } } },
			styles: { blocks: { [BLOCK]: { color: { background: 'var:preset|color|theme-palette2', text: '#fff' } } } },
		};

		expect(siteAttributes(record, BLOCK)).toEqual({
			borderRadius: [20, 20, 20, 20],
			background: 'palette2',
			color: '#fff',
		});
	});

	it('ignores stored content values', () => {
		const record = {
			settings: {
				custom: {
					kadence: {
						singlebtn: {
							label: 'Site label',
							buttonRole: true,
							iconTitle: 'Site icon title',
							tooltip: 'Site tooltip',
							tooltipPlacement: 'bottom',
							isSubmit: true,
							uniqueID: 'site',
							borderRadius: [20, 20, 20, 20],
						},
					},
				},
			},
		};

		expect(siteAttributes(record, BLOCK)).toEqual({ borderRadius: [20, 20, 20, 20] });
	});

	it('ignores cleared values', () => {
		const record = {
			settings: { custom: { kadence: { singlebtn: { borderRadius: undefined, sizePreset: 'large' } } } },
		};

		const attributes = siteAttributes(record, BLOCK);

		expect(attributes).toEqual({ sizePreset: 'large' });
		expect(attributes).not.toHaveProperty('borderRadius');
	});

	it('keeps only the overlay attributes and the mapped colors of a block without a scope', () => {
		window.kadenceSiteStyles.blocks[UNSCOPED] = unscopedEntry;
		const record = {
			settings: {
				custom: {
					kadence: {
						'show-more': {
							heightDesktop: 300,
							showHideMore: false,
							defaultExpandedDesktop: true,
							kadenceBlockCSS: 'selector { color: red; }',
						},
					},
				},
			},
			styles: { blocks: { [UNSCOPED]: { color: { text: '#222222' } } } },
		};

		expect(siteAttributes(record, UNSCOPED)).toEqual({ heightDesktop: 300, textColor: '#222222' });
	});

	it('keeps only the overlay attributes of a scoped block without site rules', () => {
		window.kadenceSiteStyles.blocks['kadence/spacer'] = scopedEntry;
		const record = {
			settings: {
				custom: { kadence: { spacer: { spacerHeight: 100, hAlign: 'left', kadenceAnimation: 'fade-in' } } },
			},
		};

		expect(siteAttributes(record, 'kadence/spacer')).toEqual({ spacerHeight: 100 });
	});

	it('gives nothing for a missing record, an empty store or an unsupported block', () => {
		expect(siteAttributes(undefined, BLOCK)).toEqual({});
		expect(siteAttributes({ settings: { custom: { kadence: { singlebtn: [] } } } }, BLOCK)).toEqual({});
		expect(siteAttributes({ settings: { custom: { kadence: { infobox: { a: 1 } } } } }, 'kadence/infobox')).toEqual(
			{}
		);
	});
});

describe('toStoredForm', () => {
	const definitions = {
		uniqueID: { default: '' },
		text: { default: '' },
		link: { default: '' },
		noFollow: { default: false },
		background: { default: '' },
		color: { default: '' },
		borderRadius: { default: ['', '', '', ''] },
		sizePreset: { default: 'standard' },
	};

	it('splits core colors from custom values and drops defaults, content, link settings and identifiers', () => {
		const attributes = {
			uniqueID: 'abc',
			text: 'Buy now',
			link: '/shop',
			noFollow: true,
			background: 'palette2',
			color: '#ffffff',
			borderRadius: [20, 20, 20, 20],
			sizePreset: 'standard',
		};

		expect(toStoredForm(attributes, definitions, BLOCK)).toEqual({
			core: { 'color.background': 'var:preset|color|theme-palette2', 'color.text': '#ffffff' },
			custom: { borderRadius: [20, 20, 20, 20] },
		});
	});

	it('never stores the button style', () => {
		expect(
			toStoredForm(
				{ inheritStyles: 'outline', borderRadius: [20, 20, 20, 20] },
				{ ...definitions, inheritStyles: { default: 'fill' } },
				BLOCK
			)
		).toEqual({ core: {}, custom: { borderRadius: [20, 20, 20, 20] } });
	});

	it('stores nothing when everything is at its default', () => {
		expect(toStoredForm({ background: '', sizePreset: 'standard' }, definitions, BLOCK)).toEqual({
			core: {},
			custom: {},
		});
	});

	it('stores no cleared value', () => {
		const stored = toStoredForm({ borderRadius: undefined, sizePreset: 'large' }, definitions, BLOCK);

		expect(stored).toEqual({ core: {}, custom: { sizePreset: 'large' } });
		expect(stored.custom).not.toHaveProperty('borderRadius');
	});

	it('stores only the overlay attributes and the mapped colors of a block without a scope', () => {
		window.kadenceSiteStyles.blocks[UNSCOPED] = unscopedEntry;
		const attributes = {
			uniqueID: 'abc',
			heightDesktop: 300,
			paddingDesktop: ['', '', '', ''],
			showHideMore: false,
			defaultExpandedDesktop: true,
			kadenceBlockCSS: 'selector { color: red; }',
			textColor: '#222222',
		};
		const unscopedDefinitions = {
			uniqueID: { default: '' },
			heightDesktop: { default: 250 },
			paddingDesktop: { default: ['', '', '', ''] },
			showHideMore: { default: true },
			defaultExpandedDesktop: { default: false },
			kadenceBlockCSS: { default: '' },
			textColor: { default: '' },
		};

		expect(toStoredForm(attributes, unscopedDefinitions, UNSCOPED)).toEqual({
			core: { 'color.text': '#222222' },
			custom: { heightDesktop: 300 },
		});
	});
});

describe('withStoredForm', () => {
	it('writes each core value at its path and the rest to settings.custom.kadence', () => {
		const record = { styles: { blocks: { [BLOCK]: { '@mobile': { color: { background: 'x' } } } } }, settings: {} };

		const result = withStoredForm(record, BLOCK, {
			core: { 'color.background': 'var:preset|color|theme-palette2' },
			custom: { borderRadius: [20, 20, 20, 20] },
		});

		expect(result.styles.blocks[BLOCK]).toEqual({
			'@mobile': { color: { background: 'x' } },
			color: { background: 'var:preset|color|theme-palette2' },
		});
		expect(result.settings.custom.kadence.singlebtn).toEqual({ borderRadius: [20, 20, 20, 20] });
		expect(record.styles.blocks[BLOCK].color).toBeUndefined();
	});

	it('removes a cleared value and the objects it leaves empty, keeping other keys', () => {
		const record = {
			styles: { blocks: { [BLOCK]: { color: { background: '#000', text: '#fff', gradient: 'g' } } } },
			settings: { custom: { kadence: { singlebtn: { borderRadius: [1, 1, 1, 1] } } } },
		};

		const onlyText = withStoredForm(record, BLOCK, { core: { 'color.text': '#fff' }, custom: {} });
		expect(onlyText.styles.blocks[BLOCK]).toEqual({ color: { text: '#fff', gradient: 'g' } });
		expect(onlyText.settings).toEqual({});

		const record2 = {
			styles: { blocks: { [BLOCK]: { color: { background: '#000' } }, 'core/paragraph': { a: 1 } } },
		};
		expect(withStoredForm(record2, BLOCK, { core: {}, custom: {} }).styles).toEqual({
			blocks: { 'core/paragraph': { a: 1 } },
		});

		const record3 = { styles: { blocks: { [BLOCK]: { color: { background: '#000' } } } } };
		expect(withStoredForm(record3, BLOCK, { core: {}, custom: {} }).styles).toEqual({});
	});
});

describe('withStoredForm and empty settings', () => {
	it('keeps other custom settings and other blocks when the last value of a block goes', () => {
		const record = {
			settings: {
				custom: { theme: 'x', kadence: { singlebtn: { borderRadius: [1, 1, 1, 1] }, other: { a: 1 } } },
			},
		};

		expect(withStoredForm(record, BLOCK, { core: {}, custom: {} }).settings).toEqual({
			custom: { theme: 'x', kadence: { other: { a: 1 } } },
		});
		expect(
			withStoredForm({ settings: { custom: { theme: 'x', kadence: { singlebtn: { a: 1 } } } } }, BLOCK, {
				core: {},
				custom: {},
			}).settings
		).toEqual({ custom: { theme: 'x' } });
	});

	it.each([
		['an empty kadence list', { custom: { kadence: [] } }],
		['an empty custom list', { custom: [] }],
	])('writes a value over %s, as WordPress returns an empty object it saved', (name, settings) => {
		const result = withStoredForm({ settings }, BLOCK, { core: {}, custom: { sizePreset: 'large' } });

		expect(JSON.parse(JSON.stringify(result.settings))).toEqual({
			custom: { kadence: { singlebtn: { sizePreset: 'large' } } },
		});
	});

	it.each([
		['an empty blocks list', { blocks: [] }],
		['an empty block entry list', { blocks: { [BLOCK]: [] } }],
		['an empty color list', { blocks: { [BLOCK]: { color: [] } } }],
	])('writes a core color over %s', (name, styles) => {
		const result = withStoredForm({ styles }, BLOCK, { core: { 'color.background': '#cc0000' }, custom: {} });

		expect(JSON.parse(JSON.stringify(result.styles))).toEqual({
			blocks: { [BLOCK]: { color: { background: '#cc0000' } } },
		});
	});

	it('writes a core color over an empty styles list', () => {
		const result = withStoredForm({ styles: [] }, BLOCK, { core: { 'color.background': '#cc0000' }, custom: {} });

		expect(JSON.parse(JSON.stringify(result.styles))).toEqual({
			blocks: { [BLOCK]: { color: { background: '#cc0000' } } },
		});
	});

	it('writes a custom value over an empty settings list', () => {
		const result = withStoredForm({ settings: [] }, BLOCK, { core: {}, custom: { sizePreset: 'large' } });

		expect(JSON.parse(JSON.stringify(result.settings))).toEqual({
			custom: { kadence: { singlebtn: { sizePreset: 'large' } } },
		});
	});

	it('removes a stored empty block entry list when nothing is written', () => {
		expect(withStoredForm({ styles: { blocks: { [BLOCK]: [] } } }, BLOCK, { core: {}, custom: {} }).styles).toEqual(
			{}
		);
	});

	it('reads no custom values from an empty kadence list', () => {
		expect(siteAttributes({ settings: { custom: { kadence: [] } } }, BLOCK)).toEqual({});
	});
});

describe('write guard', () => {
	const site = { typography: [{ size: [24, '', ''], family: 'Georgia' }], background: 'palette2' };
	const definitions = {
		typography: { default: [{ size: ['', '', ''], family: '' }] },
		background: { default: '' },
		text: { default: '' },
	};

	it('keeps no site value when the whole attribute set is written back unchanged', () => {
		const stored = { text: 'Buy', typography: [{ size: ['', '', ''], family: '' }] };
		const shown = mergeAttributes(stored, site, definitions);

		expect(guardWrite({ ...shown }, shown, stored, site)).toEqual({ text: 'Buy' });
	});

	it('stores only the changed leaf of a compound attribute', () => {
		const stored = { typography: [{ size: ['', '', ''], family: '' }] };
		const shown = mergeAttributes(stored, site, definitions);
		const written = { typography: [{ ...shown.typography[0], size: [30, '', ''] }] };

		expect(guardWrite(written, shown, stored, site)).toEqual({
			typography: [{ size: [30, '', ''], family: '' }],
		});
	});

	it('stores a changed value of an attribute with a site value', () => {
		const stored = { background: '' };
		const shown = mergeAttributes(stored, site, definitions);

		expect(guardWrite({ background: '#00aa00' }, shown, stored, site)).toEqual({ background: '#00aa00' });
	});

	it('stores only the new style when a Fill button switches to Outline', () => {
		const stored = { background: '', typography: [{ size: ['', '', ''], family: '' }] };
		const { scope } = singleButton;
		const fillSite = scopeSiteAttributes(site, stored, scope, 'fill');
		const shown = mergeAttributes(stored, fillSite, definitions);

		expect(guardWrite({ inheritStyles: 'outline' }, shown, stored, fillSite)).toEqual({ inheritStyles: 'outline' });

		const outlineSite = scopeSiteAttributes(site, { inheritStyles: 'outline' }, scope, 'fill');

		expect(outlineSite).toEqual({ typography: site.typography });
		expect(mergeAttributes({ ...stored, inheritStyles: 'outline' }, outlineSite, definitions).background).toBe('');
	});

	it('unmerge returns the stored value for an unchanged write', () => {
		expect(unmerge('palette2', 'palette2', '')).toBe('');
	});
});

describe('write guard with groups', () => {
	const groups = [['spacerHeight', 'tabletSpacerHeight', 'mobileSpacerHeight', 'spacerHeightUnits']];
	const definitions = {
		spacerHeight: { default: 60 },
		tabletSpacerHeight: { default: '' },
		mobileSpacerHeight: { default: '' },
		spacerHeightUnits: { default: 'px' },
		dividerWidth: { default: 80 },
	};
	const untouched = { spacerHeight: 60, tabletSpacerHeight: '', mobileSpacerHeight: '', spacerHeightUnits: 'px' };
	const site = { tabletSpacerHeight: 30, spacerHeightUnits: 'rem', dividerWidth: 50 };
	const shown = { ...untouched, tabletSpacerHeight: 30, spacerHeightUnits: 'rem', dividerWidth: 50 };

	it('stores the whole group as shown when a change starts the instance setting it', () => {
		expect(guardWrite({ spacerHeight: 5 }, shown, untouched, site, groups, definitions)).toEqual({
			spacerHeight: 5,
			tabletSpacerHeight: 30,
			spacerHeightUnits: 'rem',
		});
	});

	it('copies nothing for a change outside every group', () => {
		expect(guardWrite({ dividerWidth: 40 }, shown, untouched, site, groups, definitions)).toEqual({
			dividerWidth: 40,
		});
	});

	it('copies nothing when the write leaves the group unset', () => {
		expect(
			guardWrite({ spacerHeight: 60, spacerHeightUnits: 'rem' }, shown, untouched, site, groups, definitions)
		).toEqual({ spacerHeight: 60 });
	});

	it('stores only the change for a group the instance already sets', () => {
		const stored = { ...untouched, spacerHeight: 120 };
		const ownSite = { dividerWidth: 50 };

		expect(
			guardWrite(
				{ tabletSpacerHeight: 40 },
				{ ...stored, dividerWidth: 50 },
				stored,
				ownSite,
				groups,
				definitions
			)
		).toEqual({ tabletSpacerHeight: 40 });
	});

	it('keeps the written value whole, not just its changed leaves, when the group starts', () => {
		const padGroups = [['padding', 'paddingUnit']];
		const padDefinitions = { padding: { default: ['', '', '', ''] }, paddingUnit: { default: 'px' } };
		const padStored = { padding: ['', '', '', ''], paddingUnit: 'px' };
		const padSite = { padding: [20, 20, 20, 20], paddingUnit: 'rem' };

		expect(
			guardWrite(
				{ padding: [10, 20, 20, 20] },
				{ padding: [20, 20, 20, 20], paddingUnit: 'rem' },
				padStored,
				padSite,
				padGroups,
				padDefinitions
			)
		).toEqual({ padding: [10, 20, 20, 20], paddingUnit: 'rem' });
	});
});

describe('panelAttributes', () => {
	it('keeps the excluded attributes of the current block over the defaults and site values', () => {
		const current = { uniqueID: 'virtual', inheritStyles: 'outline', text: 'Preview', borderRadius: [9, 9, 9, 9] };

		expect(
			panelAttributes(
				BLOCK,
				{ inheritStyles: 'fill', borderRadius: [0, 0, 0, 0] },
				{ borderRadius: [4, 4, 4, 4] },
				current
			)
		).toEqual({ uniqueID: 'virtual', inheritStyles: 'outline', text: 'Preview', borderRadius: [4, 4, 4, 4] });
	});

	it('takes the defaults and site values before the block exists', () => {
		expect(panelAttributes(BLOCK, { inheritStyles: 'fill' }, { sizePreset: 'large' }, {})).toEqual({
			inheritStyles: 'fill',
			sizePreset: 'large',
		});
	});
});
