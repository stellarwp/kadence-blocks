(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.KadenceAccordion = factory());
}(this, (function () { 'use strict';

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
(function () {

  if ( typeof window.CustomEvent === "function" ) return false;

  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;

  window.CustomEvent = CustomEvent;
})();

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

if (!Array.from) {
  Array.from = function () {
    var toStr = Object.prototype.toString;

    var isCallable = function isCallable(fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };

    var toInteger = function toInteger(value) {
      var number = Number(value);

      if (isNaN(number)) {
        return 0;
      }

      if (number === 0 || !isFinite(number)) {
        return number;
      }

      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };

    var maxSafeInteger = Math.pow(2, 53) - 1;

    var toLength = function toLength(value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    }; // The length property of the from method is 1.


    return function from(arrayLike
    /* , mapFn, thisArg */
    ) {
      // 1. Let C be the this value.
      var C = this; // 2. Let items be ToObject(arrayLike).

      var items = Object(arrayLike); // 3. ReturnIfAbrupt(items).

      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      } // 4. If mapfn is undefined, then let mapping be false.


      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;

      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        } // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.


        if (arguments.length > 2) {
          T = arguments[2];
        }
      } // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).


      var len = toLength(items.length); // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).

      var A = isCallable(C) ? Object(new C(len)) : new Array(len); // 16. Let k be 0.

      var k = 0; // 17. Repeat, while k < len… (also steps a - h)

      var kValue;

      while (k < len) {
        kValue = items[k];

        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }

        k += 1;
      } // 18. Let putStatus be Put(A, "length", len, true).


      A.length = len; // 20. Return A.

      return A;
    };
  }();
}

/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
*/

/* eslint-disable no-unused-vars */
(function (document, window) {
  var el = document.body || document.documentElement,
      s = el.style,
      prefixAnimation = '',
      prefixTransition = '';
  if (s.WebkitAnimation == '') prefixAnimation = '-webkit-';
  if (s.MozAnimation == '') prefixAnimation = '-moz-';
  if (s.OAnimation == '') prefixAnimation = '-o-';
  if (s.WebkitTransition == '') prefixTransition = '-webkit-';
  if (s.MozTransition == '') prefixTransition = '-moz-';
  if (s.OTransition == '') prefixTransition = '-o-';
  Object.defineProperty(Object.prototype, 'onCSSAnimationEnd', {
    value: function value(callback) {
      var runOnce = function runOnce(e) {
        callback();
        e.target.removeEventListener(e.type, runOnce);
      };

      this.addEventListener('webkitAnimationEnd', runOnce);
      this.addEventListener('mozAnimationEnd', runOnce);
      this.addEventListener('oAnimationEnd', runOnce);
      this.addEventListener('oanimationend', runOnce);
      this.addEventListener('animationend', runOnce);
      if (prefixAnimation == '' && !('animation' in s) || getComputedStyle(this)[prefixAnimation + 'animation-duration'] == '0s') callback();
      return this;
    },
    enumerable: false,
    writable: true
  });
  Object.defineProperty(Object.prototype, 'onCSSTransitionEnd', {
    value: function value(callback) {
      var runOnce = function runOnce(e) {
        callback();
        e.target.removeEventListener(e.type, runOnce);
      };

      this.addEventListener('webkitTransitionEnd', runOnce);
      this.addEventListener('mozTransitionEnd', runOnce);
      this.addEventListener('oTransitionEnd', runOnce);
      this.addEventListener('transitionend', runOnce);
      this.addEventListener('transitionend', runOnce);
      if (prefixTransition == '' && !('transition' in s) || getComputedStyle(this)[prefixTransition + 'transition-duration'] == '0s') callback();
      return this;
    },
    enumerable: false,
    writable: true
  });
})(document, window, 0);

/**
 *  ACCORDION
 * Based from Badger Accordion
 * A lightwight vanilla JS accordion with an exstensible API
 */
// import uuid from 'uuid/v4';
// const uuidV4 = uuid;

