import { createReduxStore, register, createRegistrySelector, createRegistryControl } from '@wordpress/data';
import { get } from 'lodash';

const DEFAULT_STATE = {
	previewDevice: 'Desktop',
	uniqueIDs: {},
	uniquePanes: {},
	webFonts: {},
	imagePickerQuery: '',
	imagePickerSelection: 0,
	imagePickerMultiSelection: [],
	imagePickerResults: {},
	imagePickerDownloadedImages: [],
};

const actions = {
	*setPreviewDeviceType(deviceType) {
		const setForCore = yield {
			type: 'SET_PREVIEW_DEVICE_TYPE_FOR_CORE',
			deviceType,
		};
		if (!setForCore) {
			return {
				type: 'SET_PREVIEW_DEVICE_TYPE',
				deviceType,
			};
		}
	},
	*setHeaderVisualBuilderOpenId(clientId = null) {
		return {
			type: 'SET_OPEN_HEADER_VISUAL_BUILDER_ID',
			clientId,
		};
	},
	*setHeaderVisualBuilderSelectedId(clientId = null) {
		return {
			type: 'SET_SELECTED_HEADER_VISUAL_BUILDER_ID',
			clientId,
		};
	},
	*setHeaderVisualBuilderOpenPosition(position = 'bottom') {
		return {
			type: 'SET_OPEN_HEADER_VISUAL_BUILDER_POSITION',
			position,
		};
	},
	*setOffCanvasOpenId(clientId = null) {
		return {
			type: 'SET_OPEN_OFF_CANVAS_ID',
			clientId,
		};
	},
	*toggleEditorPanelOpened(panelName, defaultValue) {
		return {
			type: 'TOGGLE_EDITOR_PANEL_OPENED',
			panelName,
			defaultValue,
		};
	},
	*switchEditorTabOpened(tabName, key) {
		return {
			type: 'SWITCH_EDITOR_TAB_OPENED',
			tabName,
			key,
		};
	},
	addUniqueID(uniqueID, clientID) {
		return {
			type: 'ADD_UNIQUE_ID',
			uniqueID,
			clientID,
		};
	},
	addUniquePane(uniqueID, clientID, rootID) {
		return {
			type: 'ADD_UNIQUE_PANE',
			uniqueID,
			clientID,
			rootID,
		};
	},
	addWebFont(font, frame) {
		return {
			type: 'ADD_WEBFONT',
			font,
			frame,
		};
	},
	setImagePickerQuery(query) {
		return {
			type: 'SET_IMAGE_PICKER_QUERY',
			query,
		};
	},
	setImagePickerSelection(index) {
		return {
			type: 'SET_IMAGE_PICKER_SELECTION',
			index,
		};
	},
	setImagePickerMultiSelection(selection) {
		return {
			type: 'SET_IMAGE_PICKER_MULTI_SELECTION',
			selection,
		};
	},
	setImagePickerResults(results) {
		return {
			type: 'SET_IMAGE_PICKER_RESULTS',
			results,
		};
	},
	setImagePickerDownloadedImages(images) {
		return {
			type: 'SET_IMAGE_PICKER_DOWNLOADED_IMAGES',
			images,
		};
	},
};

const controls = {
	SET_PREVIEW_DEVICE_TYPE_FOR_CORE: createRegistryControl(
		(registry) =>
			function ({ deviceType }) {
				const editPost = registry.dispatch('core/edit-post');
				if (editPost) {
					editPost.__experimentalSetPreviewDeviceType(deviceType);

					return true;
				}

				const editSite = registry.dispatch('core/edit-site');

				if (editSite) {
					editSite.__experimentalSetPreviewDeviceType(deviceType);

					return true;
				}

				return false;
			}
	),
};

