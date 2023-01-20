let listOfUnregisteredBlocks = kt_deregister_params.deregister;
// If we are recieving an object 
// let's convert it into an array 
if ( ! listOfUnregisteredBlocks.length ) {
	listOfUnregisteredBlocks =
		Object.keys( listOfUnregisteredBlocks ).map( key => listOfUnregisteredBlocks[ key ] );
}

// Just in case let's check if function exists
if ( typeof wp.blocks.unregisterBlockType !== 'undefined' ) {
	listOfUnregisteredBlocks.forEach( block => wp.blocks.unregisterBlockType( block ) );
}
