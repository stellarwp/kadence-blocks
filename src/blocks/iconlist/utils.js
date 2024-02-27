/**
 * Utilities for the icon list block.
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';

export function migrateToInnerblocks(attributes) {
	const { items, listCount } = attributes;

	const listInnerBlocks = [];
	if (items?.length) {
		times(listCount, (n) => {
			const item = items[n];
			const newAttrs = { ...item };

			listInnerBlocks.push(createBlock('kadence/listitem', newAttrs));
		});
	}

	const listParentAttributes = { ...attributes, items: [], listCount: 1 };

	return [listParentAttributes, listInnerBlocks];
}