const getPreviewDeviceType = createRegistrySelector((select) => (state) => {
	const editor = select('core/editor');

	if (editor && editor?.getDeviceType) {
		return editor.getDeviceType();
	}

	//some backups for older versions or other unusual cases.
	const editPost = select('core/edit-post');

	if (editPost) {
		return editPost.__experimentalGetPreviewDeviceType();
	}

	const editSite = select('core/edit-site');

	if (editSite) {
		return editSite.__experimentalGetPreviewDeviceType();
	}

	return state.previewDevice;
});

const store = createReduxStore('kadenceblocks/data', {
	reducer(state = DEFAULT_STATE, action) {
		switch (action.type) {
			case 'SET_OPEN_HEADER_VISUAL_BUILDER_ID':
				return {
					...state,
					headerVisualBuilder: {
						...state.headerVisualBuilder,
						open: action.clientId,
					},
				};
			case 'SET_SELECTED_HEADER_VISUAL_BUILDER_ID':
				return {
					...state,
					headerVisualBuilder: {
						...state.headerVisualBuilder,
						selected: action.clientId,
					},
				};
			case 'SET_OPEN_HEADER_VISUAL_BUILDER_POSITION':
				return {
					...state,
					headerVisualBuilder: {
						...state.headerVisualBuilder,
						position: action.position,
					},
				};
			case 'SET_OPEN_OFF_CANVAS_ID':
				return {
					...state,
					offCanvas: {
						...state.offCanvas,
						open: action.clientId,
					},
				};
			case 'TOGGLE_EDITOR_PANEL_OPENED':
				const { panelName, defaultValue } = action;
				const isOpen =
					state[panelName] === true || get(state, ['editorPanels', panelName, 'opened'], defaultValue);
				return {
					...state,
					editorPanels: {
						...state.editorPanels,
						[panelName]: {
							...state[panelName],
							opened: !isOpen,
						},
					},
				};
			case 'SWITCH_EDITOR_TAB_OPENED':
				const { tabName, key } = action;

				return {
					...state,
					editorTabs: {
						...state.editorPanels,
						[tabName]: key,
					},
				};
			case 'SET_PREVIEW_DEVICE_TYPE':
				return {
					...state,
					previewDevice: action.deviceType,
				};
			case 'ADD_UNIQUE_ID':
				const updatedIDs = state.uniqueIDs;
				Object.assign(updatedIDs, { [action.uniqueID]: action.clientID });
				return {
					...state,
					uniqueIDs: updatedIDs,
				};
			case 'ADD_UNIQUE_PANE':
				const uniquePanes = state.uniquePanes;
				if (uniquePanes.hasOwnProperty(action.rootID)) {
					Object.assign(uniquePanes[action.rootID], { [action.uniqueID.toString()]: action.clientID });
				} else {
					uniquePanes[action.rootID] = {};
					Object.assign(uniquePanes[action.rootID], { [action.uniqueID.toString()]: action.clientID });
				}
				return {
					...state,
					uniquePanes,
				};
			case 'ADD_WEBFONT':
				const updatedFonts = state.webFonts;
				if (updatedFonts.hasOwnProperty(action.frame)) {
					Object.assign(updatedFonts[action.frame], { [action.font.toString()]: 'loaded' });
				} else {
					updatedFonts[action.frame] = {};
					Object.assign(updatedFonts[action.frame], { [action.font.toString()]: 'loaded' });
				}
				return {
					...state,
					webFonts: updatedFonts,
				};
			case 'SET_IMAGE_PICKER_QUERY':
				return {
					...state,
					imagePickerQuery: action.query,
				};
			case 'SET_IMAGE_PICKER_SELECTION':
				return {
					...state,
					imagePickerSelection: action.index,
				};
			case 'SET_IMAGE_PICKER_MULTI_SELECTION':
				return {
					...state,
					imagePickerMultiSelection: action.selection,
				};
			case 'SET_IMAGE_PICKER_RESULTS':
				return {
					...state,
					imagePickerResults: action.results,
				};
			case 'SET_IMAGE_PICKER_DOWNLOADED_IMAGES':
				return {
					...state,
					imagePickerDownloadedImages: action.images,
				};
			default:
				return state;
		}
	},
	actions,
	controls,
	selectors: {
		getPreviewDeviceType,
		getUniqueIDs(state) {
			const { uniqueIDs } = state;
			return uniqueIDs;
		},
		isUniqueID(state, uniqueID) {
			const { uniqueIDs } = state;
			let isUniqueID = true;
			if (uniqueIDs.hasOwnProperty(uniqueID)) {
				isUniqueID = false;
			}
			return isUniqueID;
		},
		isUniqueBlock(state, uniqueID, clientID) {
			const { uniqueIDs } = state;
			let isUniqueBlock = false;
			if (uniqueIDs.hasOwnProperty(uniqueID)) {
				// Compare clientID if they match then it just means we've switched to iframe view and so we don't need a new ID.
				if (uniqueIDs[uniqueID] === clientID) {
					isUniqueBlock = true;
				}
			}
			return isUniqueBlock;
		},
		isUniquePane(state, uniqueID, rootID) {
			const { uniquePanes } = state;
			let isUniquePane = true;
			if (uniquePanes.hasOwnProperty(rootID)) {
				if (uniquePanes[rootID].hasOwnProperty(uniqueID.toString())) {
					isUniquePane = false;
				}
			}
			return isUniquePane;
		},
		isUniquePaneBlock(state, uniqueID, clientID, rootID) {
			const { uniquePanes } = state;
			let isUniquePaneBlock = false;
			if (uniquePanes.hasOwnProperty(rootID)) {
				if (uniquePanes[rootID].hasOwnProperty(uniqueID.toString())) {
					// Compare clientID if they match then it just means we've switched to iframe view and so we don't need a new ID.
					if (uniquePanes[rootID][uniqueID.toString()] === clientID) {
						isUniquePaneBlock = true;
					}
				}
			}
			return isUniquePaneBlock;
		},
		isUniqueFont(state, font, frame) {
			const { webFonts } = state;
			let isUniqueFont = true;
			if (webFonts.hasOwnProperty(frame)) {
				if (webFonts[frame].hasOwnProperty(font.toString())) {
					isUniqueFont = false;
				}
			}
			return isUniqueFont;
		},
		getOpenHeaderVisualBuilderId(state) {
			return get(state, ['headerVisualBuilder', 'open'], null);
		},
		getSelectedHeaderVisualBuilderId(state) {
			return get(state, ['headerVisualBuilder', 'selected'], null);
		},
		getOpenHeaderVisualBuilderPosition(state) {
			return get(state, ['headerVisualBuilder', 'position'], 'bottom');
		},
		getOpenOffCanvasId(state) {
			return get(state, ['offCanvas', 'open'], null);
		},
		isEditorPanelOpened(state, panelName, defaultValue) {
			const panels = get(state, ['editorPanels'], {});
			return get(panels, [panelName]) === true || get(panels, [panelName, 'opened'], defaultValue) === true;
		},
		getOpenSidebarTabKey(state, panelName, defaultValue) {
			const panels = get(state, ['editorTabs'], {});
			return get(panels, [panelName], defaultValue);
		},
		getImagePickerQuery(state) {
			const { imagePickerQuery } = state;
			return imagePickerQuery;
		},
		getImagePickerSelection(state) {
			const { imagePickerSelection } = state;
			return imagePickerSelection;
		},
		getImagePickerMultiSelection(state) {
			const { imagePickerMultiSelection } = state;
			return imagePickerMultiSelection;
		},
		getImagePickerResults(state) {
			const { imagePickerResults } = state;
			return imagePickerResults;
		},
		getImagePickerDownloadedImages(state) {
			const { imagePickerDownloadedImages } = state;
			return imagePickerDownloadedImages;
		},
	},
});

register(store);
