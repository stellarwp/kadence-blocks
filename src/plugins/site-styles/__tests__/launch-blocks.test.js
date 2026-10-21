/* eslint-env jest */
import { launchBlockNames, screenBlockName } from '../launch-blocks';

const mockTypes = {
	'kadence/single-icon': { title: 'Single Icon', parent: ['kadence/icon'] },
	'kadence/icon': { title: 'Icon' },
	'kadence/singlebtn': { title: 'Single Button', parent: ['kadence/advancedbtn'] },
	'kadence/advancedbtn': { title: 'Buttons (Adv)' },
	'third-party/button': { title: 'Single Button' },
	'kadence/spacer': { title: 'Spacer / Divider' },
	'kadence/rowlayout': { title: 'Row Layout' },
	'kadence/column': { title: 'Section' },
	'kadence/iconlist': { title: 'Icon List' },
	'kadence/listitem': { title: 'List Item', parent: ['kadence/iconlist'] },
};

jest.mock(
	'@wordpress/blocks',
	() => ({
		getBlockType: (name) => mockTypes[name],
		getBlockTypes: () => Object.entries(mockTypes).map(([name, type]) => ({ name, ...type })),
	}),
	{ virtual: true }
);

const colors = { color: { text: true } };

beforeEach(() => {
	window.kadenceSiteStyles = {
		isFseMode: true,
		blocks: {
			'kadence/advancedbtn': { supports: {} },
			'kadence/singlebtn': { supports: colors },
			'kadence/icon': { supports: {} },
			'kadence/single-icon': { supports: colors },
			'kadence/spacer': { supports: {} },
		},
	};
});

afterEach(() => {
	delete window.kadenceSiteStyles;
});

describe('screenBlockName', () => {
	it('finds the supported block core lists by its title', () => {
		expect(screenBlockName('Single Icon')).toBe('kadence/single-icon');
	});

	it("ignores a supported block core doesn't list, so core's Icon screen opens no Kadence panel", () => {
		expect(screenBlockName('Icon')).toBeUndefined();
	});

	it('ignores a title another registered block shares, since the screen cannot tell them apart', () => {
		expect(screenBlockName('Single Button')).toBeUndefined();
	});

	it("finds a supported block core doesn't list when no other block's screen opens it", () => {
		expect(screenBlockName('Spacer / Divider')).toBe('kadence/spacer');
	});

	it("finds a supported block core doesn't list when only unsupported blocks are placed in it", () => {
		window.kadenceSiteStyles.blocks['kadence/iconlist'] = { supports: {} };

		expect(screenBlockName('Icon List')).toBe('kadence/iconlist');
	});

	it('ignores a block that is not supported', () => {
		expect(screenBlockName('Icon List')).toBeUndefined();
	});

	it('finds Row Layout and Section from their own screens, since neither is placed only in the other', () => {
		window.kadenceSiteStyles.blocks['kadence/rowlayout'] = { supports: {} };
		window.kadenceSiteStyles.blocks['kadence/column'] = { supports: {} };

		expect(screenBlockName('Row Layout')).toBe('kadence/rowlayout');
		expect(screenBlockName('Section')).toBe('kadence/column');
		expect(launchBlockNames('kadence/column')).toEqual(['kadence/column']);
	});

	it('finds nothing without a title', () => {
		expect(screenBlockName(undefined)).toBeUndefined();
	});
});

describe('launchBlockNames', () => {
	it("adds the block's unlisted supported parent after the block", () => {
		expect(launchBlockNames('kadence/single-icon')).toEqual(['kadence/single-icon', 'kadence/icon']);
		expect(launchBlockNames('kadence/singlebtn')).toEqual(['kadence/singlebtn', 'kadence/advancedbtn']);
	});

	it('leaves out a parent that is not supported', () => {
		delete window.kadenceSiteStyles.blocks['kadence/icon'];

		expect(launchBlockNames('kadence/single-icon')).toEqual(['kadence/single-icon']);
	});

	it('leaves out a parent core lists, since it has its own screen', () => {
		window.kadenceSiteStyles.blocks['kadence/icon'] = { supports: colors };

		expect(launchBlockNames('kadence/single-icon')).toEqual(['kadence/single-icon']);
	});
});
