import { showMoreIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';
import deprecated from './deprecated';

registerBlockType('kadence/show-more', {
	...metadata,
	title: _x('Show More', 'block title', 'kadence-blocks'),
	description: _x('Hide content and enable a show more button to reveal', 'block description', 'kadence-blocks'),
	keywords: [__('show', 'kadence-blocks'), __('hide', 'kadence-blocks'), 'kb'],
	icon: {
		src: showMoreIcon,
	},
	transforms,
	edit,
	save,
	deprecated,
	example: {
		attributes: {},
		innerBlocks: [
			{
				name: 'kadence/column',
				innerBlocks: [
					{
						name: 'core/paragraph',
						attributes: {
							content: __(
								'This content will be partially hidden. Click the button below to reveal more.',
								'kadence-blocks'
							),
						},
					},
				],
			},
		],
	},
});
