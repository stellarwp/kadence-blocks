/**
 * Attempt to get current post or widget ID.
 */
import { default as getPostOrWidgetId } from '../get-post-or-widget-id';
import { useSelect } from '@wordpress/data';
import { get, has } from 'lodash';
import { default as hashString } from '../hash-string';

export default function getPostIdOrFseSlug( props ) {

	const { clientId } = props;
	const postId = getPostOrWidgetId( props, 0 );

	if ( postId === 0 ) {

		// Try getting the FSE template slug.
		const { rootBlock, editedPostId } = useSelect(
			( select ) => {
				return {
					rootBlock: select( 'core/block-editor' ).getBlock( select( 'core/block-editor' ).getBlockHierarchyRootClientId( clientId ) ),
					editedPostId: select( 'core/edit-site' ).getEditedPostId()
				};
			},
			[ clientId ],
		);

		if ( get( rootBlock, 'name' ) === 'core/template-part' && has( rootBlock, [ 'attributes', 'slug' ] ) ) {
			let shortHash = hashString( rootBlock.attributes.slug ) % 1000000;
			console.log( 's' + shortHash );
			return 's' + shortHash;
		} else if( editedPostId ) {
			let shortHash = hashString( editedPostId ) % 1000000;
			console.log('t' + shortHash);
			return 't' + shortHash;
		}
	}

	return postId;
}
