/**
 * BLOCK: Kadence Gallery
 */

/**
 * Import Icons
 */
import { galleryIcon } from '@kadence/icons';
/**
 * Import Css
 */
 import './style.scss';
/**
 * Import edit
 */
import edit from './edit';
import save from './save';
import deprecated from './deprecated';
import metadata from './block.json';

/**
 * Internal block libraries
 */
import { registerBlockType, createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { pickRelevantMediaFiles, pickRelevantMediaFilesCore, columnConvert } from './shared';
/**
 * Register: a Gutenberg Block.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType( 'kadence/advancedgallery', {
	...metadata,
	title: __( 'Advanced Gallery', 'kadence-blocks' ),
	description: __( 'Photo galleries, carousels, and sliders! Enable custom links, captions, and more.', 'kadence-blocks' ),
	keywords: [
		__( 'gallery', 'kadence-blocks' ),
		__( 'image', 'kadence-blocks' ),
		'KB',
	],
	icon: {
		src: galleryIcon,
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => {
					return createBlock( 'kadence/advancedgallery', {
						align: ( attributes.align ? attributes.align : 'none' ),
						columns: columnConvert( ( attributes.columns ? attributes.columns : 3 ) ),
						images: attributes.images ? attributes.images.map( ( image ) => pickRelevantMediaFiles( image, 'large', 'full' ) ) : [],
						linkTo: ( attributes.linkTo ? attributes.linkTo : 'none' ),
						ids: attributes.ids,
					} );
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => {
					return createBlock( 'core/gallery', {
						align: attributes.align,
						columns: attributes.columns[ 2 ],
						images: attributes.images.map( ( image ) => pickRelevantMediaFilesCore( image ) ),
						linkTo: attributes.linkTo,
						ids: attributes.ids,
					} );
				},
			},
		],
	},
	edit,
	save,
	deprecated,
	example: {
		attributes: {
			uniqueID: '123456789',
			columns: [ 2, 2, 2, 2, 1, 1 ],
			images: [
				{
					id: 1,
					url: "https://s.w.org/images/core/5.3/Glacial_lakes%2C_Bhutan.jpg",
					width: 594,
					height: 350
				},
				{
					id: 1,
					url: "https://s.w.org/images/core/5.3/Sediment_off_the_Yucatan_Peninsula.jpg",
					width: 594,
					height: 350
				},
			],
		}
	}
} );
