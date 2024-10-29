/**
 * Attempt to get current post or widget ID. Will return the reusable block Post ID if called within a reusable block
 */
import { getWidgetIdFromBlock } from '@wordpress/widgets';
import { has } from 'lodash';

export default function getPostOrWidgetId( props, postId, reusableParent, fallback = 'block-unknown' ) {

	// Reusable block ID
	if( has(reusableParent, 'ref') ){
		return reusableParent.ref;
	}
	// AB testing block ID
	if( has(reusableParent, 'id') ){
		return reusableParent.id;
	}

	// Post ID
	if ( postId ) {
		postId = typeof postId === 'string' ? postId.replace(/\//g, '_' ) : postId;
		return postId;
	}

	// Widget ID
	if ( getWidgetIdFromBlock( props ) ) {
		return getWidgetIdFromBlock( props );
	}

	return fallback;
}
