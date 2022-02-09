/**
 * BLOCK: Kadence Google Map
 */

/**
 * External dependencies
 */
import classnames from 'classnames';

export function Save( { attributes } ) {
	const { uniqueID, mapMode, zoom, mapType, location } = attributes;
	const classes = classnames( {
		'kb-google-maps-container': true,
		[ `kb-google-maps-container${ uniqueID }` ] : true,
		[ `align${ attributes.align }` ]: attributes.align,
	} );

	let mapQueryParams = {
		key: 'KADENCE_GOOGLE_MAPS_KEY',
		zoom: zoom,
		maptype: mapType,
		q: location
	};

	const qs = Object.keys(mapQueryParams)
		.map(key => `${encodeURIComponent(key)}=${encodeURIComponent(mapQueryParams[key])}`)
		.join('&');

	return (
		<div className={ classes }>
			<iframe width={ '100%' } height={ '100%' } style={ { border: '0' } } loading={ 'lazy' }
							src={ 'https://www.google.com/maps/embed/v1/' + mapMode + '?' + qs }></iframe>
		</div>
	);
}

export default ( Save );
