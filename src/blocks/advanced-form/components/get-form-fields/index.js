import { select } from '@wordpress/data';

export default ( parentClientId ) => {
	const fields = [];

	const innerFields = select("core/editor").getBlocksByClientId( parentClientId )[0].innerBlocks;

	innerFields.forEach( ( block ) => {
		fields.push( block.attributes );
	} );

	return fields;
}
