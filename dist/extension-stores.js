/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/***/ ((module) => {

module.exports = window["lodash"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***************************************!*\
  !*** ./src/extension/stores/index.js ***!
  \***************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! lodash */ "lodash");
/* harmony import */ var lodash__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(lodash__WEBPACK_IMPORTED_MODULE_1__);


const DEFAULT_STATE = {
  previewDevice: 'Desktop',
  uniqueIDs: {},
  uniquePanes: {}
};
const actions = {
  *setPreviewDeviceType(deviceType) {
    const setForCore = yield {
      type: 'SET_PREVIEW_DEVICE_TYPE_FOR_CORE',
      deviceType
    };

    if (!setForCore) {
      return {
        type: 'SET_PREVIEW_DEVICE_TYPE',
        deviceType
      };
    }
  },

  *toggleEditorPanelOpened(panelName, defaultValue) {
    return {
      type: 'TOGGLE_EDITOR_PANEL_OPENED',
      panelName,
      defaultValue
    };
  },

  *switchEditorTabOpened(tabName, key) {
    return {
      type: 'SWITCH_EDITOR_TAB_OPENED',
      tabName,
      key
    };
  },

  addUniqueID(uniqueID, clientID) {
    return {
      type: 'ADD_UNIQUE_ID',
      uniqueID,
      clientID
    };
  },

  addUniquePane(uniqueID, clientID, rootID) {
    return {
      type: 'ADD_UNIQUE_PANE',
      uniqueID,
      clientID,
      rootID
    };
  }

};
const controls = {
  'SET_PREVIEW_DEVICE_TYPE_FOR_CORE': (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createRegistryControl)(registry => function (_ref) {
    let {
      deviceType
    } = _ref;
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
  })
};
const getPreviewDeviceType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createRegistrySelector)(select => state => {
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
const store = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.createReduxStore)('kadenceblocks/data', {
  reducer() {
    let state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_STATE;
    let action = arguments.length > 1 ? arguments[1] : undefined;

    switch (action.type) {
      case 'TOGGLE_EDITOR_PANEL_OPENED':
        const {
          panelName,
          defaultValue
        } = action;
        const isOpen = state[panelName] === true || (0,lodash__WEBPACK_IMPORTED_MODULE_1__.get)(state, ['editorPanels', panelName, 'opened'], defaultValue);
        return { ...state,
          'editorPanels': { ...state.editorPanels,
            [panelName]: { ...state[panelName],
              opened: !isOpen
            }
          }
        };

      case 'SWITCH_EDITOR_TAB_OPENED':
        const {
          tabName,
          key
        } = action;
        return { ...state,
          'editorTabs': { ...state.editorPanels,
            [tabName]: key
          }
        };

      case 'SET_PREVIEW_DEVICE_TYPE':
        return { ...state,
          previewDevice: action.deviceType
        };

      case 'ADD_UNIQUE_ID':
        const updatedIDs = state.uniqueIDs;
        Object.assign(updatedIDs, {
          [action.uniqueID]: action.clientID
        });
        return { ...state,
          uniqueIDs: updatedIDs
        };

      case 'ADD_UNIQUE_PANE':
        const uniquePanes = state.uniquePanes;

        if (uniquePanes.hasOwnProperty(action.rootID)) {
          Object.assign(uniquePanes[action.rootID], {
            [action.uniqueID.toString()]: action.clientID
          });
        } else {
          uniquePanes[action.rootID] = {};
          Object.assign(uniquePanes[action.rootID], {
            [action.uniqueID.toString()]: action.clientID
          });
        }

        return { ...state,
          uniquePanes: uniquePanes
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
      const {
        uniqueIDs
      } = state;
      return uniqueIDs;
    },

    isUniqueID(state, uniqueID) {
      const {
        uniqueIDs
      } = state;
      let isUniqueID = true;

      if (uniqueIDs.hasOwnProperty(uniqueID)) {
        isUniqueID = false;
      }

      return isUniqueID;
    },

    isUniqueBlock(state, uniqueID, clientID) {
      const {
        uniqueIDs
      } = state;
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
      const {
        uniquePanes
      } = state;
      let isUniquePane = true;

      if (uniquePanes.hasOwnProperty(rootID)) {
        if (uniquePanes[rootID].hasOwnProperty(uniqueID.toString())) {
          isUniquePane = false;
        }
      }

      return isUniquePane;
    },

    isUniquePaneBlock(state, uniqueID, clientID, rootID) {
      const {
        uniquePanes
      } = state;
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

    isEditorPanelOpened(state, panelName, defaultValue) {
      const panels = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.get)(state, ['editorPanels'], {});
      return (0,lodash__WEBPACK_IMPORTED_MODULE_1__.get)(panels, [panelName]) === true || (0,lodash__WEBPACK_IMPORTED_MODULE_1__.get)(panels, [panelName, 'opened'], defaultValue) === true;
    },

    getOpenSidebarTabKey(state, panelName, defaultValue) {
      const panels = (0,lodash__WEBPACK_IMPORTED_MODULE_1__.get)(state, ['editorTabs'], {});
      return (0,lodash__WEBPACK_IMPORTED_MODULE_1__.get)(panels, [panelName], defaultValue);
    }

  }
});
(0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.register)(store);
})();

(this.kadence = this.kadence || {})["extension-stores"] = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=extension-stores.js.map