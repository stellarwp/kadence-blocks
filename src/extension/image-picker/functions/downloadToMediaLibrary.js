import apiFetch from '@wordpress/api-fetch';

/**
 * Get library data.
 *
 * @param {(object)} userData
 *
 * @return {Promise<object>} Promise returns object
 */
async function downloadImage( images ) {
	try {
		const response = await apiFetch( {
			path: '/kb-design-library/v1/process_images',
			method: 'POST',
			data: {
				images: images,
			},
		} );
		return response;
	} catch (error) {
		console.log(`ERROR: ${ error }`);
		return false;
	}
}
/**
 * Get image response data.
 *
 * @param {Object} data The API results object.
 * @return {Array} 	 The results as an array.
 */
export default async function downloadToMediaLibrary( result, setIsDownloading, setIsDownloaded ) {
	if ( ! result ) {
		return [];
	}
    setIsDownloading(true);
	
	// Dispatch API fetch request.
	const response = await downloadImage([result]);
	if ( response !== false ) {
		setIsDownloaded(true);
		setIsDownloading(false);
	} else {
		setIsDownloaded(false);
		setIsDownloading(false);
	}
}