/**
 * Attempt to get current post or widget ID.
 */
import { default as getPostOrWidgetId } from '../get-post-or-widget-id';
import { get, has } from 'lodash';
import { default as hashString } from '../hash-string';

export default function getPostOrFseId( props, parentPostData ) {

	const { postId, reusableParent, rootBlock, editedPostId } = parentPostData;
	const id = getPostOrWidgetId( props, postId, reusableParent, 0 );
	if ( id === 0 ) {
		// Try getting the FSE template slug.
		if ( get( rootBlock, 'name' ) === 'core/template-part' && has( rootBlock, [ 'attributes', 'slug' ] ) ) {
			return hashString( get( rootBlock, 'attributes.slug' ) ) % 1000000;
		} else if( editedPostId ) {
			return hashString( editedPostId ) % 1000000;
		}
	}

	return id;
}
