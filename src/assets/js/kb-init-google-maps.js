/**
 * File kb-init-google-maps.js.
 */

function kbInitMaps () {
	// kb_google_map_' . $unique_id

	let mapItems = document.querySelectorAll('.kb-google-maps-container')
	if (!mapItems.length) {
		return
	}

	for (let n = 0; n < mapItems.length; n++) {
		let self = mapItems[n], el = self.querySelector('.kb-count-up-process')
		let mapId = self.dataset.mapid.replace(/-/g, '_');

		let mapContainer = document.getElementById("kb-google-map" + self.dataset.mapid);

		if (mapContainer && mapId.length > 0) {
			window["kb_google_map" + mapId]();
		}
	}
}
