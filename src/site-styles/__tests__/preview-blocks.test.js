/* eslint-env jest */
import { previewBlocks } from '../preview-blocks';
import singleButton from './fixtures/singlebtn-entry.json';

const mockTypes = {
	'kadence/singlebtn': {
		parent: ['kadence/advancedbtn'],
		example: { attributes: { text: 'Click Me!', background: '#000000' } },
	},
	'kadence/standalone': {},
};

jest.mock(
	'@wordpress/blocks',
	() => {
		let id = 0;
		const createBlock = (name, attributes = {}, innerBlocks = []) => {
			id++;
			return { name, attributes, innerBlocks, clientId: `id-${id}` };
		};

		return {
			createBlock,
			getBlockType: (name) => mockTypes[name],
			getBlockFromExample: (name, example) => createBlock(name, example.attributes, []),
		};
	},
	{ virtual: true }
);

describe('previewBlocks', () => {
	beforeEach(() => {
		window.kadenceSiteStyles = {
			isFseMode: true,
			blocks: { 'kadence/singlebtn': singleButton, 'kadence/standalone': { ...singleButton, exclude: [] } },
		};
	});

	afterEach(() => {
		delete window.kadenceSiteStyles;
	});

	it('wraps a child block in its first parent and takes only content from the example', () => {
		const { blocks, clientId } = previewBlocks('kadence/singlebtn', {
			text: '',
			background: 'palette2',
			uniqueID: 'abc',
		});

		expect(blocks).toHaveLength(1);
		expect(blocks[0].name).toBe('kadence/advancedbtn');
		const [block] = blocks[0].innerBlocks;
		expect(block.clientId).toBe(clientId);
		expect(block.attributes).toEqual({ text: 'Click Me!', background: 'palette2', uniqueID: '' });
	});

	it('previews a block without a parent or an example on its own', () => {
		const { blocks, clientId } = previewBlocks('kadence/standalone', { background: 'palette2' });

		expect(blocks).toHaveLength(1);
		expect(blocks[0].name).toBe('kadence/standalone');
		expect(blocks[0].clientId).toBe(clientId);
		expect(blocks[0].attributes).toEqual({ background: 'palette2', uniqueID: '' });
	});
});
