/**
 * Parallax Background.
 */
var ktjarforEach = function ( array, callback, scope ) {
	for ( var i = 0; i < array.length; i++ ) {
		callback.call( scope, i, array[i] ); // passes back stuff we need.
	}
};
var myNodeList = document.querySelectorAll( '.kt-jarallax' );
ktjarforEach( myNodeList, function( index, value ) {
	jarallax( value, {
		speed: 0.5,
		elementInViewport: value,
	} );
} );