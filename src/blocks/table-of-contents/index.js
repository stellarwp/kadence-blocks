import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import { tableOfContentsIcon } from '@kadence/icons';

/**
 * Import Css
 */
import './editor.scss';
import './style.scss';

export const settings = {
	edit,
	save() { return null; },
};

registerBlockType( 'kadence/tableofcontents', {
	...metadata,
	icon: {
		src: tableOfContentsIcon,
	},
	...settings,
} );
