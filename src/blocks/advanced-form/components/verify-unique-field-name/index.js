function verifyUniqueFieldName( fields, uniqueID, name ) {
	if ( Array.isArray( fields ) && fields.length ) {
		// filter the fields to only include fields that have a name and are not the current field.
		fields = fields.filter( ( field ) => {
			if ( field?.name && uniqueID !== field.uniqueID ) {
				return true;
			}
			return false;
		} );
		var fieldNames = fields.filter( item => item.name === name && uniqueID !== item.uniqueID );
		return fieldNames;

		// var fieldNames = []
		// fields.forEach( ( field ) => {
		// 	if ( field?.name && uniqueID !== field.uniqueID ) {
		// 		fieldNames.push( field.name );
		// 	}
		// } );
		// if ( fieldNames.includes( name ) ) {
		// 	return false;
		// }

		// return true;
	}
	return [];
}

export default verifyUniqueFieldName;