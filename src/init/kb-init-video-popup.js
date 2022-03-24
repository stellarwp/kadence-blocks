/* global SimpleLightbox */
/**
 * File kb-init-video-popup.js.
 * Gets video lighbox working for buttons.
 */

(function() {
	'use strict';
	var kadenceBlocksVideoLightbox = {
		/**
		 * Initiate the script to process all
		 */
		initAll: function( element ) {
			new SimpleLightbox({
				elements: document.querySelectorAll('.ktblocksvideopop')
			});
		},
		// Initiate the menus when the DOM loads.
		init: function() {
			if ( typeof SimpleLightbox == 'function' ) {
				kadenceBlocksVideoLightbox.initAll();
			} else {
				var initLoadDelay = setInterval( function(){ if ( typeof SimpleLightbox == 'function' ) { kadenceBlocksVideoLightbox.initAll(); clearInterval(initLoadDelay); } }, 200 );
			}
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', kadenceBlocksVideoLightbox.init );
	} else {
		// The DOM has already been loaded.
		kadenceBlocksVideoLightbox.init();
	}
})();
