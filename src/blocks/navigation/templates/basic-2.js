/**
 * Template: Basic 2
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
					uniqueID: '8_79d085-5e',
					label: 'Oil Change',
					url: 'Oil%20Change',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_5bc1d5-de',
					label: 'Tire Rotation',
					url: 'Tire%20Rotation',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{
					uniqueID: '8_11d12f-c0',
					label: 'Air Filter',
					url: 'Air%20Filter',
					kind: 'custom',
				},
				[]
			),
			createBlock(
				'kadence/navigation-link',
				{ uniqueID: '8_04be2f-5c', label: 'Coolant Refill', url: 'Coolant%20Refill', kind: 'custom' },
				[]
			),
		]),
	];
}

export { postMeta, innerBlocks };
