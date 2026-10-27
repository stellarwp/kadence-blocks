/* eslint-env jest */
import {
	groupSiteAttributes,
	guardWrite,
	keepSiteCopies,
	merge,
	mergeAttributes,
	panelAttributes,
	scopeSiteAttributes,
	siteAttributes,
	siteCopies,
	toCoreColor,
	toKadenceColor,
	toStoredForm,
	unmerge,
	withoutOverridden,
	withoutSiteCopies,
	withStoredForm,
} from '../store';
import copiesConformance from './fixtures/copies-conformance.json';
import cascadeConformance from './fixtures/cascade-conformance.json';
import conformance from './fixtures/merge-conformance.json';
import groupConformance from './fixtures/group-conformance.json';
import scopeConformance from './fixtures/scope-conformance.json';
import singleButton from './fixtures/singlebtn-entry.json';
import section from './fixtures/column-entry.json';
import showMore from './fixtures/show-more-entry.json';
import rowLayout from './fixtures/rowlayout-entry.json';
import countUp from './fixtures/countup-entry.json';
import infoBox from './fixtures/infobox-entry.json';
import countdown from './fixtures/countdown-entry.json';
import table from './fixtures/table-entry.json';
import posts from './fixtures/posts-entry.json';
import progressBar from './fixtures/progress-bar-entry.json';
import testimonials from './fixtures/testimonials-entry.json';
import testimonial from './fixtures/testimonial-entry.json';

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

		expect(groupSiteAttributes(c.site, c.instance, c.groups, definitions, c.legacy)).toEqual(c.expected);
	});
});

