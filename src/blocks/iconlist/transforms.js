/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { get } from 'lodash';
import metadata from './block.json';

import {
	LINE_SEPARATOR,
	__UNSTABLE_LINE_SEPARATOR,
} from '@wordpress/rich-text';

const lineSep = LINE_SEPARATOR ? LINE_SEPARATOR : __UNSTABLE_LINE_SEPARATOR;

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/list' ],
			transform: ( attributes, innerBlocks ) => {

				const listItems = innerBlocks.map( ( listItem ) => {
					return createBlock( 'kadence/listitem', { text: listItem.attributes.content } );
				});

				return createBlock( 'kadence/iconlist', {
					listStyles: [ {
						...metadata['attributes']['listStyles']['default'][0],
						color: get( attributes, [ 'style', 'color', 'text' ], '' )
					}]
				}, listItems );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/list' ],
			transform: ( blockAttributes, innerBlocks ) => {

				const listItems = innerBlocks.map( ( listItem ) => {
					return createBlock( 'core/list-item', { content: listItem.attributes.text } );
				});

				return createBlock('core/list', {
						ordered: false,
						style: {
							color: {
								text: blockAttributes.listStyles[0].color,
							}
						}
					},
					listItems
				);
			},
		},
	],
};

export default transforms;
