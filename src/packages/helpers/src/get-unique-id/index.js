import { uniqueId } from 'lodash';

/**
 * Creates or keeps a uniqueId for a block depending on it's status.
 * requires the current block unique Id, client id, and the useSelect functions for isUniqueId and isUniqueBlock
 */
export default function getUniqueId( uniqueID, clientId, isUniqueID, isUniqueBlock, blockPostId = '' ) {
	const hasBlockPostIdPrefix = uniqueID && uniqueID.split('_').length === 2;
	const blockPostIdPrefix = blockPostId ? blockPostId + '_' : '';
	const smallID = blockPostIdPrefix + clientId.substr( 2, 9 );

	if ( ! uniqueID || ( hasBlockPostIdPrefix && uniqueID.split('_')[0] !== blockPostId.toString() ) ) {
		//new block
		if ( ! isUniqueID( smallID ) ) {
			return uniqueId( smallID );
		}
		return smallID;
	} else if ( ! isUniqueID( uniqueID ) && ( ! isUniqueBlock( uniqueID, clientId ) ) ) {
		// This checks if we are just switching views, client ID the same means we don't need to update.
		return smallID
	}
	//normal block loading
	return uniqueID;
}

/**
 * Creates or keeps a uniqueId for a block. After it's been created it will not check if it needs to regenerate
 * requires the current block unique Id, client id, and the useSelect functions for isUniqueId and isUniqueBlock
 * This was made in reaction to a bug in core where clientId's can be unstable inside an EntityProvider.
 * Because it doesn't check against the data store, it can conflict with other uniqueID's.
 * There should be a covering deduplication process when using this.
 */
export function getUniqueIdNoRegeneration ( uniqueID, clientId, isUniqueID, isUniqueBlock, blockPostId = '' ) {
	const hasBlockPostIdPrefix = uniqueID && uniqueID.split('_').length === 2;
	const blockPostIdPrefix = blockPostId ? blockPostId + '_' : '';
	const smallID = blockPostIdPrefix + clientId.substr( 2, 9 );

	if ( ! uniqueID || ( hasBlockPostIdPrefix && uniqueID.split('_')[0] !== blockPostId.toString() ) ) {
		//new block
		if ( ! isUniqueID( smallID ) ) {
			return uniqueId( smallID );
		}
		return smallID;
	}
	//normal block loading
	return uniqueID;
}
