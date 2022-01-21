/**
 * BLOCK: Kadence Countdown
 */
const { rest_url } = kadence_blocks_params;

/**
 * External dependencies
 */
import classnames from 'classnames';
import get from 'lodash/get';

/**
 * WordPress dependencies
 */
import { InnerBlocks } from '@wordpress/block-editor';

// const encodedLocation = encodeURIComponent( location );
const apiKey = 'AIzaSyBGsB_DXmwf1WoHqBk0Jrt4VhyChI1mLjg';

function Save( { attributes } ) {
	const { uniqueID } = attributes;
	const classes = classnames( {
		'kb-google-maps-container': true,
		[ `kb-google-maps-container${ uniqueID }` ] : true,
		[ `align${ attributes.align }` ]: attributes.align,
	} );

	return (
		<div className={ classes }>
			<iframe width={ '600px' } height={ '450px' } style={ { border: '0' } } loading={ 'lazy' }
							src={ 'https://maps.google.com/maps?q=336%20Madison%20Place%2C%20Dr.%20Moore%2C%20OK&t=m&z=10&output=embed&iwloc=near' }></iframe>
		</div>
	);
}
export default Save;
