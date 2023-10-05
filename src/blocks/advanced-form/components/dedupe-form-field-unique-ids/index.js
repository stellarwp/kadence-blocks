import { fieldBlocks } from "../../constants";
import { getUniqueFieldId } from "../../components";

function getFormFields( blocks ) {
	if ( Array.isArray( blocks ) && blocks.length ) {
		var fields = []
		blocks.forEach( ( block ) => {
			var innerFields = []
			if ( fieldBlocks.includes( block.name ) ) {
				fields.push( {
					uniqueID: block?.attributes?.uniqueID || '',
					formID:  block?.attributes?.formID || '',
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

function dedupeFormFieldUniqueIds( blocks, updateBlockAttributes, formBlockID ) {
	const currentFields = getFormFields( blocks );
	const formIDString = formBlockID.toString();

	if ( Array.isArray( currentFields ) && currentFields.length ) {
		const fieldUniqueIDs = []
		currentFields.forEach( ( field ) => {
			let fieldUniqueID = field.uniqueID
			let fieldFormID = field.formID;
			let updateField = false;
			if ( fieldUniqueIDs.includes( fieldUniqueID ) ) {
				fieldUniqueID = getUniqueFieldId( '', field.clientId );
				// set this blocks uniqueId attribute
				updateField = true;
			}
			if ( formIDString !== fieldFormID ) {
				fieldFormID = formIDString;
				updateField = true;
			}
			if ( updateField ) {
				updateBlockAttributes( field.clientId, { uniqueID: fieldUniqueID, formID: fieldFormID } );
			}

			fieldUniqueIDs.push( fieldUniqueID );
		} );
	}
}


export default dedupeFormFieldUniqueIds;