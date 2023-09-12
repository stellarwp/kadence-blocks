import { fieldBlocks } from "../../constants";
import { uniqueId } from 'lodash';

function getFormFields( blocks ) {
	if ( Array.isArray( blocks ) && blocks.length ) {
		var fields = []
		blocks.forEach( ( block ) => {
			var innerFields = []
			if ( fieldBlocks.includes( block.name ) ) {
				fields.push( {
					uniqueID: block?.attributes?.uniqueID || '',
					clientId: block?.clientId || '',
				} );
			}

			if ( 'undefined' != typeof( block.innerBlocks ) && Array.isArray( block.innerBlocks ) && block.innerBlocks.length ) {
				innerFields = getFormFields( block.innerBlocks );
			}

			fields = [...fields, ...innerFields];
		} );

		return fields;
	}
}

function dedupeFormFieldUniqueIds( blocks, updateBlockAttributes ) {
	const currentFields = getFormFields( blocks );

	if ( Array.isArray( currentFields ) && currentFields.length ) {
		var fieldUniqueIDs = []
		currentFields.forEach( ( field ) => {
			var fieldUniqueID = field.uniqueID
			if ( fieldUniqueIDs.includes( fieldUniqueID ) ) {
				const smallID = field.clientId.substr( 2, 9 );
				fieldUniqueID = uniqueId( smallID );
				// set this blocks uniqueId attribute
				updateBlockAttributes(field.clientId, { uniqueID: fieldUniqueID } );
			}

			fieldUniqueIDs.push( fieldUniqueID );
		} );
	}
}


export default dedupeFormFieldUniqueIds;