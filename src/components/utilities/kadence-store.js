import { createReduxStore, register, createRegistrySelector, controls } from '@wordpress/data';
const DEFAULT_STATE = {
    previewDevice: 'Desktop',
};
 
const actions = {
	setDevice( device ) {
		return {
			type: 'SET_DEVICE',
			device,
		};
	},
};
const getDevice = createRegistrySelector( ( select ) => ( state ) => {
	if ( select( 'core/edit-post' ) ) {
		return select( 'core/edit-post' ).__experimentalGetPreviewDeviceType();
	} else if ( select( 'core/edit-site' ) ) {
		return select( 'core/edit-site' ).__experimentalGetPreviewDeviceType();
	}
	return state.previewDevice;
} );
 
const store = createReduxStore( 'kadenceblocks/data', {
    reducer( state = DEFAULT_STATE, action ) {
        switch ( action.type ) {
            case 'SET_DEVICE':
				return {
					...state,
					previewDevice: action.device,
				};
        }
 
        return state;
    },
 
    actions,
 
    selectors: {
		getDevice,
    },
   	controls: {
		
	},
 
    resolvers: {
    },
} );
 
register( store );