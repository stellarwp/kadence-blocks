const fieldBlocks = [ 'kadence/advanced-form-text', 'kadence/advanced-form-textarea', 'kadence/advanced-form-select', 'kadence/advanced-form-radio', 'kadence/advanced-form-file', 'kadence/advanced-form-time', 'kadence/advanced-form-date', 'kadence/advanced-form-telephone', 'kadence/advanced-form-checkbox', 'kadence/advanced-form-email', 'kadence/advanced-form-accept', 'kadence/advanced-form-number', 'kadence/advanced-form-hidden' ];
export default ( formInnerBlocks ) => {
	const fields = [];
	if ( Array.isArray( formInnerBlocks ) && formInnerBlocks.length ) {
		formInnerBlocks.forEach( ( block ) => {
			if ( fieldBlocks.includes( block.name ) ) {
				fields.push( {
					uniqueID: block?.attributes?.uniqueID || '',
					name: block?.attributes?.name || '',
					label: block?.attributes?.label || block?.name.replace( 'kadence/advanced-form-', ''),
					type: block?.name.replace( 'kadence/advanced-form-', '') || '',
				} );
			}
		} );
	}
	return fields;
}