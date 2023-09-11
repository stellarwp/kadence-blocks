import { API } from "../constants/API";

// eslint-disable

/**
 * Build the API query parameters
 *
 * @param {string} provider    The current service provider.
 * @param {Object} queryParams Optional query parameters to append to base params.
 * @return {Object} 				 Parameters used for the fetch request.
 */
export default function getQueryOptions( provider, options ) {
	var headers = new Headers();
	headers.append("Content-Type", "application/json");

	var body = {
		query: API.defaults.query,
		sizes: kadenceExtensionImagePicker.image_sizes,
		image_type: API.defaults.image_type,
		page: 1,
		per_page: API.defaults.per_page,
		locale: API.defaults.locale
	}

	var mergedBody = JSON.stringify( { ...body, ...options } );

	var defaults = {
		method: 'POST',
		headers: headers,
		body: mergedBody,
		redirect: 'follow'
	}

	return defaults;
}

export function getImportOptions( results, options = {} ) {
	var headers = new Headers();
	headers.append("Content-Type", "application/json");

	var body = {
		images: results,
	}

	var mergedBody = JSON.stringify( { ...body, ...options } );

	var defaults = {
		method: 'POST',
		headers: headers,
		body: mergedBody,
		redirect: 'follow'
	}

	return defaults;
}
