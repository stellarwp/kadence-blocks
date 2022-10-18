/**
 * BLOCK: Kadence Google Maps
 */

/**
 * Import Css
 */
import './editor.scss';

/**
 * Internal dependencies
 */
import snazzyMapStyles from './snazzyMapStyles';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const LIBRARIES = [ 'places' ];

export function EditJsMap( { zoom, lat, lng, showMarker, mapType, mapStyle, customSnazzy, googleApiKey } ) {

	const mapStyleArray = snazzyMapStyles( mapStyle, customSnazzy );

	let mapOptions = { styles: mapStyleArray, mapTypeId: mapType };

	let floatLat = isNaN( parseFloat( lat ) ) ? parseFloat('42.877742') : parseFloat( lat );
	let floatLng = isNaN( parseFloat( lng ) ) ? parseFloat('-97.380979') : parseFloat( lng );

	return (
		<LoadScript
			googleMapsApiKey={ googleApiKey }
			libraries={ LIBRARIES }
		>
			<GoogleMap
				mapContainerStyle={ { width: '100%', height: '100%' } }
				center={ { lat: floatLat, lng: floatLng } }
				zoom={ (zoom ? parseInt(zoom) : 10) }
				options={ mapOptions	}
			>
				{ showMarker ?
					<Marker position={ { lat: floatLat, lng: floatLng } }></Marker>
					: null }
			</GoogleMap>
		</LoadScript>
	)

}

export default ( EditJsMap );
