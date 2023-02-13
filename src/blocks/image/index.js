/**
 * WordPress dependencies
 */
import { __, _x } from '@wordpress/i18n';
import { imageIcon } from '@kadence/icons';

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
import transforms from './transforms';
import deprecated from './deprecated';
const { name } = metadata;

export { metadata, name };

export const settings = {
	title: _x( 'Advanced Image', 'block title', 'kadence-blocks' ),
	description: _x( 'Image block with greater controls and advanced features', 'block description', 'kadence-blocks' ),
	icon: {
		src: imageIcon,
	},
	example: {
		attributes: {
			sizeSlug: 'large',
			url: 'https://s.w.org/images/core/5.3/MtBlanc1.jpg',
			// translators: Caption accompanying an image of the Mont Blanc, which serves as an example for the Image block.
			caption: __( 'Mont Blanc appears—still, snowy, and serene.', 'kadence-blocks' ),
		},
	},
	__experimentalLabel( attributes, { context } ) {
		if ( context === 'accessibility' ) {
			const { caption, alt, url } = attributes;

			if ( ! url ) {
				return __( 'Empty' );
			}

			if ( ! alt ) {
				return caption || '';
			}

			// This is intended to be read by a screen reader.
			// A period simply means a pause, no need to translate it.
			return alt + ( caption ? '. ' + caption : '' );
		}
	},
	getEditWrapperProps( attributes ) {
		if ( 'wide' === attributes.align || 'full' === attributes.align || 'left' === attributes.align || 'right' === attributes.align ) {
			return {
				'data-align': attributes.align,
			};
		}
		return;
	},
	transforms,
	edit,
	save,
	deprecated,
};

registerBlockType( metadata,
	{ 
		...metadata,
		...settings
	}
);
