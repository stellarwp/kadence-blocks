/**
 * The blocks the Kadence panel previews for a block type.
 */
import { pick } from 'lodash';
import { createBlock, getBlockFromExample, getBlockType } from '@wordpress/blocks';
import { getSupportedBlock } from './supported-blocks';

/**
 * Builds the preview: the block with the site values and its example's content,
 * inside its first allowed parent when it has one, since some of a child
 * block's CSS only applies there.
 *
 * @param {string}            blockName  Block name.
 * @param {Object<string, *>} attributes The block's attributes (defaults merged with site values).
 * @return {{blocks: Object[], clientId: string}} The blocks to preview, and the client ID of the previewed block.
 */
export function previewBlocks(blockName, attributes) {
	const type = getBlockType(blockName);
	const example = type?.example ? getBlockFromExample(blockName, type.example) : null;
	const content = pick(example?.attributes || {}, getSupportedBlock(blockName)?.exclude || []);
	// No uniqueID: the preview mustn't claim a real block's ID and its CSS.
	const block = createBlock(blockName, { ...attributes, ...content, uniqueID: '' }, example?.innerBlocks || []);
	const parent = type?.parent?.[0];

	return {
		blocks: [parent ? createBlock(parent, {}, [block]) : block],
		clientId: block.clientId,
	};
}
