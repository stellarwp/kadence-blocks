jQuery( document ).ready( function( $ ) {
	// Init Masonry
	$( '.kb-masonry-init' ).each( function() {
		var itemSelector = $( this ).attr( 'data-item-selector' );
		var masRtl = true;
		if ( $( 'html[dir="rtl"]' ).length ) {
			masRtl = false;
		}
		$( this ).masonry( {
			itemSelector: itemSelector,
			isOriginLeft: masRtl,
		} );
		$( this ).find( itemSelector ).each( function( i ) {
			var item = $( this );
			setTimeout( function( ) {
				item.addClass( 'kt-masonry-trigger-animation' );
			}, i * 75 );
		} );
	} );
} );
