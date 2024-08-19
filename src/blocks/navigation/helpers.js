import { createBlock } from '@wordpress/blocks';
import { get, has } from 'lodash';

// mega menu supporting templates
import { innerBlocks as Mega2Nav1InnerBlocks, postMeta as Mega2Nav1PostMeta } from './templates/mega-2-nav-1';
import { innerBlocks as Mega2Nav2InnerBlocks, postMeta as Mega2Nav2PostMeta } from './templates/mega-2-nav-2';

export function buildTemplateFromSelection(selection) {
	return getDataFromKey(selection);
}

function getDataFromKey(key) {
	const response = {};

	if (key === 'mega-2-nav-1') {
		response.templatePostMeta = Mega2Nav1PostMeta;
		response.templateInnerBlocks = Mega2Nav1InnerBlocks();
	} else if (key === 'mega-2-nav-2') {
		response.templatePostMeta = Mega2Nav2PostMeta;
		response.templateInnerBlocks = Mega2Nav2InnerBlocks();
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
