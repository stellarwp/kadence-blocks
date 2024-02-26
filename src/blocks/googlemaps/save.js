/**
 * BLOCK: Kadence Google Map
 */
import { __, sprintf } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

/**
 * External dependencies
 */
import classnames from 'classnames';

export function Save({ attributes }) {
	const { uniqueID, zoom, mapType, apiType, location, kbVersion } = attributes;

	if (kbVersion >= 2) {
		return null;
	}

	const classes = classnames({
		'kb-google-maps-container': true,
		[`kb-google-maps-container${uniqueID}`]: true,
		[`align${attributes.align}`]: attributes.align,
	});

	let mapQueryParams = {
		key: 'KADENCE_GOOGLE_MAPS_KEY',
		zoom: zoom,
		maptype: mapType,
		q: location,
	};

	const qs = Object.keys(mapQueryParams)
		.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(mapQueryParams[key])}`)
		.join('&');

	return (
		<div className={classes} data-mapid={uniqueID}>
			{apiType === 'javascript' ? (
				<div id={`kb-google-map${uniqueID}`} style={{ width: '100%', height: '100%' }}></div>
			) : (
				<iframe
					width={'100%'}
					height={'100%'}
					style={{ border: '0' }}
					loading={'lazy'}
					src={'https://www.google.com/maps/embed/v1/place?' + qs}
				></iframe>
			)}
		</div>
	);
}

export default Save;
