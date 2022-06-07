/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */
import {
	createBlock,
} from '@wordpress/blocks';

const transforms = {
	from: [
		{
			type     : 'block',
			blocks   : [ 'core/spacer' ],
			transform: ( { height } ) => {
				return createBlock( 'kadence/spacer', {
					spacerHeight: height,
					divider     : false,
				} );
			},
		},
		{
			type     : 'block',
			blocks   : [ 'core/separator' ],
			transform: () => {
				return createBlock( 'kadence/spacer', {
					spacerHeight: 30,
					divider     : true,
				} );
			},
		},
	],
	to  : [
		{
			type     : 'block',
			blocks   : [ 'core/spacer' ],
			transform: ( { spacerHeight } ) => {
				return createBlock( 'core/spacer', {
					height: spacerHeight,
				} );
			},
		},
		{
			type     : 'block',
			blocks   : [ 'core/separator' ],
			transform: () => {
				return createBlock( 'core/separator' );
			},
		},
	],
};

export default transforms;
