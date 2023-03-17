/**
 * Attempt to get current post or widget ID.
 */
import { default as getPostOrWidgetId } from '../get-post-or-widget-id';
import { useSelect } from '@wordpress/data';
import { get, has } from 'lodash';

export default function getPostIdOrFseSlug( props ) {

	const { clientId } = props;
	const postId = getPostOrWidgetId( props, 0 );

	if ( postId === 0 ) {

		// Try getting the FSE template slug.
		const { rootBlock } = useSelect(
			( select ) => {
				return {
					rootBlock: select( 'core/block-editor' ).getBlock( select( 'core/block-editor' ).getBlockHierarchyRootClientId( clientId ) ),
				};
			},
			[ clientId ],
		);

		if ( get( rootBlock, 'name' ) === 'core/template-part' && has( rootBlock, [ 'attributes', 'slug' ] ) ) {
			console.log('FSE ID: ' + 'fse-' + rootBlock.attributes.slug);
			return 'fse' + rootBlock.attributes.slug;
		}
	}

	return postId;
}
