/**
 * External dependencies
 */
import { every } from 'lodash';

/**
 * WordPress dependencies
 */
import { createBlobURL } from '@wordpress/blob';
import { createBlock, getBlockAttributes } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

const coreCellToKadenceCell = (cell) => {
	return createBlock('kadence/table-data', {}, [
		createBlock('core/paragraph', {
			content: cell.content,
		}),
	]);
};

const createKadenceRow = (rowData) => {
	const cells = rowData.cells.map((cell) => coreCellToKadenceCell(cell));
	return createBlock('kadence/table-row', {}, cells);
};

const getColumnCount = (attributes) => {
	if (attributes.head && attributes.head[0]) {
		return attributes.head[0].cells.length;
	}
	if (attributes.body && attributes.body[0]) {
		return attributes.body[0].cells.length;
	}
	if (attributes.foot && attributes.foot[0]) {
		return attributes.foot[0].cells.length;
	}
	return 0;
};

const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: ['core/table'],
			transform: (attributes) => {
				const { head, body, foot } = attributes[0];
				const innerBlocks = [];

				if (head && head.length > 0) {
					head.forEach((row) => {
						innerBlocks.push(createKadenceRow(row));
					});
				}

				if (body && body.length > 0) {
					body.forEach((row) => {
						innerBlocks.push(createKadenceRow(row));
					});
				}

				if (foot && foot.length > 0) {
					foot.forEach((row) => {
						innerBlocks.push(createKadenceRow(row));
					});
				}

				return createBlock(
					'kadence/table',
					{
						isFirstRowHeader: head && head.length > 0,
						columns: getColumnCount(attributes[0]),
					},
					innerBlocks
				);
			},
		},
	],
};

export default transforms;
