import { getImportOptions } from "./getQueryOptions";
import { buildImportURL } from "./buildURL";

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

    const importOptions = getImportOptions( [ result ] );
	const url = buildImportURL();
	
	// Dispatch API fetch request.
	const response = await fetch(url, importOptions);
	const { status, headers } = response;

	try {
		const results = await response.json();

		setIsDownloaded(true)
		setIsDownloading(false)
	} catch (error) {
		setIsDownloaded(false)
		setIsDownloading(false)
	}
    //do it
}