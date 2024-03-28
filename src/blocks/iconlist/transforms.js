/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { get } from 'lodash';
import metadata from './block.json';

import { LINE_SEPARATOR, __UNSTABLE_LINE_SEPARATOR } from '@wordpress/rich-text';

const lineSep = LINE_SEPARATOR ? LINE_SEPARATOR : __UNSTABLE_LINE_SEPARATOR;

const getNestedListsFrom = (rawItems, level = 0) => {
	const listItems = rawItems.flatMap((listItem) => {
		if (
			undefined !== listItem.innerBlocks?.[0]?.name &&
			listItem.innerBlocks[0].name === 'core/list' &&
			listItem.innerBlocks[0].innerBlocks.length > 0
		) {
			level++;
			const nestedItems = getNestedListsFrom(listItem.innerBlocks[0].innerBlocks, level);
			level--;
			return [createBlock('kadence/listitem', { text: listItem.attributes.content, level }), ...nestedItems];
		}
		return createBlock('kadence/listitem', { text: listItem.attributes.content, level });
	});
	return listItems;
};

const getNestedListsTo = (innerBlocks, blockAttributes, indent = 0) => {
	const innerBlocksCopy = [...innerBlocks];
	const result = [];
	while (innerBlocksCopy.length > 0) {
		const curItem = innerBlocksCopy[0];
		const nextItemLevel = get(innerBlocksCopy, ['1', 'attributes', 'level']);
		innerBlocksCopy.shift();

		if (curItem.attributes.level === indent) {
			// If next item is an indent, add it as a child block
			if (nextItemLevel && nextItemLevel > indent) {
				// Core doesn't allow multiple levels of indent on a single list item
				if (nextItemLevel > indent + 1) {
					innerBlocksCopy[0].attributes.level = indent + 1;
				}

				const innerList = getNestedListsTo(innerBlocksCopy, blockAttributes, indent + 1);
				result.push(createBlock('core/list-item', { content: curItem.attributes.text }, [innerList]));
				innerBlocksCopy.splice(0, innerList.innerBlocks.length - 1);
			} else {
				result.push(createBlock('core/list-item', { content: curItem.attributes.text }));
			}
		}
	}

	return createBlock(
		'core/list',
		{ style: { color: { text: get(blockAttributes, ['listStyles', '0', 'color']) } } },
		result
	);
};

const transforms = {
	from: [
		{
			type: 'block',
			blocks: ['core/list'],
			transform: (attributes, innerBlocks) => {
				const listItems = getNestedListsFrom(innerBlocks);

				return createBlock(
					'kadence/iconlist',
					{
						listStyles: [
							{
								...metadata.attributes.listStyles.default[0],
								color: get(attributes, ['style', 'color', 'text'], ''),
							},
						],
					},
					listItems
				);
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: ['core/list'],
			transform: (blockAttributes, innerBlocks) => {
				return getNestedListsTo(innerBlocks, blockAttributes);
			},
		},
	],
};

export default transforms;
