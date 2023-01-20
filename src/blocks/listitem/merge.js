/**
 * WordPress dependencies
 */
import { useRegistry, useDispatch, useSelect } from '@wordpress/data';
import { store as blockEditorStore } from '@wordpress/block-editor';


export default function useMerge( clientId, onMerge ) {
	const registry = useRegistry();
	const {
		getPreviousBlockClientId,
		getNextBlockClientId,
		getBlockOrder,
	} = useSelect( blockEditorStore );
	const { mergeBlocks, moveBlocksToPosition } =
		useDispatch( blockEditorStore );

	function getTrailingId( id ) {
		const order = getBlockOrder( id );

		if ( ! order.length ) {
			return id;
		}

		return getTrailingId( order[ order.length - 1 ] );
	}

	return ( forward ) => {
		if ( forward ) {
			const nextBlockClientId = getNextBlockClientId( clientId );

			if ( ! nextBlockClientId ) {
				onMerge( forward );
				return;
			}

			registry.batch( () => {
				moveBlocksToPosition(
					getBlockOrder( nextBlockClientId ),
					nextBlockClientId,
					getPreviousBlockClientId( nextBlockClientId )
				);
				mergeBlocks( clientId, nextBlockClientId );
			} );
		} else {
			// Merging is only done from the top level. For lowel levels, the
			// list item is outdented instead.
			const previousBlockClientId = getPreviousBlockClientId( clientId );
			if ( previousBlockClientId ) {
				const trailingId = getTrailingId( previousBlockClientId );
				registry.batch( () => {
					// moveBlocksToPosition(
					// 	getBlockOrder( clientId ),
					// 	clientId,
					// 	previousBlockClientId
					// );
					mergeBlocks( trailingId, clientId );
				} );
			} else {
				onMerge( forward );
			}
		}
	};
}