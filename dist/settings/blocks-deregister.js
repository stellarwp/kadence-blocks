let listOfUnregisteredBlocks = kt_deregister_params.deregister;
let listOfUnregisteredPlugins = kt_deregister_params.dergisterplugins;

// If we are recieving an object 
// let's convert it into an array 
if ( ! listOfUnregisteredBlocks.length ) {
	listOfUnregisteredBlocks =
		Object.keys( listOfUnregisteredBlocks ).map( key => listOfUnregisteredBlocks[ key ] );
}
if ( ! listOfUnregisteredPlugins.length ) {
	listOfUnregisteredPlugins =
		Object.keys( listOfUnregisteredPlugins ).map( key => listOfUnregisteredPlugins[ key ] );
}

// Just in case let's check if function exists
if ( typeof wp.blocks.unregisterBlockType !== 'undefined' ) {
	listOfUnregisteredBlocks.forEach( block => wp.blocks.unregisterBlockType( block ) );
}
if ( typeof wp.plugins.unregisterPlugin !== 'undefined' ) {
	listOfUnregisteredPlugins.forEach( plugin => wp.plugins.unregisterPlugin( plugin ) );
}
