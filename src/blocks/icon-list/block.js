/**
 * BLOCK: Kadence Icon List
 */

import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import metadata from './block.json';

/**
 * Import Icon stuff
 */
import { iconListBlockIcon } from '@kadence/icons';
import { times } from 'lodash';
import { KadenceColorOutput } from '@kadence/helpers';
import { IconRender, IconSpanTag } from '@kadence/components';


/**
 * Import Css
 */
 import './style.scss';

/**
 * Internal block libraries
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/iconlist', {
	...metadata,
	icon: {
		src: iconListBlockIcon,
	},
	transforms,
	edit,
	save,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	deprecated,
	edit,
	save,
} );
