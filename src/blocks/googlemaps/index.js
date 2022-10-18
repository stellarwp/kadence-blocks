import { googleMapsIcon } from '@kadence/icons';

import { registerBlockType } from '@wordpress/blocks';
import { __, _x } from '@wordpress/i18n';
/**
 * Internal dependencies
 */
import edit from './edit';
import metadata from './block.json';
import save from './save';
import transforms from './transforms';

registerBlockType('kadence/googlemaps', {
	...metadata,
	title: _x( 'Google Maps', 'block title', 'kadence-blocks' ),
	description: _x( 'Display google maps on your site', 'block description', 'kadence-blocks' ),
	keywords: [
		__( 'google', 'kadence-blocks' ),
		__( 'maps', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: googleMapsIcon,
	},
	getEditWrapperProps( attributes ) {
		return {
			'data-align': attributes.align,
		};
	},
	transforms,
	edit,
	save
});
