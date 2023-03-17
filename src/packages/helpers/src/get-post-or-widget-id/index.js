/**
 * Attempt to get current post or widget ID. Will return the reusable block Post ID if called within a reusable block
 */
import { getWidgetIdFromBlock } from '@wordpress/widgets';
import { useSelect } from '@wordpress/data';
import { has } from 'lodash';

export default function getPostOrWidgetId( props, fallback = 'block-unknown' ) {
	const { clientId } = props;

	const { postId, reusableCheck } = useSelect(
		( select ) => {
			return {
				postId: select( 'core/editor' ).getCurrentPostId(),
				reusableCheck: select('core/block-editor').getBlockAttributes( select('core/block-editor').getBlockParentsByBlockName( clientId, 'core/block' ).slice(-1)[0] ),
			};
		},
		[ clientId ],
	);

	// Reusable block ID
	if( has(reusableCheck, 'ref') ){
		console.log('Reusable block ID: ' + reusableCheck.ref );
		return reusableCheck.ref;
	}

	// Post ID
	if ( postId ) {
		console.log('Post ID: ' + postId );
		return postId;
	}

	// Widget ID
	if ( getWidgetIdFromBlock( props ) ) {
		console.log('Widget ID: ' + getWidgetIdFromBlock( props ) );
		return getWidgetIdFromBlock( props );
	}

	return fallback;
}
