import {createReduxStore, register, createRegistrySelector, createRegistryControl} from '@wordpress/data';
import get from 'lodash/get';

const DEFAULT_STATE = {
	previewDevice: 'Desktop',
	uniqueIDs: [],
};

const actions = {
	*setPreviewDeviceType( deviceType ) {
		const setForCore = yield {
			type: 'SET_PREVIEW_DEVICE_TYPE_FOR_CORE',
			deviceType,
		}

		if ( !setForCore ) {
			return {
				type: 'SET_PREVIEW_DEVICE_TYPE',
				deviceType,
			};
		}
	},
	*toggleEditorPanelOpened ( panelName, defaultValue ) {
		return {
			type: 'TOGGLE_EDITOR_PANEL_OPENED',
			panelName,
			defaultValue
		}
	},
	addUniqueID( uniqueID ) {
		return {
			type: 'ADD_UNIQUE_ID',
			uniqueID,
		};
	}
};

const controls = {
	'SET_PREVIEW_DEVICE_TYPE_FOR_CORE': createRegistryControl( ( registry ) => function *setPreviewDeviceTypeForCore( { deviceType } ) {
		const editPost = registry.dispatch( 'core/edit-post' );

		if ( editPost ) {
			yield editPost.__experimentalSetPreviewDeviceType( deviceType );

			return true;
		}

		const editSite = registry.dispatch( 'core/edit-site' );

		if ( editSite ) {
			yield editSite.__experimentalSetPreviewDeviceType( deviceType );

			return true;
		}

		return false;
	} ),
};

const getPreviewDeviceType = createRegistrySelector( ( select ) => ( state ) => {
	const editPost = select( 'core/edit-post' );

	if ( editPost ) {
		return editPost.__experimentalGetPreviewDeviceType();
	}

	const editSite = select( 'core/edit-site' );

	if ( editSite ) {
		return editSite.__experimentalGetPreviewDeviceType();
	}

	return state.previewDevice;
} );

const store = createReduxStore( 'kadenceblocks/data', {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case 'TOGGLE_EDITOR_PANEL_OPENED':
				const { panelName, defaultValue } = action;
				const isOpen =
					state[ panelName ] === true ||
					get( state, [ 'editorPanels', panelName, 'opened' ], defaultValue );
				return {
					...state,
					'editorPanels': {
						...state.editorPanels,
						[panelName]: {
							...state[panelName],
							opened: !isOpen,
						}
					}
				};
			case 'SET_PREVIEW_DEVICE_TYPE':
				return {
					...state,
					previewDevice: action.deviceType,
				};
			case 'ADD_UNIQUE_ID':
				const updatedIDs = state.uniqueIDs;
				updatedIDs.push( action.uniqueID );
				return {
					...state,
					uniqueIDs: updatedIDs,
				};
			default:
				return state;
		}
	},
	actions,
	controls,
	selectors: {
		getPreviewDeviceType,
		getUniqueIDs( state ) {
			const { uniqueIDs } = state;
			return uniqueIDs;
		},
		isEditorPanelOpened( state, panelName, defaultValue ) {
			const panels = get( state, ['editorPanels'], {} );

			return (
				get( panels, [ panelName ] ) === true || get( panels, [ panelName, 'opened' ], defaultValue ) === true
			);
		},
	},
} );

register( store );
