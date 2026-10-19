/* eslint-env jest */
import { launchBlockNames, screenBlockName } from '../launch-blocks';

const mockTypes = {
	'kadence/single-icon': { title: 'Single Icon', parent: ['kadence/icon'] },
	'kadence/icon': { title: 'Icon' },
	'kadence/singlebtn': { title: 'Single Button', parent: ['kadence/advancedbtn'] },
	'kadence/advancedbtn': { title: 'Buttons (Adv)' },
};

jest.mock('@wordpress/blocks', () => ({ getBlockType: (name) => mockTypes[name] }), { virtual: true });

const colors = { color: { text: true } };

beforeEach(() => {
	window.kadenceSiteStyles = {
		isFseMode: true,
		blocks: {
			'kadence/advancedbtn': { supports: {} },
			'kadence/singlebtn': { supports: colors },
			'kadence/icon': { supports: {} },
			'kadence/single-icon': { supports: colors },
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
