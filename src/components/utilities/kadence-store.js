import {createReduxStore, register, createRegistrySelector, createRegistryControl} from '@wordpress/data';
import get from 'lodash/get';

const DEFAULT_STATE = {
	previewDevice: 'Desktop',
	uniqueIDs: {},
	uniquePanes: {},
};

const actions = {
	*setPreviewDeviceType( deviceType ) {
		const setForCore = yield {
			type: 'SET_PREVIEW_DEVICE_TYPE_FOR_CORE',
			deviceType,
		}
		if ( ! setForCore ) {
			return {
				type: 'SET_PREVIEW_DEVICE_TYPE',
				deviceType,
			};
		}
	},
	*toggleEditorPanelOpened( panelName, defaultValue ) {
		return {
			type: 'TOGGLE_EDITOR_PANEL_OPENED',
			panelName,
			defaultValue
		}
	},
	addUniqueID( uniqueID, clientID ) {
		return {
			type: 'ADD_UNIQUE_ID',
			uniqueID,
			clientID
		};
	},
	addUniquePane( uniqueID, clientID, rootID ) {
		return {
			type: 'ADD_UNIQUE_PANE',
			uniqueID,
			clientID,
			rootID
		};
	}
};

const controls = {
	'SET_PREVIEW_DEVICE_TYPE_FOR_CORE': createRegistryControl( ( registry ) => function( { deviceType } ) {
		const editPost = registry.dispatch( 'core/edit-post' );
		if ( editPost ) {
			editPost.__experimentalSetPreviewDeviceType( deviceType );

			return true;
		}

		const editSite = registry.dispatch( 'core/edit-site' );

		if ( editSite ) {
			editSite.__experimentalSetPreviewDeviceType( deviceType );

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
				Object.assign( updatedIDs, { [action.uniqueID]: action.clientID } );
				return {
					...state,
					uniqueIDs: updatedIDs,
				};
			case 'ADD_UNIQUE_PANE':
				const uniquePanes = state.uniquePanes;
				if ( uniquePanes.hasOwnProperty( action.rootID ) ) {
					Object.assign( uniquePanes[action.rootID], { [action.uniqueID.toString()]: action.clientID } );
				} else {
					uniquePanes[action.rootID] = {};
					Object.assign( uniquePanes[action.rootID], { [action.uniqueID.toString()]: action.clientID } );
				}
				return {
					...state,
					uniquePanes: uniquePanes,
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
		isUniqueID( state, uniqueID ) {
			const { uniqueIDs } = state;
			let isUniqueID = true;
			if ( uniqueIDs.hasOwnProperty( uniqueID ) ) {
				isUniqueID = false;
			}
			return isUniqueID;
		},
		isUniqueBlock( state, uniqueID, clientID ) {
			const { uniqueIDs } = state;
			let isUniqueBlock = false;
			if ( uniqueIDs.hasOwnProperty( uniqueID ) ) {
				// Compare clientID if they match then it just means we've switched to iframe view and so we don't need a new ID.
				if ( uniqueIDs[uniqueID] === clientID ) {
					isUniqueBlock = true;
				}
			}
			return isUniqueBlock;
		},
		isUniquePane( state, uniqueID, rootID ) {
			const { uniquePanes } = state;
			let isUniquePane = true;
			if ( uniquePanes.hasOwnProperty( rootID ) ) {
				if ( uniquePanes[rootID].hasOwnProperty( uniqueID.toString() ) ) {
					isUniquePane = false;
				}
			}
			return isUniquePane;
		},
		isUniquePaneBlock( state, uniqueID, clientID, rootID ) {
			const { uniquePanes } = state;
			let isUniquePaneBlock = false;
			if ( uniquePanes.hasOwnProperty( rootID ) ) {
				if ( uniquePanes[rootID].hasOwnProperty( uniqueID.toString() ) ) {
					// Compare clientID if they match then it just means we've switched to iframe view and so we don't need a new ID.
					if ( uniquePanes[rootID][uniqueID.toString()] === clientID ) {
						isUniquePaneBlock = true;
					}
				}
			}
			return isUniquePaneBlock;
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
