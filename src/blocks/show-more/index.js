import itemicons from '../../icons';

const el = wp.element.createElement;
import { registerBlockType } from '@wordpress/blocks';
const { InnerBlocks } = wp.blockEditor;
import uniqueId from 'lodash/uniqueId';

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
	edit,
	save
	// save: ( props ) => {
	// 	return el( InnerBlocks.Content );
	// },
};

registerBlockType('kadence/show-more', {
	...metadata,
	icon: {
		src: itemicons.showMore,
	},
	...settings
});
