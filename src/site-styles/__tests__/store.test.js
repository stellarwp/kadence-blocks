/* eslint-env jest */
import {
	guardWrite,
	merge,
	mergeAttributes,
	siteAttributes,
	toCoreColor,
	toKadenceColor,
	toStoredForm,
	unmerge,
	withStoredForm,
} from '../store';
import conformance from './fixtures/merge-conformance.json';
import singleButton from './fixtures/singlebtn-entry.json';

const BLOCK = 'kadence/singlebtn';

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

	it('stores nothing when everything is at its default', () => {
		expect(toStoredForm({ background: '', sizePreset: 'standard' }, definitions, BLOCK)).toEqual({
			core: {},
			custom: {},
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
		expect(onlyText.settings.custom.kadence).toEqual({});

		const record2 = { styles: { blocks: { [BLOCK]: { color: { background: '#000' } } } } };
		expect(withStoredForm(record2, BLOCK, { core: {}, custom: {} }).styles.blocks[BLOCK]).toEqual({});
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

	it('unmerge returns the stored value for an unchanged write', () => {
		expect(unmerge('palette2', 'palette2', '')).toBe('');
	});
});
