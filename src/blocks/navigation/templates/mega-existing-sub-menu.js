/**
 * Template: Features with icon
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {
	_kad_navigation_orientation: 'vertical',
};

function innerBlocks(uniqueID, getStash) {
	const existingSubMenuInnerBlocks = getStash(uniqueID);
	return [createBlock('kadence/navigation', {}, existingSubMenuInnerBlocks)];
}

export { postMeta, innerBlocks };
