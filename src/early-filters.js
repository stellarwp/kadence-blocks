/**
 * Early Gutenberg Blocks Filters
 *
 */
import {
	addFilter,
} from '@wordpress/hooks';
import { hasBlockSupport } from '@wordpress/blocks';
import { assign } from 'lodash';

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
				type: 'object',
				default: {
					name: ''
				}
			}
		} );
	}

	return settings;
}
addFilter( 'blocks.registerBlockType', 'kadence/block-name', blockMetadataAttribute );
