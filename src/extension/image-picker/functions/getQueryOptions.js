import { API } from '../constants/API';

// eslint-disable

/**
 * Build the API query parameters
 *
 * @param {string} provider    The current service provider.
 * @param {Object} queryParams Optional query parameters to append to base params.
 * @return {Object} 				 Parameters used for the fetch request.
 */
export default function getQueryOptions(options) {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	const sizes = kadenceExtensionImagePicker.image_sizes.forEach((element) => {
		element?.crop ? (element.crop = true) : (element.crop = false);
		return element;
	});
	const body = {
		query: API.defaults.query,
		sizes,
		image_type: API.defaults.image_type,
		page: 1,
		per_page: API.defaults.per_page,
		locale: API.defaults.locale,
	};
	const mergedBody = JSON.stringify({ ...body, ...options });

	const defaults = {
		method: 'POST',
		headers,
		body: mergedBody,
		redirect: 'follow',
	};

	return defaults;
}

export function getImportOptions(results, options = {}) {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	const body = {
		images: results,
	};

	const mergedBody = JSON.stringify({ ...body, ...options });

	const defaults = {
		method: 'POST',
		headers,
		body: mergedBody,
		redirect: 'follow',
	};

	return defaults;
}
