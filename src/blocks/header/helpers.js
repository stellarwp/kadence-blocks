import { createBlock } from '@wordpress/blocks';
import { get, has } from 'lodash';

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

export function buildTemplateFromSelection(desktop, mobile) {
	// If it's an exact match to existing template, return that template
	if (desktop === mobile) {
		return getDataFromKey(desktop);
	}

	// If it's not an exact match, build the template from scratch
	const desktopData = getDataFromKey(desktop);
	const mobileData = getDataFromKey(mobile);

	const desktopInnerBlocks = getDesktopInnerBlocks(desktopData);
	const mobileInnerBlocks = getMobileInnerBlocks(mobileData);

	const postMeta = mergeDesktopAndMobilePostMeta(desktopData, mobileData);

	return {
		templateInnerBlocks: [
			createBlock('kadence/header', {}, [
				createBlock('kadence/header-container-desktop', { uniqueID: '8_eac20d-0e' }, desktopInnerBlocks),
				createBlock('kadence/header-container-tablet', { uniqueID: '8_eac20d-0e' }, mobileInnerBlocks),
				createBlock('kadence/off-canvas', { uniqueID: 'abc123' }),
			]),
		],
		templatePostMeta: postMeta,
	};
}

function mergeDesktopAndMobilePostMeta(desktopData, mobileData) {
	const desktop = desktopData.templatePostMeta;
	const mobile = mobileData.templatePostMeta;

	// Unset all the mobile/tablet values from Desktop
	for (const key in desktop) {
		if (
			desktop.hasOwnProperty(key) &&
			(key.includes('tablet') || key.includes('mobile') || key.includes('Tablet') || key.includes('Mobile'))
		) {
			delete desktop[key];
		}
	}

	let response = desktop;

	// _kad_header_height
	if (!has(response, '_kad_header_height') && has(mobile, '_kad_header_height')) {
		response._kad_header_height = ['', mobile._kad_header_height[1], mobile._kad_header_height[2]];
	} else if (has(response, '_kad_header_height') && has(mobile, '_kad_header_height')) {
		response._kad_header_height = [
			desktop._kad_header_height[0],
			mobile._kad_header_height[1],
			mobile._kad_header_height[2],
		];
	} else if (has(response, '_kad_header_height') && !has(mobile, '_kad_header_height')) {
		response._kad_header_height = [desktop._kad_header_height[0], '', ''];
	}

	// _kad_header_flex
	if (!has(response, '_kad_header_flex') && has(mobile, '_kad_header_flex')) {
		response._kad_header_flex = {
			direction: ['', mobile._kad_header_flex.direction[1], mobile._kad_header_flex.direction[2]],
			justifyContent: ['', mobile._kad_header_flex.justifyContent[1], mobile._kad_header_flex.justifyContent[2]],
			verticalAlignment: [
				'',
				mobile._kad_header_flex.verticalAlignment[1],
				mobile._kad_header_flex.verticalAlignment[2],
			],
		};
	} else if (has(response, '_kad_header_flex') && has(mobile, '_kad_header_flex')) {
		response._kad_header_flex = {
			direction: [
				desktop._kad_header_flex.direction[0],
				mobile._kad_header_flex.direction[1],
				mobile._kad_header_flex.direction[2],
			],
			justifyContent: [
				desktop._kad_header_flex.justifyContent[0],
				mobile._kad_header_flex.justifyContent[1],
				mobile._kad_header_flex.justifyContent[2],
			],
			verticalAlignment: [
				desktop._kad_header_flex.verticalAlignment[0],
				mobile._kad_header_flex.verticalAlignment[1],
				mobile._kad_header_flex.verticalAlignment[2],
			],
		};
	} else if (has(response, '_kad_header_flex') && !has(mobile, '_kad_header_flex')) {
		response._kad_header_flex = {
			direction: [desktop._kad_header_flex.direction[0], '', ''],
			justifyContent: [desktop._kad_header_flex.justifyContent[0], '', ''],
			verticalAlignment: [desktop._kad_header_flex.verticalAlignment[0], '', ''],
		};
	}

	// _kad_header_typography
	if (!has(response, '_kad_header_typography') && has(mobile, '_kad_header_typography')) {
		response._kad_header_typography = {
			color: '',
			size: ['', mobile._kad_header_typography.size[1], mobile._kad_header_typography.size[2]],
			sizeType: 'px',
			lineHeight: ['', mobile._kad_header_typography.lineHeight[1], mobile._kad_header_typography.lineHeight[2]],
			lineType: '',
			letterSpacing: [
				'',
				mobile._kad_header_typography.letterSpacing[1],
				mobile._kad_header_typography.letterSpacing[2],
			],
			letterType: 'px',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '400',
			variant: '',
			subset: '',
			loadGoogle: true,
		};
	} else if (has(response, '_kad_header_typography') && has(mobile, '_kad_header_typography')) {
		response._kad_header_typography = {
			color: '',
			size: [
				desktop._kad_header_typography.size[0],
				mobile._kad_header_typography.size[1],
				mobile._kad_header_typography.size[2],
			],
			sizeType: 'px',
			lineHeight: [
				desktop._kad_header_typography.lineHeight[0],
				mobile._kad_header_typography.lineHeight[1],
				mobile._kad_header_typography.lineHeight[2],
			],
			lineType: '',
			letterSpacing: [
				desktop._kad_header_typography.letterSpacing[0],
				mobile._kad_header_typography.letterSpacing[1],
				mobile._kad_header_typography.letterSpacing[2],
			],
			letterType: 'px',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '400',
			variant: '',
			subset: '',
			loadGoogle: true,
		};
	} else if (has(response, '_kad_header_typography') && !has(mobile, '_kad_header_typography')) {
		response._kad_header_typography = {
			color: '',
			size: [desktop._kad_header_typography.size[0], '', ''],
			sizeType: 'px',
			lineHeight: [desktop._kad_header_typography.lineHeight[0], '', ''],
			lineType: '',
			letterSpacing: [desktop._kad_header_typography.letterSpacing[0], '', ''],
			letterType: 'px',
			textTransform: '',
			family: '',
			google: false,
			style: '',
			weight: '400',
			variant: '',
			subset: '',
			loadGoogle: true,
		};
	}

	// unset mobile _kad_header_height
	if (has(mobile, '_kad_header_height')) {
		delete mobile._kad_header_height;
	}

	// unset mobile _kad_header_flex
	if (has(mobile, '_kad_header_flex')) {
		delete mobile._kad_header_flex;
	}

	// unset mobile _kad_header_typography
	if (has(mobile, '_kad_header_typography')) {
		delete mobile._kad_header_typography;
	}

	response = { ...response, ...mobile };

	return response;
}

function getDesktopInnerBlocks({ templateInnerBlocks }) {
	return get(templateInnerBlocks, [0, 'innerBlocks', 0, 'innerBlocks']);
}

function getMobileInnerBlocks({ templateInnerBlocks }) {
	return get(templateInnerBlocks, [0, 'innerBlocks', 1, 'innerBlocks']);
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
