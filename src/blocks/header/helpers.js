import { createBlock } from '@wordpress/blocks';
import { get } from 'lodash';

// Basic templates
import { innerBlocks as Basic1InnerBlocks, postMeta as Basic1PostMeta } from './templates/basic-1';
import { innerBlocks as Basic2InnerBlocks, postMeta as Basic2PostMeta } from './templates/basic-2';
import { innerBlocks as Basic3InnerBlocks, postMeta as Basic3PostMeta } from './templates/basic-3';
import { innerBlocks as Basic4InnerBlocks, postMeta as Basic4PostMeta } from './templates/basic-4';
import { innerBlocks as Basic5InnerBlocks, postMeta as Basic5PostMeta } from './templates/basic-5';
import { innerBlocks as Basic6InnerBlocks, postMeta as Basic6PostMeta } from './templates/basic-6';
import { innerBlocks as Basic7InnerBlocks, postMeta as Basic7PostMeta } from './templates/basic-7';

// Multi-Row templates
import { innerBlocks as MultiRow1InnerBlocks, postMeta as MultiRow1PostMeta } from './templates/multi-row-1';
import { innerBlocks as MultiRow2InnerBlocks, postMeta as MultiRow2PostMeta } from './templates/multi-row-2';
import { innerBlocks as MultiRow3InnerBlocks, postMeta as MultiRow3PostMeta } from './templates/multi-row-3';
import { innerBlocks as MultiRow4InnerBlocks, postMeta as MultiRow4PostMeta } from './templates/multi-row-4';
import { innerBlocks as MultiRow5InnerBlocks, postMeta as MultiRow5PostMeta } from './templates/multi-row-5';

export function buildTemplateFromSelection(desktop, offCanvasTemplate) {
	const data = getDataFromKey(desktop);
	const offCanvasData = getDataFromKey(offCanvasTemplate);

	return {
		templateInnerBlocks: [
			createBlock('kadence/header', {}, [
				createBlock(
					'kadence/header-container-desktop',
					{ uniqueID: '8_eac20d-0e' },
					getInnerBlocksFromOffset(data, 0)
				),
				createBlock(
					'kadence/header-container-tablet',
					{ uniqueID: '8_eac21d-0e' },
					getInnerBlocksFromOffset(data, 1)
				),
				createBlock(
					'kadence/off-canvas',
					{ uniqueID: '8_eac22d-0e' },
					getInnerBlocksFromOffset(offCanvasData, 2)
				),
			]),
		],
		templatePostMeta: data.templatePostMeta,
	};
}

function getInnerBlocksFromOffset({ templateInnerBlocks }, offset = 0) {
	return get(templateInnerBlocks, [0, 'innerBlocks', offset, 'innerBlocks']);
}

function getDataFromKey(key) {
	const response = {};

	if (key === 'basic-1') {
		response.templatePostMeta = Basic1PostMeta;
		response.templateInnerBlocks = Basic1InnerBlocks();
	} else if (key === 'basic-2') {
		response.templatePostMeta = Basic2PostMeta;
		response.templateInnerBlocks = Basic2InnerBlocks();
	} else if (key === 'basic-3') {
		response.templatePostMeta = Basic3PostMeta;
		response.templateInnerBlocks = Basic3InnerBlocks();
	} else if (key === 'basic-4') {
		response.templatePostMeta = Basic4InnerBlocks;
		response.templateInnerBlocks = Basic4PostMeta();
	} else if (key === 'basic-5') {
		response.templatePostMeta = Basic5PostMeta;
		response.templateInnerBlocks = Basic5InnerBlocks();
	} else if (key === 'basic-6') {
		response.templatePostMeta = Basic6PostMeta;
		response.templateInnerBlocks = Basic6InnerBlocks();
	} else if (key === 'basic-7') {
		response.templatePostMeta = Basic7PostMeta;
		response.templateInnerBlocks = Basic7InnerBlocks();
	} else if (key === 'multi-row-1') {
		response.templatePostMeta = MultiRow1PostMeta;
		response.templateInnerBlocks = MultiRow1InnerBlocks();
	} else if (key === 'multi-row-2') {
		response.templatePostMeta = MultiRow2PostMeta;
		response.templateInnerBlocks = MultiRow2InnerBlocks();
	} else if (key === 'multi-row-3') {
		response.templatePostMeta = MultiRow3PostMeta;
		response.templateInnerBlocks = MultiRow3InnerBlocks();
	} else if (key === 'multi-row-4') {
		response.templatePostMeta = MultiRow4PostMeta;
		response.templateInnerBlocks = MultiRow4InnerBlocks();
	} else if (key === 'multi-row-5') {
		response.templatePostMeta = MultiRow5PostMeta;
		response.templateInnerBlocks = MultiRow5InnerBlocks();
	}

	return response;
}
