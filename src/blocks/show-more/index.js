import itemicons from '../../icons';

const el = wp.element.createElement;
import { registerBlockType } from '@wordpress/blocks';
const { InnerBlocks } = wp.blockEditor;

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';
const { name } = metadata;

export { metadata, name };

export const settings = {
	transforms,
	edit: ( props ) => {
		return el( InnerBlocks, {
			template: [
				[ 'core/group', { innerBlocks: 'core/paragraph' } ],
				[ 'kadence/advancedbtn', { lock: { remove: true, move: true }, hAlign: 'left', btnCount: 1, btns: [ { text: 'Show More' } ] } ],
				[ 'core/group', {} ],
				[ 'kadence/advancedbtn', { lock: { remove: true, move: true }, hAlign: 'left', btnCount: 1, btns: [ { text: 'Show More' } ] } ]
			],
			templateLock: 'all',
		} );
	},
	save
	// save: ( props ) => {
	// 	return el( InnerBlocks.Content );
	// },
};

registerBlockType('kadence/show-more', {
	...metadata,
	icon: {
		src: itemicons.row,
	},
	...settings
});