describe('withoutOverridden', () => {
	const { cascades, defaults, cases } = cascadeConformance;
	const definitions = Object.fromEntries(Object.entries(defaults).map(([name, value]) => [name, { default: value }]));

	it.each(cases.map((c) => [c.name, c]))('%s', (name, c) => {
		expect(withoutOverridden(c.site, c.instance, definitions, cascades)).toEqual(c.expected);
	});

	it('leaves the site values it is given untouched', () => {
		const site = { padding: [20, 40, 20, 40], mobilePadding: [6, 12, 6, 12] };

		withoutOverridden(site, { padding: [2, 10, 2, 10] }, definitions, cascades);

		expect(site).toEqual({ padding: [20, 40, 20, 40], mobilePadding: [6, 12, 6, 12] });
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

	it("keeps only Section's overlay attributes, leaving its layout and Pro settings to each block", () => {
		window.kadenceSiteStyles.blocks['kadence/column'] = section;
		const record = {
			settings: {
				custom: {
					kadence: {
						column: {
							padding: [2, 2, 2, 2],
							textColor: '#222222',
							margin: [10, 0, 10, 0],
							backdropFilterType: 'blur',
							kadenceAnimation: 'fade-in',
							kadenceBlockCSS: 'selector { color: red; }',
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/column')).toEqual({ padding: [2, 2, 2, 2], textColor: '#222222' });
	});

	it("keeps only Row Layout's overlay attributes, leaving its structure, layout and Pro settings to each row", () => {
		window.kadenceSiteStyles.blocks['kadence/rowlayout'] = rowLayout;
		const record = {
			settings: {
				custom: {
					kadence: {
						rowlayout: {
							padding: [2, '', 2, ''],
							bgColor: '#ff0000',
							kbVersion: 2,
							columns: 3,
							colLayout: 'left-golden',
							verticalAlignment: 'middle',
							minHeight: 400,
							inheritMaxWidth: true,
							kadenceBlockCSS: 'selector { color: red; }',
							kadenceConditional: { postData: { enable: true } },
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/rowlayout')).toEqual({ padding: [2, '', 2, ''], bgColor: '#ff0000' });
	});

	it("keeps only Count Up's overlay attributes, leaving its numbers and timing to each block", () => {
		window.kadenceSiteStyles.blocks['kadence/countup'] = countUp;
		const record = {
			settings: {
				custom: {
					kadence: {
						countup: {
							numberColor: '#cc0000',
							titleAlign: ['center', '', ''],
							start: 5,
							end: 50,
							duration: 9,
							displayTitle: false,
							titleMinHeight: [40, '', ''],
							kadenceBlockCSS: 'selector { color: red; }',
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/countup')).toEqual({
			numberColor: '#cc0000',
			titleAlign: ['center', '', ''],
			titleMinHeight: [40, '', ''],
		});
	});

	it("keeps only Info Box's overlay attributes, leaving its content, media and layout to each box", () => {
		window.kadenceSiteStyles.blocks['kadence/infobox'] = infoBox;
		const record = {
			settings: {
				custom: {
					kadence: {
						infobox: {
							containerBackground: '#fff3cd',
							titleColor: '#123456',
							mediaIcon: [{ size: 99 }],
							hAlign: 'left',
							fullHeight: true,
							containerBorder: '#00ffff',
							kadenceBlockCSS: 'selector { color: red; }',
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/infobox')).toEqual({
			containerBackground: '#fff3cd',
			titleColor: '#123456',
		});
	});

	it("keeps only Countdown's overlay attributes, leaving its timing and layout to each block", () => {
		window.kadenceSiteStyles.blocks['kadence/countdown'] = countdown;
		const record = {
			settings: {
				custom: {
					kadence: {
						countdown: {
							background: '#fff3cd',
							numberColor: '#cc0000',
							timerLayout: 'inline',
							preLabelColor: '#ff0000',
							date: '2030-01-01T00:00:00',
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/countdown')).toEqual({ background: '#fff3cd', numberColor: '#cc0000' });
	});

	it("keeps only Table's overlay attributes, leaving its structure and columns to each table", () => {
		window.kadenceSiteStyles.blocks['kadence/table'] = table;
		const record = {
			settings: {
				custom: {
					kadence: {
						table: {
							headerAlign: 'left',
							cellPaddingType: 'px',
							columns: 4,
							isFirstRowHeader: false,
							columnBackgrounds: ['#ff0000'],
							maxHeight: [200, '', ''],
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/table')).toEqual({ headerAlign: 'left', cellPaddingType: 'px' });
	});

	it("keeps only Testimonials' container, spacing and fonts, leaving what its testimonials read to each block", () => {
		window.kadenceSiteStyles.blocks['kadence/testimonials'] = testimonials;
		const record = {
			settings: {
				custom: {
					kadence: {
						testimonials: {
							containerBackground: '#fff3cd',
							gap: [40, '', ''],
							style: 'bubble',
							layout: 'carousel',
							titleFont: [{ color: '#00ff00' }],
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/testimonials')).toEqual({
			containerBackground: '#fff3cd',
			gap: [40, '', ''],
		});
	});

	it("keeps only Testimonial's icon size and color, leaving its media, icon and rating to each testimonial", () => {
		window.kadenceSiteStyles.blocks['kadence/testimonial'] = testimonial;
		const record = {
			settings: {
				custom: { kadence: { testimonial: { isize: 80, color: '#ff0000', media: 'icon', rating: 2 } } },
			},
		};

		expect(siteAttributes(record, 'kadence/testimonial')).toEqual({ isize: 80, color: '#ff0000' });
	});

	it("keeps only Progress Bar's look, leaving its type, content and animation to each bar", () => {
		window.kadenceSiteStyles.blocks['kadence/progress-bar'] = progressBar;
		const record = {
			settings: {
				custom: {
					kadence: {
						'progress-bar': {
							progressColor: '#ff0000',
							progressWidth: 4,
							barType: 'circle',
							label: 'Site label',
							duration: 5,
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/progress-bar')).toEqual({ progressColor: '#ff0000', progressWidth: 4 });
	});

	it("keeps only Posts' look, leaving its parts, labels and query to each block", () => {
		window.kadenceSiteStyles.blocks['kadence/posts'] = posts;
		const record = {
			settings: {
				custom: {
					kadence: {
						posts: {
							loopStyle: 'unboxed',
							categoriesStyle: 'pill',
							image: false,
							readmoreLabel: 'Site label',
							postType: 'page',
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/posts')).toEqual({ loopStyle: 'unboxed', categoriesStyle: 'pill' });
	});

	it("keeps only Show More's overlay attributes, leaving its expand behavior to each block", () => {
		window.kadenceSiteStyles.blocks['kadence/show-more'] = showMore;
		const record = {
			settings: {
				custom: {
					kadence: {
						'show-more': {
							heightDesktop: 400,
							enableFadeOut: true,
							showHideMore: false,
							defaultExpandedDesktop: true,
							kadenceBlockCSS: 'selector { color: red; }',
						},
					},
				},
			},
		};

		expect(siteAttributes(record, 'kadence/show-more')).toEqual({ heightDesktop: 400, enableFadeOut: true });
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
		expect(siteAttributes({ settings: { custom: { kadence: { lottie: { a: 1 } } } } }, 'kadence/lottie')).toEqual(
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

	describe('with a unit shared by the values', () => {
		const cascades = [{ unit: 'paddingUnit', values: ['padding', 'tabletPadding', 'mobilePadding'] }];
		const unitDefinitions = {
			paddingUnit: { default: 'px' },
			padding: { default: ['', '', '', ''] },
			tabletPadding: { default: ['', '', '', ''] },
			mobilePadding: { default: ['', '', '', ''] },
		};
		const emSite = { paddingUnit: 'em', padding: [1, 2, 1, 2], mobilePadding: [0.5, 1, 0.5, 1] };
		const stored = { paddingUnit: 'px', padding: ['', '', '', ''] };

		it('stores the whole box as shown on the first change, in the unit it was shown in, without the narrower sides the change covers', () => {
			const shown = mergeAttributes(stored, emSite, unitDefinitions);

			expect(
				guardWrite({ padding: [2, 2, 1, 2] }, shown, stored, emSite, [], unitDefinitions, {}, cascades)
			).toEqual({
				padding: [2, 2, 1, 2],
				mobilePadding: ['', 1, 0.5, 1],
				paddingUnit: 'em',
			});
		});

		it("stores the site's other sides and devices with one changed side, and no unit already stored", () => {
			const pxSite = { padding: [20, 40, 20, 40], mobilePadding: [6, 12, 6, 12] };
			const shown = mergeAttributes(stored, pxSite, unitDefinitions);

			expect(
				guardWrite({ padding: [30, 40, 20, 40] }, shown, stored, pxSite, [], unitDefinitions, {}, cascades)
			).toEqual({
				padding: [30, 40, 20, 40],
				mobilePadding: ['', 12, 6, 12],
			});
		});

		it('stores only the changed side once the instance owns the box', () => {
			const owned = { paddingUnit: 'em', padding: [2, 2, 1, 2], mobilePadding: [0.5, 1, 0.5, 1] };
			const shown = mergeAttributes(owned, emSite, unitDefinitions);

			expect(
				guardWrite({ padding: [3, 2, 1, 2] }, shown, owned, emSite, [], unitDefinitions, {}, cascades)
			).toEqual({
				padding: [3, 2, 1, 2],
			});
		});

		it('stores no unit for a write that changes nothing, such as a reset of a value without a site value', () => {
			const withTablet = { ...stored, tabletPadding: ['', '', '', ''] };
			const shown = mergeAttributes(withTablet, emSite, unitDefinitions);

			expect(
				guardWrite(
					{ tabletPadding: ['', '', '', ''] },
					shown,
					withTablet,
					emSite,
					[],
					unitDefinitions,
					{},
					cascades
				)
			).toEqual({
				tabletPadding: ['', '', '', ''],
			});
		});

		it('stores the values in the unit the user picks in the same write, which stays when it is the stored one', () => {
			const shown = mergeAttributes(stored, emSite, unitDefinitions);

			expect(
				guardWrite(
					{ padding: [2, 2, 1, 2], paddingUnit: 'px' },
					shown,
					stored,
					emSite,
					[],
					unitDefinitions,
					{},
					cascades
				)
			).toEqual({
				padding: [2, 2, 1, 2],
				mobilePadding: ['', 1, 0.5, 1],
			});
		});

		it('stores the values shown with the unit the user picks', () => {
			const shown = mergeAttributes(stored, emSite, unitDefinitions);

			expect(
				guardWrite({ paddingUnit: 'rem' }, shown, stored, emSite, [], unitDefinitions, {}, cascades)
			).toEqual({
				paddingUnit: 'rem',
				padding: [1, 2, 1, 2],
				mobilePadding: [0.5, 1, 0.5, 1],
			});
		});

		it("stores the values shown when the user picks the default unit over the site's", () => {
			const shown = mergeAttributes(stored, emSite, unitDefinitions);

			expect(guardWrite({ paddingUnit: 'px' }, shown, stored, emSite, [], unitDefinitions, {}, cascades)).toEqual(
				{
					padding: [1, 2, 1, 2],
					mobilePadding: [0.5, 1, 0.5, 1],
				}
			);
		});

		it("stores the default unit too when the instance doesn't store one", () => {
			const withoutUnit = { padding: ['', '', '', ''] };
			const shown = mergeAttributes(withoutUnit, emSite, unitDefinitions);

			expect(
				guardWrite({ paddingUnit: 'px' }, shown, withoutUnit, emSite, [], unitDefinitions, {}, cascades)
			).toEqual({
				paddingUnit: 'px',
				padding: [1, 2, 1, 2],
				mobilePadding: [0.5, 1, 0.5, 1],
			});
		});

		it('stores only the unit when an instance that owns the box picks the default unit', () => {
			const owned = { paddingUnit: 'em', padding: [1, 2, 1, 2] };
			const shown = mergeAttributes(owned, emSite, unitDefinitions);

			expect(guardWrite({ paddingUnit: 'px' }, shown, owned, emSite, [], unitDefinitions, {}, cascades)).toEqual({
				paddingUnit: 'px',
			});
		});

		it('stores nothing when the user picks the unit already shown', () => {
			const shown = mergeAttributes(stored, emSite, unitDefinitions);

			expect(guardWrite({ paddingUnit: 'em' }, shown, stored, emSite, [], unitDefinitions, {}, cascades)).toEqual(
				{}
			);
		});

		it('leaves a write that touches no value of the cascade alone', () => {
			const shown = mergeAttributes(stored, emSite, unitDefinitions);

			expect(guardWrite({ text: 'Buy' }, shown, stored, emSite, [], unitDefinitions, {}, cascades)).toEqual({
				text: 'Buy',
			});
		});
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

	it('copies nothing when an older attribute already sets the group', () => {
		const legacy = { spacerHeight: ['legacyHeight'] };
		const stored = { ...untouched, legacyHeight: 80 };

		expect(guardWrite({ spacerHeight: 5 }, shown, stored, site, groups, definitions, legacy)).toEqual({
			spacerHeight: 5,
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

describe('withoutSiteCopies', () => {
	const { defaults, cases } = copiesConformance;
	const definitions = Object.fromEntries(Object.entries(defaults).map(([name, value]) => [name, { default: value }]));

	it.each(cases.map((c) => [c.name, c]))('%s', (name, c) => {
		expect(withoutSiteCopies(c.instance, definitions)).toEqual(c.expected);
	});

	it('leaves the attributes and the defaults it is given untouched', () => {
		const instance = { padding: [30, 40, 20, 40], metadata: { kbSiteCopies: { padding: [[1]] } } };

		withoutSiteCopies(instance, definitions);

		expect(instance.padding).toEqual([30, 40, 20, 40]);
		expect(definitions.padding.default).toEqual(['', '', '', '']);
	});
});

describe('siteCopies', () => {
	const cascades = [{ unit: 'paddingUnit', values: ['padding', 'tabletPadding', 'mobilePadding'] }];
	const definitions = {
		paddingUnit: { default: 'px' },
		padding: { default: ['', '', '', ''] },
		tabletPadding: { default: ['', '', '', ''] },
		mobilePadding: { default: ['', '', '', ''] },
	};
	const pxSite = { padding: [20, 40, 20, 40], mobilePadding: [6, 12, 6, 12] };
	const stored = { paddingUnit: 'px', padding: ['', '', '', ''] };

	/**
	 * Runs a write through the guard, then lists the site values it copied.
	 *
	 * @param {Object} written  The attributes being written.
	 * @param {Object} instance The instance's stored attributes.
	 * @param {Object} site     The site values.
	 * @param {Object} previous The copies already listed.
	 *
	 * @since TBD
	 *
	 * @return {Object} Attribute name => the copied leaves' paths.
	 */
	function copiesOf(written, instance, site, previous) {
		const instanceSite = withoutOverridden(site, instance, definitions, cascades);
		const shown = mergeAttributes(instance, instanceSite, definitions);
		const kept = guardWrite(written, shown, instance, instanceSite, [], definitions, {}, cascades);

		return siteCopies(kept, written, shown, instance, instanceSite, previous);
	}

	it("lists the site's sides the first change copies, on every device", () => {
		expect(copiesOf({ padding: [30, 40, 20, 40] }, stored, pxSite)).toEqual({
			padding: [[1], [2], [3]],
			mobilePadding: [[1], [2], [3]],
		});
	});

	it("doesn't list the copied unit, which the changed side was typed in", () => {
		const emSite = { paddingUnit: 'em', padding: [1, 2, 1, 2], mobilePadding: [0.5, 1, 0.5, 1] };

		expect(copiesOf({ padding: [2, 2, 1, 2] }, stored, emSite)).toEqual({
			padding: [[1], [2], [3]],
			mobilePadding: [[1], [2], [3]],
		});
	});

	it('lists every side when the user only picks the unit', () => {
		const emSite = { paddingUnit: 'em', padding: [1, 2, 1, 2], mobilePadding: [0.5, 1, 0.5, 1] };

		expect(copiesOf({ paddingUnit: 'px' }, stored, emSite)).toEqual({
			padding: [[0], [1], [2], [3]],
			mobilePadding: [[0], [1], [2], [3]],
		});
	});

	it('drops a copied side the user changes later, and keeps the rest', () => {
		const owned = { paddingUnit: 'px', padding: [30, 40, 20, 40], mobilePadding: ['', 12, 6, 12] };
		const previous = { padding: [[1], [2], [3]], mobilePadding: [[1], [2], [3]] };

		expect(copiesOf({ padding: [30, 50, 20, 40] }, owned, pxSite, previous)).toEqual({
			padding: [[2], [3]],
			mobilePadding: [[1], [2], [3]],
		});
	});

	it('lists nothing for a box the instance already sets', () => {
		const owned = { paddingUnit: 'px', padding: [2, 10, 2, 10] };

		expect(copiesOf({ padding: [3, 10, 2, 10] }, owned, pxSite)).toEqual({});
	});

	it("lists a group's copied members and leaves, but not the changed leaf or a copied unit", () => {
		const shadowDefault = { color: '#000000', opacity: 0.2, spread: 0, blur: 2 };
		const siteShadow = { color: '#333333', opacity: 0.5, spread: 0, blur: 10 };
		const groups = [['displayShadow', 'shadow', 'shadowUnit']];
		const groupDefinitions = {
			displayShadow: { default: false },
			shadow: { default: [shadowDefault] },
			shadowUnit: { default: 'px' },
		};
		const instance = { displayShadow: false, shadow: [shadowDefault], shadowUnit: 'px' };
		const site = { displayShadow: true, shadow: [siteShadow], shadowUnit: 'rem' };
		const shown = mergeAttributes(instance, site, groupDefinitions);
		const written = { shadow: [{ ...siteShadow, color: '#ff0000' }] };
		const kept = guardWrite(written, shown, instance, site, groups, groupDefinitions);

		expect(siteCopies(kept, written, shown, instance, site)).toEqual({
			displayShadow: [[]],
			shadow: [
				[0, 'opacity'],
				[0, 'blur'],
			],
		});
	});
});

describe('keepSiteCopies', () => {
	const definitions = {
		padding: { default: ['', '', '', ''] },
		mobilePadding: { default: ['', '', '', ''] },
	};
	const copies = { padding: [[1], [2], [3]], mobilePadding: [[1], [2], [3]] };
	const stored = {
		padding: [30, 40, 20, 40],
		mobilePadding: ['', 12, 6, 12],
		metadata: { name: '', kbSiteCopies: copies },
	};
	const shown = withoutSiteCopies(stored, definitions);

	it('keeps the copied sides the user leaves alone, and drops the changed one from the list', () => {
		expect(keepSiteCopies({ padding: [30, 50, '', ''] }, shown, stored)).toEqual({
			padding: [30, 50, 20, 40],
			metadata: { name: '', kbSiteCopies: { padding: [[2], [3]], mobilePadding: [[1], [2], [3]] } },
		});
	});

	it('removes the list once the last copied side is changed', () => {
		const one = { ...stored, metadata: { name: '', kbSiteCopies: { padding: [[1]] } } };

		expect(keepSiteCopies({ padding: [30, 50, '', ''] }, withoutSiteCopies(one, definitions), one)).toEqual({
			padding: [30, 50, '', ''],
			metadata: { name: '' },
		});
	});

	it('passes through a write to an attribute without copies', () => {
		expect(keepSiteCopies({ text: 'Go' }, shown, stored)).toEqual({ text: 'Go' });
	});

	it('passes through a write to an instance without copies', () => {
		expect(keepSiteCopies({ padding: [1, 2, 3, 4] }, { padding: [] }, { padding: [] })).toEqual({
			padding: [1, 2, 3, 4],
		});
	});
});
