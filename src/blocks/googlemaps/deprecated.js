/**
 * External dependencies
 */
import classnames from 'classnames';

const deprecated = [
	{
		attributes: {
			"uniqueID": {
				"type": "string"
			},
			"width": {
				"type": "number",
				"default": ""
			},
			"heightDesktop": {
				"type": "number",
				"default": 450
			},
			"heightTablet": {
				"type": "number",
				"default": ""
			},
			"heightMobile": {
				"type": "number",
				"default": ""
			},
			"widthDesktop": {
				"type": "number",
				"default": ""
			},
			"widthTablet": {
				"type": "number",
				"default": ""
			},
			"widthMobile": {
				"type": "number",
				"default": ""
			},
			"zoom": {
				"type": "number",
				"default": "11"
			},
			"location": {
				"type": "string",
				"default": "Golden Gate Bridge"
			},
			"lat": {
				"type": "string",
				"default": ""
			},
			"lng": {
				"type": "string",
				"default": ""
			},
			"apiType": {
				"type": "string",
				"enum": ["embed", "javascript"],
				"default": "embed"
			},
			"showMarker": {
				"type": "boolean",
				"default": true
			},
			"mapType": {
				"type": "string",
				"enum": ["roadmap", "satellite"],
				"default": "roadmap"
			},
			"mapFilter": {
				"type": "string",
				"enum": ["standard", "grayscale", "invert", "saturate", "sepia"],
				"default": "standard"
			},
			"mapStyle": {
				"type": "string",
				"default": "standard"
			},
			"showControls": {
				"type": "boolean",
				"default": true
			},
			"customSnazzy": {
				"type": "string",
				"default": ""
			},
			"mapFilterAmount": {
				"type": "number",
				"default": 50
			},
			"marginDesktop": {
				"type": "array",
				"default":  [ "", "", "", "" ]
			},
			"marginTablet": {
				"type": "array",
				"default":  [ "", "", "", "" ]
			},
			"marginMobile": {
				"type": "array",
				"default":  [ "", "", "", "" ]
			},
			"marginUnit": {
				"type": "string",
				"default": "px"
			},
			"paddingDesktop": {
				"type": "array",
				"default":  [ "", "", "", "" ]
			},
			"paddingTablet": {
				"type": "array",
				"default":  [ "", "", "", "" ]
			},
			"paddingMobile": {
				"type": "array",
				"default":  [ "", "", "", "" ]
			},
			"paddingUnit": {
				"type": "string",
				"default": "px"
			},
			"textAlign": {
				"type": "array",
				"default":  [ "", "", "" ]
			}
		},
		save: ( { attributes } ) => {
			const { uniqueID, zoom, mapType, apiType, location } = attributes;
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
				<div className={classes} data-mapid={ uniqueID }>
					{ apiType === 'javascript' ?
						<div id={`kb-google-map${ uniqueID }`} style={ { width: '100%', height: '100%'} }></div>
						:
						<iframe width={ '100%' } height={ '100%' } style={ { border: '0' } } loading={ 'lazy' }
								src={ 'https://www.google.com/maps/embed/v1/place?' + qs }></iframe> }
				</div>
			);
		}
	}
];

export default deprecated;
