/**
 * Attempt to get current post or widget ID. Will return the reusable block Post ID if called within a reusable block
 */
import { getWidgetIdFromBlock } from '@wordpress/widgets';
import { useSelect } from '@wordpress/data';
import { has } from 'lodash';

export default function getPostOrWidgetId( props, postId, reusableCheck, fallback = 'block-unknown' ) {

	// Reusable block ID
	if( has(reusableCheck, 'ref') ){
		return reusableCheck.ref;
	}

	// Post ID
	if ( postId ) {
		return postId;
	}

	// Widget ID
	if ( getWidgetIdFromBlock( props ) ) {
		return getWidgetIdFromBlock( props );
	}

	return fallback;
}
