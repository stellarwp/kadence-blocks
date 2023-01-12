/**
 * BLOCK: Kadence Icon List
 */
/**
 * Register sub blocks.
 */
import '../listitem/block.js';

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
import { __ } from '@wordpress/i18n';

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
	title: __( 'Icon List', 'kadence-blocks' ),
	description: __( 'Create engaging lists with icons for bullets.', 'kadence-blocks' ),
	keywords: [
		__( 'icon', 'kadence-blocks' ),
		__( 'svg', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: iconListBlockIcon,
	},
	transforms,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'left' === blockAlignment || 'right' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	deprecated,
	edit,
	save,
} );
