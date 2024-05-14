/**
 * Template: Basic 3
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
					uniqueID: '10_dd5737-9c',
					label: 'About',
					url: 'About',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_bda065-6a',
					label: 'Services',
					url: 'Services',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_b64ad9-61',
					label: 'Reviews',
					url: 'Reviews',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '10_52bcf2-8a',
					label: 'Gallery',
					url: 'Gallery',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '10_71ab27-c4', label: 'Contact', url: 'Contact', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
