import { createBlock } from '@wordpress/blocks';
import { get, has } from 'lodash';

// mega menu supporting templates
import {
	innerBlocks as FeaturesWithIconInnerBlocks,
	postMeta as FeaturesWithIconPostMeta,
} from './templates/features-with-icon';

export function buildTemplateFromSelection(selection) {
	return getDataFromKey(selection);
}

function getDataFromKey(key) {
	const response = {};

	if (key === 'features-with-icon') {
		response.templatePostMeta = FeaturesWithIconPostMeta;
		response.templateInnerBlocks = FeaturesWithIconInnerBlocks();
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
