import { createBlock } from '@wordpress/blocks';
import { get, has } from 'lodash';

// Basic templates
import { innerBlocks as MegaBlankInnerBlocks, postMeta as MegaBlankPostMeta } from './templates/mega-blank';
import { innerBlocks as Mega1InnerBlocks, postMeta as Mega1PostMeta } from './templates/mega-1';
import { innerBlocks as Mega2InnerBlocks, postMeta as Mega2PostMeta } from './templates/mega-2';
import { innerBlocks as Mega3InnerBlocks, postMeta as Mega3PostMeta } from './templates/mega-3';

export function buildTemplateFromSelection(selection) {
	const data = getDataFromKey(selection);

	// const innerBlocks = getInnerBlocksFromOffset(data);

	return data;
}

function getInnerBlocksFromOffset({ templateInnerBlocks }, offset = 0) {
	return get(templateInnerBlocks, [0, 'innerBlocks', offset, 'innerBlocks'], []);
}

function getDataFromKey(key) {
	const response = {};

	if (key === 'mega-1') {
		response.templatePostMeta = Mega1PostMeta;
		response.templateInnerBlocks = Mega1InnerBlocks();
	} else if (key === 'mega-2') {
		response.templatePostMeta = Mega2PostMeta;
		response.templateInnerBlocks = Mega2InnerBlocks();
	} else if (key === 'mega-3') {
		response.templatePostMeta = Mega3PostMeta;
		response.templateInnerBlocks = Mega3InnerBlocks();
	} else {
		response.templatePostMeta = MegaBlankPostMeta;
		response.templateInnerBlocks = MegaBlankInnerBlocks();
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
