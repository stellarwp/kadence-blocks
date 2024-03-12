import { API } from '../constants/API';

/**
 * Build the API query parameters.
 *
 * @param {string} type   The query type (search, collections).
 * @return {string} 		  The new API URL with querystring params.
 */
export default function buildURL(type) {
	if (!type) {
		// Bail early if API query type is missing.
		return '';
	}

	return API.proxy + 'wp-json/prophecy/v1/images/' + type;
}

/**
 * Build the API query parameters.
 *
 * @param {string} type   The query type (search, collections).
 * @return {string} 		  The new API URL with querystring params.
 */
export function buildImportURL() {
	return '/wp-json/kb-design-library/v1/process_images';
}
