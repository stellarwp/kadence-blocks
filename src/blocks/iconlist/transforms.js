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
		if(undefined !== listItem.innerBlocks?.[0]?.name && listItem.innerBlocks[0].name === 'core/list' && listItem.innerBlocks[0].innerBlocks.length > 0) {
			level++;
			const nestedItems = getNestedListsFrom(listItem.innerBlocks[0].innerBlocks, level);
			level--;
			return [createBlock('kadence/listitem', { text: listItem.attributes.content, level: level }), ...nestedItems];
		} else {
			return createBlock('kadence/listitem', { text: listItem.attributes.content, level });
		}
	});
	return listItems;
}

const getNestedListsTo = (rawItems, attributes) => {
	let lastLevel = rawItems[0].attributes.level;
	const nestedBlocks = [];
	let nestedListItems = [];
	const listItems = rawItems.map((listItem, index) => {
		if(lastLevel === listItem.attributes.level) {
			nestedListItems.push(createBlock('core/list-item', { content: listItem.attributes.text }));
		}
		
		if(lastLevel < listItem.attributes.level) {
			nestedBlocks.push(createBlock(
				'core/list',
				{
					ordered: false,
					style: {
						color: {
							text: attributes.listStyles[0].color,
						},
					},
				},
				nestedListItems
			));
			lastLevel = listItem.attributes.level;
		}
		console.log(nestedBlocks);
		if(lastLevel > listItem.attributes.level) {
			lastLevel = listItem.attributes.level;
			nestedListItems = [];
			return nestedBlocks;
		}
	});
	return listItems;
}

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
				getNestedListsTo(innerBlocks, blockAttributes);
				const listItems = innerBlocks.map((listItem) => {
					return createBlock('core/list-item', { content: listItem.attributes.text });
				});

				return createBlock(
					'core/list',
					{
						ordered: false,
						style: {
							color: {
								text: blockAttributes.listStyles[0].color,
							},
						},
					},
					listItems
				);
			},
		},
	],
};

export default transforms;
