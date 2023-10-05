// Doesn't worry about if a filed is duplicated. Duplicated fields get a custom ID through the watch at the form level.
export default function getUniqueFieldId( uniqueID, clientId ) {

	const smallID = clientId.substr( 2, 9 );

	if ( ! uniqueID ) {
		// New block or pasted from one form block to another form block.
		return smallID;
	}
	// Normal block loading
	return uniqueID;
}