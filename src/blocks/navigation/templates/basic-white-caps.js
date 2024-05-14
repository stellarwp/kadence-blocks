/**
 * Template: Basic-white-caps
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
					uniqueID: '8_77d301-07',
					label: 'About',
					url: 'About',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_b26155-60',
					label: 'Reviews',
					url: 'Reviews',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_54a3fd-2e',
					label: 'Contact',
					url: 'Contact',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_8def91-5b',
					label: 'Sale',
					url: 'Sale',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_a61c45-3f', label: 'Clearance', url: 'Clearance', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
