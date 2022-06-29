(function() {
	'use strict';
	window.kadenceBlocksMasonry = {
		trigger_animation_class: function( element ) {
			element.classList.add( 'kt-masonry-trigger-animation' );
		},
		init: function() {
			var masonryitems = document.querySelectorAll( '.kb-masonry-init' );
			// No point if no items
			if ( ! masonryitems .length ) {
				return;
			}
			for ( let i = 0; i < masonryitems.length; i++ ) {
				var itemSelector = masonryitems[i].getAttribute('data-item-selector');
				var masRtl = true;
				if ( document.body.classList.contains( 'rtl' ) ) {
					masRtl = false;
				}
				var masGrid = new Masonry( masonryitems[i], {
					itemSelector: itemSelector,
					isOriginLeft: masRtl,
				} );
				// var subitems = masonryitems[i].querySelectorAll( itemSelector );
				// for ( let n = 0; n < subitems.length; n++ ) {
				// 	setTimeout( function( n ) {
				// 		console.log( subitems[n] );
				// 		subitems[n].classList.add( 'kt-masonry-trigger-animation' );
				// 	}, n * 75, n );
				// }
				imagesLoaded( masonryitems[i] ).on( 'progress', function() {
					// layout Masonry after each image loads
					masGrid.layout();
				});
				masGrid.once( 'layoutComplete', function( items ) {
					// Create a new event
					var event = new CustomEvent( 'layoutComplete' );
					masonryitems[i].dispatchEvent( event );
				});
			}
		}
	}
	if ( 'loading' === document.readyState ) {
		// The DOM has not yet been loaded.
		document.addEventListener( 'DOMContentLoaded', window.kadenceBlocksMasonry.init );
	} else {
		// The DOM has already been loaded.
		window.kadenceBlocksMasonry.init();
	}
})();