/* eslint-disable no-unused-vars */
/**
 * CONSTRUCTOR
 * Initializes the object
 */

var KadenceAccordion =
/*#__PURE__*/
function () {
  function KadenceAccordion(el, options) {
    var _this2 = this;

    _classCallCheck(this, KadenceAccordion);

    var container = typeof el === 'string' ? document.querySelector(el) : el; // If el is not defined

    if (container == null) {
      return;
    }

    var defaults = {
      headerClass: '.kt-blocks-accordion-header',
      panelClass: '.kt-accordion-panel',
      panelInnerClass: '.kt-accordion-panel-inner',
      hiddenClass: 'kt-accordion-panel-hidden',
	  activeClass: 'kt-accordion-panel-active',

      get hidenClass() {
        return this.hiddenClass;
      },

      initializedClass: 'kt-accordion-initialized',

      get initalisedClass() {
        return this.initializedClass;
      },

      headerDataAttr: 'data-kt-accordion-header-id',
      openMultiplePanels: false,
      openHeadersOnLoad: [],
      headerOpenLabel: '',
      headerCloseLabel: '',
      roles: true // toggleEl:            // If you want to use a different element to trigger the accordion

    }; // Options

    this.settings = _extends({}, defaults, options); // Setting getting elements

    this.container = container; // Selecting children of the current accordion instance
	  // Kadence Edit
    var panes = Array.from(this.container.children);
    var children = [];
    Array.from( panes ).forEach(function ( pane ) {
      Array.from( pane.children ).forEach(function ( item ) {
        children.push( item );
      });
    });
    //var children = Array.from(this.container.children); // Since the Accordions header button is nested inside an element with class
    // of `badger-accordion__header` it is a grandchild of the accordion instance.
    // In order to have nested accordions we need each to only get all the button
    // elements for this instance. Here an array is created to show all the children
    // of the element `badger-accordion__header`.
    var headerParent = children.filter(function (header) {
      return !header.classList.contains(_this2.settings.panelClass.substr(1));
    }); // Creating an array of all DOM nodes that are Accordion headers
    this.headers = headerParent.reduce(function (acc, header) {
      var _ref;
      // Gets all the elements that have the headerClass
      var a = Array.from(header.children).filter(function (child) {
        return child.classList.contains(_this2.settings.headerClass.substr(1));
      }); // Merges the current `badger-accordion__header` accordion triggers
      if( ! a.length && header.children[0] && header.children[0].children && header.children[0].children.length ) {
        a = Array.from(header.children[0].children).filter(function (child) {
          return child.classList.contains(_this2.settings.headerClass.substr(1));
        });
      }
      // with all the others.
      acc = (_ref = []).concat.apply(_ref, _toConsumableArray(acc).concat([a]));
      return acc;
    }, []); // Creates an array of all panel elements for this instance of the accordion

    this.panels = children.filter(function (panel) {
      return panel.classList.contains(_this2.settings.panelClass.substr(1));
    });
    this.toggleEl = this.settings.toggleEl !== undefined ? Array.from(this.container.querySelectorAll(this.settings.toggleEl)) : this.headers; // This is for managing state of the accordion. It by default sets
    // all accordion panels to be closed

    this.states = [].map.call(this.headers, function () {
      return {
        state: 'closed'
      };
    });
    this.ids = [].map.call(this.headers, function () {
      return {
        id: Math.floor(Math.random() * 1000000 + 1)
      };
    }); // This is to ensure that once an open/close event has been fired
    // another cannot start until the first event has finished.
    // @TODO - get this working...

    this.toggling = false; // Initiating the accordion

    if (this.container) {
      this.init();
    } else {
      /* eslint-disable no-console */
      console.log('Something is wrong with you markup...');
    }
  }
  /**
   *  INIT
   *
   *  Initalises the accordion
   */


  _createClass(KadenceAccordion, [{
    key: "init",
    value: function init() {
		// Sets up ID, aria attrs & data-attrs
		this._setupAttributes(); // Setting up the inital view of the accordion

		this._initalState(); // Setting the height of each panel

		this.calculateAllPanelsHeight(); // Inserting data-attribute onto each `header`

		this._insertDataAttrs(); // Adding listeners to headers

		this._addListeners(); // Adds class to accordion for initalisation

		this._finishInitialization();
    }
    /**
     * CHECK ROLES ETTING
     * @return {[boolean]}
     * Checks roles setting for all roles or a single role.
     * First checks if a `boolean` has been used to set all
     * roles to either true or false. If the setting is an
     * object it will only set the attribute where each
     * attribute has explicitly been set as true, eg;
     * ```
     * roles: {
     *     region: true
     * }
     * ```
     */

  }, {
    key: "_setRole",
    value: function _setRole(role, el) {
      if (typeof this.settings.roles === 'boolean' && this.settings.roles || this.settings.roles[role] !== undefined && this.settings.roles[role] !== false) {
        el.setAttribute('role', role);
      }
    }
    /**
     *  INSERT DATA ATTRS
     *
     *  Updates state object for inital loading of the accordion
     */

  }, {
    key: "_initalState",
    value: function _initalState() {
      // Sets state object as per `this.settings.openHeadersOnLoad`
      var headersToOpen = this.settings.openHeadersOnLoad;

      if (headersToOpen.length) {
        this.toggling = true;
        this._openHeadersOnLoad(headersToOpen);
      } // Render DOM as per the updates `this.states` object


      this._renderDom();
    }
    /**
     *  INSERT DATA ATTRS
     *
     *  Adds `headerDataAttr` to all headers
     */

  }, {
    key: "_insertDataAttrs",
    value: function _insertDataAttrs() {
      var _this3 = this;

      this.headers.forEach(function (header, index) {
        header.setAttribute(_this3.settings.headerDataAttr, index);
      });
    }
    /**
     *  FINISH INITALISATION
     *
     *  Adds in `initializedClass` to accordion
     */

  }, {
    key: "_finishInitialization",
    value: function _finishInitialization() {
      this.container.classList.add(this.settings.initializedClass);
      this._setRole( 'presentation', this.container );
       // Create a new event
      var event = new CustomEvent( 'initialized' );
      // Dispatch the event
      this.container.dispatchEvent( event );
    }
    /**
     *  ADD LISTENERS
     *
     *  Adds click event to each header
     */
  }, {
    key: "_addListeners",
    value: function _addListeners() {
		// So we can reference the badger-accordion object inside out eventListener
		var _this = this; // Adding click event to accordion

		this.headers.forEach(function (header, index) {
			header.addEventListener('click', function () {
			// Getting the target of the click
			// const clickedEl = event.target;
			_this.handleClick(header, index);
			});
			header.addEventListener( 'keydown', function (event) {
				var key = event.which.toString();
				// 33 = Page Up, 34 = Page Down
				var ctrlModifier = (event.ctrlKey && key.match(/33|34/));
				// Up/ Down arrow and Control + Page Up/ Page Down keyboard operations
				// 38 = Up, 40 = Down
				if (key.match(/38|40/) || ctrlModifier) {
					var direction = (key.match(/34|40/)) ? 1 : -1;
					var length = _this.headers.length;
					var newIndex = (index + length + direction) % length;
					_this.headers[newIndex].focus();
					event.preventDefault();
				} else if (key.match(/35|36/) ) {
					// 35 = End, 36 = Home keyboard operations
					switch (key) {
						// Go to first accordion
						case '36':
						_this.headers[0].focus();
						break;
						// Go to last accordion
						case '35':
						_this.headers[_this.headers.length - 1].focus();
						break;
					}
					event.preventDefault();
				}
			});
			header.addEventListener('startOpen', function () {
				// Getting the target of the click
				// const clickedEl = event.target;
				_this.handleClick(header, index, true );
			});
		});
	}
    /**
     *  HANDLE CLICK
     *
     *  Handles click and checks if click was on an header element
     *  @param {object} targetHeader - The header node you want to open
     */

  }, {
    key: "handleClick",
    value: function handleClick(targetHeader, headerIndex, forceOpen ) {
		if ( ! forceOpen ) {
			forceOpen = false;
		}
		var _this10 = this;
		// Removing current `.` from `this.settings.headerClass` class so it can
		// be checked against the `targetHeader` classList
		var targetHeaderClass = this.settings.headerClass.substr(1); // Checking that the thing that was clicked on was the accordions header

		if ( targetHeader.classList.contains(targetHeaderClass) && this.toggling === false ) {
			this.toggling = true; // Updating states
			this.setState(headerIndex); // Render DOM as per the updates `this.states` object
			this._renderDom();
		} else if ( forceOpen ) {
			var initLoadDelay = setInterval( function() { 
				if ( _this10.toggling === false ) { 
					_this10.toggling = true; // Updating states
					_this10.setState( headerIndex ); // Render DOM as per the updates `this.states` object
					_this10._renderDom();
					clearInterval(initLoadDelay);
				}
			}, 50 );
		}
    }
    /**
     *  SET STATES
     *
     *  Sets the state for all headers. The 'target header' will have its state toggeled
     *  @param {object} targetHeaderId - The header node you want to open
     */

  }, {
    key: "setState",
    value: function setState(targetHeaderId) {
      var _this4 = this;

      var states = this.getState(); // If `this.settings.openMultiplePanels` is false we need to ensure only one panel
      // be can open at once. If it is false then all panels state APART from the one that
      // has just been clicked needs to be set to 'closed'.

      if (!this.settings.openMultiplePanels) {
        states.filter(function (state, index) {
          if (index != targetHeaderId) {
            state.state = 'closed';
          }
        });
      } // Toggles the state value of the target header. This was `array.find` but `find`
      // isnt supported in IE11


      states.filter(function (state, index) {
        if (index == targetHeaderId) {
          var newState = _this4.toggleState(state.state);

          return state.state = newState;
        }
      });
    }
    /**
     *  RENDER DOM
     *
     *  Renders the accordion in the DOM using the `this.states` object
     */

  }, {
    key: "_renderDom",
    value: function _renderDom() {
      var _this5 = this;
      // Filter through all open headers and open them
      this.states.filter(function (state, index) {
        if (state.state === 'open') {
          // Opening the current panel but _NOT_ updating the state
          _this5.open(index, false);
        }
      }); // Filter through all closed headers and closes them

      this.states.filter(function (state, index) {
        if (state.state === 'closed') {
          // Closing the current panel but _NOT_ updating the state
          _this5.close(index, false);
        }
      });
    }
    /**
     *  OPEN
     *
     *  Closes a specific panel
     *  @param {integer} headerIndex - The header node index you want to open
     */

  }, {
    key: "open",
    value: function open(headerIndex) {
      var setState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // 1. If being fired directly the state needs to be updated.
      if (setState) {
        this.setState(headerIndex);
      }

      this.togglePanel('open', headerIndex);
    }
    /**
     *  CLOSE
     *
     *  Closes a specific panel
     *  @param {integer} headerIndex - The header node index you want to close
     */

  }, {
    key: "close",
    value: function close(headerIndex) {
      var setState = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

      // 1. If being fired directly the state needs to be updated.
      if (setState) {
        this.setState(headerIndex);
      }

      this.togglePanel('closed', headerIndex);
    }
    /**
     *  OPEN ALL
     *
     *  Opens all panels
     */

  }, {
    key: "openAll",
    value: function openAll() {
      var _this6 = this;

      this.headers.forEach(function (header, headerIndex) {
        _this6.togglePanel('open', headerIndex);
      });
    }
    /**
     *  CLOSE ALL
     *
     *  Closes all panels
     */

  }, {
    key: "closeAll",
    value: function closeAll() {
      var _this7 = this;

      this.headers.forEach(function (header, headerIndex) {
        _this7.togglePanel('closed', headerIndex);
      });
    }
    /**
     *  GET STATE
     *
     *  Getting state of headers. By default gets state of all headers
     *  @param {string} animationAction - The animation you want to invoke
     *  @param {integer} headerIndex    - The header node index you want to animate
     */

  }, {
    key: "togglePanel",
    value: function togglePanel(animationAction, headerIndex) {
      var _this8 = this;
      if (animationAction !== undefined && headerIndex !== undefined) {
        if ( animationAction === 'closed' ) {
          // 1. Getting ID of panel that we want to close
          var header = this.headers[headerIndex];
          var panelToClose = this.panels[headerIndex]; // 2. Closeing panel
          if ( ! panelToClose.classList.contains(this.settings.hiddenClass) ) {
            panelToClose.setAttribute( 'data-panel-height', panelToClose.scrollHeight + 'px' );
            panelToClose.style.height = panelToClose.scrollHeight + 'px';
            //reflow
            panelToClose.offsetHeight;
            panelToClose.style.height = '';
            panelToClose.classList.add('kt-panel-is-collapsing');
            panelToClose.classList.remove(this.settings.activeClass);
            header.classList.remove(this.settings.activeClass);
            header.setAttribute('aria-expanded', false);
            var transDuration = ( 1000 * parseFloat(getComputedStyle(panelToClose)['transitionDuration']) );
            setTimeout(function(){
              panelToClose.classList.add(_this8.settings.hiddenClass);
              panelToClose.classList.remove('kt-panel-is-collapsing');
              return _this8.toggling = false;
            }, transDuration );
          }
          //   panelToClose.onCSSTransitionEnd(function () {
          // 	panelToClose.classList.remove('kt-panel-is-collapsing');
          //     return _this8.toggling = false;
          //   });
        } else if (animationAction === 'open') {
          // 1. Getting ID of panel that we want to open
          var _header = this.headers[headerIndex];
          var panelToOpen = this.panels[headerIndex]; // 2. Opening panel
          if ( ! panelToOpen.classList.contains( this.settings.activeClass ) ) {
            panelToOpen.classList.remove( this.settings.hiddenClass );
            panelToOpen.style.height = 0;
            //reflow
            panelToOpen.offsetHeight;
            panelToOpen.classList.add('kt-panel-is-expanding');
            panelToOpen.style.height = ( panelToOpen.scrollHeight < parseInt( panelToOpen.getAttribute('data-panel-height') ) ? parseInt( panelToOpen.getAttribute('data-panel-height') ) + 'px' : panelToOpen.scrollHeight + 'px' );
            //reflow
            panelToOpen.offsetHeight;
            _header.classList.add(this.settings.activeClass); // 4. Set aria attrs
            _header.setAttribute('aria-expanded', true); // 5. Resetting toggling so a new event can be fired
            var resizeEvent = window.document.createEvent('UIEvents');
            resizeEvent.initUIEvent('resize', true, false, window, 0);
            window.dispatchEvent(resizeEvent);
            var _transDuration = ( 1000 * parseFloat(getComputedStyle(panelToOpen)['transitionDuration']) );
            setTimeout(function(){
              panelToOpen.classList.add(_this8.settings.activeClass);
              panelToOpen.style.height = '';
              panelToOpen.classList.remove('kt-panel-is-expanding');
            return _this8.toggling = false;
            }, _transDuration );
          }
        //   panelToOpen.onCSSTransitionEnd(function () {
		// 	panelToOpen.style.height = '';
		// 	panelToOpen.classList.remove('kt-panel-is-expanding');
        //     return _this8.toggling = false;
        //   });
        }
      }
    } // @TODO - is this needed anymore?
    // checkState(headerId) {
    //     let state = this.states[headerId].state;
    //
    //     if(state === 'closed') {
    //         return state;
    //     } else if(state === 'open') {
    //         return state;
    //     }
    // }

    /**
     *  GET STATE
     *
     *  Getting state of headers. By default gets state of all headers
     *  @param {array} headerIds - Id/'s of the headers you want to check
     */

  }, {
    key: "getState",
    value: function getState() {
      var _this9 = this;

      var headerIds = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (headerIds.length && Array.isArray(headerIds)) {
        var states = headerIds.map(function (header) {
          return _this9.states[header];
        });
        return states;
      } else {
        return this.states;
      }
    }
    /**
     *  TOGGLE STATE
     *
     *  Toggling the state value
     *  @param {string} currentState - Current state value for a header
     */

  }, {
    key: "toggleState",
    value: function toggleState(currentState) {
      if (currentState !== undefined) {
        return currentState === 'closed' ? 'open' : 'closed';
      }
    }
    /**
     *  HEADERS TO OPEN
     *
     *  Setting which headers should be open when accordion is initalised
     *  @param {array} headersToOpen - Array of ID's for the headers to be open
     */

  }, {
    key: "_openHeadersOnLoad",
    value: function _openHeadersOnLoad() {
      var _this10 = this;

      var headersToOpen = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
      if (headersToOpen.length && Array.isArray(headersToOpen)) {
        var headers = headersToOpen.filter(function (header) {
          return header != undefined;
        });
        headers.forEach(function (header) {
          _this10.setState(header);
        });
      }
    }
    /**
     *  SET UP ATTRIBUTES
     *
     *  Initalises accordion attribute methods
     */

  }, {
    key: "_setupAttributes",
    value: function _setupAttributes() {
      // Adding ID & aria-controls
      this._setupHeaders(); // Adding ID & aria-labelledby


      this._setupPanels(); // Inserting data-attribute onto each `header`


      this._insertDataAttrs();
    }
    /**
     *  SET PANEL HEIGHT - ** DEPRICATED **
     *
     *  Depreicated as this method is becoming public and
     *  I want to name it something that lets devs know
     *  it's not just for using inside the `init()` method.
     */

  }, {
    key: "_setPanelHeight",
    value: function _setPanelHeight() {
      this.calculateAllPanelsHeight();
    }
    /**
     *  CALCULATE PANEL HEIGHT
     *
     *  Setting height for panels using pannels inner element
     */

  }, {
    key: "calculatePanelHeight",
    value: function calculatePanelHeight(panel) {
      var panelInner = panel.querySelector(this.settings.panelInnerClass);
	  var activeHeight = panelInner.getBoundingClientRect();
	  return panel.setAttribute('data-panel-height', "".concat(activeHeight['height'], "px") );
	  //return panel.style.maxHeight = "".concat(activeHeight, "px");
	  // panel.style.maxHeight = panel.getAttribute('data-panel-height');
    }
    /**
     *  CALCULATE PANEL HEIGHT
     *
     *  Setting height for panels using pannels inner element
     */

  }, {
    key: "calculateAllPanelsHeight",
    value: function calculateAllPanelsHeight() {
      var _this11 = this;

      this.panels.forEach(function (panel) {
        _this11.calculatePanelHeight(panel);
      });
    }
    /**
     * SET UP HEADERS
     */

  }, {
    key: "_setupHeaders",
    value: function _setupHeaders() {
      var _this12 = this;

      this.headers.forEach(function (header, index) {
        header.setAttribute('id', "kt-accordion-header-".concat(_this12.ids[index].id));
        header.setAttribute('aria-controls', "kt-accordion-panel-".concat(_this12.ids[index].id));
      });
    }
    /**
     * SET UP PANELS
     */

  }, {
    key: "_setupPanels",
    value: function _setupPanels() {
      var _this13 = this;
      this.panels.forEach(function (panel, index) {
        panel.setAttribute( 'id', 'kt-accordion-panel-'.concat(_this13.ids[index].id) );
        panel.setAttribute( 'aria-labelledby', 'kt-accordion-header-'.concat(_this13.ids[index].id) );

        if (_this13.settings.roles === true || _this13.settings.roles.region !== false) {
          _this13._setRole('region', panel);
        }
      });
    }
  }]);

  return KadenceAccordion;
}(); // Export

