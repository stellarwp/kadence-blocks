/**
 * Template: Off Canvas 1
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/navigation-link',
			{
				uniqueID: '8_38f9fd-06',
				label: 'About',
				url: 'About',
				kind: 'custom',
			},
			[
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_38f9fd-06',
						label: 'About',
						url: 'About',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_a8c762-a8',
						label: 'Gallery',
						url: 'Gallery',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_e2f228-a4',
						label: 'Services',
						url: 'Services',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_4787c5-35',
						label: 'Reviews',
						url: 'Reviews',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{ uniqueID: '8_5b0739-dd', label: 'Contact', url: 'Contact', kind: 'custom' },
					[]
				),
			]
		),
	];
}

export { postMeta, innerBlocks };
