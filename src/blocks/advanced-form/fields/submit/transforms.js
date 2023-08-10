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

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [
				'kadence/advanced-form-textarea',
				'kadence/advanced-form-telephone',
				'kadence/advanced-form-number'
			],
			transform: ( attributes ) => {
				return createBlock( 'kadence/advanced-form-text', attributes );
			},
		}
	],
	to: [
		{
			type: 'block',
			blocks: [ 'kadence/advanced-form-textarea' ],
			transform: ( attributes ) => {
				return createBlock( 'kadence/advanced-form-textarea', attributes );
			},
		},
		{
			type: 'block',
			blocks: [ 'kadence/advanced-form-telephone' ],
			transform: ( attributes ) => {
				return createBlock( 'kadence/advanced-form-telephone', attributes );
			},
		},
		{
			type: 'block',
			blocks: [ 'kadence/advanced-form-number' ],
			transform: ( attributes ) => {
				return createBlock( 'kadence/advanced-form-number', attributes );
			},
		},
	],
};

export default transforms;
