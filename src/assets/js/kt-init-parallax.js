/**
 * Parallax Background.
 *
 * global kadence_blocks_parallax
 */
var ktjarforEach = function ( array, callback, scope ) {
	for ( var i = 0; i < array.length; i++ ) {
		callback.call( scope, i, array[i] ); // passes back stuff we need.
	}
};
var myNodeList = document.querySelectorAll( '.kt-jarallax' );
ktjarforEach( myNodeList, function( index, value ) {
	jarallax( value, {
		speed: kadence_blocks_parallax.speed,
		elementInViewport: value,
	} );
} );