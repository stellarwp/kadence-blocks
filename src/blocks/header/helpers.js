import { createBlock } from '@wordpress/blocks';
import { get } from 'lodash';

// Basic templates
import { innerBlocks as Basic1InnerBlocks, postMeta as Basic1PostMeta } from './templates/basic-1';
import { innerBlocks as Basic2InnerBlocks, postMeta as Basic2PostMeta } from './templates/basic-2';
import { innerBlocks as Basic3InnerBlocks, postMeta as Basic3PostMeta } from './templates/basic-3';

// Multi-Row templates
import { innerBlocks as MultiRow1InnerBlocks, postMeta as MultiRow1PostMeta } from './templates/multi-row-1';
import { innerBlocks as MultiRow2InnerBlocks, postMeta as MultiRow2PostMeta } from './templates/multi-row-2';
import { innerBlocks as MultiRow3InnerBlocks, postMeta as MultiRow3PostMeta } from './templates/multi-row-3';
import { innerBlocks as MultiRow4InnerBlocks, postMeta as MultiRow4PostMeta } from './templates/multi-row-4';
import { innerBlocks as MultiRow5InnerBlocks, postMeta as MultiRow5PostMeta } from './templates/multi-row-5';

// Off-Canvas templates
import { innerBlocks as OffCanvas1InnerBlocks, postMeta as OffCanvas1PostMeta } from './templates/off-canvas-1';
import { innerBlocks as OffCanvas2InnerBlocks, postMeta as OffCanvas2PostMeta } from './templates/off-canvas-2';
import { innerBlocks as OffCanvas3InnerBlocks, postMeta as OffCanvas3PostMeta } from './templates/off-canvas-3';
import { innerBlocks as OffCanvas4InnerBlocks, postMeta as OffCanvas4PostMeta } from './templates/off-canvas-4';

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
	} else if (key === 'off-canvas-1') {
		response.templatePostMeta = OffCanvas1PostMeta;
		response.templateInnerBlocks = OffCanvas1InnerBlocks();
	} else if (key === 'off-canvas-2') {
		response.templatePostMeta = OffCanvas2PostMeta;
		response.templateInnerBlocks = OffCanvas2InnerBlocks();
	} else if (key === 'off-canvas-3') {
		response.templatePostMeta = OffCanvas3PostMeta;
		response.templateInnerBlocks = OffCanvas3InnerBlocks();
	} else if (key === 'off-canvas-4') {
		response.templatePostMeta = OffCanvas4PostMeta;
		response.templateInnerBlocks = OffCanvas4InnerBlocks();
	}

	return response;
}
