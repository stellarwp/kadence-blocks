/**
 * External dependencies
 */
import { every } from 'lodash';

/**
 * WordPress dependencies
 */
import { createBlobURL } from '@wordpress/blob';
import { createBlock, getBlockAttributes } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { __ } from '@wordpress/i18n';

export function stripFirstImage( attributes, { shortcode } ) {
	const { body } = document.implementation.createHTMLDocument( '' );

	body.innerHTML = shortcode.content;

	let nodeToRemove = body.querySelector( 'img' );

	// if an image has parents, find the topmost node to remove
	while (
		nodeToRemove &&
		nodeToRemove.parentNode &&
		nodeToRemove.parentNode !== body
	) {
		nodeToRemove = nodeToRemove.parentNode;
	}

	if ( nodeToRemove ) {
		nodeToRemove.parentNode.removeChild( nodeToRemove );
	}

	return body.innerHTML.trim();
}


const transforms = {
	from: [
		{
			type: 'block',
			isMultiBlock: true,
			blocks: [ 'core/image' ],
			transform: ( attributes ) => {
				attributes = attributes[0];

				return createBlock( 'kadence/image', {
					id: attributes.id,
					url: attributes.url,
					alt: attributes.alt,
					caption: attributes.caption,
					align: attributes.align,
					sizeSlug: attributes.sizeSlug,
					width: attributes.width,
					height: attributes.height
				} );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: ['core/image'],
			transform: (attributes ) => {
				return createBlock('core/image', {
					id: attributes.id,
					url: attributes.url,
					alt: attributes.alt,
					caption: attributes.caption,
					align: attributes.align,
					sizeSlug: attributes.sizeSlug,
					width: attributes.width,
					height: attributes.height
				});
			},
		},
	],
};

export default transforms;