return KadenceAccordion;

})));

(function() {
  'use strict';
  var hasInitializedKadenceAccordion = false;
	window.KadenceBlocksAccordion = {
    /**
		 * Initiate anchor scroll.
		 */
		scroll: function( element, to, duration ) {
      if (duration <= 0) return;
      var difference = to - element.scrollTop;
      var perTick = difference / duration * 10;
  
      setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
      }, 10);
		},
		/**
		 * Initiate anchor trigger.
		 */
		anchor: function( e ) {
      if ( window.location.hash != '' ) {
        var id = location.hash.substring( 1 ),
          element;
  
        if ( ! ( /^[A-z0-9_-]+$/.test( id ) ) ) {
          return;
        }
        if ( e.type && e.type === 'initialized' && hasInitializedKadenceAccordion ) {
          return;
        }
        hasInitializedKadenceAccordion = true;
        element = document.getElementById( id );
        if ( element ) {
          if ( element.classList.contains('wp-block-kadence-pane') ) {
            var child = document.querySelectorAll('#' + id + ' .kt-blocks-accordion-header')[0];
            if ( ! child.classList.contains( 'kt-accordion-panel-active' ) ) {
              if ( e.type && e.type === 'initialized' ) {
                window.setTimeout(function() {
                  //child.click();
				  child.dispatchEvent(new Event( 'startOpen' ) );
                }, 50 );
              } else {
				child.dispatchEvent(new Event( 'startOpen' ) );
               // child.click();
              }
            }
            // if ( e.type && e.type === 'initialized' ) {
            //   window.setTimeout(function() {
            //     window.KadenceBlocksAccordion.scroll( document.body, document.getElementById( id ).offsetTop, 600 );
            //   }, 350 );
            // }
          }
        }
      }
		},
		// Initiate the menus when the DOM loads.
		init: function() {
			var accordions = document.querySelectorAll('.kt-accordion-inner-wrap');
      var accordionsArray = Array.from( accordions );
      for (var i = 0, len = accordionsArray.length; i < len; i++) {
        var multiplePanels = accordionsArray[i].getAttribute('data-allow-multiple-open');
        var openPanels = accordionsArray[i].getAttribute('data-start-open');
        var openPanel = parseInt(openPanels);
        if ( openPanels !== 'none' ) {
          for (var b = 0, lenb = accordionsArray[i].children.length; b < lenb; b++) {
            if ( accordionsArray[i].children[b].classList.contains( 'kt-accordion-pane-' + parseInt( 1 + openPanel ) ) ) {
              openPanel = b;
              break;
            }
          }
        }
        accordionsArray[i].addEventListener( 'initialized', window.KadenceBlocksAccordion.anchor, false );
        new KadenceAccordion( accordionsArray[i], {
          openHeadersOnLoad: ( openPanels === 'none' ? [] : [parseInt(openPanel)] ),
          headerClass: '.kt-blocks-accordion-header',
          panelClass: '.kt-accordion-panel',
          panelInnerClass: '.kt-accordion-panel-inner',
          hiddenClass: 'kt-accordion-panel-hidden',
          activeClass: 'kt-accordion-panel-active',
          initializedClass: 'kt-accordion-initialized',
          headerDataAttr: 'data-kt-accordion-header-id',
          openMultiplePanels: ( multiplePanels === 'true' ? true : false ),
		  roles: {
			presentation: false
		  }
        } );
      };
      window.addEventListener( 'hashchange', window.KadenceBlocksAccordion.anchor, false );
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.KadenceBlocksAccordion.init );
	} else {
		// The DOM has already been loaded.
		window.KadenceBlocksAccordion.init();
	}
})();