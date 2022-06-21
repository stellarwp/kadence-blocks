/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
/**
 * Import Icons
 */
import { blockRowIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';

/**
 * Import Css
 */
 import './style.scss';
 
/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import deprecated from './deprecated';
const { name } = metadata;

export { metadata, name };

export const settings = {
	edit,
	save,
	deprecated,
};

registerBlockType( 'kadence/rowlayout', {
	...metadata,
	icon: {
		src: blockRowIcon,
	},
	...settings

});
 