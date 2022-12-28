import { uniqueId } from 'lodash';

export default function getUniqueId( uniqueID, clientId, isUniqueID ) {
    /* global kadence_blocks_params */
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
    } else {
        //normal block loading
        return uniqueID;
    }
}