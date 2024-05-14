/**
 * Template: Basic
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/navigation-link',
			{
				uniqueID: '6_2a7192-e1',
				label: 'About',
				url: 'About',
				kind: 'custom',
			},
			[
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_d35c95-0e',
						label: 'About',
						url: 'About',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_ec08d1-0c',
						label: 'Services',
						url: 'Services',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_93b3b4-83',
						label: 'Reviews',
						url: 'Reviews',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						uniqueID: '8_8966bc-24',
						label: 'Contact',
						url: 'Contact',
						kind: 'custom',
					},
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{ uniqueID: '8_2591cb-19', label: 'Blog', url: 'Blog', kind: 'custom' },
					[]
				),
			]
		),
	];
}

export { postMeta, innerBlocks };
