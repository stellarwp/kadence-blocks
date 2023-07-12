import { API } from "../constants/API";
import getQueryOptions from "./getQueryOptions";
import buildURL from "./buildURL";

/**
 * Get image response data.
 *
 * @param {Object} data The API results object.
 * @return {Array} 	 The results as an array.
 */
export default async function getImageData( provider, currentDataState, setImageData, setIsLoading, combine, options ) {
	if ( ! provider || ! currentDataState ) {
		return [];
	}


	const queryOptions = getQueryOptions(provider, options);
	const url = buildURL("search");
	
	// Dispatch API fetch request.
	const response = await fetch(url, queryOptions);
	const { status, headers } = response;

	try {
		const results = await response.json();
		console.log('2 success', options, results)

		var newData = {...currentDataState}
		if ( 'undefined' != typeof( results.code ) && 'rest_prophecy_image_search_no_results' == results.code ) {
			newData = {};
		} else if ( combine && 'undefined' != typeof( currentDataState.images ) ) {
			newData = { ...currentDataState, ...results.data }
			var mergedImages = currentDataState.images.concat(results.data.images)
			newData.images = mergedImages;
		} else {
			newData = results.data;
		}

		setImageData( newData );
		setIsLoading(false)
	} catch (error) {
		console.log('2 oops', provider, status, error, response);
		setImageData({})
		setIsLoading(false)
	}

	return response;
}

/**
 * get image response data for a new search.
 *
 * @param {Object} data The API results object.
 * @return {Array} 	 The results as an array.
 */
export async function getImageDataSearch( provider, currentDataState, query, setImageData, setIsLoading ) {
	if ( ! provider || ! currentDataState ) {
		return [];
	}

    const options = {
        page: 1,
        query: query ? query : API.defaults.query
    };

	return getImageData( provider, currentDataState, setImageData, setIsLoading, false, options )
}

/**
 * get image response data for a new search.
 *
 * @param {Object} data The API results object.
 * @return {Array} 	 The results as an array.
 */
export async function getImageDataLoadMore( provider, currentDataState, query, setImageData, setIsLoading ) {
	if ( ! provider || ! currentDataState ) {
		return [];
	}

    const options = {
        page: currentDataState?.page + 1,
        query: query ? query : API.defaults.query
    };

	return getImageData( provider, currentDataState, setImageData, setIsLoading, true, options )
}