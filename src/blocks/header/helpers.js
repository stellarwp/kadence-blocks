import { createBlock } from '@wordpress/blocks';
import { get, has } from 'lodash';

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

// Mobile templates
import { innerBlocks as Mobile1InnerBlocks, postMeta as Mobile1PostMeta } from './templates/mobile-1';
import { innerBlocks as Mobile2InnerBlocks, postMeta as Mobile2PostMeta } from './templates/mobile-2';
import { innerBlocks as Mobile3InnerBlocks, postMeta as Mobile3PostMeta } from './templates/mobile-3';
import { innerBlocks as Mobile4InnerBlocks, postMeta as Mobile4PostMeta } from './templates/mobile-4';

export function buildTemplateFromSelection(desktop, mobile) {
	// If it's an exact match to existing template, return that template
	if (desktop === mobile) {
		return getDataFromKey(desktop);
	}

	// If it's not an exact match, build the template from scratch
	const desktopData = getDataFromKey(desktop);
	const mobileData = getDataFromKey(mobile);

	const desktopInnerBlocks = getInnerBlocksFromOffset(desktopData);
	const mobileInnerBlocks = getInnerBlocksFromOffset(mobileData, 1);
	const offCanvasInnerBlocks = getInnerBlocksFromOffset(mobileData, 2);

	const postMeta = mergeDesktopAndMobilePostMeta(desktopData, mobileData);

	return {
		templateInnerBlocks: [
			createBlock('kadence/header', {}, [
				createBlock('kadence/header-container-desktop', { uniqueID: '8_eac20d-0e' }, desktopInnerBlocks),
				createBlock('kadence/header-container-tablet', { uniqueID: '8_eac20d-1e' }, mobileInnerBlocks),
				createBlock('kadence/off-canvas', { uniqueID: '8_eac20d-2e' }, offCanvasInnerBlocks),
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

function getInnerBlocksFromOffset({ templateInnerBlocks }, offset = 0) {
	return get(templateInnerBlocks, [0, 'innerBlocks', offset, 'innerBlocks'], []);
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
		response.templatePostMeta = Basic4PostMeta;
		response.templateInnerBlocks = Basic4InnerBlocks();
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
	} else if (key === 'mobile-1') {
		response.templatePostMeta = Mobile1PostMeta;
		response.templateInnerBlocks = Mobile1InnerBlocks();
	} else if (key === 'mobile-2') {
		response.templatePostMeta = Mobile2PostMeta;
		response.templateInnerBlocks = Mobile2InnerBlocks();
	} else if (key === 'mobile-3') {
		response.templatePostMeta = Mobile3PostMeta;
		response.templateInnerBlocks = Mobile3InnerBlocks();
	} else if (key === 'mobile-4') {
		response.templatePostMeta = Mobile4PostMeta;
		response.templateInnerBlocks = Mobile4InnerBlocks();
	}

	// Replace placeholder relative URL with absolute URL
	if (response.templateInnerBlocks) {
		response.templateInnerBlocks = replaceInAttributes(
			response.templateInnerBlocks,
			'/wp-content/plugins/kadence-blocks/includes/assets/images/placeholder/',
			kadence_blocks_params.kadenceBlocksUrl + '/includes/assets/images/placeholder/'
		);
	}

	return response;
}

function replaceInAttributes(obj, searchValue, replaceValue) {
	// Check if the input is an array
	if (Array.isArray(obj)) {
		// Loop through each item in the array
		obj.forEach((item, index) => {
			obj[index] = replaceInAttributes(item, searchValue, replaceValue);
		});
	} else if (typeof obj === 'object' && obj !== null) {
		// Loop through each key in the object
		for (const key in obj) {
			if (typeof obj[key] === 'string') {
				// If the value is a string, replace the substring
				obj[key] = obj[key].replace(searchValue, replaceValue);
			} else {
				// If the value is an object or array, call the function recursively
				obj[key] = replaceInAttributes(obj[key], searchValue, replaceValue);
			}
		}
	}
	// Return the modified object
	return obj;
}
