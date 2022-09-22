/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { times } from 'lodash';

import {
	join,
	split,
	create,
	toHTMLString
} from '@wordpress/rich-text';

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
			transform: ( { values } ) => {
				const listArray = split( create( {
					html: values,
					multilineTag: 'li',
					multilineWrapperTags: [ 'ul', 'ol' ],
				} ), lineSep );
				const newitems = [ {
					icon: 'fe_checkCircle',
					link: '',
					target: '_self',
					size: 20,
					width: 2,
					text: toHTMLString( { value: listArray[ 0 ] } ),
					color: '',
					background: '',
					border: '',
					borderRadius: 0,
					padding: 5,
					borderWidth: 1,
					style: 'default',
					level: 0
				} ];
				const amount = Math.abs( listArray.length );
				{ times( amount, n => {
					if ( n !== 0 ) {
						newitems.push( {
							icon: 'fe_checkCircle',
							link: '',
							target: '_self',
							size: 20,
							width: 2,
							text: toHTMLString( { value: listArray[ n ] } ),
							color: '',
							background: '',
							border: '',
							borderRadius: 0,
							padding: 5,
							borderWidth: 1,
							style: 'default',
							level: 0
						} );
					}
				} ); }
				return createBlock( 'kadence/iconlist', {
					items: newitems,
					listCount: amount,
				} );
			},
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/list' ],
			transform: ( blockAttributes ) => {
				return createBlock( 'core/list', {
					values: toHTMLString( {
						value: join( blockAttributes.items.map( ( { text } ) => {
							return create( { html: text } );
						} ), lineSep ),
						multilineTag: 'li',
					} ),
				} );
			},
		},
	],
};

export default transforms;
