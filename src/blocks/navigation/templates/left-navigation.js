/**
 * Template: Left Navigation
 * Post Type: kadence_navigation
 */

import { createBlock } from '@wordpress/blocks';

const postMeta = {};

function innerBlocks() {
	return [
		createBlock(
			'kadence/navigation-link',
			{
				uniqueID: '6_9da541-0d',
				label: 'About',
				url: 'About',
				kind: 'custom',
			},
			[
				createBlock(
					'kadence/navigation-link',
					{ uniqueID: '6_9da541-0d', label: 'About', url: 'About', kind: 'custom' },
					[]
				),
				createBlock(
					'kadence/navigation-link',
					{
						label: 'Services',
						url: 'Services',
					},
					[]
				),
				createBlock('kadence/navigation-link', { label: 'Resources', url: 'Resources' }, []),
			]
		),
	];
}

export { postMeta, innerBlocks };
