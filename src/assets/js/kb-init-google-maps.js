/**
 * File kb-init-google-maps.js.
 */

function kbInitMaps() {
	// kb_google_map_' . $unique_id

	let mapItems = document.querySelectorAll( '#kb-google-maps-container' );
	console.log('Each item');
	if ( ! window.kadenceGoogleMaps.mapItems.length ) {
		console.log('Length 0');
		return;
	}
	for ( let n = 0; n < mapItems.length; n++ ) {
		let self = mapItems[n],
			el = self.querySelector('.kb-count-up-process');


		// Initialize listener
		// window.kadenceGoogleMaps.startCountUp( n );
	}
}
