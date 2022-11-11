/**
 * Parallax Background.
 */
var kbjarforEach = function ( array, callback, scope ) {
	for ( var i = 0; i < array.length; i++ ) {
		callback.call( scope, i, array[i] ); // passes back stuff we need.
	}
};
var kbNodeList = document.querySelectorAll( '.kt-jarallax' );
// Setup a timer
var kbjartimeout;
// Listen for resize events
window.addEventListener('resize', function ( event ) {
	// If timer is null, reset it to 66ms and run your functions.
	// Otherwise, wait until timer is cleared
	if ( ! kbjartimeout ) {
		kbjartimeout = setTimeout(function() {
			// Reset timeout
			kbjartimeout = null;
			document.body.style.setProperty( '--kb-screen-height-fix', ( document.documentElement.clientHeight + 200 ) + 'px' );
		}, 66 );
	}
}, false);
document.body.style.setProperty( '--kb-screen-height-fix', ( document.documentElement.clientHeight + 200 ) + 'px' );
kbjarforEach( kbNodeList, function( index, value ) {
	jarallax( value, {
		speed: -0.1,
		elementInViewport: value,
	} );
} );