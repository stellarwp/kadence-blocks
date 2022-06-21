/**
 * WordPress dependencies
 */
 import { registerBlockType } from '@wordpress/blocks';
 import { __, _x } from '@wordpress/i18n';
/**
 * Import Icons
 */
 import { BlockColumnIcon } from '@kadence/icons';

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
	title: _x( 'Section', 'block title', 'kadence-blocks' ),
	description: _x( 'A container to style a section of content', 'block description', 'kadence-blocks' ),
	edit,
	save,
	deprecated,
};

registerBlockType( 'kadence/column', {
	...metadata,
	icon: {
		src: BlockColumnIcon,
	},
	...settings

});
 