/**
 * Template: Off Canvas 2
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
					uniqueID: '10_1315ba-84',
					label: 'Home',
					url: 'Home',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_b44133-ed',
					label: 'About',
					url: 'About',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_600339-a6',
					label: 'Services',
					url: 'Services',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_fd3763-03',
					label: 'Reviews',
					url: 'Reviews',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '10_2516a8-99', label: 'Contact', url: 'Contact', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
