/* global GLightbox */
/**
 * File lightbox-init.js.
 * Gets Lightbox working for Kadence Blocks Gallery
 */

(function() {
	'use strict';
	var kadenceBlocksGLight = {
		simulateClick: function (elem) {
			// Create our event (with options)
			var evt = new MouseEvent('click', {
				bubbles: true,
				cancelable: true,
				view: window
			});
			// If cancelled, don't dispatch our event
			var canceled = !elem.dispatchEvent(evt);
		},
		checkImage: function( element ) {
			return /(png|jpg|jpeg|gif|tiff|bmp|webp)$/.test(
				element.getAttribute( 'href' ).toLowerCase().split( '?' )[0].split( '#' )[0]
			);
		},
		handleClones: function( element ) {
			var foundClones = element.querySelectorAll( '.slick-cloned a.kb-gallery-item-link' );
			var foundRegular = element.querySelectorAll( '.slick-slide:not(.slick-cloned) a.kb-gallery-item-link' );
			for ( let c = 0; c < foundClones.length; c++ ) {
				foundClones[c].addEventListener('click', function (event) {
					event.preventDefault();
					var the_href = foundClones[c].getAttribute( 'href' );
					for ( let b = 0; b < foundRegular.length; b++ ) {
						if ( the_href === foundRegular[b].getAttribute( 'href' ) ) {
							kadenceBlocksGLight.simulateClick( foundRegular[b] );
							break;
						}
					}
				} );
			}
		},
		findGalleries: function() {
			var foundGalleries = document.querySelectorAll( '.kb-gallery-magnific-init' );
			if ( ! foundGalleries.length ) {
				return;
			}
			if ( foundGalleries ) {
				var carousel = [];
				for ( let i = 0; i < foundGalleries.length; i++ ) {
					carousel[i] = foundGalleries[ i ].querySelector( '.kt-blocks-carousel-init' );
					// if ( carousel[i] ) {
					// 	setTimeout( function() {
					// 		kadenceBlocksGLight.handleClones( carousel[i] );
					// 	}, 200 );
					// }
					var galleryClass = foundGalleries[ i ].classList;
					var showCaption = foundGalleries[ i ].getAttribute( 'data-lightbox-caption' );
					var filter = foundGalleries[ i ].getAttribute( 'data-image-filter' );
					var foundGalleryClass = false;
					for ( let n = 0; n < galleryClass.length; n++ ) {
						if ( galleryClass[ n ].indexOf( 'kb-gallery-id' ) !== -1 ) {
							foundGalleryClass = galleryClass[ n ];
							break;
						}
					}
					if ( 'true' == showCaption ) {
						var foundImages = foundGalleries[ i ].querySelectorAll( 'a.kb-gallery-item-link' );
						for ( let x = 0; x < foundImages.length; x++ ) {
							var caption = foundImages[x].querySelector( '.kadence-blocks-gallery-item__caption' );
							if ( caption ) {
								foundImages[x].setAttribute( 'data-caption', caption.innerText );
							}
						}
					}
					if ( foundGalleryClass ) {
						// if ( filter ) {
						// 	GLightbox.defaults.elementClass = 'slg-kt-blocks kb-gal-light-filter-' + filter;
						// } else {
						// 	GLightbox.defaults.elementClass = 'slg-kt-blocks';
						// }
						// new GLightbox({
						// 	elements: '.' + foundGalleryClass + ' a.kb-gallery-item-link',
						// });
						new GLightbox({
							selector: '.' + foundGalleryClass + ' a.kb-gallery-item-link:not([target="_blank"])',
							touchNavigation: true,
							skin: 'kadence-dark',
							loop: true,
							openEffect: 'fade',
							closeEffect: 'fade',
						});
					}
				}
			}
		},
		/**
		 * Initiate the script to process all
		 */
		initAll: function() {
			GLightbox.defaults.captionAttribute = 'data-caption';
			kadenceBlocksGLight.findGalleries();
		},
		// Initiate the menus when the DOM loads.
		init: function() {
			if ( typeof GLightbox == 'function' ) {
				kadenceBlocksGLight.initAll();
			} else {
				var initLoadDelay = setInterval( function(){ if ( typeof GLightbox == 'function' ) { kadenceBlocksGLight.initAll(); clearInterval(initLoadDelay); } }, 200 );
			}
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', kadenceBlocksGLight.init );
	} else {
		// The DOM has already been loaded.
		kadenceBlocksGLight.init();
	}
})();