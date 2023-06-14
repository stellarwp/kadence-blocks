import { uniqueId } from 'lodash';
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
export default function getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock ) {
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
    let smallID = '_' + clientId.substr( 2, 9 );
    if ( ! uniqueID ) {
        //new block
        if ( ! isUniqueID( smallID ) ) {
            smallID = uniqueId( smallID );
        }
        return smallID;
    } else if ( ! isUniqueID( uniqueID ) ) {
        // This checks if we are just switching views, client ID the same means we don't need to update.
        if ( ! isUniqueBlock( uniqueID, clientId ) ) {
            return smallID
        }
    }
    //normal block loading 
    return uniqueID;
}