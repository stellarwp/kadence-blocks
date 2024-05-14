/**
 * Template: MR &#8211; top left
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock('kadence/navigation', {}, [
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_f8ae53-a7',
					label: 'Women',
					url: 'Business',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_dab446-b8',
					label: 'Men',
					url: 'Professional',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_cd1f69-1b', label: 'Kid', url: 'Commercial', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
