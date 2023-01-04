/* global GLightbox */
/**
 * File kb-glight-video-init.js.
 * Gets video lighbox working for buttons.
 */

(function() {
	'use strict';
	var kadenceBlocksVideoLightbox = {
		/**
		 * Initiate the script to process all
		 */
		initAll: function( element ) {
			GLightbox({
				selector: '.ktblocksvideopop',
				touchNavigation: true,
				skin: 'kadence-dark',
				loop: false,
				openEffect: 'fade',
				closeEffect: 'fade',
				autoplayVideos: true,
				plyr: {
					css: kadence_video_pop.plyr_css,
					js: kadence_video_pop.plyr_js,
					config: {
						hideControls: true,
					}
				}
			});
		},
		// Initiate the menus when the DOM loads.
		init: function() {
			if ( typeof GLightbox == 'function' ) {
				kadenceBlocksVideoLightbox.initAll();
			} else {
				var initLoadDelay = setInterval( function(){ if ( typeof GLightbox == 'function' ) { kadenceBlocksVideoLightbox.initAll(); clearInterval(initLoadDelay); } }, 200 );
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
