import { uniqueId, has } from 'lodash';
/**
 * Import WordPress Internals
 */
import { useSelect, useDispatch } from '@wordpress/data';
// import {
// 	store as blockEditorStore,
// } from '@wordpress/block-editor';
/**
 * Creates or keeps a uniqueId for a block depending on it's status.
 * requires the current block unique Id, client id, and the useSelect functions for isUniqueId and isUniqueBlock
 */
export default function getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock, postId = 0, inReusableBlock = null ) {
    // const { addUniqueID } = useDispatch( 'kadenceblocks/data' );
    // const { inReusableBlock } = useSelect(
	// 	( select ) => {
	// 		const { getBlockParentsByBlockName } = select( blockEditorStore );
	// 		const reusableBlocks = getBlockParentsByBlockName( clientId, ['core/block', 'kadence/advanced-form'] );
	// 		let inReusableBlock = false;
	// 		if ( reusableBlocks && reusableBlocks.length && inReusableBlock?.[0] ) {
	// 			inReusableBlock = reusableBlocks[0];
	// 		}
	// 		return {
	// 			inReusableBlock: inReusableBlock,
	// 		};
	// 	},
	// 	[ clientId ]
	// );
	if( has( inReusableBlock, 'ref' ) ){
		postId = inReusableBlock.ref;
    } else if( postId === null ){
		postId = 0;
	}

	const smallID = postId + '_' + clientId.substr( 2, 9 );
	const hasPostIdPrefix = uniqueID && uniqueID.split('_').length === 2;

    if ( ! uniqueID || !hasPostIdPrefix || ( hasPostIdPrefix && uniqueID.split('_')[0] !== postId.toString() ) ) {
        //new block
        if ( ! isUniqueID( smallID ) ) {
            return postId + '_' + uniqueId( smallID );
        }
        return smallID;
    } else if ( ! isUniqueID( uniqueID ) && ! isUniqueBlock( uniqueID, clientId ) ) {
        // This checks if we are just switching views, client ID the same means we don't need to update.
		return smallID
    }
    //normal block loading
    return uniqueID;
}
