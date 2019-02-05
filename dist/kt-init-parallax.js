/**
 * Parallax Background.
 */
jQuery( document ).ready( function( $ ) {
	$( '.kt-jarallax' ).each( function() {
		$( this ).jarallax( {
			speed: 0.5,
			elementInViewport: $( this ),
		} );
	} );
} );
