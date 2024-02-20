/**
 * Early Gutenberg Blocks Filters
 *
 */
import {
	addFilter,
} from '@wordpress/hooks';
import { hasBlockSupport, getBlockSupport } from '@wordpress/blocks';
import { assign, get } from 'lodash';

/**
 * Add animation attributes
 *
 * @param {array} settings The block settings.
 * @returns {array} The block settings with animation added.
 */
export function blockMetadataAttribute( settings ) {

	if ( hasBlockSupport( settings, 'kbMetadata' ) ) {
		settings.attributes = assign( settings.attributes, {
			metadata: {
				type   : 'object',
				default: {
					name: '',
				},
			},
		} );

		// Don't override if already set (image block).
		if ( undefined === settings.__experimentalLabel ) {
			const contentLabel = getBlockSupport( settings, 'kbContentLabel' );

			settings.__experimentalLabel = ( attributes, { context } ) => {
				const { metadata } = attributes;

				// In the list view, use the block's content as the label.
				// If the content is empty, fall back to the default label.
				if ( context === 'list-view' && get( metadata, 'name', '' ) !== '' ) {
					return metadata.name;
				} else if ( undefined !== contentLabel && get( attributes, contentLabel ) !== '' ) {
					// Accordion pane block is stored as an array, doing this instead of deprecation on parent accordion.
					if( get( settings, 'name' ) === 'kadence/pane' && get( attributes, contentLabel ) instanceof Array ) {
						return convertArrayTitleToString( get( attributes, contentLabel ) );
					}

					return get( attributes, contentLabel );
				}
			};
		}
	}

	return settings;
}

function convertArrayTitleToString(arr) {
	let result = '';

	arr.forEach(item => {
		if (typeof item === 'string') {
			result += item;
		} else if (item.props && item.props.children) {
			result += convertArrayTitleToString(item.props.children);
		}
	});

	return result;
}

addFilter( 'blocks.registerBlockType', 'kadence/block-label', blockMetadataAttribute );
